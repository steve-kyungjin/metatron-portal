import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ExtractSql} from '../value/extract-app-process';
import * as _ from 'lodash';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {Alert} from '../../../../../common/util/alert-util';
import {SelectValue} from '../../../../../common/component/select/select.value';
import {CustomVariableExecuteComponent} from '../../custom-variable-execute/component/custom-variable-execute.component';

@Component({
	selector: '[execute-condition-enter-information]',
	templateUrl: './execute-condition-enter-information.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class ExecuteConditionEnterInformationComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private _moduleList: ExtractSql.ModulesEntity[] = [];

	@Output('cancel')
	private oCancelEvent: EventEmitter<ExtractSql.ModulesEntity[]> = new EventEmitter();

	@Output('done')
	private oDoneEvent: EventEmitter<ExtractSql.ModulesEntity[]> = new EventEmitter();

	@ViewChild(CustomVariableExecuteComponent)
	private customVariableSelectLayerComponent: CustomVariableExecuteComponent;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChildren('input')
	public inputList: QueryList<ElementRef>;

	public callBackFn: Function = () => {};

	public selectedCustomVariable: ExtractSql.ModulesEntity = null;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Getter & Setter
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	get moduleList(): ExtractSql.ModulesEntity[] {
		return this._moduleList;
	}

	@Input('moduleList')
	set moduleList(value: ExtractSql.ModulesEntity[]) {

		const moduleList = _.cloneDeep(value);
		moduleList
			.map(module => {

				if (_.isUndefined(module.args) === false) {

					if (module.namespace === 'TEXT') {
						module.input = module.args[ 0 ];
					} else if (module.namespace === 'NUMBER') {
						module.input = module.args[ 0 ];
					} else if (module.namespace === 'SELECT') {
						const selectBoxItems: SelectValue[] = [];
						module.args.forEach((argument, index) => {
							selectBoxItems.push(new SelectValue(argument, argument, index === 0))
						});
						module.selectValues = selectBoxItems;
						if (module.selectValues.length > 0) {
							module.input = module.selectValues[ 0 ].value;
						}
					} else if (module.namespace === 'ARRAY') {
						module.input = module.args
							.map(argument => {
								return argument;
							}).join(',');
					} else if (module.namespace === 'DATE') {
						module.input = '';
					} else if (module.namespace === 'DATETIME') {
						module.input = '';
					}
					
				}

				return module;
			});

		this._moduleList = moduleList;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public showCustomVariableSelectLayer(module: ExtractSql.ModulesEntity, index: number) {
		this.selectedCustomVariable = module;
		this.callBackFn = (codes: string, labels: string) => {
			module.label = labels;
			module.input = codes;
			if (_.isNil(module.input) === false && _.isEmpty(module.input) === false) {
				this.removeIsErrorClass(index);
			}
		};
	}

	public completeCustomVariableSelect($event) {
		$event.fn($event.codes, $event.labels);
		this.selectedCustomVariable = null;
	}

	/**
	 * 취소
	 */
	public cancel(): void {
		this.moduleList = [];
		this.oCancelEvent.emit();
	}

	/**
	 * 적용
	 */
	public done(): void {

		for (let index = 0; index < this.moduleList.length; index++) {

			const module = this.moduleList[ index ];

			if (typeof module.input === 'undefined' || module.input === '') {
				this.inputList[ '_results' ][ index ].nativeElement.classList.add('is-error');
				Alert.warning(`'${module.name}'의 값을 입력해주세요.`);
				return;
			}

			if (module.moduleType === 'CUSTOM') {
				if (typeof module.input === 'undefined' || module.input === '') {
					this.inputList[ '_results' ][ index ].nativeElement.classList.add('is-error');
					Alert.warning(`'${module.name}'의 값을 입력해주세요.`);
					return;
				}
			}

		}

		this.oDoneEvent.emit(this.moduleList);
		this.moduleList = [];
	}

	public removeIsErrorClass(index: number): void {
		this.inputList[ '_results' ][ index ].nativeElement.classList.remove('is-error');
	}

	public getDatePickerInputValueByTrIndex(index: number) {
		return this.inputList[ '_results' ][ index ].nativeElement.children[ 1 ].children[ 0 ].children[ 0 ].children[ 0 ].value;
	}

	public dateFormatConvert(date, dateFormat, timeFormat: string = null): string {

		return date;

		// //  날짜 포맷 사용 가능여부 검사
		// if (this.dateFormatValid(date, dateFormat) === false) {
		// 	dateFormat = `${Picker.DateFormat.DEFAULT}`;
		// }
		//
		// // 날짜 시간 포맷인 경우
		// if (timeFormat !== null) {
		//
		// 	const mDateFormat: string = `${dateFormat}${timeFormat}`;
		//
		// 	// 입력 받은 날짜 시간 포맷 검사
		// 	// 사용 가능한 경우
		// 	if (this.dateFormatValid(date, mDateFormat)) {
		// 		dateFormat = mDateFormat;
		// 	}
		//
		// 	// 입력 받은 날짜 시간 포맷 검사
		// 	// 사용 불가능한 경우 날짜포맷 + 시간 포맷 기본으로 변경
		// 	else {
		// 		dateFormat = `${dateFormat}${Picker.TimeFormat.DEFAULT}`;
		// 	}
		// }
		//
		// // 모멘트 라이브러리 객체 생성
		// const momentDate = moment(date);
		//
		// // 모멘트 객체 유효성 검사
		// if (!momentDate.isValid()) {
		// 	return date;
		// }
		//
		// if (this.dateFormatValid(date, dateFormat)) {
		// 	return momentDate.format(dateFormat);
		// } else {
		// 	return date;
		// }
	}

	// private dateFormatValid(date, format): boolean {
	// 	const validation = moment(moment(date).format(format)).inspect();
	// 	return validation.indexOf('invalid') < 0;
	// }

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
