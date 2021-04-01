// The parameter isCustomScale should be set the same here and in the ".runtime/loader.js"
// For Open Form it should be always true
// For SingleForm, GridForm it should be false
const isCustomScale = true;
let scaleSettingsDiv = document.getElementById('scaleSettings');
if(isCustomScale) {
	scaleSettingsDiv.style.display = "flex";
} else {
  scaleSettingsDiv.style.display = "none";
}

let selectSliderDirection = document.getElementById('sliderDirection');
let scaleMin = document.getElementById('scaleMin');
let scaleMax = document.getElementById('scaleMax');
let scaleStart = document.getElementById('scaleStart');

function setValues(settings, uiSettings) {
	if (!settings) {
		return;
	}
	
	selectSliderDirection.value = settings.isVertical ? "vertical" :  "horizontal";
	scaleMin.value = settings.scaleMin;
	scaleMax.value = settings.scaleMax;
	scaleStart.value = settings.scaleStart;
}

function saveChanges() {
	var errors = checkValues();
	let elementsWithErrors = document.querySelectorAll('.form-input--error');
	removeErrors();
	if(elementsWithErrors.length > 0 || errors) {
		showErrors(errors);
	} else {
		var isVerticalVal = selectSliderDirection.value == "vertical" ? true : false;
		
		let settings = {
			isVertical: isVerticalVal,
			scaleMin: parseInt(scaleMin.value),
			scaleMax: parseInt(scaleMax.value),
			scaleStart: parseInt(scaleStart.value)
		};
		var hasError = false;
		customQuestion.saveChanges(settings, hasError);     
	}
}

function checkValues() {
	let errorsList = [];
	// check scale Min setting
	if(!!scaleMin.value) {
		if(parseInt(scaleMin.value) < -100 || parseInt(scaleMin.value) > 99) {
			if(parseInt(scaleMin.value) < -100) {
				let newItem = {
					'element': scaleMin,
					'errorText': "Can't be less <br/> than -100"
				};
				errorsList.push(newItem);
			} else {
				let newItem = {
					'element': scaleMin,
					'errorText': "Can't be more than 99"
				};
				errorsList.push(newItem);
			}
		}
	}

	// check scale Max setting
	if(!!scaleMax.value) {
		if (parseInt(scaleMax.value) < -99 || parseInt(scaleMax.value) > 100) {
			if (parseInt(scaleMax.value) < -99) {
				let newItem = {
					'element': scaleMax,
					'errorText': "Can't be less than -99"
				};
				errorsList.push(newItem);
			} else {
				let newItem = {
					'element': scaleMax,
					'errorText': "Can't be more than 100"
				};
				errorsList.push(newItem);
			}
		}
	}

	// compare Min and Max values
	if(!!scaleMax.value && !!scaleMin.value) {
		if(parseInt(scaleMax.value) <= parseInt(scaleMin.value)) {
			let newItem = {
				'element': scaleMax,
				'errorText': "Can't be less or equal than scale's minimum"
			};
			errorsList.push(newItem);
		}
	}

	// check if the start point is inside of the Min and Max range
	if(!!scaleStart.value) {
		let rangeStart = -50;
		let rangeEnd = 50;
		if(!!scaleMin.value) {
			rangeStart = scaleMin.value;
		}
		if(!!scaleMax.value) {
			rangeEnd = scaleMax.value;
		}
		if(parseInt(scaleStart.value) < parseInt(rangeStart) || parseInt(scaleStart.value) > parseInt(rangeEnd)) {
			let newItem = {
				'element': scaleStart,
				'errorText': "Must be in the range between " + parseInt(rangeStart) + " and " + parseInt(rangeEnd)
			};
			errorsList.push(newItem);
		}
	}

	if(errorsList.length > 0) {
		return errorsList;
	} else {
		return false;
	}
}

function showErrors(errors) {
	for(let i = 0; i < errors.length; i++) {
		errorTooltipShow(errors[i].element, errors[i].errorText);
		errors[i].element.classList.add("form-input--error");
	}
}

function removeErrors() {
	let elementsWithErrors = document.querySelectorAll('.form-input--error');
	if(elementsWithErrors.length > 0) {
		for(let i = 0; i < elementsWithErrors.length; i++) {
			let elementID = elementsWithErrors[i].id;
			if(document.querySelectorAll("#error--" + elementID).length > 0) {
				elementsWithErrors[i].classList.remove("form-input--error");
				document.getElementById("error--" + elementID).outerHTML = "";
			}
		}
	}
}
	
customQuestion.onSettingsReceived = setValues; 
selectSliderDirection.addEventListener('input', saveChanges);
scaleMin.addEventListener('input', saveChanges);
scaleMax.addEventListener('input', saveChanges);
scaleStart.addEventListener('input', saveChanges);
