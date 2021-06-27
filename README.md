<h1 align="center">Simply Slide</h1>

<p align="center">
<a href="https://github.com/luigi055/slimply-slide/actions/workflows/quality-check.yaml"><img src="https://github.com/luigi055/slimply-slide/actions/workflows/quality-check.yaml/badge.svg" alt="quality-check"></a>
<a href="https://github.com/luigi055/slimply-slide/actions/workflows/coverage.yaml"><img src="https://github.com/luigi055/slimply-slide/actions/workflows/coverage.yaml/badge.svg?branch=feature%2Fgithub-action-coverage" alt="Coverage"></a>
</p>

## Introduction

Simply Slide is a simple slider that brings with the very basic to customize your slide show it comes with some nice utilities that allows to enhance the user experience with touch sliding, image resize interaction, optional direction buttons, add new slides in run time and color customization.

## how to install:

### NPM package compatibility with CommonjS and ESModules;

```
npm i simply-slide

yarn add simply-slide
```

Then in your use it depending the format better fit to your needs.

#### CommonJS

```
const simplySlide = require("simply-slide");

simplySlide.setSlider({
  node: document.querySelector("#slider1")
})

```

#### ESModule

```
import { setSlider } from "simply-slide";

setSlider({
  node: document.querySelector("#slider1")
})
```

### CSS available to use with webpack

```
// esm
import "simply-slide/dist/simply-slide.css";

// cjs
require "simply-slide/dist/simply-slide.css";
```

### UMD with npm package

```
// Javascript
https://unpkg.com/simply-slide@0.0.4/dist/simply-slide.js

// CSS
https://unpkg.com/simply-slide@0.0.4/dist/simply-slide.css
```

This is an example using UMD with html

```
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Simply slide</title>
		<link
			rel="stylesheet"
			href="https://unpkg.com/simply-slide@0.0.4/dist/simply-slide.css"
		/>
	</head>
	<body>
		<div class="slider" id="slider1">
			<div class="slider__container">
				<div class="slider__slide"><span>1</span></div>
				<div class="slider__slide"><span>2</span></div>
				<div class="slider__slide"><span>3</span></div>
			</div>
		</div>

		<script src="https://unpkg.com/simply-slide@0.0.4/dist/simply-slide.js"></script>
		<script>
			document.addEventListener("DOMContentLoaded", function (event) {
				simplySlide.setSlider({
					node: document.getElementById("slider1"),
				});
			});
		</script>
	</body>
</html>
```

## How to use it

Simply Slide is compatible with all of the current Frontend frameworks, web components and vanilla JS. since this is a tools that facilitate the skeleton for the slideshow you can use how you want.

### First create the slide using html

Use the building blocks to set the basic skeleton for your slide

use the class `.slider` to define the slider and the styles for the entire element. all of these are mandatory and they where thought not only as easy to define styles but to be easy to read and simplify the reading of the slider.

define the `slider__container` and the basic slides. each one with the class `slider__slide`

```
<div class="slider" id="slider1">
	<div class="slider__container">
		<div class="slider__slide"><span>1</span></div>
		<div class="slider__slide"><span>2</span></div>
		<div class="slider__slide"><span>3</span></div>
	</div>
</div>
```

### Then set the slider

```
<script>
	document.addEventListener("DOMContentLoaded", function (event) {
		simplySlide.setSlider({
			node: document.getElementById("slider1"),
		});
	});
</script>
```

Here a really basic example with the basic building blocks.

**Notice that inside the slides theres nothing. this is made by design. you can customize every slide content as you wish.**

[Basic Example](https://simply-slide.surge.sh/basic.html)

## CSS Class Utilities

### Use the `slider__slide__image`

This utility is a great complement to your contents that contain images.
the utility class enrich the images with a resize when the user touch or clicks on the slide.

Really good for UX interaction.

[Images example](https://simply-slide.surge.sh/images-example.html)

### Use the `slider__slide-centered`

With this class you could center the content of the slide. it uses `flexbox` with `justify-content` and `align-items` to center.

_Use this class utils with the slide directly_

```
<div class="slider" id="slider1">
	<div class="slider__container">
		<div class="slider__slide slider__slide-centered"><span>1</span></div>
		<div class="slider__slide slider__slide-centered"><span>2</span></div>
		<div class="slider__slide slider__slide-centered"><span>3</span></div>
	</div>
</div>
```

[Basic example centered](https://simply-slide.surge.sh/basic-centered.html)

### You can change some parameters of the slider

```
import { setSlider } from "simply-slide";

setSlider({
  node: document.querySelector("#slider1")
  shouldDisableContextMenu: false // false by default. it shows the browser context menu.
  hasDirectionsButton: true, // true by default. it shows the direction buttons.
	controlsColor: "#3335", // change the color of the direction buttons.
	directionIconColor: "#efefef // change the color of the button icon.
})
```

Look a these example to see the configuration in action. try to right click on the slider.
**In these examples the context menu are disabled.**

[Example with disable context disabled](https://simply-slide.surge.sh/images-example-without-context-menu.html)

[Customized slide show](http://the-photo-blog.surge.sh/)

### Add more slides dynamically

Once define your slide with `setSlide` it returns and instance of the slide where you can have access to extra functionalities in run time.

so far there is just one functionality; `addLazy(DOMElement)` which you could use to add new slides dynamically with out the need to re render the entire slide.

```
import { setSlider } from "simply-slide";

const newSlide = document.createElemnent(div)
newSlide.classList.add("slider__slide")
newSlide.innerHTML = "<span>4</span>"

const slider = setSlider({
  node: document.querySelector("#slider1")
})

setTimeout(() => {
  slider.addLazy(newSlide)
}, 3000)

```

You can see this feature in action in this blog template example.

Notice that you have some images in the slider in the beginning, when you click in the get more images it adds more images dynamically.

[Add images dynamically ](http://the-photo-blog.surge.sh/)

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2013-present, Yuxi (Evan) You
