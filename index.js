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

class ActiveSlideManager {
	constructor(slider, options) {
		this._slider = slider;
		this.options = options;

		this.replaceActiveSlide = this.replaceActiveSlide.bind(this);
	}

	_replaceActiveDot(index) {
		const sliderControl = this._slider.querySelector(`.slider__dots-control`);
		const previousActiveDot = sliderControl.querySelector(
			'[aria-selected="true"]'
		);

		if (previousActiveDot) {
			previousActiveDot.setAttribute("aria-selected", false);
			previousActiveDot.querySelector("button").style.background =
				this.options.controlsColor;
		}

		const newActiveDot = sliderControl.children[index];
		newActiveDot.querySelector("button").style.background =
			this.options.controlsActiveColor;
		newActiveDot.setAttribute("aria-selected", true);
	}

	replaceActiveSlide(index) {
		if (this.options.hasDotsControl) {
			this._replaceActiveDot(index);
		}
		const activeSlide = this._slider.querySelector(
			".slider__slide[aria-hidden='true']"
		);
		const slides = this._slider.querySelectorAll(".slider__slide");

		if (activeSlide) {
			activeSlide.setAttribute("aria-hidden", false);
			activeSlide.setAttribute("aria-selected", false);
		}

		slides[index].setAttribute("aria-hidden", true);
		slides[index].setAttribute("aria-selected", true);
	}
}

class Slides {
	constructor(slider, activeSlideManager) {
		this._slider = slider;
		this._activeSlideManager = activeSlideManager;
		this._sliderContainer = this._slider.querySelector(".slider__container");
		this._slides = this._slider.querySelectorAll(".slider__slide");
		this._handleTouchStart = this._handleTouchStart.bind(this);
		this._handleTouchEnd = this._handleTouchEnd.bind(this);
		this._handleTouchMove = this._handleTouchMove.bind(this);
		this._animation = this._animation.bind(this);

		this.isDragging = false;
		this.startPos = 0;
		this.currentTranslate = 0;
		this.prevTranslate = 0;
		this.animationID = 0;
		this.currentIndex = 0;
	}

	get slideNodes() {
		return this._slides;
	}

	_getPositionX(event) {
		return event.type.includes("mouse")
			? event.pageX
			: event.touches[0].clientX;
	}

	_setSliderPosition() {
		this._sliderContainer.style.transform = `translateX(${this.currentTranslate}px)`;
	}

	_animation() {
		this._setSliderPosition();
		if (this.isDragging) requestAnimationFrame(this._animation);
	}

	_handleTouchStart(index) {
		const event = (event) => {
			this.currentIndex = index;
			this.startPos = this._getPositionX(event);
			this.isDragging = true;

			// https://css-tricks.com/using-requestanimationframe/
			this.animationID = requestAnimationFrame(this._animation);
			this._sliderContainer.classList.add("slider__container--grabbing");
		};

		return event.bind(this);
	}

	_handleTouchEnd() {
		this.isDragging = false;
		cancelAnimationFrame.call(window, this.animationID);

		const movedBy = this.currentTranslate - this.prevTranslate;
		if (movedBy < -100 && this.currentIndex < this._slides.length - 1) {
			this.currentIndex += 1;
		}
		if (movedBy > 100 && this.currentIndex > 0) {
			this.currentIndex -= 1;
		}

		this.setPositionByIndex(this.currentIndex);
		this._sliderContainer.classList.remove("slider__container--grabbing");
	}

	_handleTouchMove(event) {
		if (this.isDragging) {
			const currentPosition = this._getPositionX(event);
			this.currentTranslate =
				this.prevTranslate + currentPosition - this.startPos;
		}
	}

	setPositionByIndex = (index) => {
		this.currentTranslate = index * -window.innerWidth;
		this.prevTranslate = this.currentTranslate;
		this.currentIndex = index;
		this._setSliderPosition();
		this._activeSlideManager.replaceActiveSlide(index);
	};

	goNextSlide() {
		const nextIndex = Math.min(this.currentIndex + 1, this.slides.length - 1);
		this.setPositionByIndex(nextIndex);
	}

	goPreviousSlide() {
		const previousIndex = Math.max(this.currentIndex - 1, 0);
		this.setPositionByIndex(previousIndex);
	}

	generateSlides() {
		Array.from(this._slides).forEach((slide, index) => {
			const slideImage = slide.querySelector(".slider__slide__image");
			if (slideImage) {
				slideImage.addEventListener("dragstart", (e) => e.preventDefault());
			}

			slide.setAttribute("aria-hidden", false);
			slide.setAttribute("role", "option");
			slide.setAttribute(
				"aria-describedby",
				`${this._slider.getAttribute("id")}-dot-control-${index}`
			);

			// Touch events
			slide.addEventListener("touchstart", this._handleTouchStart(index));
			slide.addEventListener("touchend", this._handleTouchEnd);
			slide.addEventListener("touchmove", this._handleTouchMove);

			// Mouse events
			slide.addEventListener("mousedown", this._handleTouchStart(index));
			slide.addEventListener("mouseup", this._handleTouchEnd);
			slide.addEventListener("mouseleave", this._handleTouchEnd);
			slide.addEventListener("mousemove", this._handleTouchMove);
		});

		this._activeSlideManager.replaceActiveSlide(this.currentIndex);
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

	const sliderControlsBuilder = new SliderControlsBuilder(slider, {
		controlsColor,
		controlsActiveColor,
		directionIconColor,
	});
	const activeSlideManager = new ActiveSlideManager(slider, {
		controlsColor,
		controlsActiveColor,
		hasDotsControl,
	});

	const slides = new Slides(slider, activeSlideManager);

	if (hasDotsControl === true) {
		sliderControlsBuilder.createDotsControl(slides.slideNodes, {
			onDotClick: slides.setPositionByIndex,
		});
	}

	if (hasDirectionsButton === true) {
		sliderControlsBuilder
			.createLeftButton({ onClick: slides.goPreviousSlide })
			.createRightButton({ onClick: slides.goNextSlide });
	}

	sliderControlsBuilder.build();
	slides.generateSlides();
}
