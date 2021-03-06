/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import { getByTestId, queryByTestId, fireEvent } from "@testing-library/dom";
import { setSlider } from "./index";
import {
	DEFAULT_CONTROLS_COLOR,
	DEFAULT_CONTROLS_ACTIVE_COLOR,
	DEFAULT_DIRECTION_ICONS_COLOR,
} from "./constants";

const testSliderTestId = "test-slider";
const slideOneTestId = "slide-1";
const slideTwoTestId = "slide-2";
const slideThreeTestId = "slide-3";
const slideFourTestId = "slide-4";
const nextSlideButtonTestId = "next-slide-button";
const previousSlideButtonTestId = "previous-slide-button";

const createSlide = (content) => {
	const slide = document.createElement("div");
	slide.classList.add("slider__slide");
	slide.setAttribute("data-testid", `slide-${content}`);
	slide.innerHTML = `
					<span class="slider__slide__image">${content}</span>
				`;

	return slide;
};

function slideshowDOM() {
	const div = document.createElement("div");
	div.innerHTML = `
  	<div class="slider" id="slider1" data-testid="${testSliderTestId}">
			<div class="slider__container">
				<div class="slider__slide" data-testid="slide-1">
					<span class="slider__slide__image" >1</span>
				</div>
				<div class="slider__slide" data-testid="slide-2">
					<span>2</span>
				</div>
				<div class="slider__slide" data-testid="slide-3">
					<span>3</span>
				</div>
			</div>
		</div>
  `;

	return div;
}

describe("Testing the simplySlide widget", () => {
	let container;
	beforeEach(() => {
		container = slideshowDOM();
	});

	describe("Initializing the slider correctly", () => {
		it("should initialize the slider without directions control", () => {
			const sliderNode = getByTestId(container, testSliderTestId);

			setSlider({ node: sliderNode, hasDirectionsButton: false });
			const nextSlideButton = queryByTestId(container, nextSlideButtonTestId);
			const previousSlideButton = queryByTestId(
				container,
				previousSlideButtonTestId
			);

			expect(nextSlideButton).toBeNull();
			expect(previousSlideButton).toBeNull();
		});

		it("should not initialize the slider when simplySlide doesnt receive a node", () => {
			setSlider({});

			expect(container.querySelector("#slider1")).not.toHaveAttribute(
				"role",
				"toolbar"
			);
		});

		it("should initialize the slider when simplySlide receives a node", () => {
			const sliderNode = getByTestId(container, testSliderTestId);

			setSlider({ node: sliderNode });

			expect(sliderNode).toHaveAttribute("role", "toolbar");
		});
	});

	describe("Testing controls customizable colors", () => {
		it("should use the colors by default", () => {
			const slider = container.querySelector("#slider1");
			setSlider({ node: slider });

			const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

			const previousSlideButton = getByTestId(
				container,
				previousSlideButtonTestId
			);

			const nextSlideButtonIcon = nextSlideButton.querySelector("span");
			const previousSlideButtonIcon = previousSlideButton.querySelector("span");

			expect(nextSlideButtonIcon).toHaveStyle(
				`border-top-color: ${DEFAULT_DIRECTION_ICONS_COLOR}`
			);
			expect(nextSlideButtonIcon).toHaveStyle(
				`border-right-color: ${DEFAULT_DIRECTION_ICONS_COLOR}`
			);
			expect(previousSlideButtonIcon).toHaveStyle(
				`border-top-color: ${DEFAULT_DIRECTION_ICONS_COLOR}`
			);
			expect(previousSlideButtonIcon).toHaveStyle(
				`border-left-color: ${DEFAULT_DIRECTION_ICONS_COLOR}`
			);
			expect(previousSlideButton).toHaveStyle(
				`background: ${DEFAULT_CONTROLS_COLOR}`
			);
			expect(nextSlideButton).toHaveStyle(
				`background: ${DEFAULT_CONTROLS_COLOR}`
			);
			expect(previousSlideButton).toHaveStyle(
				`background: ${DEFAULT_CONTROLS_COLOR}`
			);
		});

		it("should set custom the colors for controls", () => {
			const slider = container.querySelector("#slider1");
			const controlsColor = "#f905";
			const directionIconColor = "#333";

			setSlider({
				node: slider,
				controlsColor,
				directionIconColor,
			});
			const nextSlideButton = getByTestId(container, nextSlideButtonTestId);
			const previousSlideButton = getByTestId(
				container,
				previousSlideButtonTestId
			);

			const nextSlideButtonIcon = nextSlideButton.querySelector("span");
			const previousSlideButtonIcon = previousSlideButton.querySelector("span");

			expect(nextSlideButtonIcon).toHaveStyle(
				`border-top-color: ${directionIconColor}`
			);
			expect(nextSlideButtonIcon).toHaveStyle(
				`border-right-color: ${directionIconColor}`
			);
			expect(previousSlideButtonIcon).toHaveStyle(
				`border-top-color: ${directionIconColor}`
			);
			expect(previousSlideButtonIcon).toHaveStyle(
				`border-left-color: ${directionIconColor}`
			);
			expect(previousSlideButton).toHaveStyle(`background: ${controlsColor}`);
			expect(nextSlideButton).toHaveStyle(`background: ${controlsColor}`);
			expect(previousSlideButton).toHaveStyle(`background: ${controlsColor}`);
		});

		it("should disable the context menu", () => {
			let slider = container.querySelector("#slider1");
			const controlsColor = "#f905";
			const directionIconColor = "#333";

			setSlider({
				node: slider,
				shouldDisableContextMenu: true,
			});

			// This invocation is for covering purposes. Since it is difficult to test
			// the context menu since it is a proper behavior of the real browser.
			// this includes the covering part of the body of the real event callback
			// when shouldDisableContextMenu is set to true
			fireEvent.contextMenu(slider);

			// Then the event is mocked just to check if the event is working properly
			slider.oncontextmenu = jest.fn();
			fireEvent.contextMenu(slider);

			expect(slider.oncontextmenu).toHaveBeenCalledTimes(1);
		});
	}); // Testing controls customizable colors END

	describe("Testing Slides", () => {
		it("should start in the first slide", async () => {
			const slider = container.querySelector("#slider1");
			setSlider({ node: slider });

			const slideOne = getByTestId(container, slideOneTestId);
			const slideTwo = getByTestId(container, slideTwoTestId);
			const slideThree = getByTestId(container, slideThreeTestId);

			expect(slideOne).toHaveAttribute("aria-selected", "true");
			expect(slideOne).toHaveAttribute("aria-hidden", "false");
			expect(slideTwo).toHaveAttribute("aria-selected", "false");
			expect(slideTwo).toHaveAttribute("aria-hidden", "true");
			expect(slideThree).toHaveAttribute("aria-selected", "false");
			expect(slideThree).toHaveAttribute("aria-hidden", "true");
		});

		describe("Testing slides jumping through slides", () => {
			it("should slide stay in the first slide when it is the active slide", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const previousSlideButton = getByTestId(
					container,
					previousSlideButtonTestId
				);

				previousSlideButton.click();

				const slideOne = getByTestId(container, slideOneTestId);
				const slideTwo = getByTestId(container, slideTwoTestId);
				const slideThree = getByTestId(container, slideThreeTestId);

				expect(slideOne).toHaveAttribute("aria-selected", "true");
				expect(slideOne).toHaveAttribute("aria-hidden", "false");
				expect(slideTwo).toHaveAttribute("aria-selected", "false");
				expect(slideTwo).toHaveAttribute("aria-hidden", "true");
				expect(slideThree).toHaveAttribute("aria-selected", "false");
				expect(slideThree).toHaveAttribute("aria-hidden", "true");
			});

			it("should go to the second slide", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

				nextSlideButton.click();

				const slideOne = getByTestId(container, slideOneTestId);
				const slideTwo = getByTestId(container, slideTwoTestId);
				const slideThree = getByTestId(container, slideThreeTestId);

				expect(slideOne).toHaveAttribute("aria-selected", "false");
				expect(slideOne).toHaveAttribute("aria-hidden", "true");
				expect(slideTwo).toHaveAttribute("aria-selected", "true");
				expect(slideTwo).toHaveAttribute("aria-hidden", "false");
				expect(slideThree).toHaveAttribute("aria-selected", "false");
				expect(slideThree).toHaveAttribute("aria-hidden", "true");
			});

			it("should go to the third slide", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const previousSlideButton = getByTestId(
					container,
					previousSlideButtonTestId
				);
				const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

				nextSlideButton.click();
				nextSlideButton.click();

				const slideOne = getByTestId(container, slideOneTestId);
				const slideTwo = getByTestId(container, slideTwoTestId);
				const slideThree = getByTestId(container, slideThreeTestId);

				expect(slideOne).toHaveAttribute("aria-selected", "false");
				expect(slideOne).toHaveAttribute("aria-hidden", "true");
				expect(slideTwo).toHaveAttribute("aria-selected", "false");
				expect(slideTwo).toHaveAttribute("aria-hidden", "true");
				expect(slideThree).toHaveAttribute("aria-selected", "true");
				expect(slideThree).toHaveAttribute("aria-hidden", "false");
			});

			it("should go to the third slide and go back to the second", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const previousSlideButton = getByTestId(
					container,
					previousSlideButtonTestId
				);
				const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

				nextSlideButton.click();
				nextSlideButton.click();
				previousSlideButton.click();

				const slideOne = getByTestId(container, slideOneTestId);
				const slideTwo = getByTestId(container, slideTwoTestId);
				const slideThree = getByTestId(container, slideThreeTestId);

				expect(slideOne).toHaveAttribute("aria-selected", "false");
				expect(slideOne).toHaveAttribute("aria-hidden", "true");
				expect(slideTwo).toHaveAttribute("aria-selected", "true");
				expect(slideTwo).toHaveAttribute("aria-hidden", "false");
				expect(slideThree).toHaveAttribute("aria-selected", "false");
				expect(slideThree).toHaveAttribute("aria-hidden", "true");
			});

			it("should keep in the third slide when is the active slide and the user clicks next", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const previousSlideButton = getByTestId(
					container,
					previousSlideButtonTestId
				);
				const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

				nextSlideButton.click();
				nextSlideButton.click();
				nextSlideButton.click();

				const slideOne = getByTestId(container, slideOneTestId);
				const slideTwo = getByTestId(container, slideTwoTestId);
				const slideThree = getByTestId(container, slideThreeTestId);

				expect(slideOne).toHaveAttribute("aria-selected", "false");
				expect(slideOne).toHaveAttribute("aria-hidden", "true");
				expect(slideTwo).toHaveAttribute("aria-selected", "false");
				expect(slideTwo).toHaveAttribute("aria-hidden", "true");
				expect(slideThree).toHaveAttribute("aria-selected", "true");
				expect(slideThree).toHaveAttribute("aria-hidden", "false");
			});
		}); // Testing slides  END
	}); // Testing Slides END

	describe("Testing add slide dynamically", () => {
		it("should add a new slide", () => {
			const slider = container.querySelector("#slider1");
			const slide = setSlider({ node: slider });

			let slideFour = queryByTestId(container, slideFourTestId);
			expect(slideFour).not.toBeTruthy();

			slide.addLazy(createSlide(4));

			slideFour = queryByTestId(container, slideFourTestId);
			expect(slideFour).toBeTruthy();
		});

		it("should enrich the new slide", () => {
			const slider = container.querySelector("#slider1");
			const slide = setSlider({ node: slider });

			slide.addLazy(createSlide(4));

			let slideFour = getByTestId(container, slideFourTestId);

			expect(slideFour).toHaveAttribute("aria-selected", "false");
			expect(slideFour).toHaveAttribute("aria-hidden", "true");
			expect(slideFour).toHaveAttribute("role", "option");
		});

		it("should show the slide when the user go to the four slide", () => {
			const slider = container.querySelector("#slider1");
			const slide = setSlider({ node: slider });

			slide.addLazy(createSlide(4));

			let slideFour = getByTestId(container, slideFourTestId);
			const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

			nextSlideButton.click();
			nextSlideButton.click();
			nextSlideButton.click();

			expect(slideFour).toHaveAttribute("aria-selected", "true");
			expect(slideFour).toHaveAttribute("aria-hidden", "false");
		});
	});

	describe("Testing Touch events", () => {
		function touchTo(slide, initialX = 0, moveX = 0) {
			const touchstart = [{ clientX: initialX, clientY: 0 }];
			const touchMove = [{ clientX: moveX, clientY: 0 }];
			fireEvent.touchStart(slide, { touches: touchstart });
			fireEvent.touchMove(slide, { touches: touchMove });
			fireEvent.touchEnd(slide, { touches: touchMove });
		}

		beforeEach(() => {
			let count = 0;
			jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
				if (count < 1) {
					count = 1;
					cb();
				}
				return 15;
			});
		});

		afterEach(() => {
			window.requestAnimationFrame.mockRestore();
		});

		it("should no move to the second slide when move the first slide but never start", async () => {
			const slider = container.querySelector("#slider1");
			setSlider({ node: slider });

			const slideOne = getByTestId(container, slideOneTestId);
			const slideTwo = getByTestId(container, slideTwoTestId);
			const slideThree = getByTestId(container, slideThreeTestId);

			const touchMove = [{ clientX: -150, clientY: 0 }];

			fireEvent.touchMove(slideOne, { touches: touchMove });
			fireEvent.touchEnd(slideOne, { touches: touchMove });

			expect(slideOne).toHaveAttribute("aria-selected", "true");
			expect(slideTwo).toHaveAttribute("aria-selected", "false");
			expect(slideThree).toHaveAttribute("aria-selected", "false");
		});

		it("should move to the second slide", async () => {
			const slider = container.querySelector("#slider1");
			setSlider({ node: slider });

			const slideOne = getByTestId(container, slideOneTestId);
			const slideTwo = getByTestId(container, slideTwoTestId);
			const slideThree = getByTestId(container, slideThreeTestId);

			touchTo(slideOne, 0, -150);

			expect(slideOne).toHaveAttribute("aria-selected", "false");
			expect(slideTwo).toHaveAttribute("aria-selected", "true");
			expect(slideThree).toHaveAttribute("aria-selected", "false");
		});

		it("should move to the third slide and go back to the second", async () => {
			const slider = container.querySelector("#slider1");
			setSlider({ node: slider });

			const slideOne = getByTestId(container, slideOneTestId);
			const slideTwo = getByTestId(container, slideTwoTestId);
			const slideThree = getByTestId(container, slideThreeTestId);

			touchTo(slideTwo, 0, -150);

			expect(slideOne).toHaveAttribute("aria-selected", "false");
			expect(slideTwo).toHaveAttribute("aria-selected", "false");
			expect(slideThree).toHaveAttribute("aria-selected", "true");

			touchTo(slideThree, 0, 150);

			expect(slideOne).toHaveAttribute("aria-selected", "false");
			expect(slideTwo).toHaveAttribute("aria-selected", "true");
			expect(slideThree).toHaveAttribute("aria-selected", "false");
		});
	});
});
