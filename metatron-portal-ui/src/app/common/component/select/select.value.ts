/**
 * select value
 */
export class SelectValue {
	constructor(
		private _label: string = '',
		private _value: any = null,
		private _checked: boolean = false
	) {
		this.label = _label;
		this.value = _value;
		this.checked = _checked;
	}

	public label: string;
	public value: any;
	public checked: boolean;
}
