import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from 'ng2-translate';
// import {FileItem} from 'ng2-file-upload';
// import {DialogService} from '../../../../../common/component/dialog/dialog.service';
// import {Alert} from '../../../../../common/util/alert-util';
// import {CommonConstant} from '../../../../common/constant/common-constant';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {FileUploadComponent} from '../../../../common/file-upload/component/file-upload.component';
import {UserService} from '../../../../common/service/user.service';

@Component({
	selector: 'profile-detail-layer',
	templateUrl: './user-profile-detail-layer.component.html'
})
export class UserProfileDetailLayerComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild(FileUploadComponent)
	private fileUploadComponent: FileUploadComponent;

	// 선택한 파일
	// private selectedFile: FileItem;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// popup show/hide
	@Input()
	public isShow: boolean = false;

	// 닫기 클릭 시 event emit
	@Output()
	public close: EventEmitter<any> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				// private dialogService: DialogService,
				public userService: UserService,
				public translateService: TranslateService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.initialize();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public show(): void {
		this.isShow = true;
	}

	public hide(): void {
		this.isShow = false;
	}

	/**
	 * 팝업 닫기 클릭
	 */
	public closeClick() {
		this.hide();
		this.close.emit();
	}

	/**
	 * 파일 찾기 클릭
	 */
	/*public changeFile(files: FileItem[]) {
		this.selectedFile = files[ 0 ];

		this.userService.uploadProfileImage(files[ 0 ]).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
				this.refreshProfile();
				this.fileUploadComponent.removeAll();
			} else {
				Alert.success(this.translateService.instant('COMMON.MESSAGE.ERROR', '에러'));
			}
		});
	}*/

	/**
	 * 삭제 클릭
	 */
	/*public deleteClick() {

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
				if (this.selectedFile) {
					this.fileUploadComponent.removeAll();
				}

				this.userService.deleteProfileImage().then(result => {
					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
						Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
						this.refreshProfile();
					} else {
						Alert.success(this.translateService.instant('COMMON.MESSAGE.ERROR', '에러'));
					}
				});
			});
	}*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private initialize(): void {
		this.isShow = false;
	}

	/**
	 * 프로필 이미지 refresh
	 */
	/*private refreshProfile() {
		this.userService
			.getMyInfo()
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.sessionInfo.setUser(result.data.user);
				}
			});
	}*/

}
