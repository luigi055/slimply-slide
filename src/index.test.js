/**
 * @jest-environment jsdom
 */

import {
	getByLabelText,
	getByText,
	getByTestId,
	queryByTestId,
	// Tip: all queries are also exposed on an object
	// called "queries" which you could import here as well
	waitFor,
	screen,
} from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import SliderInitializer from "./lib/slider-initializer";
import { setSlider } from "./index";

const testSliderTestId = "test-slider";

function slideshowDOM() {
	// This is just a raw example of setting up some DOM
	// that we can interact with. Swap this with your UI
	// framework of choice 😉
	const body = document.createElement("body");
	body.innerHTML = `
  	<div class="slider" id="slider1" data-testid="${testSliderTestId}">
			<div class="slider__container">
				<div class="slider__slide">
					<span data-testid="slide-content-1">1</span>
				</div>
				<div class="slider__slide">
					<span data-testid="slide-content-2">2</span>
				</div>
				<div class="slider__slide">
					<span data-testid="slide-content-3">3</span>
				</div>
			</div>
		</div>
  `;

	return body;
}
jest.mock("./lib/slider-initializer");

describe("Testing the simplySlide widget", () => {
	let container;
	beforeEach(() => {
		container = slideshowDOM();
	});
	describe("Initializing the slider correctly", () => {
		const mockInit = jest.fn();
		jest.mock("./lib/slider-initializer", () => {
			return jest.fn().mockImplementation(() => {
				return { init: mockInit };
			});
		});

		beforeEach(() => {
			SliderInitializer.mockClear();
		});

		it("should initialize the slider when simplySlide receives a node", () => {
			const sliderNode = getByTestId(container, testSliderTestId);

			setSlider({ node: sliderNode });

			expect(SliderInitializer).toHaveBeenCalledTimes(1);
		});

		it("should not initialize the slider when simplySlide doesnt receive a node", () => {
			setSlider({});

			expect(SliderInitializer).toHaveBeenCalledTimes(0);
		});
	});

	describe("Slider controls", () => {
		it("should render the simplySlide", () => {
			const sliderNode = getByTestId(container, testSliderTestId);
			setSlider({ node: sliderNode });
			expect(getByTestId(container, testSliderTestId)).toHaveAttribute(
				"id",
				"slider1"
			);
		});
	});
});
