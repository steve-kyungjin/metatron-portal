export namespace Picker {

	export enum Lang {
		KO = <any>'ko',
		EN = <any>'en',
	}

	export enum ClassName {
		DATEPICKER = <any>'dtp-datepicker'
	}

	export enum Position {
		BL = <any>'bottom left',
		LT = <any>'top left'
	}

	export enum TitleFormat {
		KO = <any>{ days: 'yyyy<span>년&nbsp;</span> MM' },
		EN = <any>{ days: 'MM,yyyy' }
	}

	export enum PeriodType {
		ALL = <any>'ALL',
		TODAY = <any>'TODAY',
		LAST_WEEK = <any>'LAST_WEEK',
		NOT = <any>'NOT',
		YEAR = <any>'YEAR'
	}

	export enum DateFormat {
		DEFAULT = <any>'yyyy-mm-dd'
	}

	export enum TimeFormat {
		DEFAULT = <any>'hh:ii'
	}

	export class Settings {

		public class: ClassName = ClassName.DATEPICKER;
		public language: Lang = Lang.KO;
		public navTitles: TitleFormat = TitleFormat.KO;
		public position: Position | string = Position.BL;

		public minView: string;
		public view: string;
		public dateFormat: string | DateFormat;
		public timeFormat: string | TimeFormat;
		public timepicker: boolean = false;
		public onSelect: Function;
		public autoClose: boolean = true;
		public onHide: Function;

		constructor(clz: ClassName, onSelectDate: Function, onHide: Function) {
			this.class = clz;
			this.onSelect = onSelectDate;
			this.onHide = onHide;
			this.dateFormat = DateFormat.DEFAULT;
			this.timeFormat = TimeFormat.DEFAULT;
		}

	}

	export class PeriodSettings extends Settings {

		constructor(clz: ClassName, onSelectDate: Function, onHide: Function, useTimePicker: boolean) {

			super(clz, onSelectDate, onHide);

			if (useTimePicker) {
				this.dateFormat = DateFormat.DEFAULT;
				this.timeFormat = TimeFormat.DEFAULT;
				this.minView = 'days';
				this.view = 'days';
				this.timepicker = true;
			} else {
				this.dateFormat = DateFormat.DEFAULT;
				this.minView = 'days';
				this.view = 'days';
			}
		}
	}

}
