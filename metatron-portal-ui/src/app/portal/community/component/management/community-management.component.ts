import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AbstractComponent} from "../../../common/component/abstract.component";
import {TranslateService} from "ng2-translate";
import {CommunityService} from "../../service/community.service";
import {EditorComponent} from "../../../../common/component/editor/editor.component";
import {Community} from "../../value/community.value";
import {CommonConstant} from "../../../common/constant/common-constant";
import {Alert} from "../../../../common/util/alert-util";
import {DialogService} from "../../../../common/component/dialog/dialog.service";
import {Validate} from "../../../../common/util/validate-util";
import {FileFieldComponent} from "../../../common/file-upload/component/file-field.component";
import {File} from "../../../common/file-upload/value/file";
import {FileUploadService} from "../../../common/file-upload/service/file-upload.service";
import * as moment from "moment";
import {PERMISSION_CODE} from "../../../common/value/page-permission";
import {Loading} from "../../../../common/util/loading-util";
import {User} from "../../../common/value/user";
import {UserService} from "../../../common/service/user.service";
import {SelectValue} from "../../../../common/component/select/select.value";
import {AuthenticationSettingsComponent} from '../../../management/shared/authentication-settings/component/authentication-settings.component';

import * as _ from 'lodash';
import {RoleGroup} from "../../../common/value/role-group";

@Component({
	selector: 'community-management',
	templateUrl: './community-management.component.html'
})
export class CommunityManagementComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild('fileUploader')
	private fileUploader: FileFieldComponent;

	@ViewChild('imageUploader')
	private imageUploader: FileFieldComponent;

	@ViewChild(EditorComponent)
	private editor: EditorComponent;

	@ViewChild(AuthenticationSettingsComponent)
	private authenticationSettingsComponent: AuthenticationSettingsComponent;

	private files: Array<Object>;

	private images: Array<Object>;

	private minMaxDate: any;

	private beforeSelectedMenu: SelectValue;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public menuList: SelectValue[];

	public editorText: string;

	public isModify: boolean;

	public post: Community.Post;
	public master: Community.Master;

	public slug: string;

	public isValidateTitle: boolean = true;
	public isValidateContent: boolean = true;
	public isValidateDate: boolean = true;

	public PostType: typeof Community.PostType = Community.PostType;

	public isAdmin: boolean;

	public isOpenUserSelectPopup: boolean;
	public isOpenWorkerSelectPopup: boolean;
	public isOpenCoworkerSelectPopup: boolean;

	public isUserMultipleSelectMode: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private communityService: CommunityService,
				private dialogService: DialogService,
				private fileUploadService: FileUploadService,
				public userService: UserService) {
		super(elementRef, injector);

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

						this.post = new Community.Post();
						this.post.title = '';
						this.post.content = '';
						this.post.contentType = 'HTML';

						this.master = new Community.Master();

						this.slug = params[ 'slug' ];

						// 마스터 조회
						this.communityService.getMaster(this.slug).then(result => {
							if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
								this.master = result.data.master;

								// 권한 체크
								if ((this.gnbService.permission.permission < PERMISSION_CODE.RW && this.master.postType != Community.PostType.NOTICE) ||
									this.gnbService.permission.permission < PERMISSION_CODE.SA && this.master.postType == Community.PostType.NOTICE) {
									this.router.navigate([ 'view/error/403' ]);
									return;
								}

								if (this.master.postType == Community.PostType.NOTICE) {
									const self = this;
									this.minMaxDate = this.jQuery('#minMaxDate')
										.datepicker({
											language: 'ko',
											autoClose: true,
											class: 'dtp-datepicker',
											dateFormat: 'yyyy-mm-dd',
											navTitles: { days: 'yyyy<span>년&nbsp;</span> MM' },
											onHide: function () {},
											position: 'bottom left',
											timepicker: false,
											toggleSelected: false,
											range: true,
											multipleDatesSeparator: ' ~ ',
											onSelect: function (formattedDate, date, inst) {
												self.minMaxDateSelect();
											}
										})
										.data('datepicker');
								}

								// 게시글 이동을 위한 게시판 목록 조회
								if (this.master.postType == Community.PostType.WORKFLOW) {
									this.communityService.getMasterList(this.master.postType).then(result => {
										if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
											let list: SelectValue[] = [];
											Array.from(result.data.masterList).forEach(value => {
												let checked = value.slug == this.master.slug ? true : false;
												list.push(new SelectValue(value.name, value.slug, checked));
											});

											this.menuList = list;
										}
									});
								}




								// 권한 표시
								if ((typeof this.post.roles === 'undefined') === false) {

									let userRoles = [];
									let groupRoles = [];
									let orgRoles = [];
									this.post.roles.forEach(role => {
										if (role.type == RoleGroup.RoleGroupType.PRIVATE) {
											userRoles.push(role);
										} else if (role.type == RoleGroup.RoleGroupType.GENERAL) {
											groupRoles.push(role);
										} else if (role.type == RoleGroup.RoleGroupType.ORGANIZATION) {
											orgRoles.push(role);
										}
									});
									this.authenticationSettingsComponent.privateUserList = userRoles;
									this.authenticationSettingsComponent.groupList = groupRoles;
									this.authenticationSettingsComponent.organizationList = orgRoles;
									this.authenticationSettingsComponent.isRoleDefaultMode = userRoles.length === 0 && groupRoles.length === 0 && orgRoles.length === 0 ? 'true' : 'false';

								}






								if (params[ 'postId' ]) {
									// 수정

									this.post.id = params[ 'postId' ];
									this.isModify = true;

									Loading.show();

									this.communityService.getPostDetail(this.slug, this.post.id).then(result => {
										if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
											// 권한 체크
											if (this.gnbService.permission.permission < PERMISSION_CODE.SA && result.data.post.createdBy.userId != this.sessionInfo.getUser().userId) {
												this.router.navigate([ 'view/error/403' ]);
												return;
											}

											this.setPost(result.data.post);
										}

										Loading.hide();
									});
								} else {
									// 등록
									this.isModify = false;
									this.post.createdBy = this.sessionInfo.getUser();

									Loading.show();

									// 임시저장 조회
									this.communityService.getDraft(this.slug).then(result => {
										if (result.data.draft) {
											this.dialogService
												.confirm(
													this.translateService.instant('COMMUNITY.CONFIRM.DRAFT.TITLE', '임시저장'),
													this.translateService.instant('COMMUNITY.CONFIRM.DRAFT.CONTENT', '임시저장된 글이 있습니다.<br>새로 작성 시 임시저장된 글은 자동삭제 됩니다.'),
													null,
													this.translateService.instant('COMMUNITY.CONFIRM.DRAFT.CANCEL', '이어 작성하기'),
													this.translateService.instant('COMMUNITY.CONFIRM.DRAFT.CONFIRM', '새로 작성하기'),
													() => {
														this.setPost(result.data.draft);
													},
													() => {
														// 임시저장 삭제
														this.communityService.deleteDraft(this.slug).then(result => {

														});

														if (this.master.templates && this.master.templates.length) {
															this.editorText = this.communityService.contentToEditorText(this.master.templates[0].template);
														}
													});
										} else {
											if (this.master.templates && this.master.templates.length) {
												this.editorText = this.communityService.contentToEditorText(this.master.templates[0].template);
											}
										}

										Loading.hide();
									});
								}





							}
						});
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
	 * 이동할 게시판 선택
	 * @param item
	 */
	public beforeMenuSelect(items: SelectValue[]) {
		if (!this.isModify) {
			Array.from(items).forEach(value => {
				if (value.checked) {
					// 선택 원복할 item 저장
					this.beforeSelectedMenu = value;
				}
			});
		}
	}

	/**
	 * 이동할 게시판 선택
	 * @param item
	 */
	public menuSelect(item: SelectValue) {
		if (this.isModify) {
			this.post.changedSlug = item.value;
		} else {
			this.dialogService
				.confirm(
					this.translateService.instant('COMMON.CONFIRM', '확인'),
					this.translateService.instant('COMMUNITY.CONFIRM.CHANGE.SLUG.CONTENT1', '요청유형을 변경시 기존에 입력된 내용이 모두 삭제됩니다.'),
					this.translateService.instant('COMMUNITY.CONFIRM.CHANGE.SLUG.CONTENT2', '변경하시겠습니까?'),
					this.translateService.instant('COMMON.CANCEL', '취소'),
					this.translateService.instant('COMMON.CONFIRM', '확인'),
					() => {
						this.logger.debug(`취소 클릭`);

						// 선택 원복
						let menuList = _.cloneDeep(this.menuList);
						Array.from(menuList).forEach(value => {
							if (value.value == this.beforeSelectedMenu.value) {
								value.checked = true;
							} else {
								value.checked = false;
							}
						});
						this.menuList = menuList;
					},
					() => {
						this.slug = item.value;
						this.fileUploader.removeAll();
						this.imageUploader.removeAll();
						this.router.navigate([ `view${this.master.prePath}/${this.slug}/post/create` ]);
					});
		}
	}

	/**
	 * 취소 클릭
	 */
	public cancelClick() {

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
					if (this.post.id) {
						this.router.navigate([ `view${this.master.prePath}/${this.slug}/post/${this.post.id}` ]);
					} else {
						this.router.navigate([ `view${this.master.prePath}/${this.slug}` ]);
					}
				});
	}

	/**
	 * 임시 저장 클릭
	 */
	public saveDraftClick() {
		Loading.show();

		this.post.draft = true;

		this.setUploadList();
		this.deleteFiles();
	}

	/**
	 * 등록 클릭
	 */
	public createClick() {
		this.isValidateTitle = true;
		this.isValidateDate = true;

		if (Validate.isEmpty(this.post.title) || this.editor.isEmpty() ||
			(this.post.bannerYn && (!this.post.dispStartDate || !this.post.dispEndDate))) {
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', 'COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION'));

			if (Validate.isEmpty(this.post.title)) {
				this.isValidateTitle = false;
			}
			if (this.editor.isEmpty()) {
				this.editor.focus();
			}
			if (this.post.bannerYn && (!this.post.dispStartDate || !this.post.dispEndDate)) {
				this.isValidateDate = false;
			}

			return;
		}

		Loading.show();

		this.post.draft = false;

		this.setUploadList();
		this.deleteFiles();
	}

	/**
	 * 삭제 클릭
	 */
	public deleteClick() {
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
					this.communityService.deletePost(this.slug, this.post.id).then(result => {
						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
							Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE'));

							this.router.navigate([ `view${this.master.prePath}/${this.slug}` ]);
						}
					});
				});
	}

	/**
	 * 등록자 선택 완료
	 */
	public doneUserSelectPopup(users: User.Entity[]): void {
		if (this.isOpenUserSelectPopup) {
			this.post.createdBy = users[ 0 ];
			this.post.createdById = this.post.createdBy.userId;
			this.isOpenUserSelectPopup = false;
		} else if (this.isOpenWorkerSelectPopup) {
			this.post.worker = users[ 0 ];
			this.isOpenWorkerSelectPopup = false;
		} else {
			this.post.coworkers = users.sort();
			this.isOpenCoworkerSelectPopup = false;
		}
	}

	/**
	 * 등록자 선택 팝업 닫기
	 */
	public closeUserSelectPopup() {
		this.isOpenUserSelectPopup = false;
		this.isOpenWorkerSelectPopup = false;
		this.isOpenCoworkerSelectPopup = false;
	}

	/**
	 * 등록일자 선택 완료
	 */
	public createdDateSelect(date: Date) {
		this.post.createdDateStr = moment(date).format('YYYY-MM-DD HH:mm');
	}

	/**
	 * 담당자 삭제
	 */
	public deleteWorker() {
		this.post.worker = undefined;
	}

	/**
	 * 처리자 삭제
	 */
	public deleteCoworker(index: number) {
		this.post.coworkers.splice(index, 1);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 날짜 선택
	 */
	private minMaxDateSelect() {
		const selectedDates = this.minMaxDate.selectedDates;
		if (selectedDates.length > 1) {
			this.post.dispStartDate = moment(selectedDates[ 0 ]).format('YYYY-MM-DD');
			this.post.dispEndDate = moment(selectedDates[ 1 ]).format('YYYY-MM-DD');
		} else {
			this.post.dispEndDate = null;
		}
	}

	/**
	 * 첨부파일 업로드
	 */
	private uploadFile() {
		if (!this.files || !this.files.length) {
			this.deleteImages();
			return;
		}

		const fileGroupId = this.post.fileGroup ? this.post.fileGroup.id : null;
		this.fileUploadService.uploadFile('communication', this.files[ 0 ], fileGroupId).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.post.fileGroup = result.data.fileGroup;
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
			this.fileUploadService.deleteFile(this.fileUploader.deleteFileList, this.post.fileGroup.id).then(result => {
				this.uploadFile();
			});
		} else {
			this.uploadFile();
		}
	}

	/**
	 * 대표이미지 업로드
	 */
	private uploadImage() {
		if (!this.images || !this.images.length) {
			this.savePost();
			return;
		}

		const mediaGroupId = this.post.mediaGroup ? this.post.mediaGroup.id : null;
		this.communityService.uploadImage(this.images[ 0 ], mediaGroupId).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.post.mediaGroup = result.data.mediaGroup;
				this.images.splice(0, 1);
				this.uploadImage();
			}
		});
	}

	/**
	 * 대표이미지 삭제
	 */
	private deleteImages() {
		if (this.imageUploader.deleteFileList && this.imageUploader.deleteFileList.length && !this.images.length) {
			this.communityService.deleteImage(this.post.mediaGroup.id).then(result => {
				this.uploadImage();
			});
		} else {
			this.uploadImage();
		}
	}

	/**
	 * 포스트 등록/수정
	 */
	private savePost() {
		this.post.content = this.editor.getText();
		let attachGroupId = this.editor.getFileGroupId();
		if (attachGroupId) {
			this.post.attachGroup = new File.Group();
			this.post.attachGroup.id = attachGroupId;
		}

		if (this.post.worker) {
			this.post.workerId = this.post.worker.userId;
		}
		if (this.post.coworkers) {
			this.post.coworkerIds = Array.from(this.post.coworkers).map(value => {
				return value.userId;
			});
		}

		if (this.post.id) {
			this.communityService.updatePost(this.slug, this.post).then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					if (this.post.draft) {
						Alert.success(this.translateService.instant('COMMUNITY.DETAIL.DRAFT.SAVE.MESSAGE', '임시 저장 되었습니다.'));
					} else {
						Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY'));
					}

					if (this.post.draft) {
						this.router.navigate([ `view${this.master.prePath}/${this.slug}` ]);
					} else {
						if (this.post.changedSlug) {
							this.slug = this.post.changedSlug;
						}
						this.router.navigate([ `view${this.master.prePath}/${this.slug}/post/${this.post.id}` ]);
					}
				}

				Loading.hide();
			});
		} else {
			this.communityService.createPost(this.slug, this.post).then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					if (this.post.draft) {
						Alert.success(this.translateService.instant('COMMUNITY.DETAIL.DRAFT.SAVE.MESSAGE', '임시 저장 되었습니다.'));
					} else {
						Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE'));
					}

					this.router.navigate([ `view${this.master.prePath}/${this.slug}` ]);
				}

				Loading.hide();

				// LNB 메뉴 데이터 다시 생성
				this.layoutService.createDataSetUsedByLnb();
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

		this.images = [];
		Array.from(this.imageUploader.files).forEach(value => {
			if (value.file.type != 'O') {
				this.images.push(value.file);
			}
		});
	}

	/**
	 * 포스트 세팅
	 * @param {Community.Post} post
	 */
	private setPost(post: Community.Post) {
		this.post = post;
		this.master = post.master;
		this.editorText = post.content;
		this.editor.fileGroupId = post.attachGroup ? post.attachGroup.id : null;

		// 업로드된 파일 목록 세팅
		this.fileUploader.setUploadedFileList(post.fileGroup);
		this.imageUploader.setUploadedMediaList(post.mediaGroup);

		// 공지알림 날짜 세팅
		if (this.master.postType == Community.PostType.NOTICE && post.bannerYn) {
			let startDate = new Date(post.dispStartDate);
			let endDate = new Date(post.dispEndDate);
			this.minMaxDate.selectDate([ startDate, endDate ]);
		}

	}

}
