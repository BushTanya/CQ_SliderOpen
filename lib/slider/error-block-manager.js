import AnswerErrorBlock from './answer-error-block';

export default class ErrorBlockManager {
	constructor() {
		this.answerErrorBlocks = [];
	}

	showErrors(blockId, targetNode, errors) {
		if(errors.length === 0) {
			return;
		}

		this.showErrorBlock(blockId, targetNode, errors);
	}

	removeAllErrors() {
		this.answerErrorBlocks.forEach(block => block.remove());
		this.answerErrorBlocks = [];
	}

	showErrorBlock(blockId, targetNode, errors)  {
		this.createBlock(blockId, targetNode).showErrors(errors);
	}

	createBlock(id, target) {
		const block = new AnswerErrorBlock(id, target);
		this.answerErrorBlocks.push(block);
		return block;
	}
}