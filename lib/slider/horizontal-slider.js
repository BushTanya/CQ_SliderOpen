import SliderBase from './slider-base';
import Utils from './utils';
import KEYS from './keyboard-keys';

export default class HorizontalSlider extends SliderBase {
	
	setHandleNodePosition(position) {
		this.handleNode.style.left = position;
	}

	getTrackNodeSize() {
		return this.trackNode.offsetWidth;
	}

	getHandleNodeSize() {
		return this.handleNode.offsetWidth;
	}

	getHandleNodeMargin() {
		return Utils.outerWidth(this.handleNode) - this.handleNode.offsetWidth;
	}

	getNoValueNodeOffset() {
		return Utils.getElementOffset(this.noValueNode).left;
	}

	getTrackNodeOffset() {
		return Utils.getElementOffset(this.trackNode).left;
	}

	getNoValueHandleNodePosition() {
		return (this.getNoValueNodeOffset() - this.getHandleNodeMargin()) - this.getTrackNodeOffset();
	}

	getMouseEventPointerPosition(event) {
		return event.pageX;
	}

	getTouchEventPointerPosition(event) {
		return event.changedTouches[0].pageX;
	}

	getPointerPositionOnTheTrack(pointerPosition) {
		return pointerPosition - this.getTrackNodeOffset();
	}

	handleArrowsKeys(keyCode) {
		switch (keyCode) {
			case KEYS.ArrowDown:
			case KEYS.ArrowLeft:
				this.moveHandleBack();
				break;
			case KEYS.ArrowUp:
			case KEYS.ArrowRight:
				this.moveHandleForward();
				break;
		}
	}
}