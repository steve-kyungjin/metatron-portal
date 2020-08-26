import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import 'angular2-navigate-with-data/dist/index';
import {ReportApp} from '../../../../../report-app/value/report-app.value';
import {AbstractComponent} from '../../../../../common/component/abstract.component';
import {Loading} from '../../../../../../common/util/loading-util';

export class HeaderType {
	URL: ReportApp.HeaderType = ReportApp.HeaderType.URL;
	METATRON: ReportApp.HeaderType = ReportApp.HeaderType.METATRON;
	EXTRACT: ReportApp.HeaderType = ReportApp.HeaderType.EXTRACT;
}

@Component({
	selector: 'register-step1',
	templateUrl: './register-step1.component.html'
})
export class RegisterStep1Component extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 리포트 앱 HeaderType
	 *
	 * @type {HeaderType}
	 */
	public ANALYSIS_APP_HEADER_TYPE: HeaderType = new HeaderType();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		Loading.hide();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 리포트 앱 정보 등록화면으로 앱 타입 전달
	 *
	 * @param {ReportApp.HeaderType} createAppType
	 */
	public sendAppTypeToReportAppEnterInformationCreatePage(createAppType: ReportApp.HeaderType): void {

		const param: ReportApp.CreateReportAppPageParameter = new ReportApp.CreateReportAppPageParameter();

		switch (createAppType) {
			case ReportApp.HeaderType.URL: {
				this.goNextPage(param, createAppType);
				break;
			}
			case ReportApp.HeaderType.METATRON: {
				this.goNextPage(param, createAppType);
				break;
			}
			case ReportApp.HeaderType.EXTRACT: {
				this.goNextPage(param, createAppType);
				break;
			}
		}
	}

	/**
	 * 라우트 링크
	 *
	 * @param {string} routerLink
	 */
	public routerLink(routerLink: string): void {
		this.router.navigate([ routerLink ]);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private goNextPage(param: ReportApp.CreateReportAppPageParameter, createAppType: ReportApp.HeaderType): void {
		param.type = createAppType;
		this.router.navigateByData({
			url: [ 'view/management/report-app/report/register-step2' ],
			data: param
		});
	}

}
