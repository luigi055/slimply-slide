import InitializeSlider from "./lib/slider-initializer";

export function setSlider({
	node = null,
	hasDotsControl = true,
	hasDirectionsButton = true,
	controlsColor = "#3335",
	controlsActiveColor = "#333c",
	directionIconColor = "#efefef",
}) {
	if (!node) return;

	const slideShow = new InitializeSlider(node, {
		hasDotsControl,
		hasDirectionsButton,
		controlsColor,
		controlsActiveColor,
		directionIconColor,
	});

	slideShow.init();
}
