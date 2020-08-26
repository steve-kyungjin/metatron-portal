import {Component, ElementRef, Injector, OnDestroy, OnInit} from "@angular/core";
import {AbstractComponent} from "../../../common/component/abstract.component";
import {TranslateService} from "ng2-translate";
import {CommunityService} from "../../service/community.service";
import {CommonConstant} from "../../../common/constant/common-constant";
import {Community} from "../../value/community.value";
import {environment} from "../../../../../environments/environment";
import {DialogService} from "../../../../common/component/dialog/dialog.service";
import {Alert} from "../../../../common/util/alert-util";
import {User} from "../../../common/value/user";
import {PERMISSION_CODE} from "../../../common/value/page-permission";
import {Loading} from "../../../../common/util/loading-util";
import {UserService} from "../../../common/service/user.service";

@Component({
	selector: 'community-detail',
	templateUrl: './community-detail.component.html'
})
export class CommunityDetailComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public post: Community.Post;

	public master: Community.Master;

	public slug: string;

	public postId: string;

	public editorText: string;

	// 수정 가능 여부
	public enableEdit: boolean;
	// 삭제 가능 여부
	public enableDelete: boolean;

	public PostType: typeof Community.PostType = Community.PostType;
	public Status: typeof Community.Status = Community.Status;
	public RequestType: typeof Community.RequestType = Community.RequestType;

	// 이미지 상세 팝업 show/hide
	public showDetailImage: boolean = false;
	public detailImageTypeMin: boolean = false;
	public detailImageTypeMax: boolean = false;
	// 이미지 상세 src
	public detailImageSrc: string;

	public isAdmin: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private communityService: CommunityService,
				public userService: UserService,
				private dialogService: DialogService) {
		super(elementRef, injector);

		this.post = new Community.Post();
		this.post.createdBy = new User.Entity();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		super.ngOnInit();

		if (this.gnbService.permission.permission == PERMISSION_CODE.SA) {
			this.isAdmin = true;
		} else {
			this.isAdmin = false;
		}

		this.subscriptions.push(
			this.activatedRoute
				.params
				.subscribe(params => {
					if (params[ 'slug' ]) {
						this.slug = params[ 'slug' ];
					}
					if (params[ 'postId' ]) {
						this.postId = params[ 'postId' ];
					}

					Loading.show();
					this.communityService.getPostDetail(this.slug, this.postId).then(result => {
						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
							this.post = result.data.post;
							this.master = this.post.master;
							this.editorText = result.data.post.content;

							// 권한 체크
							if ((this.gnbService.permission.permission == PERMISSION_CODE.RW && this.post.createdBy.userId == this.sessionInfo.getUser().userId) || this.gnbService.permission.permission == PERMISSION_CODE.SA) {
								this.enableEdit = true;
								this.enableDelete = true;
							} else {
								this.enableEdit = false;
								this.enableDelete = false;
							}

							this.post.imageUrl = this.getPostImage(this.post);
							this.post.className = this.communityService.getStatus(this.post);

							// 태깅
							this.tagging(this.TaggingType.DETAIL, this.TaggingAction.VIEW, this.post.id, this.post.title);
						}

						Loading.hide();
					});
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
	 * 목록 보기 클릭
	 */
	public listViewClick() {
		this.router.navigate([ `view${this.master.prePath}/${this.slug}` ]);
	}

	/**
	 * 포스트 수정 클릭
	 */
	public postEditClick() {
		this.router.navigate([ `view${this.master.prePath}/${this.slug}/post/${this.postId}/edit` ]);
	}

	/**
	 * 포스트 삭제 클릭
	 */
	public postDeleteClick() {
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
					this.communityService.deletePost(this.slug, this.postId).then(result => {
						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
							Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE'));

							// LNB 메뉴 데이터 다시 생성
							this.layoutService.createDataSetUsedByLnb();

							this.router.navigate([ `view${this.master.prePath}/${this.slug}` ]);
						}
					});
				});
	}

	/**
	 * 댓글에서 상태 변경
	 * @param status
	 */
	public postStatusChange(status: Community.Status) {
		this.post.status = status;
		this.post.className = this.communityService.getStatus(this.post);
	}

	/**
	 * 에디터에서 이미지 클릭
	 * @param obj
	 */
	public imageClickInEditor(obj) {
		this.showDetailImage = true;
		this.detailImageSrc = obj.currentSrc || obj.href;
		this.detailImageTypeMin = obj.naturalWidth < 300 && obj.naturalHeight < 300 ? true : false;
		this.detailImageTypeMax = obj.naturalWidth > 1200 && obj.naturalHeight > 600 ? true : false;
	}

	/**
	 * 이미지 상세 닫기
	 */
	public detailImageClose() {
		this.showDetailImage = false;
		this.showDetailImage = null
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * get image url
	 * @param {Community.Post} item
	 * @returns {any}
	 */
	private getPostImage(item: Community.Post) {
		if (item.mediaGroup && item.mediaGroup.medias) {
			return `${environment.apiUrl}/media/${item.mediaGroup.medias[ 0 ].id}/t`;
		}
		return '';
	}

}
