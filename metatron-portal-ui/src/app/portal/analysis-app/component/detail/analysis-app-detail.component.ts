import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {CookieService} from 'ng2-cookies';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Page, Sort} from '../../../common/value/result-value';
import {Role} from '../../../common/value/role';
import {SelectValue} from '../../../../common/component/select/select.value';
import {AnalysisApp} from '../../value/analysis-app.value';
import {Code} from '../../../common/value/code';
import {ImageList} from '../../../../common/component/image-list/image-list.value';
import {DialogService} from '../../../../common/component/dialog/dialog.service';
import {AnalysisAppService} from '../../service/analysis-app.service';
import {SessionInfo} from '../../../common/service/session-info.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Alert} from '../../../../common/util/alert-util';
import {Validate} from '../../../../common/util/validate-util';
import {Media} from '../../../common/value/media';
import {environment} from '../../../../../environments/environment';
import {CookieConstant} from '../../../common/constant/cookie-constant';
import {Loading} from '../../../../common/util/loading-util';
import {RoleService} from '../../../common/service/role.service';
import {PERMISSION_CODE} from '../../../common/value/page-permission';
import {Utils} from '../../../../common/util/utils';
import {UserService} from '../../../common/service/user.service';
import * as _ from 'lodash';

enum AppAuth {
	ENABLE,
	DISABLE,
	ADDED
}

@Component({
	selector: 'analysis-app-detail',
	templateUrl: './analysis-app-detail.component.html'
})
export class AnalysisAppDetailComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private pageable: Page;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	AppAuth = AppAuth;

	// 앱 ID
	public appId: string;

	// 선택한 이미지
	public currentImageUrl: string;

	// 신청 할 수 있는 권한 목록(앱에 대한 권한)
	public otherRoleList: Role[];
	public otherRoleLabelValueList: SelectValue[];
	// 권한 신청 팝업 show/hide
	public showRequestRolePopup: boolean = false;
	// 관리자 여부
	public isAdmin: boolean = false;
	// 답변 등록 가능 여부
	public enableAnswer: boolean = false;
	// 앱 등록이 안되어 있을 때 추가 가능한지 여부
	public acceptableApp: boolean;

	// 앱 상세
	public analysisApp: AnalysisApp.Entity = new AnalysisApp.Entity();
	// 앱 카테고리 목록
	public categories: Array<Code.Entity>;
	// 이미지 목록
	public imageList: Array<ImageList>;

	// 리뷰 목록
	public reviews: Array<AnalysisApp.Review>;
	// 리뷰 작성폼 show/hide
	public showReviewForm: boolean;
	// 작성폼 text
	public reviewText: string;
	// 앱 카테고리 목록(구분자 ',' string)
	public categoryNames: string;

	// 인기 앱 목록
	public addAppList: Array<AnalysisApp.Entity>;
	// 신규 앱 목록
	public latestAppList: Array<AnalysisApp.Entity>;

	// 리뷰 최대 글자 수
	public maxReviewLength: number = 1000;

	// 앱 권한 상태(ADDED, ENABLE, DISABLE)
	public appAuth: AppAuth;
	// 전체 카테고리 목록
	public totalCategories: Array<Code.Entity>;

	// 리뷰 마지막 페이지 여부
	public isLastReview: boolean;
	// 리뷰 총 건 수
	public totalReviewCnt: number;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				public dialogService: DialogService,
				public analysisAppService: AnalysisAppService,
				private cookieService: CookieService,
				public userService: UserService,
				public sessionInfo: SessionInfo,
				private roleService: RoleService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		super.ngOnInit();

		// Admin 체크
		if (this.gnbService.permission.permission == PERMISSION_CODE.SA) {
			this.isAdmin = true;

			// 답변 가능한지 체크
			this.checkEnableAnswer();
		}

		this.subscriptions.push(
			this.activatedRoute
				.params
				.subscribe(params => {
					if (params[ 'appId' ]) {
						this.appId = params[ 'appId' ];
						this.init();
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
	 * 초기화
	 */
	public init() {
		Loading.show();

		this.analysisAppService
			.getDetail(this.appId)
			.then(result => {
				// scroll to top
				window.scrollTo(0, 0);

				this.analysisApp = result.data.analysisApp;

				// 앱 권한
				if (result.data.isAddedMyApp) {
					this.appAuth = AppAuth.ADDED;
				} else if (result.data.acceptableApp) {
					this.appAuth = AppAuth.ENABLE;
				} else {
					this.appAuth = AppAuth.DISABLE;
				}
				this.acceptableApp = result.data.acceptableApp;

				// 이미지 목록
				if (this.analysisApp.mediaGroup) {
					const medias = this.analysisApp.mediaGroup.medias;
					this.imageList = [];
					for (let i = 0; i < medias.length; i++) {
						const item = this.createImageItem(medias[ i ]);
						this.imageList.push(item);
					}
				}

				// 카테고리 목록
				this.categories = this.analysisApp.categories;
				this.categoryNames = this.categories.map(function (elem) {
					return '# ' + elem.nmKr;
				}).join(' ');

				// 사용자 추가 앱 탑3
				this.addAppList = result.data.addAppList;
				// 최신 앱 리스트
				this.latestAppList = result.data.latestAppList;

				// 답변 가능한지 체크
				this.checkEnableAnswer();

				// 태깅
				this.tagging(this.TaggingType.DETAIL, this.TaggingAction.VIEW, this.analysisApp.id, this.analysisApp.appNm);

				Loading.hide();
			});

		// 카테고리 목록 조회
		this.codeService
			.getCodesByGrpCdKey('GC0000004')
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.totalCategories = result.data.codeList;
				}
			});

		// 리뷰 목록 조회
		this.pageReset();
		this.getReviewList(true);
	}

	/**
	 * 권한 신청 클릭
	 */
	public requestAuthClick() {

		this.showRequestRolePopup = true;
	}

	/**
	 * 신청하기 클릭(권한 팝업)
	 */
	public requestRoleClick() {
		this.roleService.requestAppRole('ANALYSIS_APP', this.appId).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
			} else {
				Alert.error(this.translateService.instant('ANALYSIS.APP.DETAIL.ROLE.POPUP.ALREADY', '권한 신청을 할 수 없습니다.'));
			}
			this.showRequestRolePopup = false;
		})
	}

	/**
	 * 마이앱에서 삭제 클릭
	 */
	public appDeleteClick() {
		this.dialogService.confirm(
			this.translateService.instant('COMMON.DELETE', '삭제'),
			this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제'),
			null,
			this.translateService.instant('COMMON.CANCEL', '취소'),
			this.translateService.instant('COMMON.CONFIRM', '확인'),
			() => {
				this.logger.debug('cancel');
			},
			() => {
				this.analysisAppService.deleteMyApp(this.appId).then(result => {
					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
						Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
						this.appAuth = this.acceptableApp ? AppAuth.ENABLE : AppAuth.DISABLE;
						this.analysisApp.usage--;

						// LNB 메뉴 데이터 다시 생성
						this.layoutService.createDataSetUsedByLnb();
					}
				})
			});
	}

	/**
	 * 앱 실행 클릭
	 */
	public appExecClick() {

		if (this.analysisApp.externalYn && _.isUndefined(this.analysisApp.urlHeader) === false) {
			window.open(this.analysisApp.urlHeader.navigation, this.analysisApp.id);
			return;
		}

		this.router.navigate([ `view/analysis-app/my-app/${this.analysisApp.id}` ]);
	}

	/**
	 * 앱 추가 클릭
	 */
	public appAddClick() {
		this.analysisAppService.addMyApp(this.appId).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
				this.appAuth = AppAuth.ADDED;
				this.analysisApp.usage++;
				this.reCreateLnbDataSet();
			} else {
				Alert.error(this.translateService.instant('COMMON.MESSAGE.ERROR', '오류'));
			}
		});
	}

	/**
	 * Thumbnail 이미지 클릭
	 */
	public imageClick(item: ImageList) {
		this.currentImageUrl = item.image;
	}

	/**
	 * 리뷰 작성 취소 클릭
	 */
	public reviewCreateCancelClick() {
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
				this.showReviewForm = false;
				this.reviewText = '';
			});
	}

	/**
	 * 리뷰 작성 클릭
	 */
	public reviewCreateClick() {
		if (Validate.isEmpty(this.reviewText)) {
			Alert.warning(this.translateService.instant('ANALYSIS.APP.DETAIL.REVIEW.VALID.EMPTY', '내용을 입력하세요'));
			return;
		}

		let review = new AnalysisApp.Review();
		review.contents = this.reviewText;
		this.analysisAppService.createReview(this.appId, review).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.reviewText = '';
				this.showReviewForm = false;

				Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));

				this.pageable.number = 0;
				this.pageable.size = this.pageable.totalElements + 1;
				this.getReviewList(true);
			} else {
				Alert.error(this.translateService.instant('COMMON.MESSAGE.ERROR', '오류'));
			}
		});
	}

	/**
	 * 리뷰 취소 클릭
	 */
	public reviewCancelClick(item: AnalysisApp.Review) {
		item.openMenu = false;
		item.isView = true;
		item.contents = item.originContents;
	}

	/**
	 * 리뷰 저장 클릭
	 */
	public reviewSaveClick(item: AnalysisApp.Review) {
		item.openMenu = false;
		this.analysisAppService.updateReview(item).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));
				item.isView = true;
			} else {
				Alert.error(this.translateService.instant('COMMON.MESSAGE.ERROR', '오류'));
			}
		});
	}

	/**
	 * 리뷰/답변 삭제 클릭
	 */
	public reviewDeleteClick(item: AnalysisApp.Review) {
		item.openMenu = false;
		this.dialogService.confirm(
			this.translateService.instant('COMMON.DELETE', '삭제'),
			this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제'),
			null,
			this.translateService.instant('COMMON.CANCEL', '취소'),
			this.translateService.instant('COMMON.CONFIRM', '확인'),
			() => {
				this.logger.debug('cancel');
			},
			() => {
				item.showReply = false;
				this.analysisAppService.deleteReview(item).then(result => {
					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
						Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));

						this.getReviewList(true);
					} else {
						Alert.error(this.translateService.instant('COMMON.MESSAGE.ERROR', '오류'));
					}
				});
			});
	}

	/**
	 * 답변 취소 클릭
	 */
	public replyCancelClick(item: AnalysisApp.Review) {
		item.openMenu = false;
		if (!item.id) {
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
					item.showReply = false;
					item.contents = item.originContents;
				});
		} else {
			item.isView = true;
			item.contents = item.originContents;
		}
	}

	/**
	 * 답변 저장 클릭
	 */
	public replySaveClick(item: AnalysisApp.Review) {
		item.openMenu = false;
		if (!item.id) {
			this.analysisAppService.createReview(this.appId, item).then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));

					let newItem = result.data.review;
					newItem.isMine = true;
					newItem.isView = true;
					newItem.showReply = true;

					const parent = item.parent;
					parent.children = [];
					parent.children.push(newItem);

				} else {
					Alert.error(this.translateService.instant('COMMON.MESSAGE.ERROR', '오류'));
				}
			});
		} else {
			this.analysisAppService.updateReview(item).then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));
					item.isView = true;
				} else {
					Alert.error(this.translateService.instant('COMMON.MESSAGE.ERROR', '오류'));
				}
			});
		}

	}

	/**
	 * 리뷰 더보기 클릭
	 */
	public reviewListMoreClick() {
		this.pageable.number++;
		this.getReviewList();
	}

	/**
	 * 카테고리 선택
	 */
	public selectCategory(item: Code.Entity) {
		if (item.id) {
			this.router.navigate([ `/view/analysis-app` ], { queryParams: { category: item.id } });
		} else {
			this.router.navigate([ `/view/analysis-app` ]);
		}
	}

	/**
	 * 앱 클릭
	 */
	public appClick(item: AnalysisApp.Entity) {
		if (item.id) {
			this.logger.debug(`view/analysis-app/${item.id}`);
			this.router.navigate([ `view/analysis-app/${item.id}` ]);
		}
	}

	/**
	 * 스크롤 이동
	 */
	public scrollTo(target) {
		const targetTop = this.jQuery(target).offset().top - 50;
		const headerHeight = this.jQuery('.layout-header').height();

		this.jQuery('html, body').animate({
			scrollTop: targetTop - headerHeight
		}, 500);
	}

	public commentToHTML(comment: string) {
		return comment ? comment.replace(/\n/gi, '<br>') : '';
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * \n - <br>
	 * \t - &nbsp;&nbsp;&nbsp;&nbsp;
	 * space - &nbsp;
	 * 로 치환
	 *
	 * @param text
	 */
	public lineBreakOrTabOrSpaceCharacter(text: string): string {
		return Utils.EscapeUtil.urlToLink(Utils.EscapeUtil.lineBreakOrTabOrSpaceCharacter(text));
	}

	/**
	 * 목록 보기
	 */
	public listViewClick() {
		this.router.navigate([ 'view/analysis-app' ]);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * image list item 생성
	 */
	private createImageItem(media: Media.Entity): ImageList {
		const imageUrl = `${environment.apiUrl}/media/${media.id}`;
		let imageItem = new ImageList(imageUrl, `${imageUrl}/t`, media.name, null);
		return imageItem;
	}

	/**
	 * 리뷰 목록 조회
	 */
	private getReviewList(isInit: boolean = false) {
		this.analysisAppService
			.getReviews(this.appId, this.pageable)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					if (isInit) {
						this.reviews = [];
					}

					const userId = this.cookieService.get(CookieConstant.KEY.USER_ID);
					this.pageable = result.data.reviewList;
					this.reviews = this.reviews.concat(result.data.reviewList.content);
					this.totalReviewCnt = this.pageable.totalElements;

					for (let i = 0; i < this.reviews.length; i++) {
						let review = this.reviews[ i ];
						// 내가 쓴 글 인지 여부
						review.isMine = review.user.userId === userId;
						// 수정 취소 시 되돌리기용
						review.originContents = review.contents;

						// 등록된 답변이 없을 경우 화면 표현을 위해 데이터를 생성해야 한다
						if (!this.reviews[ i ].children.length) {
							let reply = new AnalysisApp.Review();
							reply.user = this.sessionInfo.user;
							reply.parent = this.reviews[ i ];
							this.reviews[ i ].children.push(reply);
						} else {
							let reply = this.reviews[ i ].children[ 0 ];
							// 내가 쓴 글인지 여부
							reply.isMine = reply.user.userId === userId;
							// 수정 취소 시 되돌리기용
							reply.originContents = reply.contents;
						}
					}

					// 리뷰 마지막 페이지 여부
					if (this.pageable.totalElements == 0 || this.pageable.totalPages == this.pageable.number + 1) {
						this.isLastReview = true;
					} else {
						this.isLastReview = false;
					}
				}
			})
	}

	// 페이지 초기화
	private pageReset() {
		this.pageable = new Page();
		// 현재 페이지
		this.pageable.number = 0;
		// 페이지 사이즈
		this.pageable.size = 10;
		this.pageable.sort = new Sort();
		// sort
		this.pageable.sort.property = 'createdDate';
		// sort
		this.pageable.sort.direction = 'desc';
	}

	// 답변 가능한지 여부
	private checkEnableAnswer() {
		const userId = this.cookieService.get(CookieConstant.KEY.USER_ID);
		if ((this.analysisApp.createdBy && userId === this.analysisApp.createdBy.userId) || this.isAdmin) {
			this.enableAnswer = true;
		}
	}

	/**
	 * LNB 에서 사용하는 데이터 셋 재생성
	 */
	private reCreateLnbDataSet(): void {
		this.layoutService.createDataSetUsedByLnb();
	}
}
