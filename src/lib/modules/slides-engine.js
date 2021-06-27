import {
	SLIDER_CONTAINER_GRABBING_STATUS_CLASS,
	SLIDER_SLIDE_IMAGE_CLASS,
	SLIDER_CONTAINER_CLASS,
	SLIDER_SLIDE_CLASS,
} from "../constants";
import ActiveSlideManager from "./active-slide-manager";

export default class SlidesEngine {
	constructor(slider, activeSlideManager) {
		this._slider = slider;
		this._activeSlideManager = new ActiveSlideManager(this._slider);
		this._sliderContainer = this._slider.querySelector(
			`.${SLIDER_CONTAINER_CLASS}`
		);
		this._slides = this._slider.querySelectorAll(`.${SLIDER_SLIDE_CLASS}`);
		this._handleTouchStart = this._handleTouchStart.bind(this);
		this._handleTouchEnd = this._handleTouchEnd.bind(this);
		this._handleTouchMove = this._handleTouchMove.bind(this);
		this._animation = this._animation.bind(this);
		this.goNextSlide = this.goNextSlide.bind(this);
		this.goPreviousSlide = this.goPreviousSlide.bind(this);

		this.isDragging = false;
		this.startPosition = 0;
		this.currentTranslate = 0;
		this.prevTranslate = 0;
		this.animationID = 0;
		this.currentSlideIndex = 0;
	}

	get slidesLength() {
		return this._slides.length;
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
			this.currentSlideIndex = index;
			this.startPosition = this._getPositionX(event);
			this.isDragging = true;

			this.animationID = requestAnimationFrame(this._animation);
			this._sliderContainer.classList.add(
				SLIDER_CONTAINER_GRABBING_STATUS_CLASS
			);
		};
		return event.bind(this);
	}

	_handleTouchEnd() {
		this.isDragging = false;
		cancelAnimationFrame.call(window, this.animationID);

		const movedBy = this.currentTranslate - this.prevTranslate;
		if (movedBy < -100 && this.currentSlideIndex < this._slides.length - 1) {
			this.currentSlideIndex += 1;
		}
		if (movedBy > 100 && this.currentSlideIndex > 0) {
			this.currentSlideIndex -= 1;
		}
		this._setPositionByIndex(this.currentSlideIndex);
		this._sliderContainer.classList.remove(
			SLIDER_CONTAINER_GRABBING_STATUS_CLASS
		);
	}

	_handleTouchMove(event) {
		if (this.isDragging) {
			const currentPosition = this._getPositionX(event);
			this.currentTranslate =
				this.prevTranslate + currentPosition - this.startPosition;
		}
	}

	_setPositionByIndex = (index) => {
		this.currentTranslate = index * -window.innerWidth;
		this.prevTranslate = this.currentTranslate;
		this.currentSlideIndex = index;
		this._setSliderPosition();
		this._activeSlideManager.replaceActiveSlide(index);
	};

	goNextSlide() {
		const nextIndex = Math.min(
			this.currentSlideIndex + 1,
			this.slidesLength - 1
		);
		this._setPositionByIndex(nextIndex);
	}

	goPreviousSlide() {
		const previousIndex = Math.max(this.currentSlideIndex - 1, 0);
		this._setPositionByIndex(previousIndex);
	}

	enrichSlide(slide, index) {
		const slideImage = slide.querySelector(`.${SLIDER_SLIDE_IMAGE_CLASS}`);
		if (slideImage) {
			slideImage.addEventListener("dragstart", (e) => e.preventDefault());
		}

		slide.setAttribute("aria-hidden", true);
		slide.setAttribute("aria-selected", false);
		slide.setAttribute("data-slide_page", index);
		slide.setAttribute("role", "option");

		slide.addEventListener("touchstart", this._handleTouchStart(index));
		slide.addEventListener("touchend", this._handleTouchEnd);
		slide.addEventListener("touchmove", this._handleTouchMove);

		slide.addEventListener("mousedown", this._handleTouchStart(index));
		slide.addEventListener("mouseup", this._handleTouchEnd);
		slide.addEventListener("mouseleave", this._handleTouchEnd);
		slide.addEventListener("mousemove", this._handleTouchMove);
	}

	addSlide(slider, slide) {
		this._slider = slider;
		this._slider.querySelector(`.${SLIDER_CONTAINER_CLASS}`).appendChild(slide);
		this._sliderContainer = this._slider.querySelector(
			`.${SLIDER_CONTAINER_CLASS}`
		);
		this._slides = this._slider.querySelectorAll(`.${SLIDER_SLIDE_CLASS}`);
		this._activeSlideManager.refreshSlideManager(this._slider);
		this.enrichSlide(slide, this.slidesLength - 1);
	}

	generateSlides() {
		Array.from(this._slides).forEach((slide, index) => {
			this.enrichSlide(slide, index);
		});

		this._activeSlideManager.replaceActiveSlide(this.currentSlideIndex);
	}
}
