import {Component, ElementRef, Injector, OnDestroy, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {AbstractComponent} from "../../../../common/component/abstract.component";
import {TranslateService} from "ng2-translate";
import {CookieConstant} from "../../../../common/constant/cookie-constant";
import {CookieService} from "ng2-cookies";
import * as moment from "moment";
import {Community} from "../../../../community/value/community.value";
import {NavigationStart} from "@angular/router";
import {NoticeLayer} from "../../value/notice-layer.value";

@Component({
	selector: 'notice-layer',
	templateUrl: 'notice-layer.component.html'
})
export class NoticeLayerComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Input()
	public type: NoticeLayer.NoticeType = NoticeLayer.NoticeType.DEFAULT;

	@Input()
	public badgeCount: number = 0;

	// 팝업 show/hide
	@Input()
	public isShow: boolean = false;

	@Output()
	public onShow: EventEmitter<any> = new EventEmitter();

	public NoticeType: typeof NoticeLayer.NoticeType = NoticeLayer.NoticeType;

	// 공지알림 목록
	@Input()
	public noticeList: Community.Post[];

	// 팝업 타이틀
	@Input()
	public layerTitle: string;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private cookieService: CookieService) {
		super(elementRef, injector);

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.subscriptions.push(
			this.router
				.events
				.subscribe((e) => {

					if (e instanceof NavigationStart) {
						this.isShow = false;
					}

				})
		);
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 공지사항 보기 클릭
	 */
	public showListClick() {
		if (this.isShow) {
			this.closeClick();
		} else {
			this.onShow.emit();
		}
	}

	/**
	 * 닫기 클릭
	 */
	public closeClick() {
		if (this.type == NoticeLayer.NoticeType.DEFAULT) {
			const today = moment(new Date()).format('YYYYMMDD');
			let id = null;
			if (this.noticeList && this.noticeList.length) {
				id = this.noticeList[0].id;
			}

			if (id) {
				this.cookieService.set(CookieConstant.KEY.NOTICE, today + ',' + id, 1, '/');
			}
		}

		this.isShow = false;
	}

	/**
	 * 공지 클릭
	 * @param post
	 */
	public noticeClick(post: Community.Post) {
		this.router.navigate([ `view${post.master.prePath}/${post.master.slug}/post/${post.id}` ]);
	}

	/**
	 * 전체보기 클릭
	 */
	public viewAllClick() {
		this.router.navigate([ 'view/community/notice' ]);
	}

	/**
	 * 건수 표시
	 */
	public displayCount(cnt: number) {
		return cnt > 999 ? '999+' : cnt;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/



}
