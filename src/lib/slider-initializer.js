import SliderControlsBuilder from "./modules/slider-control-builder";
import ActiveSlideManager from "./modules/active-slide-manager";
import SlidesEngine from "./modules/slides-engine";

export default class SliderInitializer {
	constructor(slider, options) {
		this._slider = slider;
		this._options = options;
		this._sliderControlsBuilder = new SliderControlsBuilder(
			this._slider,
			this._options
		);
		this._activeSlideManager = new ActiveSlideManager(
			this._slider,
			this._options
		);
		this._slides = new SlidesEngine(this._slider, this._activeSlideManager);
	}

	init() {
		this._slider.setAttribute("role", "toolbar");
		if (this._options.hasDotsControl === true) {
			this._sliderControlsBuilder.createDotsControl(this._slides.slideNodes, {
				onDotClick: this._slides.setPositionByIndex,
			});
		}

		if (this._options.hasDirectionsButton === true) {
			this._sliderControlsBuilder
				.createLeftButton({ onClick: this._slides.goPreviousSlide })
				.createRightButton({ onClick: this._slides.goNextSlide });
		}

		this._sliderControlsBuilder.build();
		this._slides.generateSlides();
	}
}
