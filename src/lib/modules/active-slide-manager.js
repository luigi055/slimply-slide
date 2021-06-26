import { SLIDER_DOTS_CONTROL_CLASS, SLIDER_SLIDE_CLASS } from "../constants";

export default class ActiveSlideManager {
	constructor(slider, options) {
		this._slider = slider;
		this.options = options;

		this.replaceActiveSlide = this.replaceActiveSlide.bind(this);
	}

	regenerateSlides(slider) {
		this._slider = slider;
	}

	_replaceActiveDot(index) {
		const sliderControl = this._slider.querySelector(
			`.${SLIDER_DOTS_CONTROL_CLASS}`
		);
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
			`.${SLIDER_SLIDE_CLASS}[aria-selected="true"]`
		);
		const slides = this._slider.querySelectorAll(`.${SLIDER_SLIDE_CLASS}`);

		if (activeSlide) {
			activeSlide.setAttribute("aria-hidden", true);
			activeSlide.setAttribute("aria-selected", false);
		}

		slides[index].setAttribute("aria-hidden", false);
		slides[index].setAttribute("aria-selected", true);
	}
}
