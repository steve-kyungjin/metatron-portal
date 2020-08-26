import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CookieService} from 'ng2-cookies';
import {Indicator} from 'app/portal/layout/gnb/value/indicator';
import {TranslateService} from 'ng2-translate';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {AnalysisExtractAppComponent} from '../../extract-app/analysis-extract-app.component';
import {AnalysisAppService} from '../../../service/analysis-app.service';
import {MetatronService} from '../../../../common/service/metatron.service';
import {ExtractService} from '../../../../management/shared/extract/service/extract.service';
import {DataSourceService} from '../../../../management/shared/datasource/service/data-source.service';
import {DialogService} from '../../../../../common/component/dialog/dialog.service';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {Validate} from '../../../../../common/util/validate-util';
import {CookieConstant} from '../../../../common/constant/cookie-constant';
import {environment} from '../../../../../../environments/environment';

@Component({
	selector: '[iframe]',
	templateUrl: './analysis-iframe.component.html',
	host: { '[class.blank-content]': 'true' }
})
export class AnalysisIframeComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Private Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild('siteFrame')
	private siteFrame: ElementRef;

	@ViewChild('metatronForm')
	private metatronForm: ElementRef;

	@ViewChild('extractAppComp')
	private extractApp: AnalysisExtractAppComponent;

	private appId: string;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Protected Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Public Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터 추출 앱인 경우
	 *
	 * @type {boolean}
	 */
	public isExtractApp: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Constructor
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				protected cookieService: CookieService,
				public translateService: TranslateService,
				private analysisAppService: AnalysisAppService,
				private metatronService: MetatronService,
				private extractService: ExtractService,
				private dataSourceService: DataSourceService,
				private dialogService: DialogService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Override Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		super.ngOnInit();

		Loading.show();

		this.subscriptions.push(
			this.activatedRoute
				.params
				.subscribe(params => {
					if (params[ 'appId' ]) {
						const appId = params[ 'appId' ];
						this.appId = appId;
						this.gnbService.showNewWindowIcon.next(true);
						this.getAppInfo(appId);
					}
				})
		);

		this.subscriptions.push(
			this.gnbService
				.openNewWindow$
				.subscribe(() => {
					this.openWindow();
				})
		);

	}

	public ngOnDestroy(): void {
		this.gnbService.showNewWindowIcon.next(false);
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Public Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Protected Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Private Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private openWindow() {
		window.open(`http://${window.location.hostname}:${window.location.port}/view/new-window/analysis-app/my-app/${this.appId}`, `${this.appId}`)
	}

	/**
	 * 앱 정보 조회
	 *
	 * @param {string} appId
	 */
	private getAppInfo(appId: string): void {

		this.analysisAppService
			.getAppUrl(appId)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					this.gnbService.changeIndicator.next(new Indicator(result.data.appNm, result.data.summary, []));

					// 태깅
					this.tagging(this.TaggingType.DETAIL, this.TaggingAction.VIEW, appId, result.data.appNm);

					if (Validate.isEmpty(result.data.path)) {
						this.router.navigate([ 'view/error/404' ]);
						return;
					}

					if (typeof result.data.type === 'undefined') {
						this.router.navigate([ 'view/error/404' ]);
						return;
					}

					this.isExtractApp = false;

					// 메타트론 앱
					if (this.isAppTypeMetatron(result)) {
						this.metatronService
							.getMetatronToken()
							.then(() => this.executeMetatronApp(result));
					}

					// URL 앱
					if (this.isAppTypeUrl(result)) {
						this.siteFrame.nativeElement.src = result.data.path;
					}

					// 데이터 추출 앱
					if (this.isAppTypeExtract(result)) {
						this.isExtractApp = true;
						this.extractApp.init(result.data.path);
					}

				} else {

					// 메뉴 리로드
					this.layoutService.createDataSetUsedByLnb();

					this.dialogService.alert(
						'알림',
						'앱에 대한 권한이 없습니다.',
						'권한을 다시 신청해 주세요.',
						'확인',
						() => {
							this.router.navigate([ `view/analysis-app/${appId}` ]);
						}
					);
				}

				Loading.hide();
			});
	}

	/**
	 * 메타트론 앱 실행
	 *
	 * @param result
	 */
	private executeMetatronApp(result): void {
		const token = this.cookieService.get(CookieConstant.KEY.METATRON_TOKEN);
		const refreshToken = this.cookieService.get(CookieConstant.KEY.METATRON_REFRESH_TOKEN);
		const type = this.cookieService.get(CookieConstant.KEY.METATRON_TOKEN_TYPE);
		const userId = this.cookieService.get(CookieConstant.KEY.USER_ID);

		this.metatronForm.nativeElement.action = this.sessionInfo.getUser().metatronUrl + `/api/sso?token=${token}&refreshToken=${refreshToken}&type=${type}&userId=${userId}&forwardUrl=${result.data.path}`;
		this.metatronForm.nativeElement.submit();
	}

	/**
	 * 앱 타입이 메타트론인 경우
	 *
	 * @param result
	 * @returns {boolean}
	 */
	private isAppTypeMetatron(result): boolean {
		return result.data.type === 'METATRON';
	}

	/**
	 * 앱 타입이 추출형인 경우
	 *
	 * @param result
	 * @returns {boolean}
	 */
	private isAppTypeExtract(result): boolean {
		return result.data.type === 'EXTRACT';
	}

	/**
	 * 앱 타입이 Url인 경우
	 *
	 * @param result
	 * @returns {boolean}
	 */
	private isAppTypeUrl(result): boolean {
		return result.data.type === 'URL';
	}

}
