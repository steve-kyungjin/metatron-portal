import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {ExtractService} from '../../extract/service/extract.service';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {ExtractSql} from '../../extract/value/extract-app-process';
import {Utils} from '../../../../../common/util/utils';
import * as _ from 'lodash';

@Component({
	selector: '[custom-variable-select-layer]',
	templateUrl: './custom-variable-execute.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class CustomVariableExecuteComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Output()
	private onComplete = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public customVariables: ExtractSql.CustomVariableExecute[] = [];

	@Input()
	public callBackFn: Function;

	@Input()
	public extractCustomVariableModule: ExtractSql.ModulesEntity;

	@Output()
	public onCancel = new EventEmitter();

	public selectedCustomVariables: ExtractSql.CustomVariableExecute[] = [];

	public keyWord: string = '';

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private extractService: ExtractService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		if (_.isNil(this.extractCustomVariableModule) === false) {

			Loading.show();

			this.extractService.customVariableExecute(this.extractCustomVariableModule)
				.then(result => {

					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
						this.customVariables = result.data.result.resultList.filter(customVariable => {
							return typeof customVariable.label !== 'undefined';
						});
					}

					Loading.hide();
				});
		}
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public complete() {
		this.onComplete.emit({
			'origin': this.selectedCustomVariables,
			'fn': this.callBackFn,
			'codes': this.toCodesWithComma(),
			'labels': this.toLabelsWithComma()
		});
	}

	public clearSelectedCustomVariables() {
		this.selectedCustomVariables = [];
	}

	public deleteSelectedCustomVariable(index: number) {
		this.selectedCustomVariables = Utils.ArrayUtil.remove(this.selectedCustomVariables, index);
	}

	public select(customVariable: ExtractSql.CustomVariableExecute): void {
		if (this.extractCustomVariableModule.multiple) {
			this.selectedCustomVariables.push(customVariable);
			this.selectedCustomVariables = _.uniqWith(this.selectedCustomVariables, _.isEqual);
		} else {
			this.selectedCustomVariables = [];
			this.selectedCustomVariables.push(customVariable);
			this.complete();
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Protected Method
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private toCodesWithComma() {
		return this.selectedCustomVariables
			.filter(c => typeof c.code !== 'undefined')
			.map(c => c.code)
			.join(',');
	}

	private toLabelsWithComma() {
		return this.selectedCustomVariables
			.filter(c => typeof c.code !== 'undefined')
			.map(c => c.label)
			.join(',');
	}

}
