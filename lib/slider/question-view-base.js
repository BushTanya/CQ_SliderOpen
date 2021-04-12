import Event from './event';

export default class QuestionViewBase {
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
		this._pendingChangeEvent.trigger({id: this._question.id, pending: this._pending});
	}

	detachModelHandlers() {
		this.question.changeEvent.off(this.boundOnModelValueChange);
		this.question.validationCompleteEvent.off(this.boundOnValidationComplete);
	}

	attachModelHandlers() {
		this.question.changeEvent.on(this.boundOnModelValueChange);
		this.question.validationCompleteEvent.on(this.boundOnValidationComplete);
	}

	onValidationComplete() {
	}

	onModelValueChange() {
	}
}