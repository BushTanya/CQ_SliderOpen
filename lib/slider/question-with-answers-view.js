import QuestionView from './question-view';
import ErrorBlockManager from './error-block-manager';

export default class QuestionWithAnswersView extends QuestionView {
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
		return `${this.question.id}_${answerCode}_error`
	}

	getAnswerOtherErrorBlockId(answerCode) {
		return `${this.question.id}_${answerCode}_other_error`
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
		let answer = this.question.getAnswer(validationResult.answerCode);
		let target = answer.isOther
				? this.getAnswerOtherNode(validationResult.answerCode)
				: this.getAnswerTextNode(validationResult.answerCode);
		let errorBlockId = this.getAnswerErrorBlockId(validationResult.answerCode);
		let errors = validationResult.errors.map(error => error.message);
		this.answerErrorBlockManager.showErrors(errorBlockId, target, errors);
	}

	hideErrors() {
		super.hideErrors();
		this.answerErrorBlockManager.removeAllErrors();
	}

	updateAnswerOtherNodes({otherValues = []}) {
		otherValues.forEach(answerCode => {
			let otherValue = this.question.otherValues[answerCode];
			this.setOtherNodeValue(answerCode, otherValue);
		});
	}

	setOtherNodeValue(answerCode, otherValue) {
		otherValue = otherValue || '';

		let otherInput = this.getAnswerOtherNode(answerCode);
		if(otherInput != null && otherInput.value !== otherValue) { 
			otherInput.value = otherValue;
		}
	}
}