import Utils from './utils';

export default class FloatingLabels {
	/**
	 * @param {HTMLDivElement} panel
	 * @param {HTMLDivElement} lastItem
	 * @param {Number} mobileThreshold
	 */
	constructor(panel, lastItem, mobileThreshold){
		this.mobileThreshold = mobileThreshold;
		this.panel = panel;
		this.lastItem = lastItem;
		this.clone = null;

		this.init();
	}

	init(){
		if(this.panel.length === 0) {
			return;
		}

		this.onScroll = this.onScroll.bind(this);
		this.onResize = this.onResize.bind(this);

		this.clone = this.panel.cloneNode(true);
	
		this.clone.classList.add('cf-label-panel--floating');	
		this.clone.style.visibility = 'hidden';
	
		this.panel.parentNode.insertBefore(this.clone, this.panel.nextSibling);

		window.addEventListener('resize', this.onResize);
		if(window.ResizeObserver !== undefined) {
			new window.ResizeObserver(() => {
				this.adjustWidthAndPosition();
			}).observe(this.panel); 
		}

		this.adjustWidthAndPosition();
		this.onOffPanel();
	}

	adjustWidthAndPosition() {
		this.clone.style.width = this.panel.offsetWidth + 'px';
		this.clone.style.left = Utils.getElementOffset(this.panel).left;
	}

	onOffPanel() {
		if(window.innerWidth <= this.mobileThreshold) {
			this.onFloat();
			return;
		}
		
		this.hide();
	}

	onFloat() {
		this.panelOffset = Utils.getElementOffset(this.panel).top;
		this.maxOffset = Utils.getElementOffset(this.lastItem).top - Utils.outerHeight(this.clone);

		window.addEventListener('scroll', this.onScroll);
		this.onScroll();
	}

	hide() {
		this.clone.style.visibility = 'hidden';
		window.removeEventListener('scroll', this.onScroll);
	}

	handleScroll() {
		let scrollValue = this.getScrollTop();

		if(scrollValue < this.panelOffset) { // above the topmost panel
			this.clone.style.visibility = 'hidden';
		} else if( scrollValue > this.maxOffset + Utils.outerHeight(this.clone)) { // below last item
				this.clone.style.visibility = 'hidden';
		} else {
				let fixedTop = scrollValue > this.maxOffset
					? this.maxOffset - scrollValue
					: 0;

				this.clone.style.top = fixedTop + 'px';
				this.clone.style.visibility = 'visible';
		}
	}

	onResize() {
		this.adjustWidthAndPosition();
		this.onOffPanel();
	}

	onScroll() {
		this.handleScroll();
	}
	
	getScrollTop() {
		let supportPageOffset = window.pageXOffset !== undefined;
		let isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

		return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
	}
}