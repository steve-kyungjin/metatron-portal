export class DatePicker {

	dataFormat: string;
	timeFormat: string;
	useTimePicker: boolean;
	setCurrentDate: boolean;
	position: string;

	constructor(dataFormat: string, timeFormat: string, useTimePicker: boolean, setCurrentDate: boolean) {
		this.dataFormat = dataFormat;
		this.timeFormat = timeFormat;
		this.useTimePicker = useTimePicker;
		this.setCurrentDate = setCurrentDate;
	}
}
