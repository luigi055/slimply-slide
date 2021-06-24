class SliderControlsBuilder {
	constructor(sliderNode, options) {
		this.sliderNode = sliderNode;
		this.sliderButtonLeft = null;
		this.sliderButtonRight = null;
		this.sliderDotsControl = null;
		this.options = options;
	}

	get sliderDotControlClass() {
		return "slider__dots-control";
	}
	get sliderDotClass() {
		return "slider__dots-control__dot";
	}
	get sliderButtonClass() {
		return "slider__button";
	}
	get sliderLeftButtonClass() {
		return "slider__button__left";
	}
	get sliderRightButtonClass() {
		return "slider__button__right";
	}

	_generateControlDot(index, onDotClick) {
		const handleDotClick = () => {
			onDotClick(index);
		};
		const button = document.createElement("button");
		button.setAttribute("type", "button");
		button.setAttribute("aria-label", `slide ${index + 1}`);
		button.addEventListener("click", handleDotClick);
		const li = document.createElement("li");
		li.setAttribute("aria-hidden", "true");
		li.setAttribute("role", "presentation");
		li.setAttribute("aria-controls", `slide-${index}`);
		li.setAttribute(
			"id",
			`${this.sliderNode.getAttribute("id")}-dot-control-${index}`
		);
		li.classList.add(this.sliderDotClass);
		button.style.background = this.options.controlsColor;
		li.appendChild(button);

		return li;
	}

	_generateDirectionIcon() {
		const icon = document.createElement("span");
		icon.style.borderColor = this.options.directionIconColor;
		return icon;
	}

	createLeftButton({ onClick = () => {} }) {
		this._generateDirectionIcon();
		this.sliderButtonLeft = document.createElement("button");
		this.sliderButtonLeft.classList.add(
			this.sliderButtonClass,
			this.sliderLeftButtonClass
		);
		this.sliderButtonLeft.style.background = this.options.controlsColor;
		this.sliderButtonLeft.setAttribute("type", "button");
		this.sliderButtonLeft.setAttribute("aria-label", "Previous slide");
		this.sliderButtonLeft.appendChild(this._generateDirectionIcon());
		this.sliderButtonLeft.addEventListener("click", onClick);

		return this;
	}

	createRightButton({ onClick = () => {} }) {
		this.sliderButtonRight = document.createElement("button");
		this.sliderButtonRight.classList.add(
			this.sliderButtonClass,
			this.sliderRightButtonClass
		);
		this.sliderButtonRight.style.background = this.options.controlsColor;
		this.sliderButtonRight.setAttribute("type", "button");
		this.sliderButtonRight.setAttribute("aria-label", "Next slide");
		this.sliderButtonRight.appendChild(this._generateDirectionIcon());
		this.sliderButtonRight.addEventListener("click", onClick);

		return this;
	}

	createDotsControl(slides, { onDotClick }) {
		this.sliderDotsControl = document.createElement("ul");
		this.sliderDotsControl.classList.add(this.sliderDotControlClass);

		slides.forEach((slide, index) => {
			this.sliderDotsControl.appendChild(
				this._generateControlDot(index, onDotClick)
			);
		});

		return this;
	}

	build() {
		if (this.sliderButtonLeft)
			this.sliderNode.appendChild(this.sliderButtonLeft);
		if (this.sliderButtonRight)
			this.sliderNode.appendChild(this.sliderButtonRight);
		if (this.sliderDotsControl)
			this.sliderNode.appendChild(this.sliderDotsControl);
	}
}

function setSlider({
	node = null,
	hasDotsControl = true,
	hasDirectionsButton = true,
	controlsColor = "#3335",
	controlsActiveColor = "#333c",
	directionIconColor = "#efefef",
}) {
	if (!node) return;
	const slider = node;
	slider.setAttribute("role", "toolbar");
	const sliderContainer = slider.querySelector(".slider__container");
	const slides = Array.from(slider.querySelectorAll(".slider__slide"));
	const sliderControls = new SliderControlsBuilder(slider, {
		controlsColor,
		controlsActiveColor,
		directionIconColor,
	});

	let isDragging = false;
	let startPos = 0;
	let currentTranslate = 0;
	let prevTranslate = 0;
	let animationID = 0;
	let currentIndex = 0;

	const handleButtonLeft = () => {
		const previousIndex = Math.max(currentIndex - 1, 0);
		setPositionByIndex(previousIndex);
	};
	const handleButtonRight = () => {
		const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
		setPositionByIndex(nextIndex);
	};

	const setPositionByIndex = (index) => {
		currentTranslate = index * -window.innerWidth;
		prevTranslate = currentTranslate;
		currentIndex = index;
		setSliderPosition();
		replaceActiveSlide(index);
	};

	if (hasDotsControl === true) {
		sliderControls.createDotsControl(slides, {
			onDotClick: setPositionByIndex,
		});
	}
	if (hasDirectionsButton === true) {
		sliderControls
			.createLeftButton({ onClick: handleButtonLeft })
			.createRightButton({ onClick: handleButtonRight });
	}

	sliderControls.build();
	replaceActiveSlide(currentIndex);

	slides.forEach((slide, index) => {
		const slideImage = slide.querySelector(".slider__slide__image");
		if (slideImage) {
			slideImage.addEventListener("dragstart", (e) => e.preventDefault());
		}

		slide.setAttribute("aria-hidden", false);
		slide.setAttribute("role", "option");
		slide.setAttribute(
			"aria-describedby",
			`${slider.getAttribute("id")}-dot-control-${index}`
		);

		// Touch events
		slide.addEventListener("touchstart", touchStart(index));
		slide.addEventListener("touchend", touchEnd);
		slide.addEventListener("touchmove", touchMove);

		// Mouse events
		slide.addEventListener("mousedown", touchStart(index));
		slide.addEventListener("mouseup", touchEnd);
		slide.addEventListener("mouseleave", touchEnd);
		slide.addEventListener("mousemove", touchMove);
	});

	// Disable context menu
	window.oncontextmenu = function (event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	function touchStart(index) {
		return function (event) {
			currentIndex = index;
			startPos = getPositionX(event);
			isDragging = true;

			// https://css-tricks.com/using-requestanimationframe/
			animationID = requestAnimationFrame(animation);
			sliderContainer.classList.add("grabbing");
		};
	}

	function touchEnd() {
		isDragging = false;
		cancelAnimationFrame(animationID);

		const movedBy = currentTranslate - prevTranslate;
		if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
		if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

		setPositionByIndex(currentIndex);

		sliderContainer.classList.remove("grabbing");
	}

	function touchMove(event) {
		if (isDragging) {
			const currentPosition = getPositionX(event);
			currentTranslate = prevTranslate + currentPosition - startPos;
		}
	}

	function getPositionX(event) {
		return event.type.includes("mouse")
			? event.pageX
			: event.touches[0].clientX;
	}

	function animation() {
		setSliderPosition();
		if (isDragging) requestAnimationFrame(animation);
	}

	function setSliderPosition() {
		sliderContainer.style.transform = `translateX(${currentTranslate}px)`;
	}

	function replaceActiveDot(index) {
		const sliderControl = slider.querySelector(
			`.${sliderControls.sliderDotControlClass}`
		);
		const previousActiveDot = sliderControl.querySelector(
			'[aria-selected="true"]'
		);

		if (previousActiveDot) {
			previousActiveDot.setAttribute("aria-selected", false);
			previousActiveDot.querySelector("button").style.background =
				controlsColor;
		}

		const newActiveDot = sliderControl.children[index];
		newActiveDot.querySelector("button").style.background = controlsActiveColor;
		newActiveDot.setAttribute("aria-selected", true);
	}

	function replaceActiveSlide(index) {
		if (hasDotsControl) {
			replaceActiveDot(index);
		}
		const activeSlide = slider.querySelector(
			".slider__slide[aria-hidden='true']"
		);
		const slides = slider.querySelectorAll(".slider__slide");

		if (activeSlide) {
			activeSlide.setAttribute("aria-hidden", false);
			activeSlide.setAttribute("aria-selected", false);
		}

		slides[index].setAttribute("aria-hidden", true);
		slides[index].setAttribute("aria-selected", true);
	}
}
