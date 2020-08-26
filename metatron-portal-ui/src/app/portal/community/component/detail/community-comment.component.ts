import {
	Component,
	ElementRef,
	EventEmitter,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	SimpleChanges,
	ViewChild,
	ViewChildren
} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {TranslateService} from 'ng2-translate';
import {CommunityService} from '../../service/community.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Community} from '../../value/community.value';
import {Validate} from '../../../../common/util/validate-util';
import {DialogService} from '../../../../common/component/dialog/dialog.service';
import {Alert} from '../../../../common/util/alert-util';
import {Loading} from '../../../../common/util/loading-util';
import {FileFieldComponent} from '../../../common/file-upload/component/file-field.component';
import {FileUploadService} from '../../../common/file-upload/service/file-upload.service';
import {PERMISSION_CODE} from '../../../common/value/page-permission';
import {Utils} from '../../../../common/util/utils';
import {UserService} from '../../../common/service/user.service';
import {User} from "../../../common/value/user";

@Component({
	selector: '[community-comment]',
	templateUrl: './community-comment.component.html'
})
export class CommunityCommentComponent extends AbstractComponent implements OnInit, OnDestroy, OnChanges {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChildren('commentFileUploader')
	private fileUploaderList: QueryList<ElementRef>;

	@ViewChild('commentWriteFileUploader')
	private commentWriteFileUploader: FileFieldComponent;

	private fileUploader: FileFieldComponent;

	private files: Array<Object>;

	private comment: Community.Comment;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Input()
	public post: Community.Post;

	// master 정보
	public master: Community.Master;
	// 댓글 목록
	public commentList: Community.Comment[];
	// 등록 댓글
	public writeComment: Community.Comment = new Community.Comment();

	@Output()
	public postStatusChange: EventEmitter<Object> = new EventEmitter();

	public enableCreate: boolean;

	public PostType: typeof Community.PostType = Community.PostType;

	public Status: typeof Community.Status = Community.Status;
	public RequestType: typeof Community.RequestType = Community.RequestType;

	public isAdmin: boolean = false;

	public showDeletePopup: boolean;
	public deleteStatus: Community.Status;
	public currentDeleteComment: Community.Comment;

	// 담당자 팝업 show/hide
	public isOpenWorkerSelectPopup: boolean;
	// 처리자 팝업 show/hide
	public isOpenCoworkerSelectPopup: boolean;

	// 멀티 셀렉트 여부
	public isUserMultipleSelectMode: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				public communityService: CommunityService,
				public userService: UserService,
				private dialogService: DialogService,
				private fileUploadService: FileUploadService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		super.ngOnInit();

		if (this.gnbService.permission.permission >= PERMISSION_CODE.RW) {
			this.enableCreate = true;
		} else {
			this.enableCreate = false;
		}

		if (this.gnbService.permission.permission == PERMISSION_CODE.SA) {
			this.isAdmin = true;
		} else {
			this.isAdmin = false;
		}
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		for (let propName in changes) {
			if (propName === 'post') {
				if (this.post && this.post.master) {
					this.master = this.post.master;

					// 댓글 목록 조회
					this.getCommentList();
				}
			}
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 댓글 수정 메뉴 클릭
	 * @param {Community.Comment} comment
	 * @param {number} index
	 */
	public commentChangeMenuClick(comment: Community.Comment, index: number) {
		comment.openMenu = false;

		comment.isView = false;
		this.fileUploaderList[ '_results' ][ index ].setUploadedFileList(comment.fileGroup);
	}

	/**
	 * 댓글 삭제 메뉴 클릭
	 * @param {Community.Comment} comment
	 */
	public commentDeleteMenuClick(comment: Community.Comment) {
		comment.openMenu = false;

		if (this.master.postType == Community.PostType.WORKFLOW && this.isAdmin && comment.status != Community.Status.COMMENT) {
			this.showDeletePopup = true;
			this.deleteStatus = Community.Status.NONE;
			this.currentDeleteComment = comment;
		} else {
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
						this.communityService.deleteComment(this.master.slug, this.post.id, comment.id).then(result => {
							this.getCommentList(true);
						});
					});
		}
	}

	/**
	 * 삭제 팝업에서 삭제 클릭
	 */
	public commentDeleteConfirmClick() {
		this.showDeletePopup = false;
		let completeType;
		if (this.deleteStatus == Community.Status.COMPLETED || this.deleteStatus == Community.Status.COMPLETED_CANCEL) {
			if (this.master.secondaryType == Community.RequestType.NORMAL) {
				if (this.deleteStatus == Community.Status.COMPLETED) {
					completeType = this.translateService.instant('COMMUNITY.STATUS.COMPLETED.TYPE1', '개발완료');
				} else {
					completeType = this.translateService.instant('COMMUNITY.STATUS.COMPLETED.TYPE2', '대안제시/미수용');
				}
			} else {
				if (this.deleteStatus == Community.Status.COMPLETED) {
					completeType = this.translateService.instant('COMMUNITY.STATUS.COMPLETED.TYPE3', '수정보완');
				} else {
					completeType = this.translateService.instant('COMMUNITY.STATUS.COMPLETED.TYPE4', '결과확인/설명');
				}
			}
		}

		this.deleteStatus = this.deleteStatus == Community.Status.COMPLETED_CANCEL ? Community.Status.COMPLETED : this.deleteStatus;
		this.communityService.deleteComment(this.master.slug, this.post.id, this.currentDeleteComment.id, this.deleteStatus != Community.Status.NONE ? this.deleteStatus : null).then(result => {
			if (this.deleteStatus != Community.Status.NONE) {
				this.post.status = this.deleteStatus;
				if (this.post.status == Community.Status.COMPLETED) {
					// 완료 상태 일 경우 댓글 등록에 텍스트 표시를 위한
					this.post.completeType = completeType;
				}

				// 상세 쪽에 상태 알림(상세화면에서 표시하기 위함)
				this.postStatusChange.emit(this.post.status);
			}

			this.getCommentList(true);
		});
	}

	/**
	 * 댓글 수정 클릭
	 * @param {Community.Comment} comment
	 */
	public commentModifyClick(comment: Community.Comment, index: number) {
		if (Validate.isEmpty(comment.content)) {
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', 'COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION'));

			comment.isError = true;
			return;
		}

		Loading.show();

		this.comment = comment;
		this.fileUploader = this.fileUploaderList[ '_results' ][ index ];

		this.setUploadList();
		this.deleteFiles();
	}

	/**
	 * 댓글 수정 취소 클릭
	 * @param {Community.Comment} comment
	 */
	public commentModifyCancelClick(comment: Community.Comment) {
		this.dialogService
			.confirm(
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMUNITY.CONFIRM.SAVE.CANCEL.CONTENT1', '작성중인 내용이 있습니다.<br>취소하시면 작성 중인 내용이 사라집니다.'),
				this.translateService.instant('COMMUNITY.CONFIRM.SAVE.CANCEL.CONTENT2', '취소하시겠습니까?'),
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.CONFIRM', '확인'),
				() => {
					this.logger.debug(`취소 클릭`);
				},
				() => {
					comment.isView = true;
					comment.content = comment.originContent;
					comment.isError = false;
				});
	}

	/**
	 * 댓글 등록 클릭
	 */
	public commentCreateClick() {
		if (Validate.isEmpty(this.writeComment.content)) {
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', 'COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION'));

			this.writeComment.isError = true;
			return;
		}

		Loading.show();

		this.comment = this.writeComment;
		this.fileUploader = this.commentWriteFileUploader;

		this.setUploadList();
		this.deleteFiles();
	}

	/**
	 * \n - <br>
	 * \t - &nbsp;&nbsp;&nbsp;&nbsp;
	 * space - &nbsp;
	 * 로 치환
	 *
	 * @param text
	 */
	public lineBreakOrTabOrSpaceCharacter(text: string): string {
		let txt = Utils.EscapeUtil.lineBreakOrTabOrSpaceCharacter(text);
		txt = Utils.EscapeUtil.urlToLink(txt);
		return txt;
	}

	/**
	 * 유저 선택 완료
	 */
	public doneUserSelectPopup(users: User.Entity[]): void {

		if (this.isOpenWorkerSelectPopup) {
			this.post.worker = users[ 0 ];
			this.isOpenWorkerSelectPopup = false;
		} else {
			this.post.coworkers = users;
			this.isOpenCoworkerSelectPopup = false;
		}

		if (this.post.worker) {
			this.post.workerId = this.post.worker.userId;
		}
		this.post.coworkerIds = Array.from(this.post.coworkers).map(value => {
			return value.userId;
		});

		this.communityService.updateWorker(this.master.slug, this.post).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY'));
			}
		});
	}

	/**
	 * 유저 선택 팝업 닫기
	 */
	public closeUserSelectPopup() {
		this.isOpenWorkerSelectPopup = false;
		this.isOpenCoworkerSelectPopup = false;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 댓글 조회
	 */
	private getCommentList(refresh: boolean = false) {
		if (!this.master || !this.post) {
			return;
		}
		this.communityService.getCommentList(this.master.slug, this.post.id).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				let commentList = result.data.postReplyList;
				Array.from(commentList).forEach(value => {
					value.isView = true;
					value.isMine = (this.sessionInfo.getUser().userId == value.createdBy.userId && this.gnbService.permission.permission >= PERMISSION_CODE.RW) || PERMISSION_CODE.SA == this.gnbService.permission.permission ? true : false;
					value.openMenu = false;
					value.originContent = value.content;
				});

				this.commentList = commentList;

				if (refresh && this.commentList.length == 0) {
					this.post.status = Community.Status.REQUESTED;
					// 상세 쪽에 상태 알림(상세화면에서 표시하기 위함)
					this.postStatusChange.emit(this.post.status);
				}
			}
		});
	}

	/**
	 * 첨부파일 업로드
	 */
	private uploadFile() {
		if (!this.files || !this.files.length) {
			this.saveComment();
			return;
		}

		const fileGroupId = this.comment.fileGroup ? this.comment.fileGroup.id : null;
		this.fileUploadService.uploadFile('community', this.files[ 0 ], fileGroupId).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.comment.fileGroup = result.data.fileGroup;
				this.files.splice(0, 1);
				this.uploadFile();
			}
		});
	}

	/**
	 * 첨부파일 삭제
	 */
	private deleteFiles() {
		if (this.fileUploader.deleteFileList && this.fileUploader.deleteFileList.length) {
			this.fileUploadService.deleteFile(this.fileUploader.deleteFileList, this.comment.fileGroup.id).then(result => {
				this.uploadFile();
			});
		} else {
			this.uploadFile();
		}
	}

	/**
	 * 댓글 등록
	 */
	private saveComment() {
		// 종결일 경우 종결 타입 set
		if (this.comment.status == Community.Status.COMPLETED) {
			if (this.master.secondaryType == Community.RequestType.NORMAL) {
				if (this.post.status == Community.Status.PROGRESS) {
					this.comment.completeType = this.translateService.instant('COMMUNITY.STATUS.COMPLETED.TYPE1', '개발완료');
				} else {
					this.comment.completeType = this.translateService.instant('COMMUNITY.STATUS.COMPLETED.TYPE2', '대안제시/미수용');
				}
			} else {
				if (this.post.status == Community.Status.PROGRESS) {
					this.comment.completeType = this.translateService.instant('COMMUNITY.STATUS.COMPLETED.TYPE3', '수정보완');
				} else {
					this.comment.completeType = this.translateService.instant('COMMUNITY.STATUS.COMPLETED.TYPE4', '결과확인/설명');
				}
			}
		}

		if (this.comment.id) {
			this.communityService.updateComment(this.master.slug, this.post.id, this.comment).then(result => {
				this.getCommentList();

				Loading.hide();
			});
		} else {
			this.communityService.createComment(this.master.slug, this.post.id, this.comment).then(result => {
				this.writeComment = new Community.Comment();
				this.fileUploader.removeAll();
				this.getCommentList();

				// 상태 변경 알림
				if (this.master.postType == Community.PostType.WORKFLOW && this.comment.status && this.comment.status != Community.Status.COMMENT) {
					this.post.status = this.comment.status;
					if (this.post.status == Community.Status.COMPLETED) {
						// 완료 상태 일 경우 댓글 등록에 텍스트 표시를 위한
						this.post.completeType = this.comment.completeType;
					}
					// 상세 쪽에 상태 알림(상세화면에서 표시하기 위함)
					this.postStatusChange.emit(this.comment.status);
				}

				Loading.hide();
			});
		}

	}

	/**
	 * 업로드 목록 세팅
	 */
	private setUploadList() {
		this.files = [];
		Array.from(this.fileUploader.files).forEach(value => {
			if (value.file.type != 'O') {
				this.files.push(value.file);
			}
		});
	}

}
