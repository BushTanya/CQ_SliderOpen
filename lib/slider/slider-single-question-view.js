import QuestionWithAnswersView from './question-with-answers-view';
import QuestionErrorBlock from './question-error-block';
import ErrorBlockManager from './error-block-manager';
import HorizontalSlider from './horizontal-slider';
import VerticalSlider from './vertical-slider';
import HorizontalRtlSlider from './horizontal-rtl-slider';
import FloatingLabels from './floating-labels';
import ValidationTypes from './validation-types';

export default class SliderSingleQuestionView extends QuestionWithAnswersView {
	/**
	 * @param {SingleQuestion} question
	 * @param {QuestionViewSettings} settings
	 * @param {Object} sliderSettings
	 * @param {Boolean} isCustomScale
	 * @param {Boolean} isQuestionValue
	 */
	constructor(question, settings, sliderSettings, isCustomScale = false, isQuestionValue = false) {
		super(question, settings);
		this.sliderSettings = sliderSettings;
		this.isQuestionValue = isQuestionValue;
		
		this.container = this.getContainer();
		this.render();

		this.slider = this.createSlider();
		this.slider.changeEvent.on(this.onSliderChange.bind(this));
		
		this.questionErrorBlock = new QuestionErrorBlock(this.getQuestionErrors());
		this.answerErrorBlockManager = new ErrorBlockManager();

		this.question.answers.forEach(answer => {
			this.getAnswerTextNode(answer.code).addEventListener('click', () => {
				this.setSliderValue(answer.code);
			});
		});
	}
	
	render() {
		let container = this.container;
		
		let textDiv = document.createElement('div');
		textDiv.setAttribute('id', this.question.id + '_text');
		textDiv.setAttribute('class', 'cf-question__text');
		if(this.question.text) {
			textDiv.innerHTML = this.question.text;
		}
		
		let instructionDiv = document.createElement('div');
		instructionDiv.setAttribute('id', this.question.id + '_instruction');
		instructionDiv.setAttribute('class', 'cf-question__instruction');
		if(this.question.instruction) {
			instructionDiv.innerHTML = this.question.instruction;
		}
		
		let errorDiv = document.createElement('div');
		errorDiv.setAttribute('id', this.question.id + '_error');
		errorDiv.setAttribute('class', 'cf-question__error cf-error-block cf-error-block--bottom cf-error-block--hidden');
		errorDiv.innerHTML = '<ul class="cf-error-list" id="' + this.question.id + '_error_list"></ul>';
		
		let labels = '<ol class="cf-single-slider-question__labels">';
		if(!this.sliderSettings.isVertical && this.question.isRtl) {
			this.question.answers.slice().reverse();
		}
		this.question.answers.forEach(answer => {
			labels += '<li class="cf-single-slider-question__label" id="' + this.question.id + "_" + answer.code + "_text" + '">' + answer.text + '</li>';
		});
		labels += '</ol>';
	
		let sliderContainer = document.createElement('div');
		sliderContainer.setAttribute('id', this.question.id + '_content');
		sliderContainer.setAttribute('class', 'cf-question__content');
		let questDirection = this.sliderSettings.isVertical ? 'cf-single-slider-question--vertical'
								: (this.question.isRtl ? 'cf-single-slider-question--horizontal-rtl' : 'cf-single-slider-question--horizontal');
		let sliderDirection = this.sliderSettings.isVertical ? 'cf-slider--vertical' : 'cf-slider--horizontal';
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
		let sliderNode = this.getQuestionInputNodeId();
		let sliderValues = this.question.answers.map(answer => answer.code);
		let sliderValue = this.question.value;
		let readOnly = this.question.readOnly;
		let sliderTextValueHandler = (sliderValue) => {
			return sliderValue === null ? this.settings.messages.noResponse : this.question.getAnswer(sliderValue).text;
		};

		if(this.sliderSettings.isVertical) {
			return new VerticalSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, readOnly);
		}
		if(this.question.isRtl) {
			return new HorizontalRtlSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, readOnly);
		}

		return new HorizontalSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, readOnly);
	}

	onModelValueChange() {
		this.slider.value = this.question.value;
	}

	onSliderChange() {
		if(this.isQuestionValue) {
			this.question.setValue(this.slider.value);
		}

		let questLabels = this.container.querySelectorAll('.cf-single-slider-question__label');
		if(questLabels != null && questLabels.length != 0) {		
			questLabels.forEach(questLabel => {
				questLabel.classList.remove('cf-single-slider-question__label--selected');
			});
		}
		
		let answerTextNode = this.getAnswerTextNode(this.slider.value);
		if (answerTextNode != null) {
			answerTextNode.classList.add('cf-single-slider-question__label--selected');
		}
	}
	
	getContainer() {
		try {
			return document.querySelector(`#${this.question.id}`);
		} 
		catch (e) {
			throw 'Could not find the slider container';
		}
	}
	
	getQuestionErrors() {
		try {
			return this.container.querySelector('.cf-question__error');
		} 
		catch (e) {
			throw 'Could not find the ".cf-question__error"';
		}
	}
	
	setSliderValue(value) {
		if(this.isQuestionValue) {
			this.question.setValue(value);
			return;
		}
		
		this.slider.value = value;
	}
	
	getSliderValue() {
		return this.slider.value;
	}
}