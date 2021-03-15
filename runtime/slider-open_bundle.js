/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./lib/event.js
class Event {
  /**
   * Create instance.
   * @param {string} name - Event name.
   */
  constructor(name) {
    this._name = name;
    this.subscribers = [];
  }
  /**
   * Event name.
   * @type {string}
   * @readonly
   */


  get name() {
    return this._name;
  }
  /**
   * Subscribe to event.
   * @param {function} subscriber - Event handler function.
   */


  on(subscriber) {
    if (this.subscribers.find(item => item === subscriber) !== undefined) {
      return;
    }

    this.subscribers.push(subscriber);
  }
  /**
   * Unsubscribe from event.
   * @param {function} subscriber - Event handler function.
   */


  off(subscriber) {
    this.subscribers = this.subscribers.filter(item => item !== subscriber);
  }
  /**
   * Trigger the event.
   * @param {object} data
   */


  trigger(data = null) {
    this.subscribers.forEach(item => item(data));
  }

}
;// CONCATENATED MODULE: ./lib/question-view-base.js

class QuestionViewBase {
  /**
   * @param {Question} question
   * @param {QuestionViewSettings} settings
   */
  constructor(question, settings = null) {
    this.question = question;
    this.settings = settings;
    this.boundOnModelValueChange = this.onModelValueChange.bind(this);
    this.boundOnValidationComplete = this.onValidationComplete.bind(this);
    this._pending = false;
    this._pendingChangeEvent = new Event('pending: change');
    this.attachModelHandlers();
  }

  get pendingChangeEvent() {
    return this._pendingChangeEvent;
  }

  get pending() {
    return this._pending;
  }

  set pending(value) {
    this._pending = value;

    this._pendingChangeEvent.trigger({
      id: this._question.id,
      pending: this._pending
    });
  }

  detachModelHandlers() {
    this.question.changeEvent.off(this.boundOnModelValueChange);
    this.question.validationCompleteEvent.off(this.boundOnValidationComplete);
  }

  attachModelHandlers() {
    this.question.changeEvent.on(this.boundOnModelValueChange);
    this.question.validationCompleteEvent.on(this.boundOnValidationComplete);
  }

  onValidationComplete() {}

  onModelValueChange() {}

}
;// CONCATENATED MODULE: ./lib/question-view.js


class QuestionView extends QuestionViewBase {
  /**
   * @param {Question} question
   * @param {QuestionViewSettings} settings
   */
  constructor(question, settings = null) {
    super(question, settings);
  }

  getQuestionErrorNodeId() {
    return `${this.question.id}_error`;
  }

  getQuestionInputNodeId() {
    return `${this.question.id}_input`;
  }

  getQuestionErrorNode() {
    return document.querySelector('#' + this.getQuestionErrorNodeId());
  }

  getQuestionInputNode() {
    return document.querySelector('#' + this.getQuestionInputNodeId());
  }

  onValidationComplete(validationResult) {
    this.hideErrors();

    if (validationResult.isValid === false) {
      this.showErrors(validationResult);
    }
  }

  showErrors(validationResult) {
    this.addQuestionErrorModifier();
    this.questionErrorBlock.showErrors(validationResult.errors.map(error => error.message));
  }

  hideErrors() {
    this.removeQuestionErrorModifier();
    this.questionErrorBlock.hideErrors();
  }

  addQuestionErrorModifier() {
    this.container.classList.add('cf-question--error');
  }

  removeQuestionErrorModifier() {
    this.container.classList.remove('cf-question--error');
  }

}
;// CONCATENATED MODULE: ./lib/question-with-answers-view.js


class QuestionWithAnswersView extends QuestionView {
  /**
   * @param {QuestionWithAnswers} question
   * @param {QuestionViewSettings} settings
   */
  constructor(question, settings = null) {
    super(question, settings);
  }

  get answers() {
    return this.question.answers;
  }

  getAnswerErrorBlockId(answerCode) {
    return `${this.question.id}_${answerCode}_error`;
  }

  getAnswerOtherErrorBlockId(answerCode) {
    return `${this.question.id}_${answerCode}_other_error`;
  }

  getAnswerNodeId(answerCode) {
    return `${this.question.id}_${answerCode}`;
  }

  getAnswerInputNodeId(answerCode) {
    return `${this.question.id}_${answerCode}_input`;
  }

  getAnswerTextNodeId(answerCode) {
    return `${this.question.id}_${answerCode}_text`;
  }

  getAnswerOtherNodeId(answerCode) {
    return `${this.question.id}_${answerCode}_other`;
  }

  getScaleNodeId(answerCode, scaleCode) {
    return `${this.question.id}_${answerCode}_${scaleCode}`;
  }

  getAnswerNode(answerCode) {
    return document.querySelector('#' + this.getAnswerNodeId(answerCode));
  }

  getAnswerInputNode(answerCode) {
    return document.querySelector('#' + this.getAnswerInputNodeId(answerCode));
  }

  getAnswerTextNode(answerCode) {
    return document.querySelector('#' + this.getAnswerTextNodeId(answerCode));
  }

  getAnswerOtherNode(answerCode) {
    return document.querySelector('#' + this.getAnswerOtherNodeId(answerCode));
  }

  getScaleNode(answerCode, scaleCode) {
    return document.querySelector('#' + this.getScaleNodeId(answerCode, scaleCode));
  }

  showErrors(validationResult) {
    this.showQuestionErrors(validationResult);
    this.showAnswerErrors(validationResult);
  }

  showQuestionErrors(validationResult) {
    super.showErrors(validationResult);
  }
  /**
   * @param {QuestionValidationResult} validationResult
   * @protected
   */


  showAnswerErrors(validationResult) {
    validationResult.answerValidationResults.filter(result => !result.isValid).forEach(result => this.showAnswerError(result));
  }
  /**
   * @param {AnswerValidationResult} validationResult
   * @protected
   */


  showAnswerError(validationResult) {
    const answer = this.question.getAnswer(validationResult.answerCode);
    const target = answer.isOther ? this.getAnswerOtherNode(validationResult.answerCode) : this.getAnswerTextNode(validationResult.answerCode);
    const errorBlockId = this.getAnswerErrorBlockId(validationResult.answerCode);
    const errors = validationResult.errors.map(error => error.message);
    this.answerErrorBlockManager.showErrors(errorBlockId, target, errors);
  }

  hideErrors() {
    super.hideErrors();
    this.answerErrorBlockManager.removeAllErrors();
  }

  updateAnswerOtherNodes({
    otherValues = []
  }) {
    otherValues.forEach(answerCode => {
      const otherValue = this.question.otherValues[answerCode];
      this.setOtherNodeValue(answerCode, otherValue);
    });
  }

  setOtherNodeValue(answerCode, otherValue) {
    otherValue = otherValue || '';
    const otherInput = this.getAnswerOtherNode(answerCode);

    if (otherInput != null && otherInput.value !== otherValue) {
      otherInput.value = otherValue;
    }
  }

}
;// CONCATENATED MODULE: ./lib/error-list.js
class ErrorList {
  constructor(listNode) {
    this.list = listNode;
  }

  addErrors(errors = []) {
    if (errors.length === 0) {
      return;
    }

    errors.forEach(error => this.appendError(error));
  }

  addError(error) {
    this.appendError(error);
  }

  clean() {
    while (this.list.firstChild) this.list.removeChild(this.list.firstChild);
  }

  appendError(error) {
    var erLi = document.createElement('li');
    erLi.setAttribute("class", "cf-error-list__item");
    erLi.innerHTML = `${error}`;
    this.list.append(erLi);
  }

}
;// CONCATENATED MODULE: ./lib/question-error-block.js

class QuestionErrorBlock {
  constructor(container) {
    this.container = container;
    this.errorList = new ErrorList(this.container.querySelector('.cf-error-list'));
  }

  showErrors(errors) {
    if (errors.length === 0) return;
    this.errorList.clean();
    this.errorList.addErrors(errors);
    this.container.classList.remove('cf-error-block--hidden');
  }

  hideErrors() {
    this.container.classList.add('cf-error-block--hidden');
    this.errorList.clean();
  }

}
;// CONCATENATED MODULE: ./lib/answer-error-block.js

class AnswerErrorBlock {
  constructor(id, target, {
    top = false,
    absolute = false
  } = {}) {
    this.container = null;
    this.errorList = null;
    this.id = id;
    this.target = target;
    this.targetIsInput = this.targetIsInput();
    this.positionTop = top;
    this.positionAbsolute = absolute;
    this.init();
  }

  showErrors(errors) {
    if (errors.length === 0) return;
    this.errorList.clean();
    this.errorList.addErrors(errors);
    this.container.classList.remove('cf-error-block--hidden');
  }

  remove() {
    this.container.remove();

    if (this.targetIsInput) {
      this.removeErrorClassFromTarget();
    }
  }

  init() {
    this.container = this.prepareHtml();
    this.errorList = new ErrorList(this.container.querySelector('.cf-error-list'));
    this.append();

    if (this.targetIsInput) {
      this.addErrorClassToTarget();
    }
  }

  append() {
    if (this.positionAbsolute) {
      this.target.append(this.container);
    } else {
      if (this.positionTop) {
        this.target.before(this.container);
      } else {
        this.target.after(this.container);
      }
    }
  }

  prepareHtml() {
    let html = document.createElement("div");
    html.setAttribute("id", `${this.id}`);
    html.setAttribute("class", "cf-error-block cf-error-block--hidden" + `${this.getPositionModifier()}`);
    html.setAttribute("role", "alert");
    html.setAttribute("aria-labelledby", `${this.id}_list`);
    html.innerHTML = "<ul class='cf-error-list' id='" + `${this.id}_list` + "'></ul>";
    return html;
  }

  getPositionModifier() {
    if (this.targetIsInput) {
      return '';
    }

    let modifier = 'cf-error-block--bottom'; // default

    if (!this.positionAbsolute) {
      if (this.positionTop) {
        modifier = 'cf-error-block--top';
      } else {
        modifier = 'cf-error-block--bottom';
      }
    } else {
      if (this.positionTop) {
        modifier = 'cf-error-block--absolute-top';
      } else {
        modifier = 'cf-error-block__absolute-bottom';
      }
    }

    return modifier;
  }

  targetIsInput() {
    return this.target.classList.contains('cf-text-box') || this.target.classList.contains('cf-dropdown');
  }

  addErrorClassToTarget() {
    if (this.target.classList.contains('cf-text-box')) {
      this.target.classList.add('cf-text-box--error');
    }

    if (this.target.classList.contains('cf-dropdown')) {
      this.target.classList.add('cf-dropdown--error');
    }
  }

  removeErrorClassFromTarget() {
    this.target.classList.remove('cf-text-box--error');
    this.target.classList.remove('cf-dropdown--error');
  }

}
;// CONCATENATED MODULE: ./lib/error-block-manager.js

class ErrorBlockManager {
  constructor() {
    this.answerErrorBlocks = [];
  }

  showErrors(blockId, targetNode, errors) {
    if (errors.length === 0) {
      return;
    }

    this.showErrorBlock(blockId, targetNode, errors);
  }

  removeAllErrors() {
    this.answerErrorBlocks.forEach(block => block.remove());
    this.answerErrorBlocks = [];
  }

  showErrorBlock(blockId, targetNode, errors) {
    this.createBlock(blockId, targetNode).showErrors(errors);
  }

  createBlock(id, target) {
    const block = new AnswerErrorBlock(id, target);
    this.answerErrorBlocks.push(block);
    return block;
  }

}
;// CONCATENATED MODULE: ./lib/utils.js
class Utils {
  static floor(value, precision) {
    const multiplier = Math.pow(10, precision);
    return Math.floor(value * multiplier) / multiplier;
  }

  static round(value, precision) {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
  }

  static getElementOffset(element) {
    var rect = element.getBoundingClientRect();
    var offset = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
    return offset;
  }

  static outerWidth(element) {
    var width = element.offsetWidth;
    var style = window.getComputedStyle(element);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  }

  static outerHeight(element) {
    var height = element.offsetHeight;
    var style = window.getComputedStyle(element);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }

}
;// CONCATENATED MODULE: ./lib/keyboard-keys.js
/* harmony default export */ const keyboard_keys = ({
  SpaceBar: 32,
  Enter: 13,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  PageUp: 33,
  PageDown: 34,
  Home: 36,
  End: 35,
  Tab: 9
});
;// CONCATENATED MODULE: ./lib/slider-base.js



class SliderBase {
  /**
   * @param sliderNodeId {string} - slider node id
   * @param values {Object[]} - array of values
   * @param value {Object} - current slider value
   * @param textValueHandler {function} - (sliderValue) => { return "text representation of slider value" }
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

    if (this.valueIndex === -1) {
      this.syncHandlePositionToIndexValue();
      this.updateNoValueCSSAttribute();
    }
  } // TODO: make an optimization for a large number of values, when interval less than one pixel.


  calculateTrackIntervals() {
    const intervalSize = 100 / this.values.length;

    for (let i = 0; i < this.values.length; i++) {
      let startInterval = Utils.round(i * intervalSize, 2);
      let endInterval = Utils.round((i + 1) * intervalSize, 2);
      this.trackIntervals.push([startInterval, endInterval]);
    }
  }

  calculateTrackPageUpPageDownStep() {
    if (this.values.length < 10) {
      this.trackPageUpPageDownStep = 1;
    }

    this.trackPageUpPageDownStep = Math.round(this.values.length / 5);
  }

  attachToDOM() {
    // click
    this.onTrackClick = this.onTrackClick.bind(this);
    this.onNoValueNodeClick = this.onNoValueNodeClick.bind(this);
    this.trackNode.addEventListener('click', this.onTrackClick);
    this.noValueNode.addEventListener('click', this.onNoValueNodeClick); // mouse

    this.onHandleMouseDown = this.onHandleMouseDown.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
    this.handleNode.addEventListener('mousedown', this.onHandleMouseDown);
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('mouseup', this.onDocumentMouseUp); // touch

    this.onHandleTouchStart = this.onHandleTouchStart.bind(this);
    this.onDocumentTouchMove = this.onDocumentTouchMove.bind(this);
    this.onDocumentTouchEnd = this.onDocumentTouchEnd.bind(this);
    this.handleNode.addEventListener('touchstart', this.onHandleTouchStart);
    document.addEventListener('touchmove', this.onDocumentTouchMove);
    document.addEventListener('touchend', this.onDocumentTouchEnd); //keyboard

    this.onHandleKeyPress = this.onHandleKeyPress.bind(this);
    this.handleNode.addEventListener('keydown', this.onHandleKeyPress);
  }

  getValueIndexByTrackValue(trackValue) {
    const search = (minIndex, maxIndex) => {
      if (minIndex > maxIndex) {
        return -1;
      }

      const midIndex = Math.floor((minIndex + maxIndex) / 2);
      const interval = this.trackIntervals[midIndex];

      if (trackValue < interval[0]) {
        return search(minIndex, midIndex - 1);
      }

      if (trackValue > interval[1]) {
        return search(midIndex + 1, maxIndex);
      }

      return midIndex;
    };

    return search(0, this.trackIntervals.length - 1);
  }

  setValueIndex(value, isSilent = false) {
    if (this.valueIndex === value || this.readOnly) {
      return;
    }

    this.valueIndex = value;
    this.syncHandlePositionToIndexValue();
    this.updateNoValueCSSAttribute();
    this.updateAccessibilityState();

    if (!isSilent) {
      this.changeEvent.trigger();
    }
  } // track value in percent


  getTrackValue(absoluteValue) {
    if (absoluteValue < 0) {
      absoluteValue = 0;
    }

    if (absoluteValue > this.getTrackNodeSize()) {
      absoluteValue = this.getTrackNodeSize();
    }

    return Math.floor(absoluteValue / this.getTrackNodeSize() * 100);
  }

  getTrackValueByInterval(interval) {
    return Utils.floor((interval[0] + interval[1]) / 2, 2);
  } // eslint-disable-next-line no-unused-vars


  setHandleNodePosition(position) {
    throw "Not implemented exception";
  }

  getTrackNodeSize() {
    throw "Not implemented exception";
  }

  getHandleNodeSize() {
    throw "Not implemented exception";
  }

  getHandleNodeMargin() {
    throw "Not implemented exception";
  }

  getNoValueNodeOffset() {
    throw "Not implemented exception";
  }

  getTrackNodeOffset() {
    throw "Not implemented exception";
  }

  getNoValueHandleNodePosition() {
    throw "Not implemented exception";
  } // eslint-disable-next-line no-unused-vars


  getMouseEventPointerPosition(event) {
    throw "Not implemented exception";
  } // eslint-disable-next-line no-unused-vars


  getTouchEventPointerPosition(event) {
    throw "Not implemented exception";
  } // eslint-disable-next-line no-unused-vars


  getPointerPositionOnTheTrack(pointerPosition) {
    throw "Not implemented exception";
  }

  getSliderNodeId(sliderNodeId) {
    try {
      return document.querySelector(`#${sliderNodeId}`);
    } catch (e) {
      throw "Could not find the sliderNodeId";
    }
  }

  getHandleNode() {
    try {
      return this.sliderNode.querySelector('.cf-slider__handle');
    } catch (e) {
      throw "Could not find the '.cf-slider__handle'";
    }
  }

  getNoValueNode() {
    try {
      return this.sliderNode.querySelector('.cf-slider__no-value');
    } catch (e) {
      throw "Could not find the '.cf-slider__no-value'";
    }
  }

  getTrackNode() {
    try {
      return this.sliderNode.querySelector('.cf-slider__track-area');
    } catch (e) {
      throw "Could not find the '.cf-slider__track-area'";
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
    if (this.valueIndex > -1) {
      this.setValueIndex(this.valueIndex - 1);
    }
  }

  moveHandleForward() {
    if (this.valueIndex < this.values.length - 1) {
      this.setValueIndex(this.valueIndex + 1);
    }
  }

  syncHandlePositionToIndexValue() {
    if (this.valueIndex === -1) {
      this.moveHandleToNoValuePosition();
      return;
    }

    const interval = this.trackIntervals[this.valueIndex];
    const trackValue = this.getTrackValueByInterval(interval);
    this.moveHandleNode(trackValue);
  }

  updateNoValueCSSAttribute() {
    this.toggleHandleNodeNoValueCSSModifier(this.valueIndex === -1);
  }

  updateAccessibilityState() {
    let textValue = null;

    if (this.textValueHandler !== null) {
      textValue = this.textValueHandler(this.value);
    } else if (this.valueIndex > -1) {
      textValue = this.value;
    }

    this.handleNode.setAttribute('aria-valuetext', textValue);
    this.handleNode.setAttribute('aria-valuenow', this.valueIndex);
  }

  toggleHandleNodeNoValueCSSModifier(add) {
    if (add) {
      this.handleNode.classList.add(this.handleNodeNoValueModifierClass);
    } else {
      this.handleNode.classList.remove(this.handleNodeNoValueModifierClass);
    }
  }

  handleCommonKeys(keyCode) {
    let newIndex = this.valueIndex;

    switch (keyCode) {
      case keyboard_keys.Home:
        newIndex = 0;
        break;

      case keyboard_keys.End:
        newIndex = this.values.length - 1;
        break;

      case keyboard_keys.PageUp:
        if (this.valueIndex === -1) {
          newIndex = 0;
        } else {
          newIndex = this.valueIndex + this.trackPageUpPageDownStep;

          if (newIndex > this.values.length - 1) {
            newIndex = this.values.length - 1;
          }
        }

        break;

      case keyboard_keys.PageDown:
        newIndex = this.valueIndex - this.trackPageUpPageDownStep;

        if (newIndex < 0) {
          newIndex = 0;
        }

        break;
    }

    this.setValueIndex(newIndex);
  } // eslint-disable-next-line no-unused-vars


  handleArrowsKeys(keyCode) {
    throw "Not implemented exception";
  }

  onTrackClick(event) {
    const pointerPositionOnTheTrack = this.getPointerPositionOnTheTrack(this.getMouseEventPointerPosition(event));

    if (pointerPositionOnTheTrack < 0) {
      return;
    }

    const trackValue = this.getTrackValue(pointerPositionOnTheTrack);
    const index = this.getValueIndexByTrackValue(trackValue);
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
    if (!this.isSliding) {
      return;
    }

    event.preventDefault();
    const pointerPositionOnTheTrack = this.getPointerPositionOnTheTrack(this.getMouseEventPointerPosition(event));
    this.onHandleMove(pointerPositionOnTheTrack);
  }

  onDocumentMouseUp(event) {
    if (!this.isSliding) {
      return;
    }

    event.preventDefault();
    const pointerPositionOnTheTrack = this.getPointerPositionOnTheTrack(this.getMouseEventPointerPosition(event));
    this.onHandleMoveEnd(pointerPositionOnTheTrack);
  }

  onHandleTouchStart(event) {
    if (this.isSliding) {
      return true;
    }

    if (event.cancelable) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.onHandleMoveStart();
  }

  onDocumentTouchMove(event) {
    if (!this.isSliding) {
      return;
    }

    const pointerPositionOnTheTrack = this.getPointerPositionOnTheTrack(this.getTouchEventPointerPosition(event));
    this.onHandleMove(pointerPositionOnTheTrack);
  }

  onDocumentTouchEnd(event) {
    if (!this.isSliding) {
      return;
    }

    event.preventDefault();
    const pointerPositionOnTheTrack = this.getPointerPositionOnTheTrack(this.getTouchEventPointerPosition(event));
    this.onHandleMoveEnd(pointerPositionOnTheTrack);
  }

  onHandleMoveStart() {
    this.isSliding = true;
    this.sliderNode.classList.add(this.sliderNodeSlidingModifierClass);
  }

  onHandleMove(pointerPositionOnTheTrack) {
    this.toggleHandleNodeNoValueCSSModifier(pointerPositionOnTheTrack < 0);

    if (pointerPositionOnTheTrack < 0) {
      // Out of track
      if (pointerPositionOnTheTrack < this.getNoValueHandleNodePosition()) {
        // beyond no value position
        this.moveHandleToNoValuePosition();
        return;
      }

      this.moveHandleNodeByAbsoluteValue(pointerPositionOnTheTrack);
      return;
    }

    const trackValue = this.getTrackValue(pointerPositionOnTheTrack);
    this.moveHandleNode(trackValue);
  }

  onHandleMoveEnd(pointerPositionOnTheTrack) {
    this.isSliding = false;
    this.sliderNode.classList.remove(this.sliderNodeSlidingModifierClass);
    let newValueIndex = null;

    if (pointerPositionOnTheTrack < -(this.getHandleNodeSize() / 2)) {
      newValueIndex = -1;
    } else {
      const trackValue = this.getTrackValue(pointerPositionOnTheTrack);
      newValueIndex = this.getValueIndexByTrackValue(trackValue);
    }

    if (newValueIndex === this.valueIndex) {
      this.syncHandlePositionToIndexValue();
      this.updateNoValueCSSAttribute();
    } else {
      this.setValueIndex(newValueIndex);
    }
  }

  onHandleKeyPress(event) {
    const allowedKeys = [keyboard_keys.ArrowUp, keyboard_keys.ArrowLeft, keyboard_keys.ArrowRight, keyboard_keys.ArrowDown, keyboard_keys.PageUp, keyboard_keys.PageDown, keyboard_keys.Home, keyboard_keys.End];

    if (allowedKeys.includes(event.keyCode) === false) {
      return;
    }

    event.preventDefault();
    this.handleCommonKeys(event.keyCode);
    this.handleArrowsKeys(event.keyCode);
  }

}
;// CONCATENATED MODULE: ./lib/horizontal-slider.js



class HorizontalSlider extends SliderBase {
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
    return this.getNoValueNodeOffset() - this.getHandleNodeMargin() - this.getTrackNodeOffset();
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
      case keyboard_keys.ArrowDown:
      case keyboard_keys.ArrowLeft:
        this.moveHandleBack();
        break;

      case keyboard_keys.ArrowUp:
      case keyboard_keys.ArrowRight:
        this.moveHandleForward();
        break;
    }
  }

}
;// CONCATENATED MODULE: ./lib/vertical-slider.js



class VerticalSlider extends SliderBase {
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
    return this.getNoValueNodeOffset() - this.getHandleNodeMargin() - this.getTrackNodeOffset();
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
      case keyboard_keys.ArrowUp:
      case keyboard_keys.ArrowLeft:
        this.moveHandleBack();
        break;

      case keyboard_keys.ArrowDown:
      case keyboard_keys.ArrowRight:
        this.moveHandleForward();
        break;
    }
  }

}
;// CONCATENATED MODULE: ./lib/horizontal-rtl-slider.js



class HorizontalRtlSlider extends SliderBase {
  setHandleNodePosition(position) {
    this.handleNode.style.right = position;
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
    return Utils.getElementOffset(this.noValueNode).left + this.noValueNode.offsetWidth;
  }

  getTrackNodeOffset() {
    return Utils.getElementOffset(this.trackNode).left + this.trackNode.offsetWidth;
  }

  getNoValueHandleNodePosition() {
    return this.getTrackNodeOffset() - (this.getNoValueNodeOffset() + this.getHandleNodeMargin());
  }

  getMouseEventPointerPosition(event) {
    return event.pageX;
  }

  getTouchEventPointerPosition(event) {
    return event.changedTouches[0].pageX;
  }

  getPointerPositionOnTheTrack(pointerPosition) {
    return this.getTrackNodeOffset() - pointerPosition;
  }

  handleArrowsKeys(keyCode) {
    switch (keyCode) {
      case keyboard_keys.ArrowDown:
      case keyboard_keys.ArrowRight:
        this.moveHandleBack();
        break;

      case keyboard_keys.ArrowUp:
      case keyboard_keys.ArrowLeft:
        this.moveHandleForward();
        break;
    }
  }

}
;// CONCATENATED MODULE: ./lib/validation-types.js
/* harmony default export */ const validation_types = (Object.freeze({
  Required: 'Required',
  OtherRequired: 'OtherRequired',
  MaxLength: 'MaxLength',
  Numeric: 'Numeric',
  Precision: 'Precision',
  Scale: 'Scale',
  Range: 'Range',
  MultiCount: 'MultiCount',
  MultiSum: 'MultiSum',
  Date: 'Date',
  Ranking: 'Ranking',
  RequiredIfOtherSpecified: 'RequiredIfOtherSpecified',
  Geolocation: 'Geolocation',
  HierarchyForceLowestLevel: 'HierarchyForceLowestLevel',
  Email: 'Email'
}));
;// CONCATENATED MODULE: ./lib/slider-open-question-view.js








class SliderOpenQuestionView extends QuestionWithAnswersView {
  /**
   * @param {OpenQuestion} question
   * @param {QuestionViewSettings} settings
   */
  constructor(question, settings, sliderSettings, isCustomScaleOn = true, ifSetQuestionVal) {
    super(question, settings);
    this.sliderSettings = sliderSettings;
    this.ifSetQuestionVal = ifSetQuestionVal;
    this.container = this.getContainer();
    this.sliderValues = this.getValues(this.sliderSettings.scaleMin, this.sliderSettings.scaleMax);
    this.sliderStartValue = this.sliderSettings.scaleStart;
    this.render();
    this.slider = this.createSlider();
    this.slider.changeEvent.on(this.onSliderChange.bind(this));
    this.questionErrorBlock = new QuestionErrorBlock(this.getQuestionErrors());
    this.answerErrorBlockManager = new ErrorBlockManager();
    this.sliderValues.forEach(answer => {
      this.getAnswerTextNode(answer.code).addEventListener('click', () => {
        this.setSliderValue(answer.code);
      });
    });
    this.setSliderValue(this.sliderStartValue.toString());
  }

  render() {
    var container = this.container;
    var textDiv = document.createElement('div');
    textDiv.setAttribute('id', this.question.id + '_text');
    textDiv.setAttribute('class', 'cf-question__text');
    var instructionDiv = document.createElement('div');
    instructionDiv.setAttribute('id', this.question.id + '_instruction');
    instructionDiv.setAttribute('class', 'cf-question__instruction');
    var errorDiv = document.createElement('div');
    errorDiv.setAttribute('id', this.question.id + '_error');
    errorDiv.setAttribute('class', 'cf-question__error cf-error-block cf-error-block--bottom cf-error-block--hidden');
    errorDiv.innerHTML = '<ul class="cf-error-list" id="' + this.question.id + '_error_list"></ul>';
    var labels = '<ol class="cf-single-slider-question__labels">';
    this.sliderValues = this.question.isRtl ? this.sliderValues.slice().reverse() : this.sliderValues;
    this.sliderValues.forEach(value => {
      labels += '<li class="cf-single-slider-question__label" id="' + this.question.id + "_" + value.code + "_text" + '">' + value.text + '</li>';
    });
    labels += '</ol>';
    var sliderContainer = document.createElement('div');
    sliderContainer.setAttribute('id', this.question.id + '_content');
    sliderContainer.setAttribute('class', 'cf-question__content');
    var questDirection = this.sliderSettings.isVertical ? 'cf-single-slider-question--vertical' : this.question.isRtl ? 'cf-single-slider-question--horizontal-rtl' : 'cf-single-slider-question--horizontal';
    var sliderDirection = this.sliderSettings.isVertical ? 'cf-slider--vertical' : 'cf-slider--horizontal';
    sliderDirection = this.question.isRtl ? sliderDirection + '-rtl' : sliderDirection;
    sliderContainer.innerHTML = '<div class="cf-single-slider-question ' + questDirection + '">' + labels + '<div class="cf-single-slider-question__slider cf-slider ' + sliderDirection + '" id="' + this.question.id + '_input">' + '<div class="cf-slider__track-area">' + '<div class="cf-slider__track">' + '<div class="cf-slider__no-value"></div>' + '<div class="cf-slider__handle cf-slider__handle--no-value" role="slider" aria-readonly="false" tabindex="0" aria-valuenow="-1" aria-valuetext="NO RESPONSE"></div>' + '</div></div></div></div></div>';
    container.append(textDiv);
    container.append(instructionDiv);
    container.append(errorDiv);
    container.append(sliderContainer);
  }

  createSlider() {
    const sliderNode = this.getQuestionInputNodeId();
    const sliderValues = this.sliderValues.map(answer => answer.code);
    const sliderValue = this.ifSetQuestionVal ? this.question.value : this.sliderStartValue;
    const readOnly = this.question.readOnly;

    const sliderTextValueHandler = sliderValue => {
      return sliderValue === null ? this.settings.messages.noResponse : sliderValue;
    };

    if (this.sliderSettings.isVertical) {
      return new VerticalSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, readOnly);
    }

    if (this.question.isRtl) {
      return new HorizontalRtlSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, readOnly);
    }

    return new HorizontalSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, readOnly);
  }

  onModelValueChange() {
    this.slider.value = this.question.value;
  }

  onSliderChange() {
    if (this.ifSetQuestionVal) {
      this.question.setValue(this.slider.value);
    }

    var questLabels = this.container.querySelectorAll('.cf-single-slider-question__label');

    if (questLabels != null && questLabels.length != 0) {
      questLabels.forEach(questLabel => {
        questLabel.classList.remove('cf-single-slider-question__label--selected');
      });
    }

    var answerTextNode = this.getAnswerTextNode(this.slider.value);

    if (answerTextNode != null) {
      answerTextNode.classList.add('cf-single-slider-question__label--selected');
    }
  }

  getContainer() {
    try {
      return document.querySelector(`#${this.question.id}`);
    } catch (e) {
      throw "Could not find the slider container";
    }
  }

  getQuestionErrors() {
    try {
      return this.container.querySelector('.cf-question__error');
    } catch (e) {
      throw "Could not find the '.cf-question__error'";
    }
  }

  getValues(start, end) {
    var values = Array(end - start + 1).fill().map((_, idx) => start + idx);
    var valArr = [];
    var cur = 0;

    for (const key of values) {
      valArr[cur] = {
        code: key.toString(),
        text: key.toString()
      };
      cur++;
    }

    return valArr;
  }

  setSliderValue(value) {
    if (this.ifSetQuestionVal) {
      this.question.setValue(value);
    } else {
      this.slider.value = value;
    }
  }

  getSliderValue() {
    return this.slider.value;
  }

}
;// CONCATENATED MODULE: ./entry.js


if (window && !window.customQuestionsLibrary) {
  window.customQuestionsLibrary = {};
}

window.customQuestionsLibrary.SliderOpenQuestionView = SliderOpenQuestionView;
/******/ })()
;