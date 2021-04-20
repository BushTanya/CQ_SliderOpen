export default class Utils {
	
	static floor(value, precision) {
		const multiplier = Math.pow(10, precision);
		return Math.floor(value * multiplier) / multiplier;
	}

	static round(value, precision) {
		const multiplier = Math.pow(10, precision);
		return Math.round(value * multiplier) / multiplier;
	}
	
	static getElementOffset(element) {
		if(!element) {
			return;
		}
		
		let rect = element.getBoundingClientRect();
		let offset = { 
			top: rect.top + window.scrollY, 
			left: rect.left + window.scrollX, 
		};	
		return offset;
	}
	
	static outerWidth(element) {
		if(!element) {
			return;
		}
		
		let width = element.offsetWidth;
		let style = window.getComputedStyle(element);

		width += parseInt(style.marginLeft) + parseInt(style.marginRight);
		return width;
	}
	
	static outerHeight(element) {
		if(!element) {
			return;
		}
		
		let height = element.offsetHeight;
		let style = window.getComputedStyle(element);

		height += parseInt(style.marginTop) + parseInt(style.marginBottom);
		return height;
	}
	
	/**
	 * @param {DOM} element
	 * @return {object} get computed style for an element, excluding any default styles 
	 */
	static getStylesWithoutDefaults(element) {
		if(!element) {
			return;
		}
		
		// creating an empty dummy object to compare with
		let dummy = document.createElement('div');
		element.parentNode.appendChild(dummy);
	
		// getting computed styles for both elements
		let defaultStyles = getComputedStyle(dummy);
		let elementStyles = getComputedStyle(element);

		// calculating the difference
		let diff = {};
		for(let key in elementStyles) {
			if(elementStyles.hasOwnProperty(key) && defaultStyles[key] !== elementStyles[key] && elementStyles[key].indexOf('px') === -1) {
				diff[key] = elementStyles[key];
			}
		}

		// clear dom
		dummy.remove();

		return diff;
	}
}