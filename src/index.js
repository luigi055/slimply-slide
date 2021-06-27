import InitializeSlider from "./lib/slider-initializer";
import {
	DEFAULT_CONTROLS_COLOR,
	DEFAULT_DIRECTION_ICONS_COLOR,
} from "./constants";

export function setSlider({
	node = null,
	hasDirectionsButton = true,
	shouldDisableContextMenu = false,
	controlsColor = DEFAULT_CONTROLS_COLOR,
	directionIconColor = DEFAULT_DIRECTION_ICONS_COLOR,
}) {
	if (!node) return;

	const slideShow = new InitializeSlider(node, {
		hasDirectionsButton,
		controlsColor,
		directionIconColor,
		shouldDisableContextMenu,
	});

	return slideShow.init();
}
