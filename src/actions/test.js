import { TEST } from './const';

function action(parameter) {
	return { type: TEST, parameter };
}

module.exports = action;
