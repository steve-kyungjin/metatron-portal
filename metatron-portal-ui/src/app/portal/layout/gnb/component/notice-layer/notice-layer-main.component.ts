import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {TranslateService} from 'ng2-translate';
import {CommunityService} from '../../../../community/service/community.service';
import {CookieConstant} from '../../../../common/constant/cookie-constant';
import {CookieService} from 'ng2-cookies';
import * as moment from 'moment';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {Community} from '../../../../community/value/community.value';
import {NavigationStart} from '@angular/router';
import {PagePermission, PERMISSION_CODE} from '../../../../common/value/page-permission';
import * as _ from 'lodash';
import {NoticeLayer} from "../../value/notice-layer.value";

@Component({
	selector: 'notice-layer-main',
	templateUrl: 'notice-layer-main.component.html'
})
export class NoticeLayerMainComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Private Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Protected Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Public Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public NoticeType: typeof NoticeLayer.NoticeType = NoticeLayer.NoticeType;

	// 요청 등록 건수
	public requestedCnt: number;
	// 요청 처리중 건수
	public progressCnt: number;
	// 요청 완료 건수
	public completedCnt: number;
	// 공지 알림 건수
	public noticeCnt: number;

	// 요청 등록 목록
	public requestedList: Community.Post[];
	// 요청 처리중 목록
	public progressList: Community.Post[];
	// 요청 완료 목록
	public completedList: Community.Post[];
	// 공지 알림 목록
	public noticeList: Community.Post[];

	public showRequested: boolean;
	public showProgress: boolean;
	public showCompleted: boolean;
	public showDefaultNotice: boolean;

	// 레이어 타이틀
	public layerTitleRequested: string;
	public layerTitleProgress: string;
	public layerTitleCompleted: string;
	public layerTitleDefaultNotice: string;

	public showIndex: number;

	// 공지알림 표시 여부
	public show: boolean;


	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Constructor
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public communityService: CommunityService,
				public translateService: TranslateService,
				private cookieService: CookieService) {
		super(elementRef, injector);

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Override Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		const permission: PagePermission = this.layoutService.getPagePermissionByIACode(this.layoutService.iaCodes.communityIaCode);
		if (permission.permission >= PERMISSION_CODE.RO && _.isUndefined(permission.permission) === false) {
			this.show = true;

			this.layerTitleRequested = this.translateService.instant('NOTICE.LAYER.TITLE.REQUESTED', '요청 등록 알림');
			this.layerTitleProgress = this.translateService.instant('NOTICE.LAYER.TITLE.PROGRESS', '요청 처리중 알림');
			this.layerTitleCompleted = this.translateService.instant('NOTICE.LAYER.TITLE.COMPLETED', '요청 완료 알림');
			this.layerTitleDefaultNotice = this.translateService.instant('NOTICE.LAYER.TITLE', '공지알림');

			const notice = this.cookieService.get(CookieConstant.KEY.NOTICE);
			if (notice) {
				const date = notice.split(',')[0];
				const lastId = notice.split(',')[1];

				const today = moment(new Date()).format('YYYYMMDD');
				if (date != today) {
					this.getNoticeList(this.NoticeType.DEFAULT);
				} else {
					this.communityService.getNewNotice(lastId).then(result => {
						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
							if (result.data) {
								this.getNoticeList(this.NoticeType.DEFAULT);
							}
						}
					});
				}
			} else {
				this.getNoticeList(this.NoticeType.DEFAULT);
			}
		} else {
			this.show = false;
		}

		this.subscriptions.push(
			this.router
				.events
				.subscribe((e) => {

					if (e instanceof NavigationStart) {
						// 건수 조회
						this.getNoticeCount();
					}
				})
		);

		this.getNoticeCount();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Public Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public showNotice(index) {
		if (index == 0) {
			this.getNoticeList(this.NoticeType.REQUESTED, true);
		} else if (index == 1) {
			this.getNoticeList(this.NoticeType.PROGRESS, true);
		} else if (index == 2) {
			this.getNoticeList(this.NoticeType.COMPLETED, true);
		} else {
			this.getNoticeList(this.NoticeType.DEFAULT, true);
		}
	}

	/**
	 * 공지알림 개수 조회
	 */
	public getNoticeCount() {
		this.communityService.getNoticeCount().then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.noticeCnt = result.data.badge.notice;
				this.requestedCnt = result.data.badge.notProcess;
				this.progressCnt = result.data.badge.process;
				this.completedCnt = result.data.badge.completed;
			}
		});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Protected Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Private Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 공지알림 조회
	 */
	private getNoticeList(type: NoticeLayer.NoticeType, isForce: boolean = false) {
		this.showDefaultNotice = false;
		this.showRequested = false;
		this.showProgress = false;
		this.showCompleted = false;

		if (type == NoticeLayer.NoticeType.REQUESTED) {
			this.showIndex = 0;
			this.communityService.getRequestedList().then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.requestedList = result.data.notProcessList;
					if (this.showIndex == 0) {
						this.showRequested = true;
					}
				}
			});
		} else if (type == NoticeLayer.NoticeType.PROGRESS) {
			this.showIndex = 1;
			this.communityService.getProgressList().then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.progressList = result.data.processList;
					if (this.showIndex == 1) {
						this.showProgress = true;
					}
				}
			});
		} else if (type == NoticeLayer.NoticeType.COMPLETED) {
			this.showIndex = 2;
			this.communityService.getCompletedList().then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.completedList = result.data.completedList;
					if (this.showIndex == 2) {
						this.showCompleted = true;
					}
				}
			});
		} else {
			this.showIndex = 3;
			this.communityService.getNoticeList().then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.noticeList = result.data.noticeList;
					if (isForce || this.noticeList.length) {
						if (this.showIndex == 3) {
							this.showDefaultNotice = true;
						}
					}
				}
			});
		}
	}
}
