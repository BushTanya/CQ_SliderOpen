import ErrorList from './error-list.js';

export default class QuestionErrorBlock {
	constructor(container) {
		this.container = container;
		this.errorList = new ErrorList(this.container.querySelector('.cf-error-list'));
	}

	showErrors(errors) {
		if(errors.length === 0) {
				return;
		}

		this.errorList.clean();
		this.errorList.addErrors(errors);

		this.container.classList.remove('cf-error-block--hidden');
	}

	hideErrors() {
		this.container.classList.add('cf-error-block--hidden');
		this.errorList.clean();
	}
}