import {
	Component, ElementRef, Injector, OnDestroy, OnInit, Input, EventEmitter, Output,
	OnChanges, SimpleChanges
} from "@angular/core";
import {AbstractComponent} from "../../../common/component/abstract.component";
import {QuickService} from "../service/quick.service";
import {TranslateService} from "ng2-translate";
import {CookieService} from "ng2-cookies";
import {CookieConstant} from "../../../common/constant/cookie-constant";
import {Alert} from "../../../../common/util/alert-util";
import {CommonConstant} from "../../../common/constant/common-constant";
import {environment} from "../../../../../environments/environment";
import {DialogService} from "../../../../common/component/dialog/dialog.service";
import * as moment from "moment";
import {Validate} from "../../../../common/util/validate-util";
import {CommunityService} from "../../../community/service/community.service";
import {Community} from "../../../community/value/community.value";
import {PagePermission, PERMISSION_CODE} from "../../../common/value/page-permission";
import {NavigationStart} from "@angular/router";
import * as _ from "lodash";
import {UserService} from "../../../common/service/user.service";

@Component({
	selector: 'quick-menu',
	templateUrl: './quick.component.html'
})
export class QuickComponent extends AbstractComponent implements OnInit, OnDestroy, OnChanges {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private currentSlug: string;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Output()
	public show: EventEmitter<boolean> = new EventEmitter();

	@Output()
	public showUserProfile: EventEmitter<boolean> = new EventEmitter();

	@Output()
	public createPost: EventEmitter<any> = new EventEmitter();

	@Input()
	public isShow: boolean = false;
	public menus: Array<Object>;
	public langList: Array<Object>;
	public currentLang: object;
	public isOpenLang: boolean;
	public showRequestPopup: boolean;

	public requestPopupTitle: string;
	public requestPopupDesc: string;
	public requestTitle: string;
	public requestContent: string;

	public myPostList: Array<Object>;
	public myCommentList: Array<Object>;
	public myPostCommentList: Array<Object>;

	// 요청 게시판 show/hide
	public showRequest: boolean;
	// 게시판 show/hide
	public showCommunity: boolean;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private quickService: QuickService,
				public translateService: TranslateService,
				private cookieService: CookieService,
				private dialogService: DialogService,
				private communityService: CommunityService,
				public userService: UserService) {
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
						this.show.emit(false);
					}

				})
		);

		this.initialize();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		for (let propName in changes) {
			if (propName === 'isShow') {
				if (this.isShow) {
					this.getList();

					// this.tagging(this.TaggingType.QUICK, this.TaggingAction.BTN, 'Quick Comm.');
				}
			}
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 퀵 메뉴 열고 닫기
	public quickBtnClick(): void {
		this.isShow = !this.isShow;

		if (this.isShow) {
			this.getList();
		}

		this.show.emit(this.isShow);

		this.tagging(this.TaggingType.QUICK, this.TaggingAction.BTN, 'Quick Comm.');
	}

	// 퀵 메뉴 내 탭 메뉴 선택
	public menuClick(index): void {
		// 선택한 메뉴만 열림
		for (let i = 0; i < this.menus.length; i++) {
			let isOpen = false;
			if (index == i) {
				isOpen = true;
			}

			this.menus[ i ][ 'clicked' ] = isOpen;
		}
	}

	// logout
	public logoutClick() {
		this.userService.logout();
		location.reload();
	}

	// 퀵 메뉴 내 탭 메뉴 아이템 선택
	public menuItemClick(url: string) {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ url ]);
	}

	// 언어 선택
	public langClick(code): void {
		for (let i = 0; i < this.langList.length; i++) {
			if (this.langList[ i ][ 'code' ] == code) {
				this.currentLang = this.langList[ i ];
			}
		}

		this.cookieService.set(CookieConstant.KEY.LANGUAGE, code, 9999, '/');
		this.isOpenLang = false;
		location.href = `${environment.contextPath}${this.router.url}`;
	}

	// 현재 페이지를 시작페이지로 설정
	public configStartPage(): void {
		this.dialogService.confirm(
			this.translateService.instant('QUICK.MENU.START.CONFIG.CONFIRM.TITLE', '시작화면 설정하기'),
			this.translateService.instant('QUICK.MENU.START.CONFIG.CONFIRM.CONTENT', '포탈 접속 시 현 화면이 항상 시작화면으로 실행됩니다. 설정하시겠습니까?'),
			null,
			this.translateService.instant('COMMON.CANCEL', '취소'),
			this.translateService.instant('COMMON.CONFIRM', '확인'),
			() => {
				this.logger.debug('close');
			},
			() => {
				this.quickService.setStartPage(this.router.url).then(result => {
					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
						Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
					} else {
						Alert.error(this.translateService.instant('COMMON.MESSAGE.ERROR', '오류'));
					}
				});
			});

	}

	/**
	 * 공지사항 클릭
	 */
	public noticeClick() {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ 'view/community/notice' ]);
	}

	/**
	 * 소프트웨어 클릭
	 */
	public softwareClick() {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ 'view/community/pds' ]);
	}

	/**
	 * FAQ 클릭
	 */
	public faqClick() {
		this.router.navigate([ 'view/community/infra-faq' ]);
	}

	/**
	 * 하단 메뉴 클릭
	 * @param index
	 */
	public bottomMenuClick(index: number) {
		let title = '';
		let desc = '';
		if (index == 0) {
			this.currentSlug = 'request-collect';
			title = this.translateService.instant('QUICK.MENU.BOTTOM.MENU1', '데이터 수집 요청');
			desc = this.translateService.instant('QUICK.MENU.BOTTOM.MENU1.DESC', '');
		} else if (index == 1) {
			this.currentSlug = 'request-data-create';
			title = this.translateService.instant('QUICK.MENU.BOTTOM.MENU2', '데이터 생성 요청');
			desc = this.translateService.instant('QUICK.MENU.BOTTOM.MENU2.DESC', '');
		} else if (index == 2) {
			this.currentSlug = 'request-report-create';
			title = this.translateService.instant('QUICK.MENU.BOTTOM.MENU3', '리포트 생성 요청');
			desc = this.translateService.instant('QUICK.MENU.BOTTOM.MENU3.DESC', '');
		} else if (index == 3) {
			this.currentSlug = 'request-extract';
			title = this.translateService.instant('QUICK.MENU.BOTTOM.MENU4', '데이터 추출 요청');
			desc = this.translateService.instant('QUICK.MENU.BOTTOM.MENU4.DESC', '');
		} else if (index == 4) {
			this.currentSlug = 'request-confirm';
			title = this.translateService.instant('QUICK.MENU.BOTTOM.MENU5', '데이터 검증 요청');
			desc = this.translateService.instant('QUICK.MENU.BOTTOM.MENU5.DESC', '');
		} else if (index == 5) {
			this.currentSlug = 'request-metadata';
			title = this.translateService.instant('QUICK.MENU.BOTTOM.MENU6', '메타데이터 수정/보완 요청');
			desc = this.translateService.instant('QUICK.MENU.BOTTOM.MENU6.DESC', '');
		}

		this.showReqPopup(title, desc);
	}

	/**
	 * 요청 팝업 취소 클릭
	 */
	public requestPopupCancelClick() {
		this.dialogService.confirm(
			this.translateService.instant('COMMON.CANCEL', '취소'),
			this.translateService.instant('COMMON.MESSAGE.CONFIRM.WRITE.CANCEL', '취소'),
			null,
			this.translateService.instant('COMMON.CANCEL', '취소'),
			this.translateService.instant('COMMON.CONFIRM', '확인'),
			() => {
				this.logger.debug('cancel');
			},
			() => {
				this.showRequestPopup = false;
			});
	}

	/**
	 * 요청 팝업 등록 클릭
	 */
	public requestPopupCreateClick() {

		if (Validate.isEmpty(this.requestTitle) || Validate.isEmpty(this.requestContent)) {
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		let post = new Community.Post();
		post.title = this.requestTitle;
		post.contentType = 'HTML';
		post.content = this.communityService.contentToEditorText(this.requestContent);

		this.communityService.createPost(this.currentSlug, post).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
				this.showRequestPopup = false;

				// 글 등록 이벤트
				this.createPost.emit();
			} else {
				Alert.error(this.translateService.instant('COMMON.MESSAGE.ERROR', '오류'));
			}
		});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private initialize(): void {

		const permission: PagePermission = this.layoutService.getPagePermissionByIACode(this.layoutService.iaCodes.communityIaCode);
		if (permission.permission < PERMISSION_CODE.RW || _.isUndefined(permission.permission)) {
			this.showRequest = false;
			if (permission.permission < PERMISSION_CODE.RO || _.isUndefined(permission.permission)) {
				this.showCommunity = false;
			} else {
				this.showCommunity = true;
			}
		} else {
			this.showRequest = true;
			this.showCommunity = true;
		}

		this.menus = [
			{ clicked: true, title: this.translateService.instant('QUICK.MENU.TOP.MENU1'), children: [] },
			{ clicked: false, title: this.translateService.instant('QUICK.MENU.TOP.MENU2'), children: [] },
			{ clicked: false, title: this.translateService.instant('QUICK.MENU.TOP.MENU3'), children: [] }
		];

		this.langList = [
			{ code: 'ko', label: this.translateService.instant('QUICK.MENU.LANGUAGE.KOR', '한국어') },
			{ code: 'en', label: this.translateService.instant('QUICK.MENU.LANGUAGE.ENG', 'English') }
		];

		const currentLang = this.cookieService.get(CookieConstant.KEY.LANGUAGE);
		this.currentLang = currentLang == 'en' ? this.langList[ 1 ] : this.langList[ 0 ];

		this.isOpenLang = false;

		this.getList();

		this.show.emit(this.isShow);
	}

	/**
	 * 목록 조회(내가 작성한 글/댓글)
	 */
	private getList() {

		// 내가 작성한 글 목록 조회
		this.communityService.getMyPostList().then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.myPostList = result.data.postList.map(value => {
					return {
						content: value.title,
						date: moment(value.createdDate).format('YYYY-MM-DD HH:mm'),
						url: `view${value.master.prePath}/${value.master.slug}/post/${value.id}`
					}
				});
				this.menus[ 0 ][ 'children' ] = this.myPostList;
			}
		});

		// 내가 작성한 댓글 목록 조회
		this.communityService.getMyCommentList().then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.myCommentList = result.data.postReplyList.map(value => {
					return {
						content: value.content,
						date: moment(value.createdDate).format('YYYY-MM-DD HH:mm'),
						url: `view${value.prePath}/${value.slug}/post/${value.postId}`
					}
				});
				this.menus[ 1 ][ 'children' ] = this.myCommentList;
			}
		});

		// 내가 작성한 글의 댓글 목록 조회
		this.communityService.getMyPostCommentList().then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.myPostCommentList = result.data.postReplyList.map(value => {
					return {
						content: value.content,
						date: moment(value.createdDate).format('YYYY-MM-DD HH:mm'),
						createdBy: (value.createdBy ? value.createdBy.userNm : '') + (value.createdBy.orgNm ? `(${value.createdBy.orgNm})` : ''),
						url: `view${value.prePath}/${value.slug}/post/${value.postId}`
					}
				});
				this.menus[ 2 ][ 'children' ] = this.myPostCommentList;
			}
		});
	}

	/**
	 * 요청 팝업 show
	 */
	private showReqPopup(popupTitle: string, desc: string) {
		this.requestPopupTitle = popupTitle;
		this.requestPopupDesc = desc;
		this.requestTitle = '';
		this.requestContent = '';
		this.showRequestPopup = true;

		this.communityService.getMaster(this.currentSlug).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				if (result.data.master.templates && result.data.master.templates.length) {
					this.requestContent = result.data.master.templates[0].template;
				}
			}
		});
	}
}
