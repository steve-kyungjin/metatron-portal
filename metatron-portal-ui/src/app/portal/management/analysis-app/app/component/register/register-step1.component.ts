import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import 'angular2-navigate-with-data/dist/index';
import {AnalysisApp} from '../../../../../analysis-app/value/analysis-app.value';
import {AbstractComponent} from '../../../../../common/component/abstract.component';
import {Loading} from '../../../../../../common/util/loading-util';

export class HeaderType {
	URL: AnalysisApp.HeaderType = AnalysisApp.HeaderType.URL;
	METATRON: AnalysisApp.HeaderType = AnalysisApp.HeaderType.METATRON;
	EXTRACT: AnalysisApp.HeaderType = AnalysisApp.HeaderType.EXTRACT;
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
	 * 분석 앱 HeaderType
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
	 * 분석 앱 정보 등록화면으로 앱 타입 전달
	 *
	 * @param {AnalysisApp.HeaderType} createAppType
	 */
	public sendAppTypeToAnalysisAppEnterInformationCreatePage(createAppType: AnalysisApp.HeaderType): void {

		const param: AnalysisApp.CreateAnalysisAppPageParameter = new AnalysisApp.CreateAnalysisAppPageParameter();

		switch (createAppType) {
			case AnalysisApp.HeaderType.URL: {
				this.goNextPage(param, createAppType);
				break;
			}
			case AnalysisApp.HeaderType.METATRON: {
				this.goNextPage(param, createAppType);
				break;
			}
			case AnalysisApp.HeaderType.EXTRACT: {
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

	private goNextPage(param: AnalysisApp.CreateAnalysisAppPageParameter, createAppType: AnalysisApp.HeaderType): void {
		param.type = createAppType;
		this.router.navigateByData({
			url: [ 'view/management/analysis-app/app/register-step2' ],
			data: param
		});
	}

}
