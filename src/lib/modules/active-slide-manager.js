import { SLIDER_SLIDE_CLASS } from "../constants";

export default class ActiveSlideManager {
	constructor(slider) {
		this._slider = slider;

		this.replaceActiveSlide = this.replaceActiveSlide.bind(this);
	}

	refreshSlideManager(slider) {
		this._slider = slider;
	}

	replaceActiveSlide(index) {
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
