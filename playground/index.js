function initializeSlider(element) {
	const createImageSlide = (image) => {
		const slide = document.createElement("div");
		slide.classList.add("slider__slide");
		slide.innerHTML = `
					<img
						class="slider__slide__image blog__gallery__image"
						src="${image}"
						loading="lazy"
						alt=""
					/>
				`;

		return slide;
	};

	document.addEventListener("DOMContentLoaded", function (event) {
		let galleryPage = 0;
		const slide = simplySlide.setSlider({
			node: element,
			controlsColor: "#f905",
			controlsActiveColor: "#f90",
			directionIconColor: "#333",
		});

		const btn = document.getElementById("more-images-btn");
		btn.addEventListener("click", () => {
			galleryPage += 1;
			btn.setAttribute("disabled", "true");
			const originalText = btn.textContent;
			btn.textContent = "Loading...";

			fetch(
				`https://api.unsplash.com/photos?page=${galleryPage}&client_id=nPky8UvfmaFxtiSrnvOLM2z-Wa3Prkagwk_Q1_JxNqo`
			)
				.then(function (response) {
					return response.json();
				})
				.then(function (json) {
					const photos = json.map((photo) => photo.urls.small);
					photos.forEach((photo) => {
						slide.addLazy(createImageSlide(photo));
					});
					btn.removeAttribute("disabled");
					btn.textContent = originalText;
				});
		});
	});
}
