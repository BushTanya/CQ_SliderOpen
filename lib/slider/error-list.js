export default class ErrorList {
	/**
	 * @param {HTMLUListElement} listNode
	 */
  constructor(listNode) {
		this.list = listNode;
  }

  addErrors(errors = []) {
		if(errors.length === 0) {
			return;
		}

		errors.forEach(error => this.appendError(error));
  }

  addError(error) {
		this.appendError(error);
  }

  clean() {
		while(this.list.firstChild) {
			this.list.removeChild(this.list.firstChild);
		}
  }

  appendError(error) {
		let erLi = document.createElement('li');
	  erLi.setAttribute('class', 'cf-error-list__item');
	  erLi.innerHTML = `${error}`;
		
		this.list.append(erLi);
  }
}