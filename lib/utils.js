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
		
		var rect = element.getBoundingClientRect();
		var offset = { 
                top: rect.top + window.scrollY, 
                left: rect.left + window.scrollX, 
            };	
		return offset;
	}
	
	static outerWidth(element) {
		if(!element) {
			return;
		}
		
		var width = element.offsetWidth;
		var style = window.getComputedStyle(element);

		width += parseInt(style.marginLeft) + parseInt(style.marginRight);
		return width;
	}
	
	static outerHeight(element) {
		if(!element) {
			return;
		}
		
		var height = element.offsetHeight;
		var style = window.getComputedStyle(element);

		height += parseInt(style.marginTop) + parseInt(style.marginBottom);
		return height;
	}
}