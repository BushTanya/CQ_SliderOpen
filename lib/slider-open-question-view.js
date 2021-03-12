import QuestionWithAnswersView from './question-with-answers-view.js';
import QuestionErrorBlock from './question-error-block.js';
import ErrorBlockManager from './error-block-manager.js';
import HorizontalSlider from './horizontal-slider.js';
import VerticalSlider from './vertical-slider.js';
import HorizontalRtlSlider from './horizontal-rtl-slider.js';
import FloatingLabels from "./floating-labels.js";
import ValidationTypes from "./validation-types.js";

export default class SliderOpenQuestionView extends QuestionWithAnswersView {
	/**
	 * @param {OpenQuestion} question
	 * @param {QuestionViewSettings} settings
	 */
	constructor(question, settings, sliderSettings, isCustomScaleOn, ifSetQuestionVal) {
		super(question, settings);
		this.sliderSettings = sliderSettings;
		this.ifSetQuestionVal = ifSetQuestionVal;
		this.isCustomScaleOn = isCustomScaleOn;
		this.container = this.getContainer();		
		
		this.sliderValues = this.isCustomScaleOn ? this.getValues(this.sliderSettings.scaleMin, this.sliderSettings.scaleMax)
							 : this.question.answers;
		
		this.render();
		this.slider = this.createSlider();
		this.slider.changeEvent.on(this.onSliderChange.bind(this));
		
		this.questionErrorBlock = new QuestionErrorBlock(this.getQuestionErrors());
        this.answerErrorBlockManager = new ErrorBlockManager();

		this.sliderValues.forEach(answer => {
			this.getAnswerTextNode(answer.code).addEventListener('click', () => {
				if (ifSetQuestionVal) {
					this.question.setValue(answer.code);
				}
				else {
					this.sliderValue = answer.code;
					this.onModelValueChange();
				}
			});
		});
		
		if (this.ifSetQuestionVal && this.isCustomScaleOn) {
			this.question.setValue(this.sliderSettings.scaleStart);
		}

		if (!this.ifSetQuestionVal && this.isCustomScaleOn) {
			this.sliderValue = this.sliderSettings.scaleStart.toString();
			this.onModelValueChange();
		}
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
		var questDirection = this.sliderSettings.isVertical ? 'cf-single-slider-question--vertical'
								: (this.question.isRtl ? 'cf-single-slider-question--horizontal-rtl' : 'cf-single-slider-question--horizontal');
		var sliderDirection = this.sliderSettings.isVertical ? 'cf-slider--vertical' : 'cf-slider--horizontal';
		sliderDirection = this.question.isRtl ? sliderDirection + '-rtl' : sliderDirection;
																				
		sliderContainer.innerHTML = '<div class="cf-single-slider-question ' + questDirection + '">' + labels +
						'<div class="cf-single-slider-question__slider cf-slider ' + sliderDirection + '" id="' + this.question.id + '_input">' +
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
	createSlider() {
		const sliderNode = this.getQuestionInputNodeId();
		const sliderValues = this.sliderValues.map(answer => answer.code);
		const sliderValue = this.ifSetQuestionVal ? this.question.value : this.sliderValue; 
		const readOnly = this.question.readOnly;
		const sliderTextValueHandler = (sliderValue) => {
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
		this.slider.value = this.ifSetQuestionVal ? this.question.value : this.sliderValue;
	}

	onSliderChange() {
		if (this.ifSetQuestionVal) {
			this.question.setValue(this.slider.value);
		}
		else {
			this.sliderValue = this.slider.value;
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
		var values = Array(end - start + 1).fill().map((_, idx) => (start + idx));	
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
	getSliderValue() {
		return this.slider.value;
	}
}