import ErrorList from './error-list';

export default class AnswerErrorBlock {
	/**
	 * @param {string} id
	 * @param {HTMLDivElement} target
	 * @param {Boolean} top
	 * @param {Boolean} absolute
	 */
	constructor(id, target, { top = false, absolute = false } = {}) {
		this.container = null;
		this.errorList = null;

		this.id = id;
		this.target = target;
		this.targetIsInput = this.targetIsInput();
		this.positionTop = top;
		this.positionAbsolute = absolute;

		this.init();
	}

	showErrors(errors) {
		if(errors.length === 0) {
			return;
		}

		this.errorList.clean();
		this.errorList.addErrors(errors);

		this.container.classList.remove('cf-error-block--hidden');
	}

	remove() {
		this.container.remove();
		if(this.targetIsInput) {
			this.removeErrorClassFromTarget();
		}
	}

	init() {
		this.container = this.prepareHtml();
		this.errorList = new ErrorList(this.container.querySelector('.cf-error-list'));
		this.append();

		if(this.targetIsInput) {
			this.addErrorClassToTarget();
		}
	}

	append() {
		if(this.positionAbsolute) {
			this.target.append(this.container);
			return;
		} 
		
		if(this.positionTop) {
			this.target.before(this.container);
			return;
		} 
		
		this.target.after(this.container);
	}

	prepareHtml() {
		let html = document.createElement('div');
		html.setAttribute('id', `${this.id}`);
		html.setAttribute('class', 'cf-error-block cf-error-block--hidden' + `${this.getPositionModifier()}`);
		html.setAttribute('role', 'alert');
		html.setAttribute('aria-labelledby', `${this.id}_list`);
		
		html.innerHTML = '<ul class="cf-error-list" id="' + `${this.id}_list` + '"></ul>';
	
		return html;
	}

	getPositionModifier() {
		if(this.targetIsInput) {
			return '';
		}

		if(!this.positionAbsolute) {
			if(this.positionTop) {
				return 'cf-error-block--top';
			} 
		
			return 'cf-error-block--bottom';
		} 
		
		if(this.positionTop) {
			return 'cf-error-block--absolute-top';
		} 

		return 'cf-error-block__absolute-bottom';
	}

	targetIsInput() {
		return this.target.classList.contains('cf-text-box') || this.target.classList.contains('cf-dropdown');
	}

	addErrorClassToTarget() {
		if(this.target.classList.contains('cf-text-box')) {
			this.target.classList.add('cf-text-box--error');
		}
		
		if(this.target.classList.contains('cf-dropdown')) {
			this.target.classList.add('cf-dropdown--error');
		}
	}

	removeErrorClassFromTarget() {
		this.target.classList.remove('cf-text-box--error');
		this.target.classList.remove('cf-dropdown--error');
	}
}