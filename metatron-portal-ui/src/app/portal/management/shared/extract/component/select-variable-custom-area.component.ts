import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {MetaService} from '../../../../meta/service/meta.service';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {PaginationComponent} from '../../../../../common/component/pagination/pagination.component';
import {Page, Sort} from '../../../../common/value/result-value';
import {Loading} from '../../../../../common/util/loading-util';
import {QueryExpression} from '../value/query-expression';
import {Type} from '../value/type';
import * as _ from 'lodash';
import {Alert} from '../../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import {DialogService} from '../../../../../common/component/dialog/dialog.service';
import {ExtractService} from '../service/extract.service';
import {ExtractSql} from '../value/extract-app-process';

@Component({
	selector: '[custom-area]',
	templateUrl: './select-variable-custom-area.component.html',
	host: { '[class.custom-area]': 'true' }
})
export class SelectVariableCustomAreaComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild(PaginationComponent)
	private pagination: PaginationComponent;

	private currentPage: number = 0;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public customVariables: ExtractSql.CustomVariable[] = [];

	public page: Page = new Page();

	public queryExpression: QueryExpression = new QueryExpression(Type.CUSTOM, '', '', '', '');

	public selectedCustomVariable: ExtractSql.CustomVariable = null;

	public isSingle: boolean = true;

	public isValidationName: boolean = false;

	public isValidationDescription: boolean = false;

	public isShow: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private metaService: MetaService,
				private dialogService: DialogService,
				private extractService: ExtractService,
				private translateService: TranslateService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		this.initializePaginationData();
		this.getVars();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public setCurrentPage(currentPage: number): void {
		this.currentPage = currentPage;
		this.page.number = this.currentPage;
		this.selectedCustomVariable = null;
		this.getVars();
	}

	public makePreviewVariable(): string {
		return this.makeExpression(
			this.queryExpression.type,
			this.selectedCustomVariable.name,
			this.isSingle,
			this.queryExpression.name,
			this.convertArgument(_.cloneDeep(this.queryExpression.argument)),
			this.convertDescription(_.cloneDeep(this.queryExpression.description))
		);
	}

	private convertArgument(argument: string) {
		return (_.isUndefined(argument) || _.isEmpty(argument)) ? '' : `'${argument}'`;
	}

	public checked(isChecked: boolean) {
		this.isSingle = isChecked;
	}

	public getVariable() {

		if (this.validationName()) {
			this.isValidationName = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (this.selectedCustomVariable === null) {
			Alert.warning('사용하실 변수를 선택하세요.');
			return;
		}

		return this.makePreviewVariable();
	}

	public completeCreateCustomVariable() {
		this.pagingInit();
		this.selectedCustomVariable = null;
		this.getVars();
	}

	/**
	 * 석제
	 */
	public deleteCustomVariable(id: string) {

		this.dialogService
			.confirm(
				this.translateService.instant('COMMON.DELETE', '삭제'),
				this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제하시겠습니까?'),
				null,
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.CONFIRM', '확인'),
				() => {
					this.logger.debug(`삭제 컨펌 취소 클릭`);
				},
				() => {

					Loading.show();

					this.extractService
						.deleteCustomVariable(id)
						.then(result => {

							Loading.hide();

							if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
								Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
								this.pagingInit();
								this.selectedCustomVariable = null;
								this.getVars();
							} else {
								Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
							}
						})
						.catch(error => {
							this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
						});
				});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private initializePaginationData() {
		this.page.number = 0;
		this.page.size = 5;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';
	}

	private getVars(loading: boolean = true) {

		if (loading) {
			Loading.show();
		}

		this.metaService
			.getVars(this.page)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.varList);
					this.pagination.init(this.page);
					this.customVariables = result.data.varList.content;
				} else {
					this.pagingInit();
					this.customVariables = [];
				}

				if (loading) {
					Loading.hide();
				}

			});
	}

	private setPageInfo(page): void {
		this.page.first = page.first;
		this.page.last = page.last;
		this.page.number = page.number;
		this.page.numberOfElements = page.numberOfElements;
		this.page.size = page.size;
		this.page.totalElements = page.totalElements;
		this.page.totalPages = page.totalPages;
	}

	private pagingInit(totalPage: number = 0): void {
		this.page.totalPages = totalPage;
		this.page.number = 0;
		this.page.totalElements = 0;
		this.pagination.init(this.page);
	}

	private convertDescription(description) {
		return `'${description}'`;
	}

	private makeExpression(type, defaultVariable, isSingle, name, argument, description) {
		return this.queryExpression.ofCustomExpressionString(type, defaultVariable, isSingle, name, argument, description);
	}

	private validationName() {
		return (_.isNil(this.queryExpression.name) || _.isEmpty(this.queryExpression.name));
	}

}
