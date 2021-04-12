import QuestionWithAnswersView from './question-with-answers-view';
import QuestionErrorBlock from './question-error-block';
import ErrorBlockManager from './error-block-manager';
import HorizontalSlider from './horizontal-slider';
import VerticalSlider from './vertical-slider';
import HorizontalRtlSlider from './horizontal-rtl-slider';
import FloatingLabels from './floating-labels';
import ValidationTypes from './validation-types';

var defaultSettings = {
	isVertical: true,
	isQuestionValue: true,
	isCustomScale: true,
	customScale: {
		min: -10,
		max: 10,
		start: 0
	}
}
			
class SliderOpenQuestionView extends QuestionWithAnswersView {
	/**
	 * @param {OpenQuestion} question
	 * @param {QuestionViewSettings} settings
	 * @param {Object} sliderSettings
	 */
	constructor(question, settings, sliderSettings) {
		super(question, settings);		
		this.sliderSettings = sliderSettings ? sliderSettings : defaultSettings;

		this.init();
	}
	
	init() {
		this.container = this.getContainer();			
		this.sliderValues = this.getValues(this.sliderSettings.customScale.min, this.sliderSettings.customScale.max);
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

		this.setSliderValue(this.sliderSettings.customScale.start.toString());
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
		var questionDirection = this.sliderSettings.isVertical ? 'cf-single-slider-question--vertical'
								: (this.question.isRtl ? 'cf-single-slider-question--horizontal-rtl' : 'cf-single-slider-question--horizontal');
		var sliderDirection = this.sliderSettings.isVertical ? 'cf-slider--vertical' : 'cf-slider--horizontal';
		sliderDirection = this.question.isRtl ? sliderDirection + '-rtl' : sliderDirection;
																				
		sliderContainer.innerHTML = '<div class="cf-single-slider-question ' + questionDirection + '">' + labels +
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
		const sliderValue = this.sliderSettings.isQuestionValue ? this.question.value : this.sliderStartValue; 
		const readOnly = this.question.readOnly;
		const sliderTextValueHandler = (sliderValue) => {
			return sliderValue === null ? this.settings.messages.noResponse : sliderValue; 
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
		if(this.sliderSettings.isQuestionValue) {
			this.question.setValue(this.slider.value);
		}
		
		var questionLabels = this.container.querySelectorAll('.cf-single-slider-question__label');
		if(questionLabels != null && questionLabels.length != 0) {		
			questionLabels.forEach(questionLabels => {
				questionLabels.classList.remove('cf-single-slider-question__label--selected');
			});
		}
		
		var answerTextNode = this.getAnswerTextNode(this.slider.value);
		if(answerTextNode != null) {
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
	
	/**
	 * @param {number} start
	 * @param {number} end
	 * @return {Array} returns an array of objects
	*/
	getValues(start, end) {
		var values = Array(end - start + 1).fill().map((_, idx) => (start + idx));	
		var valArr = [];
		var cur = 0;
		for(const key of values) {
			valArr[cur] = {	
								code: key.toString(), 
								text: key.toString()
							};
			cur++; 
		}
		return valArr;
	}	
	
	setSliderValue(value) {
		if(this.sliderSettings.isQuestionValue) {
			this.question.setValue(value);
			return;
		} 
		
		this.slider.value = value;
	}
	
	getSliderValue() {
		return this.slider.value;
	}
}

if(window && !window.customQuestionsLibrary) {
	window.customQuestionsLibrary = {};
}
window.customQuestionsLibrary.SliderOpenQuestionView = SliderOpenQuestionView;