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
	fireEvent,
} from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import SliderInitializer from "./lib/slider-initializer";
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
const nextSlideButtonTestId = "next-slide-button";
const previousSlideButtonTestId = "previous-slide-button";
const sliderDotsControlTestId = "slider-dots-control";

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

		it("should initialize the slider without dots control", () => {
			const sliderNode = getByTestId(container, testSliderTestId);

			setSlider({ node: sliderNode, hasDotsControl: false });
			const sliderDotsControl = queryByTestId(
				container,
				sliderDotsControlTestId
			);

			expect(sliderDotsControl).toBeNull();
		});

		it("should map correctly the slide aria-described with the dots id", () => {
			const slider = container.querySelector("#slider1");
			setSlider({ node: slider });

			const sliderDotsControl = getByTestId(container, sliderDotsControlTestId);

			const slideDotOne = sliderDotsControl.children[0];
			const slideDotTwo = sliderDotsControl.children[1];
			const slideDotThree = sliderDotsControl.children[2];
			const slideOne = getByTestId(container, slideOneTestId);
			const slideTwo = getByTestId(container, slideTwoTestId);
			const slideThree = getByTestId(container, slideThreeTestId);

			expect(slideOne).toHaveAttribute(
				"aria-describedby",
				slideDotOne.getAttribute("id")
			);
			expect(slideTwo).toHaveAttribute(
				"aria-describedby",
				slideDotTwo.getAttribute("id")
			);
			expect(slideThree).toHaveAttribute(
				"aria-describedby",
				slideDotThree.getAttribute("id")
			);
		});

		it("should map correctly the dots aria-controls with the slide id", () => {
			const slider = container.querySelector("#slider1");
			setSlider({ node: slider });

			const sliderDotsControl = getByTestId(container, sliderDotsControlTestId);

			const slideDotOne = sliderDotsControl.children[0];
			const slideDotTwo = sliderDotsControl.children[1];
			const slideDotThree = sliderDotsControl.children[2];
			const slideOne = getByTestId(container, slideOneTestId);
			const slideTwo = getByTestId(container, slideTwoTestId);
			const slideThree = getByTestId(container, slideThreeTestId);

			expect(slideDotOne).toHaveAttribute(
				"aria-controls",
				slideOne.getAttribute("id")
			);
			expect(slideDotTwo).toHaveAttribute(
				"aria-controls",
				slideTwo.getAttribute("id")
			);
			expect(slideDotThree).toHaveAttribute(
				"aria-controls",
				slideThree.getAttribute("id")
			);
		});
	});

	describe("Slider controls", () => {
		it("should activate the first dot", async () => {
			const slider = container.querySelector("#slider1");
			setSlider({ node: slider });

			const sliderDotsControl = getByTestId(container, sliderDotsControlTestId);

			expect(sliderDotsControl.children[0]).toHaveAttribute(
				"aria-selected",
				"true"
			);
			expect(sliderDotsControl.children[1]).toHaveAttribute(
				"aria-selected",
				"false"
			);
			expect(sliderDotsControl.children[2]).toHaveAttribute(
				"aria-selected",
				"false"
			);
		});

		describe("Testing controls customizable colors", () => {
			it("should use the colors by default", () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });
				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);
				const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

				const previousSlideButton = getByTestId(
					container,
					previousSlideButtonTestId
				);

				const nextSlideButtonIcon = nextSlideButton.querySelector("span");
				const previousSlideButtonIcon =
					previousSlideButton.querySelector("span");

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
				expect(
					sliderDotsControl.children[0].querySelector("button")
				).toHaveStyle(`background: ${DEFAULT_CONTROLS_ACTIVE_COLOR}`);
				expect(
					sliderDotsControl.children[1].querySelector("button")
				).toHaveStyle(`background: ${DEFAULT_CONTROLS_COLOR}`);
				expect(
					sliderDotsControl.children[2].querySelector("button")
				).toHaveStyle(`background: ${DEFAULT_CONTROLS_COLOR}`);
			});

			it("should set custom the colors for controls", () => {
				const slider = container.querySelector("#slider1");
				const controlsColor = "#f905";
				const controlsActiveColor = "#f90";
				const directionIconColor = "#333";

				setSlider({
					node: slider,
					controlsColor,
					controlsActiveColor,
					directionIconColor,
				});
				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);
				const nextSlideButton = getByTestId(container, nextSlideButtonTestId);
				const previousSlideButton = getByTestId(
					container,
					previousSlideButtonTestId
				);

				const nextSlideButtonIcon = nextSlideButton.querySelector("span");
				const previousSlideButtonIcon =
					previousSlideButton.querySelector("span");

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
				expect(
					sliderDotsControl.children[0].querySelector("button")
				).toHaveStyle(`background: ${controlsActiveColor}`);
				expect(
					sliderDotsControl.children[1].querySelector("button")
				).toHaveStyle(`background: ${controlsColor}`);
				expect(
					sliderDotsControl.children[2].querySelector("button")
				).toHaveStyle(`background: ${controlsColor}`);
			});
		}); // Testing controls customizable colors END

		describe("Testing previous and next buttons", () => {
			it("should activate the second dot when the user clicks on the next button", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });
				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);
				const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

				nextSlideButton.click();
				expect(nextSlideButton).toHaveStyle("background:#3335");

				expect(sliderDotsControl.children[0]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[1]).toHaveAttribute(
					"aria-selected",
					"true"
				);
				expect(sliderDotsControl.children[2]).toHaveAttribute(
					"aria-selected",
					"false"
				);
			});

			it("should activate the third dot when the user clicks twice on the next button", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });
				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);
				const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

				nextSlideButton.click();
				nextSlideButton.click();

				expect(sliderDotsControl.children[0]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[1]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[2]).toHaveAttribute(
					"aria-selected",
					"true"
				);
			});

			it("should keep activated the third button when the user clicks on the next button 3 or more times", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });
				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);
				const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

				nextSlideButton.click();
				nextSlideButton.click();
				nextSlideButton.click();
				nextSlideButton.click();

				expect(sliderDotsControl.children[0]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[1]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[2]).toHaveAttribute(
					"aria-selected",
					"true"
				);
			});

			it("should keep activated the first button when the user clicks on the previous button 1 or more times", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });
				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);
				const previousSlideButton = getByTestId(
					container,
					previousSlideButtonTestId
				);
				const nextSlideButton = getByTestId(container, nextSlideButtonTestId);

				nextSlideButton.click();
				nextSlideButton.click();
				previousSlideButton.click();

				expect(sliderDotsControl.children[0]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[1]).toHaveAttribute(
					"aria-selected",
					"true"
				);
				expect(sliderDotsControl.children[2]).toHaveAttribute(
					"aria-selected",
					"false"
				);
			});

			it("should user go to the end of the slides and get back to the second dot", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });
				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);
				const previousSlideButton = getByTestId(
					container,
					previousSlideButtonTestId
				);

				previousSlideButton.click();
				previousSlideButton.click();

				expect(sliderDotsControl.children[0]).toHaveAttribute(
					"aria-selected",
					"true"
				);
				expect(sliderDotsControl.children[1]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[2]).toHaveAttribute(
					"aria-selected",
					"false"
				);
			});
		}); // Testing previous and next buttons END

		describe("Testing dot controls", () => {
			it("should jump to the second dot slide", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);

				sliderDotsControl.children[1].querySelector("button").click();

				expect(sliderDotsControl.children[0]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[1]).toHaveAttribute(
					"aria-selected",
					"true"
				);
				expect(sliderDotsControl.children[2]).toHaveAttribute(
					"aria-selected",
					"false"
				);
			});

			it("should jump to the third dot slide", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);

				sliderDotsControl.children[2].querySelector("button").click();

				expect(sliderDotsControl.children[0]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[1]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[2]).toHaveAttribute(
					"aria-selected",
					"true"
				);
			});

			it("should jump to the third dot slide and come back to the first dot", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);

				sliderDotsControl.children[2].querySelector("button").click();
				sliderDotsControl.children[0].querySelector("button").click();

				expect(sliderDotsControl.children[0]).toHaveAttribute(
					"aria-selected",
					"true"
				);
				expect(sliderDotsControl.children[1]).toHaveAttribute(
					"aria-selected",
					"false"
				);
				expect(sliderDotsControl.children[2]).toHaveAttribute(
					"aria-selected",
					"false"
				);
			});
		}); // Testing dot controls END
	}); // Slider controls END

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
			it("should jump to the second slide", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);

				sliderDotsControl.children[1].querySelector("button").click();

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

			it("should jump to the third slide", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);

				sliderDotsControl.children[2].querySelector("button").click();

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

			it("should jump to the third slide and go back to the second", async () => {
				const slider = container.querySelector("#slider1");
				setSlider({ node: slider });

				const sliderDotsControl = getByTestId(
					container,
					sliderDotsControlTestId
				);

				sliderDotsControl.children[2].querySelector("button").click();
				sliderDotsControl.children[1].querySelector("button").click();

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
		}); // Testing slides jumping through slides END
	}); // Testing Slides END
});
