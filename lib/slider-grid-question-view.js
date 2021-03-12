import QuestionWithAnswersView from './question-with-answers-view.js';
import QuestionErrorBlock from './question-error-block.js';
import ErrorBlockManager from './error-block-manager.js';
import HorizontalSlider from './horizontal-slider.js';
import HorizontalRtlSlider from './horizontal-rtl-slider.js';
import FloatingLabels from "./floating-labels";
import ValidationTypes from "./validation-types";

export default class SliderGridQuestionView extends QuestionWithAnswersView {
    /**
     * @param {GridQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);		
		this.container = this.getContainer();
		this.render();
			
		this.sliders = new Map();		
        this.init();
		
        this.questionErrorBlock = new QuestionErrorBlock(this.getQuestionErrors());
        this.answerErrorBlockManager = new ErrorBlockManager();
    }

    render() {
        var container = this.container;
		
		var textDiv = document.createElement('div');
		textDiv.setAttribute("id", this.question.id + "_text");
		textDiv.setAttribute("class", "cf-question__text");
		
		var instructionDiv = document.createElement('div');
		instructionDiv.setAttribute("id", this.question.id + "_instruction");
		instructionDiv.setAttribute("class", "cf-question__instruction");
		
		var errorDiv = document.createElement('div');
		errorDiv.setAttribute("id", this.question.id + "_error");
		errorDiv.setAttribute("class", "cf-question__error cf-error-block cf-error-block--bottom cf-error-block--hidden");
		errorDiv.innerHTML = "<ul class='cf-error-list' id='" + this.question.id + "_error_list'></ul>";
		
		var labels = "";
        this.question.scales.forEach(scale => {
            labels += "<div class='cf-slider-grid-answer__label'>" + scale.text + "</div>";
        });
		
		var rowsDiv = "";
        this.question.answers.forEach(answer => {
            rowsDiv += "<div class='cf-grid-layout__row cf-slider-grid-answer' id='" + this.question.id + "_" + answer.code + "'>" +
						"<div class='cf-grid-layout__row-text'>" + 
						(answer.isOther ? "<input class='cf-text-box cf-grid-layout__row-text-other  cf-slider-grid-answer__other' type='text' id='" + this.question.id + "_" + answer.code + "_other' value='' placeholder='" + answer.text + "' aria-label='" + answer.text + "'>" 
						: "<div class='cf-slider-grid-answer__text' id='" + this.question.id + "_" + answer.code + "_text'>" + answer.text + "</div>") +
						"</div>" +
						"<div class='cf-grid-layout__row-control cf-slider-grid-answer__control'>" +
							"<div class='cf-slider-grid-answer__labels-area'>" +
								"<div class='cf-label-panel cf-slider-grid-answer__labels' aria-hidden='true'>" + labels +
								"</div>" +
							"</div>" +

							"<div class='cf-slider cf-slider--horizontal' id='" + this.question.id + "_" + answer.code + "_input'>" +
								"<div class='cf-slider__track-area'>" +
									"<div class='cf-slider__track'>" +
										"<div class='cf-slider__no-value'></div>" +
										"<div class='cf-slider__handle' role='slider' aria-readonly='false' aria-labelledby='" + this.question.id + "_" + answer.code + "_text' tabindex='0'></div>" +
									"</div>" +
								"</div>" +
							"</div>" +
						"</div>" +
					  "</div>";
        });

		var contentDiv = document.createElement('div');
		contentDiv.setAttribute("id", this.question.id + "_content");
		contentDiv.setAttribute("class", "cf-question__content");
		contentDiv.innerHTML = "<div class='cf-grid-layout'>" + 
									"<div class='cf-grid-layout__row cf-slider-grid-answer  cf-slider-grid-answer--fake-for-panel'>" +
										"<div class='cf-slider-grid-answer__text cf-grid-layout__row-text'></div>" +
											"<div class='cf-slider-grid-answer__control cf-grid-layout__row-control'>" +
											"<div class='cf-slider-grid-answer__labels-area'>" +
												"<div class='cf-label-panel cf-slider-grid-answer__labels'>" + labels + "</div>" +
												"<div class='cf-label-panel cf-slider-grid-answer__labels cf-label-panel--floating' style='visibility: hidden;'>" + labels + "</div>" +
											"</div>" +
										"</div>" +
									"</div>" + rowsDiv +
							   "</div>";
		
		container.append(textDiv);
		container.append(instructionDiv);
		container.append(errorDiv);
		container.append(contentDiv);
    }
	
    init() {
        const sliderValues = this.question.scales.map(scale => scale.code);
        const sliderTextValueHandler = (sliderValue) => {
            return sliderValue === null ? this.settings.messages.noResponse : this.question.getScale(sliderValue).text;
        };

        this.question.answers.forEach(answer => {
            const sliderNode = this.getAnswerInputNodeId(answer.code); 
            const sliderValue = this.question.values[answer.code] || null;
            const slider = this.createSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler);
            slider.changeEvent.on(() => {
                this.question.setValue(answer.code, slider.value);
            });
            this.sliders.set(answer.code, slider);

            if (answer.isOther) {
                var otherNode = this.getAnswerOtherNode(answer.code);
				otherNode.addEventListener('keydown', e => e.stopPropagation());
				otherNode.addEventListener('input', event => this.onAnswerOtherValueChangedHandler(answer, event.target.value));
            }
			
        });
		
        this.initFloatingLabels();
    }

    initFloatingLabels() {
        const panelNode = this.container.querySelector('.cf-slider-grid-answer--fake-for-panel .cf-slider-grid-answer__labels');
        const lastItemNode = this.container.querySelector('.cf-slider-grid-answer:last-child .cf-slider');
		
		if (panelNode != null && lastItemNode != null) {
			new FloatingLabels(panelNode, lastItemNode, this._settings.mobileThreshold);
		}
    }

    createSlider(sliderNode, sliderValues, sliderValue, textValueHandler) {
        const readOnly = this.question.readOnly;

        if (this.question.isRtl) {
            return new HorizontalRtlSlider(sliderNode, sliderValues, sliderValue, textValueHandler, readOnly);
        }

        return new HorizontalSlider(sliderNode, sliderValues, sliderValue, textValueHandler, readOnly);
    }

    updateSliders({values = []}) {
        if (values.length === 0)
            return;

        values.forEach(answerCode => {
            this.sliders.get(answerCode).value = this.question.values[answerCode] || null;
        });
    }

    showAnswerError(validationResult) {
        const answer = this.question.getAnswer(validationResult.answerCode);
        const targetNode = answer.isOther
            ? this.getAnswerOtherNode(answer.code)
            : this.getAnswerTextNode(answer.code);
        const errorBlockId = this.getAnswerErrorBlockId(answer.code);
        const errors = validationResult.errors.map(error => error.message);
        this.answerErrorBlockManager.showErrors(errorBlockId, targetNode, errors);

        const otherErrors = validationResult.errors.filter(error => error.type === ValidationTypes.OtherRequired);
        if (otherErrors.length > 0) {
            var valNode = this.getAnswerOtherNode(validationResult.answerCode);
			valNode.setAttribute('aria-errormessage', errorBlockId);
			valNode.setAttribute('aria-invalid', 'true');
        }
    }

    hideErrors() {
        super.hideErrors();

        var textboxNode = this._container.querySelector('.cf-text-box');
		if (textboxNode != null) {
			textboxNode.removeAttribute('aria-errormessage');
			textboxNode.removeAttribute('aria-invalid');
		}
    }

    onModelValueChange({changes}) {
        this.updateSliders(changes);
        this.updateAnswerOtherNodes(changes);
    }

    onAnswerOtherValueChangedHandler(answer, value) {
        this.question.setOtherValue(answer.code, value);
    }

	getContainer() {
		try {
            return document.querySelector(`#${this._question.id}`);
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
}