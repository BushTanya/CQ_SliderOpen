import QuestionErrorBlock from './question-error-block';
import QuestionViewBase from './question-view-base';

export default class QuestionView extends QuestionViewBase {
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