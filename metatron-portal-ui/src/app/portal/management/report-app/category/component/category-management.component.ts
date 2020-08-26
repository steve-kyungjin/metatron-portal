import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {BaseCategoryManagementClass} from '../../../shared/component/base-category-management/base-category-management.class';
import {TranslateService} from 'ng2-translate';
import {DialogService} from '../../../../../common/component/dialog/dialog.service';
import {CookieService} from 'ng2-cookies';
import {Loading} from '../../../../../common/util/loading-util';
import {ReportAppService} from '../../../../report-app/service/report-app.service';
import {CommonConstant} from '../../../../common/constant/common-constant';

@Component({
	selector: '[category-management]',
	templateUrl: './category-management.component.html',
	host: { '[class.page-management-category]': 'true' }
})
export class CategoryManagementComponent extends BaseCategoryManagementClass implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  	| Private Variables
  	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

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
	 * @param elementRef
	 * @param injector
	 * @param translateService
	 * @param dialogService
	 * @param cookieService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				protected translateService: TranslateService,
				protected dialogService: DialogService,
				protected cookieService: CookieService,
				private reportAppService: ReportAppService) {
		super(elementRef, injector, translateService, dialogService, cookieService);
		// noinspection UnnecessaryLocalVariableJS
		const reportAppCategoryGroupCode: string = 'GC0000003';
		this.groupCode = reportAppCategoryGroupCode;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		super.ngOnInit();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 카테고리 목록 조회
	 */
	protected getCategoryList(): void {

		Loading.show();

		this.reportAppService
			.getCategoryList()
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					result.data
						.categoryList
						.map(code => {
							code.isCdValidationFail = false;
							code.isNmKrValidationFail = false;
							code.isNmEnValidationFail = false;
							code.isCdDescValidationFail = false;
							return code.groupCd = this.groupCode;
						});

					this.categoryList = result.data.categoryList;
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
