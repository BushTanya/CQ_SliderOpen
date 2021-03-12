import QuestionWithAnswersView from './question-with-answers-view.js';
import QuestionErrorBlock from './question-error-block.js';
import ErrorBlockManager from './error-block-manager.js';
import HorizontalSlider from './horizontal-slider.js';
import VerticalSlider from './vertical-slider.js';
import HorizontalRtlSlider from './horizontal-rtl-slider.js';
import FloatingLabels from "./floating-labels.js";
import ValidationTypes from "./validation-types.js";

export default class SliderSingleQuestionView extends QuestionWithAnswersView {
	/**
	 * @param {SingleQuestion} question
	 * @param {QuestionViewSettings} settings
	 */
	constructor(question, settings, sliderSettings) {
		super(question, settings);
		this._sliderSettings = sliderSettings;
		this._container = this._getContainer();
		this._render();

		this._slider = this._createSlider();
		this._slider.changeEvent.on(this._onSliderChange.bind(this));
		
		this._questionErrorBlock = new QuestionErrorBlock(this._getQuestionErrors());
        this._answerErrorBlockManager = new ErrorBlockManager();

		this._question.answers.forEach(answer => {
			this._getAnswerTextNode(answer.code).addEventListener('click', () => {
				this._question.setValue(answer.code);
			});
		});
	}
	_render() {
		var container = this._container;
		
		var textDiv = document.createElement('div');
		textDiv.setAttribute("id", this._question.id + "_text");
		textDiv.setAttribute("class", "cf-question__text");
		
		var instructionDiv = document.createElement('div');
		instructionDiv.setAttribute("id", this._question.id + "_instruction");
		instructionDiv.setAttribute("class", "cf-question__instruction");
		
		var errorDiv = document.createElement('div');
		errorDiv.setAttribute("id", this._question.id + "_error");
		errorDiv.setAttribute("class", "cf-question__error cf-error-block cf-error-block--bottom cf-error-block--hidden");
		errorDiv.innerHTML = "<ul class='cf-error-list' id='" + this._question.id + "_error_list'></ul>";
		
		var labels = '<ol class="cf-single-slider-question__labels">';
		this._question.answers = (!this._sliderSettings.isVertical && this._question.isRtl) ? this._question.answers.slice().reverse() : this._question.answers;
		this._question.answers.forEach(answer => {
			labels += '<li class="cf-single-slider-question__label" id="' + this._question.id + "_" + answer.code + "_text" + '">' + answer.text + '</li>';
		});
		labels += '</ol>';
	
		var sliderContainer = document.createElement('div');
		sliderContainer.setAttribute("id", this._question.id + "_content");
		sliderContainer.setAttribute("class", "cf-question__content");
		var questDirection = this._sliderSettings.isVertical ? 'cf-single-slider-question--vertical'
								: (this._question.isRtl ? 'cf-single-slider-question--horizontal-rtl' : 'cf-single-slider-question--horizontal');
		var sliderDirection = this._sliderSettings.isVertical ? 'cf-slider--vertical' : 'cf-slider--horizontal';
		sliderDirection = this._question.isRtl ? sliderDirection + '-rtl' : sliderDirection;
																				
		sliderContainer.innerHTML = '<div class="cf-single-slider-question ' + questDirection + '">' + labels +
						'<div class="cf-single-slider-question__slider cf-slider ' + sliderDirection + '" id="' + this._question.id + '_input">' +
						'<div class="cf-slider__track-area">' +
						'<div class="cf-slider__track">' +
						'<div class="cf-slider__no-value"></div>' +
						'<div class="cf-slider__handle cf-slider__handle--no-value" role="slider" aria-readonly="false" tabindex="0" aria-valuenow="-1" aria-valuetext="NO RESPONSE"></div>'+
						'</div></div></div></div></div>';
						
		container.append(textDiv);
		container.append(instructionDiv);
		container.append(errorDiv);
		container.append(sliderContainer);
	}
	_createSlider() {
		const sliderNode = this._getQuestionInputNodeId();
		const sliderValues = this._question.answers.map(answer => answer.code);
		const sliderValue = this._question.value;
		const readOnly = this._question.readOnly;
		const sliderTextValueHandler = (sliderValue) => {
			return sliderValue === null ? this._settings.messages.noResponse : this._question.getAnswer(sliderValue).text;
		};

		if (this._sliderSettings.isVertical) {
			return new VerticalSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, readOnly);
		}
		if (this._question.isRtl) {
			return new HorizontalRtlSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, readOnly);
		}

		return new HorizontalSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, readOnly);
	}

	_onModelValueChange() {
		this._slider.value = this._question.value;
	}

	_onSliderChange() {
		this._question.setValue(this._slider.value);

		var questLabels = this._container.querySelectorAll('.cf-single-slider-question__label');
		if (questLabels != null && questLabels.length != 0) {		
			questLabels.forEach(questLabel => {
				questLabel.classList.remove('cf-single-slider-question__label--selected');
			});
		}
		
		var answerTextNode = this._getAnswerTextNode(this._slider.value);
		if (answerTextNode != null) {
			answerTextNode.classList.add('cf-single-slider-question__label--selected');
		}
	}
	
	_getContainer() {
		try {
            return document.querySelector(`#${this._question.id}`);
        } catch (e) {
			throw "Could not find the slider container";
        }
	}
	
	_getQuestionErrors() {
		try {
            return this._container.querySelector('.cf-question__error');
        } catch (e) {
			throw "Could not find the '.cf-question__error'";
        }
	}
}