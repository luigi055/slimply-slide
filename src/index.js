import InitializeSlider from "./lib/slider-initializer";
import {
	DEFAULT_CONTROLS_COLOR,
	DEFAULT_CONTROLS_ACTIVE_COLOR,
	DEFAULT_DIRECTION_ICONS_COLOR,
} from "./constants";
import { Console } from "console";

export function setSlider({
	node = null,
	hasDotsControl = true,
	hasDirectionsButton = true,
	controlsColor = DEFAULT_CONTROLS_COLOR,
	controlsActiveColor = DEFAULT_CONTROLS_ACTIVE_COLOR,
	directionIconColor = DEFAULT_DIRECTION_ICONS_COLOR,
}) {
	if (!node) return;

	const slideShow = new InitializeSlider(node, {
		hasDotsControl,
		hasDirectionsButton,
		controlsColor,
		controlsActiveColor,
		directionIconColor,
	});

	return slideShow.init();
}
