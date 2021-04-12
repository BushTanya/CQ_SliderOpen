export default class Event {
	/**
	 * Create instance.
	 * @param {string} name - Event name.
	 */
	constructor(name) {
		this._name = name;
		this.subscribers = [];
	}

	/**
	 * Event name.
	 * @type {string}
	 * @readonly
	 */
	get name() {
		return this._name;
	}

	/**
	 * Subscribe to event.
	 * @param {function} subscriber - Event handler function.
	 */
	on(subscriber) {
		if(this.subscribers.find(item => item === subscriber) !== undefined) {
			return;
		}

		this.subscribers.push(subscriber)
	}

	/**
	 * Unsubscribe from event.
	 * @param {function} subscriber - Event handler function.
	 */
	off(subscriber) {
		this.subscribers = this.subscribers.filter(item => item !== subscriber);
	}

	/**
	 * Trigger the event.
	 * @param {object} data
	 */
	trigger(data = null) {
		this.subscribers.forEach(item => item(data));
	}
}