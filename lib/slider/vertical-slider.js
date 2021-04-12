import SliderBase from './slider-base';
import Utils from './utils';
import KEYS from './keyboard-keys';

export default class VerticalSlider extends SliderBase {

	setHandleNodePosition(position) {
		this.handleNode.style.top = position;
	}

	getTrackNodeSize() {
		return this.trackNode.offsetHeight;
	}

	getHandleNodeSize() {
		return this.handleNode.offsetHeight;
	}

	getHandleNodeMargin() {
		return Utils.outerHeight(this.handleNode) - this.handleNode.offsetHeight;
	}

	getNoValueNodeOffset() {
		return Utils.getElementOffset(this.noValueNode).top;
	}

	getTrackNodeOffset() {
		return Utils.getElementOffset(this.trackNode).top;
	}

	getNoValueHandleNodePosition() {
		return (this.getNoValueNodeOffset() - this.getHandleNodeMargin()) - this.getTrackNodeOffset();
	}

	getMouseEventPointerPosition(event) {
		return event.pageY;
	}

	getTouchEventPointerPosition(event) {
		return event.changedTouches[0].pageY;
	}

	getPointerPositionOnTheTrack(pointerPosition) {
		return pointerPosition - this.getTrackNodeOffset();
	}

	handleArrowsKeys(keyCode) {
		switch (keyCode) {
			case KEYS.ArrowUp:
			case KEYS.ArrowLeft:
				this.moveHandleBack();
				break;
			case KEYS.ArrowDown:
			case KEYS.ArrowRight:
				this.moveHandleForward();
				break;
		}
	}
}