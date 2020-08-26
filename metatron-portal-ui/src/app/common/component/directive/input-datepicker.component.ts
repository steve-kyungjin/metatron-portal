import {Directive, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {AbstractComponent} from '../../../portal/common/component/abstract.component';
import {Picker} from '../../../portal/management/shared/extract/value/picker';
import {DatePicker} from '../../value/input-datepicker-value';

@Directive({
	selector: '[input-datepicker]'
})
export class InputDatepickerComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 디렉티브에서 사용할 파라미터
	 */
	private _datepicker: DatePicker;

	/**
	 * 날짜 선택 인풋 엘리먼트
	 */
	private datePickerInputEl;

	/**
	 * 현재 선택된 날짜
	 *
	 * @type {string}
	 */
	private _selectedDate: string;

	/**
	 * 날짜 선택 아웃풋 이벤트
	 *
	 * @type {EventEmitter}
	 */
	@Output('oSelected')
	private oSelected: EventEmitter<string> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public getSelectedDate(): string {
		return this.selectedDate;
	}

	private get selectedDate(): string {
		return this._selectedDate;
	}

	private set selectedDate(value: string) {
		this._selectedDate = value;
	}

	////////////////////////////////////////////////////////////////////////
	// 날짜 포맷
	////////////////////////////////////////////////////////////////////////

	private get datepicker(): DatePicker {
		return this._datepicker;
	}

	@Input('datepicker')
	private set datepicker(datePicker: DatePicker) {

		if (_.isUndefined(datePicker.setCurrentDate)) {
			datePicker.setCurrentDate = false;
		}

		this._datepicker = datePicker;

		// noinspection JSUnusedLocalSymbols
		const pickerSettings: Picker.Settings = new Picker.Settings(
			Picker.ClassName.DATEPICKER,
			() => {
			},
			() => {
				this.logger.debug(`[${this[ '__proto__' ].constructor.name}] onHide event`);
			}
		);

		if (_.isUndefined(this.datepicker.useTimePicker) === false) {
			pickerSettings.timepicker = this.datepicker.useTimePicker;
		}

		if (_.isUndefined(this.datepicker.position) === false) {
			pickerSettings.position = this.datepicker.position;
		}

		// DatePicker 생성
		// noinspection TypeScriptUnresolvedFunction
		// noinspection TypeScriptValidateJSTypes
		this.datePickerInputEl = this.jQuery(this.elementRef.nativeElement)
			.datepicker(pickerSettings)
			.data('datepicker');

		if (datePicker.setCurrentDate) {
			// noinspection TypeScriptUnresolvedFunction
			this.datePickerInputEl.selectDate(new Date());
		}

		this.datePickerInputEl.update('onSelect', (fDate: string, date: Date) => {
			this.logger.debug(`[${this[ '__proto__' ].constructor.name}] onSelectDate event`);
			this._selectedDate = fDate;
			this.oSelected.emit(fDate);
		});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
	}

	public ngOnDestroy(): void {

		super.ngOnDestroy();

		if (this.datePickerInputEl) {
			this.datePickerInputEl.destroy();
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 *
	 *
	 * @param {Date} date
	 */
	public setDate(date: Date) {

		this.datePickerInputEl.update('onSelect', () => {});

		// noinspection TypeScriptUnresolvedFunction
		this.datePickerInputEl.selectDate(date);

		this.datePickerInputEl.update('onSelect', (fDate: string, date: Date) => {
			this.logger.debug(`[${this[ '__proto__' ].constructor.name}] onSelectDate event`);
			this._selectedDate = fDate;
			this.oSelected.emit(fDate);
		});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
