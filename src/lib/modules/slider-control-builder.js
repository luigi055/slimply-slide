import {
	SLIDER_DOT_CLASS,
	SLIDER_BUTTON_CLASS,
	SLIDER_BUTTON_LEFT_CLASS,
	SLIDER_BUTTON_RIGHT_CLASS,
	SLIDER_DOTS_CONTROL_CLASS,
} from "../constants";

export default class SliderControlsBuilder {
	constructor(sliderNode, options) {
		this.sliderNode = sliderNode;
		this.sliderButtonLeft = null;
		this.sliderButtonRight = null;
		this.sliderDotsControl = null;
		this.options = options;
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
		li.classList.add(SLIDER_DOT_CLASS);
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
			SLIDER_BUTTON_CLASS,
			SLIDER_BUTTON_LEFT_CLASS
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
			SLIDER_BUTTON_CLASS,
			SLIDER_BUTTON_RIGHT_CLASS
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
		this.sliderDotsControl.classList.add(SLIDER_DOTS_CONTROL_CLASS);

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
