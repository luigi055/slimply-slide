import { createElement } from "parse5/lib/tree-adapters/default";
import {
	SLIDER_BUTTON_CLASS,
	SLIDER_BUTTON_LEFT_CLASS,
	SLIDER_BUTTON_RIGHT_CLASS,
} from "../constants";

export default class SliderControlsBuilder {
	constructor(sliderNode, options) {
		this.sliderNode = sliderNode;
		this.sliderButtonLeft = null;
		this.sliderButtonRight = null;
		this.options = options;
	}

	_generateDirectionIcon() {
		const icon = document.createElement("span");
		icon.style.borderColor = this.options.directionIconColor;
		return icon;
	}

	createLeftButton({ onClick }) {
		this._generateDirectionIcon();
		this.sliderButtonLeft = document.createElement("button");
		this.sliderButtonLeft.classList.add(
			SLIDER_BUTTON_CLASS,
			SLIDER_BUTTON_LEFT_CLASS
		);
		this.sliderButtonLeft.style.background = this.options.controlsColor;
		this.sliderButtonLeft.setAttribute("type", "button");
		this.sliderButtonLeft.setAttribute("data-testid", "previous-slide-button");
		this.sliderButtonLeft.setAttribute("aria-label", "Previous slide");
		this.sliderButtonLeft.appendChild(this._generateDirectionIcon());
		this.sliderButtonLeft.addEventListener("click", onClick);

		return this;
	}

	createRightButton({ onClick }) {
		this.sliderButtonRight = document.createElement("button");
		this.sliderButtonRight.classList.add(
			SLIDER_BUTTON_CLASS,
			SLIDER_BUTTON_RIGHT_CLASS
		);
		this.sliderButtonRight.style.background = this.options.controlsColor;
		this.sliderButtonRight.setAttribute("type", "button");
		this.sliderButtonRight.setAttribute("data-testid", "next-slide-button");
		this.sliderButtonRight.setAttribute("aria-label", "Next slide");
		this.sliderButtonRight.appendChild(this._generateDirectionIcon());
		this.sliderButtonRight.addEventListener("click", onClick);

		return this;
	}

	build() {
		if (this.sliderButtonLeft)
			this.sliderNode.appendChild(this.sliderButtonLeft);
		if (this.sliderButtonRight)
			this.sliderNode.appendChild(this.sliderButtonRight);
	}
}
