import Event from './event';
import Utils from './utils';
import KEYS from './keyboard-keys';

export default class SliderBase {
	/**
	 * @param sliderNodeId {string} - slider node id
	 * @param values {Object[]} - array of values
	 * @param value {Object} - current slider value
	 * @param textValueHandler {function} - (sliderValue) => { return 'text representation of slider value' }
	 * @param readOnly {boolean} is slider has to be in read only mode
	 */
	constructor(sliderNodeId, values = [], value = null, textValueHandler = null, readOnly = false) {
		this.values = values;
		this.valueIndex = -1;
		this.trackIntervals = [];
		this.trackPageUpPageDownStep = 1;
		this.isSliding = false;
		this.readOnly = readOnly;

		this.textValueHandler = textValueHandler;

		this._changeEvent = new Event('slider:change');

		this.sliderNode = this.getSliderNodeId(sliderNodeId);
		this.handleNode = this.getHandleNode();
		this.noValueNode = this.getNoValueNode();
		this.trackNode = this.getTrackNode();
 
		this.sliderNodeSlidingModifierClass = 'cf-slider--sliding';
		this.handleNodeNoValueModifierClass = 'cf-slider__handle--no-value';

		this.init(value);
	}

	/**
	 * Get slider value
	 * @return {Object|null} current slider value
	 */
	get value() {
		return this.values[this.valueIndex] || null;
	}

	/**
	 * Set slider value
	 * @param newValue
	 */
	set value(newValue) {
		this.setValueIndex(this.values.findIndex(value => value === newValue));
	}

	/**
	 * Fires after slider values is changed
	 * @return {Event}
	 */
	get changeEvent() {
		return this._changeEvent;
	}

	/**
	 * Set slider value silently without triggering change event
	 * @param newValue
	 */
	setValueSilently(newValue) {
		this.setValueIndex(this.values.findIndex(value => value === newValue), true);
	}

	/**
	 * Detach slider control from DOM
	 */
	detachFromDOM() {
		this.trackNode.removeEventListener('click', this.onTrackClick);
		this.noValueNode.removeEventListener('click', this.onNoValueNodeClick);

		this.handleNode.removeEventListener('mousedown', this.onHandleMouseDown);
		document.removeEventListener('mousemove', this.onDocumentMouseMove);
		document.removeEventListener('mouseup', this.onDocumentMouseUp);

		this.handleNode.removeEventListener('touchstart', this.onHandleTouchStart);
		document.removeEventListener('touchmove', this.onDocumentTouchMove);
		document.removeEventListener('touchend', this.onDocumentTouchEnd);

		this.handleNode.removeEventListener('keydown', this.onHandleKeyPress);
	}

	init(value) {	
		this.calculateTrackIntervals();
		this.calculateTrackPageUpPageDownStep();
		this.attachToDOM();
		this.value = value;

		if(this.valueIndex === -1) {
			this.syncHandlePositionToIndexValue();
			this.updateNoValueCSSAttribute();
		}
	}

	// TODO: make an optimization for a large number of values, when interval less than one pixel.
	calculateTrackIntervals() {
		let intervalSize = 100 / (this.values.length);
		for(let i = 0; i < this.values.length; i++) {
			let startInterval = Utils.round(i * intervalSize, 2);
			let endInterval = Utils.round((i + 1) * intervalSize, 2);

			this.trackIntervals.push([startInterval, endInterval]);
		}
	}

	calculateTrackPageUpPageDownStep() {
		if(this.values.length < 10) {
			this.trackPageUpPageDownStep = 1;
		}
		
		this.trackPageUpPageDownStep = Math.round(this.values.length / 5);
	}

	attachToDOM() {
		// click
		this.onTrackClick = this.onTrackClick.bind(this);
		this.onNoValueNodeClick = this.onNoValueNodeClick.bind(this);
		this.trackNode.addEventListener('click', this.onTrackClick);
		this.noValueNode.addEventListener('click', this.onNoValueNodeClick);

		// mouse
		this.onHandleMouseDown = this.onHandleMouseDown.bind(this);
		this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
		this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);

		this.handleNode.addEventListener('mousedown', this.onHandleMouseDown);
		document.addEventListener('mousemove', this.onDocumentMouseMove);
		document.addEventListener('mouseup', this.onDocumentMouseUp);

		// touch
		this.onHandleTouchStart = this.onHandleTouchStart.bind(this);
		this.onDocumentTouchMove = this.onDocumentTouchMove.bind(this);
		this.onDocumentTouchEnd = this.onDocumentTouchEnd.bind(this);

		this.handleNode.addEventListener('touchstart', this.onHandleTouchStart);
		document.addEventListener('touchmove', this.onDocumentTouchMove);
		document.addEventListener('touchend', this.onDocumentTouchEnd);

		//keyboard
		this.onHandleKeyPress = this.onHandleKeyPress.bind(this);
		this.handleNode.addEventListener('keydown', this.onHandleKeyPress);
	}

	getValueIndexByTrackValue(trackValue) {
		let search = (minIndex, maxIndex) => {
			if(minIndex > maxIndex) {
				return -1;
			}
			let midIndex = Math.floor((minIndex + maxIndex) / 2);
			let interval = this.trackIntervals[midIndex];
			if(trackValue < interval[0]) {
				return search(minIndex, midIndex - 1);
			}
			if(trackValue > interval[1]) {
				return search(midIndex + 1, maxIndex);
			}
			return midIndex;
		};

		return search(0, this.trackIntervals.length - 1);
	}

	setValueIndex(value, isSilent = false) {
		if(this.valueIndex === value || this.readOnly) {
			return;
		}

		this.valueIndex = value;

		this.syncHandlePositionToIndexValue();
		this.updateNoValueCSSAttribute();
		this.updateAccessibilityState();

		if(!isSilent) {
			this.changeEvent.trigger();
		}
	}

	// track value in percent
	getTrackValue(absoluteValue) {
		if(absoluteValue < 0) {
			absoluteValue = 0;
		}

		if(absoluteValue > this.getTrackNodeSize()) {
			absoluteValue = this.getTrackNodeSize();
		}

		return Math.floor((absoluteValue / this.getTrackNodeSize()) * 100);
	}

	getTrackValueByInterval(interval) {
		return Utils.floor(((interval[0] + interval[1]) / 2), 2);
	}

	// eslint-disable-next-line no-unused-vars
	setHandleNodePosition(position) {
		throw 'Not implemented exception';
	}

	getTrackNodeSize() {
		throw 'Not implemented exception';
	}

	getHandleNodeSize() {
		throw 'Not implemented exception';
	}

	getHandleNodeMargin() {
		throw 'Not implemented exception';
	}

	getNoValueNodeOffset() {
		throw 'Not implemented exception';
	}

	getTrackNodeOffset() {
		throw 'Not implemented exception';
	}

	getNoValueHandleNodePosition() {
		throw 'Not implemented exception';
	}

	// eslint-disable-next-line no-unused-vars
	getMouseEventPointerPosition(event) {
		throw 'Not implemented exception';
	}

	// eslint-disable-next-line no-unused-vars
	getTouchEventPointerPosition(event) {
		throw 'Not implemented exception';
	}

	// eslint-disable-next-line no-unused-vars
	getPointerPositionOnTheTrack(pointerPosition) {
		throw 'Not implemented exception';
	}

	getSliderNodeId(sliderNodeId) {
		try {
			return document.querySelector(`#${sliderNodeId}`);
		} 
		catch (e) {
			throw 'Could not find the sliderNodeId';
		}
	}

	getHandleNode() {
		try {
			return this.sliderNode.querySelector('.cf-slider__handle');
		} 
		catch (e) {
			throw 'Could not find the ".cf-slider__handle"';
		}
	}

	getNoValueNode() {
		try {
			return this.sliderNode.querySelector('.cf-slider__no-value');
		} 
		catch (e) {
			throw 'Could not find the ".cf-slider__no-value"';
		}
	}

	getTrackNode() {
		try {
			return this.sliderNode.querySelector('.cf-slider__track-area');
		} 
		catch (e) {
			throw 'Could not find the ".cf-slider__track-area"';
		}
	}

	moveHandleNode(trackValue) {
		this.setHandleNodePosition(`${trackValue}%`);
	}

	moveHandleNodeByAbsoluteValue(absoluteTrackValue) {
		this.setHandleNodePosition(`${absoluteTrackValue}px`);
	}

	moveHandleToNoValuePosition() {
		this.moveHandleNodeByAbsoluteValue(this.getNoValueHandleNodePosition());
	}

	moveHandleBack() {
		if(this.valueIndex > -1) {
			this.setValueIndex(this.valueIndex - 1);
		}
	}

	moveHandleForward() {
		if(this.valueIndex < this.values.length - 1) {
			this.setValueIndex(this.valueIndex + 1)
		}
	}

	syncHandlePositionToIndexValue() {
		if(this.valueIndex === -1) {
			this.moveHandleToNoValuePosition();
			return;
		}

		let interval = this.trackIntervals[this.valueIndex];
		let trackValue = this.getTrackValueByInterval(interval);

		this.moveHandleNode(trackValue);
	}

	updateNoValueCSSAttribute() {
		this.toggleHandleNodeNoValueCSSModifier(this.valueIndex === -1);
	}

	updateAccessibilityState() {
		let textValue = null;
		if(this.textValueHandler !== null) {
			textValue = this.textValueHandler(this.value);
		} else if(this.valueIndex > -1) {
				textValue = this.value;
		}
		this.handleNode.setAttribute('aria-valuetext', textValue);
		this.handleNode.setAttribute('aria-valuenow', this.valueIndex);
	}

	toggleHandleNodeNoValueCSSModifier(add) {
		if(add) {
			this.handleNode.classList.add(this.handleNodeNoValueModifierClass);
			return;
		} 
		
		this.handleNode.classList.remove(this.handleNodeNoValueModifierClass);
	}

	handleCommonKeys(keyCode) {
		let newIndex = this.valueIndex;
		switch (keyCode) {
			case KEYS.Home:
				newIndex = 0;
				break;
			case KEYS.End:
				newIndex = this.values.length - 1;
				break;
			case KEYS.PageUp:
				if(this.valueIndex === -1) {
						newIndex = 0;
				} else {
						newIndex = this.valueIndex + this.trackPageUpPageDownStep;
						if(newIndex > this.values.length - 1) {
							newIndex = this.values.length - 1;
						}
				}
				break;
			case KEYS.PageDown:
				newIndex = this.valueIndex - this.trackPageUpPageDownStep;
				if(newIndex < 0) {
					newIndex = 0;
				}
				break;
		}
		this.setValueIndex(newIndex);
	}

	// eslint-disable-next-line no-unused-vars
	handleArrowsKeys(keyCode) {
		throw 'Not implemented exception';
	}

	onTrackClick(event) {
		let pointerPositionOnTheTrack = this.getPointerPositionOnTheTrack(this.getMouseEventPointerPosition(event));
		if(pointerPositionOnTheTrack < 0) {
			return;
		}

		let trackValue = this.getTrackValue(pointerPositionOnTheTrack);
		let index = this.getValueIndexByTrackValue(trackValue);
		this.setValueIndex(index);
	}

	onNoValueNodeClick(event) {
		event.stopPropagation();

		this.setValueIndex(-1);
	}

	onHandleMouseDown(event) {
		event.stopPropagation();

		this.onHandleMoveStart();
	}

	onDocumentMouseMove(event) {
		if(!this.isSliding) {
			return;
		}

		event.preventDefault();

		let pointerPositionOnTheTrack = this.getPointerPositionOnTheTrack(this.getMouseEventPointerPosition(event));
		this.onHandleMove(pointerPositionOnTheTrack);
	}

	onDocumentMouseUp(event) {
		if(!this.isSliding) {
			return;
		}

		event.preventDefault();

		let pointerPositionOnTheTrack = this.getPointerPositionOnTheTrack(this.getMouseEventPointerPosition(event));
		this.onHandleMoveEnd(pointerPositionOnTheTrack);
	}

	onHandleTouchStart(event) {
		if(this.isSliding) {
			return true;
		}

		if(event.cancelable) {
			event.stopPropagation();
			event.preventDefault();
		}

		this.onHandleMoveStart();
	}

	onDocumentTouchMove(event) {
		if(!this.isSliding) {
			return;
		}

		let pointerPositionOnTheTrack = this.getPointerPositionOnTheTrack(this.getTouchEventPointerPosition(event));
		this.onHandleMove(pointerPositionOnTheTrack);
	}

	onDocumentTouchEnd(event) {
		if(!this.isSliding) {
			return;
		}

		event.preventDefault();

		let pointerPositionOnTheTrack = this.getPointerPositionOnTheTrack(this.getTouchEventPointerPosition(event));
		this.onHandleMoveEnd(pointerPositionOnTheTrack);
	}

	onHandleMoveStart() {
		this.isSliding = true;
		this.sliderNode.classList.add(this.sliderNodeSlidingModifierClass);
	}

	onHandleMove(pointerPositionOnTheTrack) {
		this.toggleHandleNodeNoValueCSSModifier(pointerPositionOnTheTrack < 0);

		if(pointerPositionOnTheTrack < 0) { // Out of track
			if(pointerPositionOnTheTrack < this.getNoValueHandleNodePosition()) { // beyond no value position
				this.moveHandleToNoValuePosition();
				return;
			}

			this.moveHandleNodeByAbsoluteValue(pointerPositionOnTheTrack);
			return;
		}

		let trackValue = this.getTrackValue(pointerPositionOnTheTrack);
		this.moveHandleNode(trackValue);
	}

	onHandleMoveEnd(pointerPositionOnTheTrack) {
		this.isSliding = false;
		this.sliderNode.classList.remove(this.sliderNodeSlidingModifierClass);

		let newValueIndex = null;
		if(pointerPositionOnTheTrack < -(this.getHandleNodeSize() / 2)) {
				newValueIndex = -1;
		} else {
				let trackValue = this.getTrackValue(pointerPositionOnTheTrack);
				newValueIndex = this.getValueIndexByTrackValue(trackValue);
		}

		if(newValueIndex === this.valueIndex) {
			this.syncHandlePositionToIndexValue();
			this.updateNoValueCSSAttribute();
		} else {
				this.setValueIndex(newValueIndex);
		}
	}

	onHandleKeyPress(event) {
		let allowedKeys = [KEYS.ArrowUp, KEYS.ArrowLeft, KEYS.ArrowRight, KEYS.ArrowDown, KEYS.PageUp, KEYS.PageDown, KEYS.Home, KEYS.End];
		if(allowedKeys.includes(event.keyCode) === false) {
			return;
		}

		event.preventDefault();

		this.handleCommonKeys(event.keyCode);
		this.handleArrowsKeys(event.keyCode);
	}
}