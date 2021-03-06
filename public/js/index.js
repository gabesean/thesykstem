// ------- CURRENTLY EVERYTHING USES ARROW FUNCTIONS...BAD FOR IE COMPATIBILITY -------

// Check URL
const currentURL = window.location.href;
const baseURL = window.location.origin;

// Product Sort & Filter
let initialProductArray = [];
let productArray = [];
let currentProductArray = [];
var gridObjects = [];
let productsOnPage = [];
let productsNotOnPage = [];
let colorFilterArray = [];
let currentPriceFilterArray = [];
let allPriceFiltersArray = [];
var checkedColors = [];
var uncheckedColors = [];
var checkedPrices = [];
var uncheckedPrices = [];
var availFilterColors = [];
var unavailFilterColors = [];
var availFilterPrices = [];
var unavailFilterPrices = [];

const sortDropdown = document.getElementById("sort-products");

const filterColorsContainer = document.getElementById("filter-colors");
const filterColorDropdownValues = document.querySelectorAll(".filter-option-color");
const filterColors = Array.from(filterColorDropdownValues);
const filterPricesContainer = document.getElementById("filter-prices");
const filterPriceDropdownValues = document.querySelectorAll(".filter-option-price");
const clearFiltersButton = document.getElementById("clear-filters-button");
const productGrid = document.querySelector(".product-grid");

const mainNavbar = document.getElementById("main-nav");

// Love List
let loveArray = [];
let currentLoved = [];
const allProductsArray = [];
const productsOnPageArray = [];
let productsOnPageList = [];
let lovedProductsOnPageArray = [];
const lovedCountNavbarContainer = document.querySelector(".loved-items-count");

// Hide & Show Navbar

/*
let scrolling = false;

window.addEventListener('scroll', (e) => {
    scrolling = true;
});

var scrollval = 0;
setInterval(() => {
    if (scrolling) {
        scrolling = false;
		
		if (scrollval > window.scrollY) {
 			
			mainNavbar.classList.add("navbar-slide-down");
			
 		} else {
			console.log("DOWN")
			
 			mainNavbar.classList.add("navbar-slide-up");
			setTimeout(() => {
				mainNavbar.classList.remove("navbar-slide-down");
			}, 1000)
			
			 
 		}
 		scrollval = window.scrollY;
    }
}, 200);
*/


// Sorting & Filtering

if (sortDropdown) {

	window.addEventListener("DOMContentLoaded", () => {
		loadLovedProducts();
		createProductObjects();
		createPriceFilterObjects();
		loadAvailablePriceFilters();
		loadAvailableColorsInLoveList();
		findProductsOnPage()
	});

	sortDropdown.addEventListener("change", handleSortDropdownValue);
	clearFiltersButton.addEventListener("click", clearFilters);

	// Create Product Object
	function createProductObjects() {
		const productContainers = Array.from(document.querySelectorAll(".grid-product-container"));
		for (let i = 0; i < productContainers.length; i++) {
			const productPrice = Number(productContainers[i].querySelector(".price").textContent.replace("$", ""));
			const productColor = productContainers[i].querySelector(".product-page-color").textContent;
			const productObject = {
				container: productContainers[i],
				price: productPrice,
				color: productColor
			}
			initialProductArray.push(productObject);
			productArray.push(productObject);
		}
	}

	// Create price filter objects
	function createPriceFilterObjects() {
		for (let i = 0; i < filterPriceDropdownValues.length; i++) {
			const lowPrice = Number(filterPriceDropdownValues[i].value.split(",").slice(0, 1));
			const highPrice = Number(filterPriceDropdownValues[i].value.split(",").slice(1, 2));
			const priceFilterObject = {
				container: filterPriceDropdownValues[i],
				low: lowPrice,
				high: highPrice
			}
			allPriceFiltersArray.push(priceFilterObject);
		}
	}

	// Load selectable price filters based on products shown
	function loadAvailablePriceFilters() {

		const unavailFilterPricesOnPageVisit = allPriceFiltersArray.filter(fPrice =>
			!productArray.some(pNot =>
				fPrice.high >= pNot.price && fPrice.low <= pNot.price));
		for (let i = 0; i < unavailFilterPricesOnPageVisit.length; i++) {
			unavailFilterPricesOnPageVisit[i].container.parentElement.parentElement.remove();
		}
	}

	// Find all newly filtered products
	function findFilteredProductsOnPage(currentProductsFiltered) {
		productsOnPage = productArray.filter(el =>
			currentProductsFiltered.some(i =>
				el.container.id === i.container.id))

		return productsOnPage;
	}

	function findProductsOnPage() {
		const gridProducts = Array.from(document.querySelectorAll(".grid-product-container"));
		gridObjects = productArray.filter(el =>
			gridProducts.some(i =>
				el.container.id === i.id))

		return gridObjects;
	}

	function findFilteredProductsNotOnPage(currentProductsFiltered) {
		productsNotOnPage = productArray.filter(el =>
			!currentProductsFiltered.some(i =>
				el.container.id === i.container.id))

		return productsNotOnPage
	}

	function getCheckedValue(option, filterType) {
		const checkedStatus = option.target.checked;
		const checkedValue = option.target.value;

		if (filterType === "color") {
			if (checkedStatus === true) {
				colorFilterArray.push(checkedValue);
			} else {
				colorFilterArray.splice(colorFilterArray.indexOf(checkedValue), 1);
			}
		} else if (filterType === "price") {
			const priceFilterObject = {
				low: Number(checkedValue.split(",").slice(0, 1)),
				high: Number(checkedValue.split(",").slice(1, 2))
			}
			if (checkedStatus === true) {
				currentPriceFilterArray.push(priceFilterObject);
			} else {

				// NO INTERNET EXPLORER SUPPORT FOR FINDINDEX:(
				currentPriceFilterArray.splice(currentPriceFilterArray.findIndex(el =>
					el.low === priceFilterObject.low && el.high === priceFilterObject.high), 1);
			}
		}
	}

	// Filter Products (Color)
	function handleColorDropdownValue(currentProductsFiltered) {

		checkedColors = productArray.filter(pItem => colorFilterArray.indexOf(pItem.color) >= 0);
		uncheckedColors = productArray.filter(pItem => colorFilterArray.indexOf(pItem.color) == -1);

		// Change checked products if there are already filters on
		if (currentProductsFiltered !== undefined && currentProductsFiltered.length > 0) {
			checkedColors = currentProductsFiltered.filter(pItem => colorFilterArray.indexOf(pItem.color) >= 0);

		}

		

		// Add Products selected by color filter(s)
		for (let i = 0; i < checkedColors.length; i++) {
			productGrid.appendChild(checkedColors[i].container);
		}

		// Remove Products not selected for color filter(s)
		uncheckedColors.forEach(el => el.container.remove());



		if (currentProductsFiltered !== undefined && currentProductsFiltered.length > 0) {
			uncheckedPrices.forEach(el => el.container.remove());
			// checkedColors = currentProductsFiltered.filter(pItem => colorFilterArray.indexOf(pItem.color) >= 0);

		}


		// Add products back if no filter selected
		if ((uncheckedColors.length == productArray.length) && productArray.every(el => uncheckedColors.indexOf(el) >= 0)) {

			changeFiltersAvailable();

			for (let i = 0; i < productArray.length; i++) {
				productGrid.appendChild(productArray[i].container);
			}
		}
		return checkedColors
	}
	filterColorDropdownValues.forEach((f) => {
		f.addEventListener("change", (option) => {
			const filterType = "color";
			getCheckedValue(option, filterType);

			var currentProductsFiltered = handleColorDropdownValue();

			if (currentPriceFilterArray.length > 0) {

				currentProductsFiltered = handlePriceDropdownValue(currentProductsFiltered);
			}

			changeProductsAvailable(currentProductsFiltered);
			handleSortDropdownValue();
			changeClearFiltersButtonState();
		});
	});

	// Filter Products (Price)
	function handlePriceDropdownValue(currentProductsFiltered) {

		checkedPrices = productArray.filter(pItem =>
			currentPriceFilterArray.some(pFilter =>
				pFilter.high >= pItem.price && pFilter.low <= pItem.price))
		uncheckedPrices = productArray.filter(pItem =>
			!currentPriceFilterArray.some(pFilter =>
				pFilter.high >= pItem.price && pFilter.low <= pItem.price))


		// Change checked products if there are already filters on
		if (currentProductsFiltered !== undefined && currentProductsFiltered.length > 0) {

			// checkedPrices = currentProductsFiltered.filter(pItem =>
			// 	currentPriceFilterArray.some(pFilter =>
			// 		pFilter.high >= pItem.price && pFilter.low <= pItem.price))
			// uncheckedPrices = currentProductsFiltered.filter(pItem =>
			// 	!currentPriceFilterArray.some(pFilter =>
			// 		pFilter.high >= pItem.price && pFilter.low <= pItem.price))
		}



		// Add Products selected by price filters(s)
		for (let i = 0; i < checkedPrices.length; i++) {
			productGrid.appendChild(checkedPrices[i].container);
		}

		// Remove Products not selected for price filter(s)
		uncheckedPrices.forEach(el => el.container.remove());

		if (currentProductsFiltered !== undefined && currentProductsFiltered.length > 0) {
			uncheckedColors.forEach(el => el.container.remove());
			// checkedPrices = currentProductsFiltered.filter(pItem =>
			// 	currentPriceFilterArray.some(pFilter =>
			// 		pFilter.high >= pItem.price && pFilter.low <= pItem.price))
			// uncheckedPrices = currentProductsFiltered.filter(pItem =>
			// !currentPriceFilterArray.some(pFilter =>
			// 	pFilter.high >= pItem.price && pFilter.low <= pItem.price))
		}

		// Add products back if no filter selected
		if ((uncheckedPrices.length == productArray.length) && productArray.every(el => uncheckedPrices.indexOf(el) >= 0)) {

			changeFiltersAvailable();

			for (let i = 0; i < productArray.length; i++) {
				productGrid.appendChild(productArray[i].container);
			}
		}
		return checkedPrices

	}
	filterPriceDropdownValues.forEach((f) => {
		f.addEventListener("change", (option) => {
			const filterType = "price";
			getCheckedValue(option, filterType);

			var currentProductsFiltered = handlePriceDropdownValue();

			if (colorFilterArray.length > 0) {

				currentProductsFiltered = handleColorDropdownValue(currentProductsFiltered);
			}

			changeProductsAvailable(currentProductsFiltered);
			handleSortDropdownValue();
			changeClearFiltersButtonState();
		});
	});

	function changeProductsAvailable(currentProductsFiltered) {

		productsOnPage = findFilteredProductsOnPage(currentProductsFiltered);

		productsNotOnPage = findFilteredProductsNotOnPage(currentProductsFiltered);

		gridObjects = findProductsOnPage();
		
		if (gridObjects.length == 0) {
			for (let i = 0; i < productsOnPage.length; i++) {
				productGrid.appendChild(productsOnPage[i].container);
			}
		}
			
		unavailFilterPrices = allPriceFiltersArray.filter(fPrice => productsNotOnPage.some(pNot =>
			fPrice.high >= pNot.price && fPrice.low <= pNot.price));

		unavailFilterColors = filterColors.filter(fColor => productsNotOnPage.some(i => i.color === fColor.value));


		availFilterPrices = allPriceFiltersArray.filter(fPrice => productsOnPage.some(pOn =>
			fPrice.high >= pOn.price && fPrice.low <= pOn.price));

		availFilterColors = filterColors.filter(fColor =>
			productsOnPage.some(i => i.color === fColor.value));

		changeFiltersAvailable();
	}

	function changeFiltersAvailable() {
		if (currentPriceFilterArray.length > 0) {
			if (availFilterPrices.length > 0) {
				for (let i = 0; i < unavailFilterColors.length; i++) {
					unavailFilterColors[i].setAttribute("disabled", true);
					unavailFilterColors[i].parentElement.setAttribute("disabled", true);
				}
			}
			for (let i = 0; i < availFilterColors.length; i++) {
				availFilterColors[i].removeAttribute("disabled");
				availFilterColors[i].parentElement.removeAttribute("disabled");
			}

		} else {
			for (let i = 0; i < unavailFilterColors.length; i++) {
				unavailFilterColors[i].removeAttribute("disabled");
				unavailFilterColors[i].parentElement.removeAttribute("disabled");
			}
		}
		if (colorFilterArray.length > 0) {
			if (availFilterColors.length > 0) {
				for (let i = 0; i < unavailFilterPrices.length; i++) {
					unavailFilterPrices[i].container.setAttribute("disabled", true);
					unavailFilterPrices[i].container.parentElement.setAttribute("disabled", true);
				}
			}
			for (let i = 0; i < availFilterPrices.length; i++) {
				availFilterPrices[i].container.removeAttribute("disabled");
				availFilterPrices[i].container.parentElement.removeAttribute("disabled");
			}
		} else {
			for (let i = 0; i < unavailFilterPrices.length; i++) {
				unavailFilterPrices[i].container.removeAttribute("disabled");
				unavailFilterPrices[i].container.parentElement.removeAttribute("disabled");
			}
		}
		// uncheckDisabledCheckedFilters();
	}

	function uncheckDisabledCheckedFilters() {
		for (let i = 0; i < filterColorDropdownValues.length; i++) {
			if (filterColorDropdownValues[i].checked == true && filterColorDropdownValues[i].disabled == true) {
				filterColorDropdownValues[i].checked = false;
			}
		}
	}

	// Hide or show reset filters button
	function changeClearFiltersButtonState() {
		if (colorFilterArray.length > 0 || currentPriceFilterArray.length > 0) {
			clearFiltersButton.classList.remove("is-hidden");
		} else {
			clearFiltersButton.classList.add("is-hidden");
		}
	}

	// Clear Filters
	function clearFilters() {
		filterColorDropdownValues.forEach((el) => {
			if (el.checked == true) {
				el.checked = false;
			}
		})
		filterPriceDropdownValues.forEach((el) => {
			if (el.checked == true) {
				el.checked = false;
			}
		})
		for (let i = 0; i < initialProductArray.length; i++) {
			productGrid.appendChild(initialProductArray[i].container);
		}
		colorFilterArray = [];
		currentPriceFilterArray = [];
		checkedColors = [];
		checkedPrices = [];
		findProductsOnPage();

		for (let i = 0; i < unavailFilterColors.length; i++) {
			unavailFilterColors[i].removeAttribute("disabled");
			unavailFilterColors[i].parentElement.removeAttribute("disabled");
		}
		for (let i = 0; i < unavailFilterPrices.length; i++) {
			unavailFilterPrices[i].container.removeAttribute("disabled");
			unavailFilterPrices[i].container.parentElement.removeAttribute("disabled");
		}
		handleSortDropdownValue();
		clearFiltersButton.classList.add("is-hidden");
	}

	// Handle sort value
	function handleSortDropdownValue() {
		const sortValue = sortDropdown.options[sortDropdown.selectedIndex].value;
		if (sortValue === "lowToHigh") {
			sortLowToHigh();
		} else if (sortValue === "highToLow") {
			sortHighToLow();
		} else if (sortValue === "default") {
			sortDefault();
		}
	}

	// Sort low to high
	function sortLowToHigh() {
		
		gridObjects = gridObjects.sort((a, b) => a.price - b.price);
			for (let i = 0; i < gridObjects.length; i++) {
				productGrid.appendChild(gridObjects[i].container);
			}
		// if (checkedColors.length > 0) {
		// 	checkedColors = checkedColors.sort((a, b) => a.price - b.price);
		// 	for (let i = 0; i < checkedColors.length; i++) {
		// 		productGrid.appendChild(checkedColors[i].container);
		// 	}
		// } else if (checkedPrices.length > 0) {
		// 	checkedPrices = checkedPrices.sort((a, b) => a.price - b.price);
		// 	for (let i = 0; i < checkedPrices.length; i++) {
		// 		productGrid.appendChild(checkedPrices[i].container);
		// 	}
		// } else {
		// 	productArray = productArray.sort((a, b) => a.price - b.price);
		// 	for (let i = 0; i < productArray.length; i++) {
		// 		productGrid.appendChild(productArray[i].container);
		// 	}
		// }
	}

	// Sort high to low
	function sortHighToLow() {
		gridObjects = gridObjects.sort((a, b) => b.price - a.price);
			for (let i = 0; i < gridObjects.length; i++) {
				productGrid.appendChild(gridObjects[i].container);
			}
		// if (checkedColors.length > 0) {
		// 	checkedColors = checkedColors.sort((a, b) => b.price - a.price);
		// 	for (let i = 0; i < checkedColors.length; i++) {
		// 		productGrid.appendChild(checkedColors[i].container);
		// 	}
		// } else if (checkedPrices.length > 0) {
		// 	checkedPrices = checkedPrices.sort((a, b) => b.price - a.price);
		// 	for (let i = 0; i < checkedPrices.length; i++) {
		// 		productGrid.appendChild(checkedPrices[i].container);
		// 	}
		// } else {
		// 	productArray = productArray.sort((a, b) => b.price - a.price);
		// 	for (let i = 0; i < productArray.length; i++) {
		// 		productGrid.appendChild(productArray[i].container);
		// 	}
		// }
	}

	// Default sort
	function sortDefault() {
		gridObjects = gridObjects.sort((a, b) => a.container.id.toLowerCase().localeCompare(b.container.id.toLowerCase()));
		for (let i = 0; i < gridObjects.length; i++) {
			productGrid.appendChild(gridObjects[i].container);
		}
		// if (checkedColors.length > 0) {
		// 	for (let i = 0; i < checkedColors.length; i++) {
		// 		productGrid.appendChild(checkedColors[i].container);
		// 	}
		// } else if (checkedPrices.length > 0) {
		// 	for (let i = 0; i < checkedPrices.length; i++) {
		// 		productGrid.appendChild(checkedPrices[i].container);
		// 	}
		// } else {
		// 	for (let i = 0; i < initialProductArray.length; i++) {
		// 		productGrid.appendChild(initialProductArray[i].container);
		// 	}
		// }
	}
} else if (!sortDropdown && (currentURL.indexOf("/account/loved") >= 0)) {
	loadLovedProducts();
} else if (currentURL === (baseURL + "/")) {
	loadLovedProducts();
}

// Product Zoom In
if ((currentURL.indexOf("product") >= 0) && currentURL !== baseURL + "/product/") {

	const activeCollection = document.querySelector(".active-image");
	var activeNormal = document.querySelector(".active-image .image-normal");
	var activeZoomed = document.querySelector(".active-image .image-zoomed");
	const thumbs = document.querySelectorAll(".gallery label");
	for (let i = 0; i < thumbs.length; i++) {
		thumbs[i].addEventListener("click", () => {
			document.querySelector(".active-image").classList.remove("active-image");
			const activeThumb = thumbs[i].getAttribute("for");
			const activeFull = document.getElementById(activeThumb).nextElementSibling;
			activeFull.classList.add("active-image");
			activeNormal = activeFull.firstElementChild;
			activeZoomed = activeFull.lastElementChild;
			activeZoomed.addEventListener("click", getCoordinates);
			activeNormal.addEventListener("click", getCoordinates);
		});
	}

	activeNormal.addEventListener("click", getCoordinates);
	activeZoomed.addEventListener("click", getCoordinates);
}

function getCoordinates(event) {
	const xOffset = event.offsetX;
	const yOffset = event.offsetY;
	zoomProduct(xOffset, yOffset, event);
}

function zoomProduct(xOffset, yOffset, event) {
	const targetArray = [event.target.parentNode.firstElementChild, event.target.parentNode.lastElementChild];
	const productImageNormal = targetArray[0];
	const productImageZoomed = targetArray[1];
	const nWidthZoomed = productImageZoomed.naturalWidth;
	const nHeightZoomed = productImageZoomed.naturalHeight;
	const nWidthNormal = productImageNormal.naturalWidth;
	const nHeightNormal = productImageNormal.naturalHeight;
	const zoomScale = nHeightNormal / nHeightZoomed;
	const calcX = (xOffset) * (zoomScale - (1 + zoomScale));
	const calcY = (yOffset) * (zoomScale - (1 + zoomScale));

	if (productImageNormal.style.opacity == 1 && productImageZoomed.style.opacity == 0) {
		productImageNormal.style.cssText = `opacity: 0;`;
		productImageZoomed.style.cssText = `
		opacity: 1; 
		z-index: 0; 
		left: ${ calcX + "px"}; 
		top: ${ calcY + "px"}`;
	} else if (productImageNormal.style.opacity == 0 && productImageZoomed.style.opacity == 1) {
		productImageNormal.style.cssText = `opacity: 1; z-index: 0;`;
		productImageZoomed.style.cssText = `opacity: 0; z-index: -1;`;
	}
}

// Love Component
window.addEventListener("DOMContentLoaded", () => {
	loadLovedNavbarCount();
});

function loveUnloveProduct(productID) {
	
	const checkbox = document.querySelector("#love-button-" + productID);
	if (checkbox.checked === true) {
		if (JSON.parse(localStorage.getItem("lovedProd")) != null) {
			loveArray = JSON.parse(localStorage.getItem("lovedProd"));
			if (!loveArray.includes(productID)) {
				loveArray.push(productID);
			}
		} else {
			loveArray.push(productID);
		}
	} else {
		if (JSON.parse(localStorage.getItem("lovedProd")) != null) {
			loveArray = JSON.parse(localStorage.getItem("lovedProd"));
			var itemIndex = loveArray.indexOf(productID);
			loveArray.splice(itemIndex, 1);
		}
	}
	try {
		localStorage.setItem("lovedProd", JSON.stringify(loveArray));
	} catch (error) {
		console.error("An error occured while modifying your love list.");
	}
	setTimeout(() => {
		loadLovedNavbarCount();
	}, 500)
}

function loadLovedProducts() {

	productsOnPageList = Array.from(document.querySelectorAll(".grid-product-container"));

	const sortFilterProductsContainer = document.querySelector("#sort-filter-products-container");
	const checkLovedProdExists = JSON.parse(localStorage.getItem("lovedProd"));

	if (checkLovedProdExists) {
		if (checkLovedProdExists.length > 0) {
			currentLoved = JSON.parse(localStorage.getItem("lovedProd"));
			if (currentURL.indexOf("/account/loved") >= 0) {

				for (i = 0; i < currentLoved.length; i++) {
					const gridProductLovedContainer = document.querySelectorAll("#" + currentLoved[i]);
					if (currentLoved.indexOf(gridProductLovedContainer[0].id) >= 0) {
						gridProductLovedContainer.forEach(el => el.classList.remove("is-hidden"));
					}
				}
				productsOnPageList.forEach(el => allProductsArray.push(el.id));
				const productsNotLoved = allProductsArray.filter(match => currentLoved.indexOf(match) == -1);
				for (i = 0; i < currentLoved.length; i++) {
					document.querySelector("#love-button-" + currentLoved[i]).checked = true;
				}
				for (i = 0; i < productsNotLoved.length; i++) {
					const productsRemovedFromList = document.querySelectorAll("#" + productsNotLoved[i]);
					productsRemovedFromList.forEach(el => el.remove());
				}
			} else {
				productsOnPageList.forEach(el => productsOnPageArray.push(el.id));
				const productsWillBeLoved = productsOnPageArray.filter(match => currentLoved.indexOf(match) >= 0);
				for (i = 0; i < productsWillBeLoved.length; i++) {
					document.querySelector("#love-button-" + productsWillBeLoved[i]).checked = true;
				}
			}
		} else {
			if (currentURL.indexOf("/account/loved") >= 0) {

				sortFilterProductsContainer.classList.add("is-hidden");

				const loveListSubtitle = document.querySelector("#loved p");
				loveListSubtitle.innerText = "No items yet! Try adding some and check back here.";
				for (i = 0; i < productsOnPageList.length; i++) {
					productsOnPageList[i].remove();
				}
			}
		}
	} else {
		if (currentURL.indexOf("/account/loved") >= 0) {

			sortFilterProductsContainer.classList.add("is-hidden");

			const loveListSubtitle = document.querySelector("#my-love-list p");
			loveListSubtitle.innerText = "No items yet! Try adding some and check back here.";
		}
	}
}

function loadLovedNavbarCount() {
	
	if (JSON.parse(localStorage.getItem("lovedProd")).length == 0 || JSON.parse(localStorage.getItem("lovedProd")).length == undefined) {
		lovedCountNavbarContainer.classList.add("is-hidden");
	} else {
		lovedCountNavbarContainer.classList.remove("is-hidden");
		lovedCountNavbarContainer.innerText = JSON.parse(localStorage.getItem("lovedProd")).length;
	}
}

function loadAvailableColorsInLoveList() {
	if (currentURL.indexOf("/account/loved") >= 0) {

		unavailFilterColors = filterColors.filter(el => !productArray.some(i => i.color === el.value));

		for (let i = 0; i < unavailFilterColors.length; i++) {
			unavailFilterColors[i].parentElement.parentElement.remove();
		}
	}
}