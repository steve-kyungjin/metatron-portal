import * as _ from 'lodash';
import {DefaultVariable} from './default-variable';
import {Type} from './type';

export class QueryExpression {

	type: Type;
	defaultVariable: DefaultVariable | string;
	name: string;
	description: string;
	argument: string;

	constructor(type: Type, defaultVariable: DefaultVariable | string, description: string, desc: string, argument: string) {
		this.type = type;
		this.defaultVariable = defaultVariable;
		this.name = name;
		this.description = description;
		this.argument = argument;
	}

	public static fromDefaultGeneral(defaultVariable: DefaultVariable) {
		return new QueryExpression(Type.GENERAL, defaultVariable, '', '', '');
	}

	public validation() {
		if ((_.isNil(this.type) || _.isEmpty(this.type))
			|| (_.isNil(this.defaultVariable) || _.isEmpty(this.defaultVariable))
			|| (_.isNil(this.name) || _.isEmpty(this.name))
			|| (_.isNil(this.description) || _.isEmpty(this.description))
			|| _.isNil(this.argument)) {
			throw new Error('Required information is not entered.');
		}
	}

	public ofCustomExpressionString(type, defaultVariable: DefaultVariable | string, isSingle: boolean, name: string, argument: string, description: string): string {
		return `${type}{${defaultVariable}${isSingle ? '' : '*'}:${name}${argument === '' ? '()' : '(' + argument + ')'}|${description}}`;
	}

	public ofGeneralExpressionString(type, defaultVariable: DefaultVariable | string, name: string, argument: string, description: string): string {
		return `${type}{${defaultVariable}:${name}(${argument})|${description}}`;
	}

}
