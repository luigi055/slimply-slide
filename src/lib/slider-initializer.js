import SliderControlsBuilder from "./modules/slider-control-builder";
import ActiveSlideManager from "./modules/active-slide-manager";
import SlidesEngine from "./modules/slides-engine";
import { SLIDER_CONTAINER_CLASS } from "./constants";

export default class SliderInitializer {
	constructor(slider, options) {
		this._slider = slider;
		this._options = options;
		this._sliderControlsBuilder = new SliderControlsBuilder(
			this._slider,
			this._options
		);
		this._slides = new SlidesEngine(this._slider);
	}

	init() {
		this._slider.setAttribute("role", "toolbar");

		if (this._options.shouldDisableContextMenu) {
			this._slider.oncontextmenu = function (event) {
				event.preventDefault();
				event.stopPropagation();
				return false;
			};
		}

		if (this._options.hasDirectionsButton === true) {
			this._sliderControlsBuilder
				.createLeftButton({ onClick: this._slides.goPreviousSlide })
				.createRightButton({ onClick: this._slides.goNextSlide });
		}

		this._sliderControlsBuilder.build();
		this._slides.generateSlides();

		return {
			addLazy: (slide) => {
				this._slides.addSlide(this._slider, slide);
			},
		};
	}
}
