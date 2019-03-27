import { UUID } from './const';

function action(parameter) {
	return { type: UUID, parameter };
}

module.exports = action;
