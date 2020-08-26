import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Group} from '../../../common/value/group';
import * as _ from 'lodash';
import {Alert} from '../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import {GroupService} from '../../../common/service/group.service';
import {Loading} from '../../../../common/util/loading-util';
import {CommonConstant} from '../../../common/constant/common-constant';
import {DialogService} from '../../../../common/component/dialog/dialog.service';

@Component({
	selector: '[create]',
	templateUrl: './create.component.html',
	host: { '[class.page-management-group]': 'true' }
})
export class CreateComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	 * 그룹
	 *
	 * @type {Group.Entity}
	 */
	public group: Group.Entity = new Group.Entity();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param translateService
	 * @param groupService
	 * @param dialogService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private groupService: GroupService,
				private dialogService: DialogService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		this.group.name = '';
		this.group.description = '';
		this.group.isGroupNmError = false;
		this.group.isGroupDescEditMode = false;
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 취소
	 */
	public cancel(): void {
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
					this.goGroupListPage();
				});
	}

	/**
	 * 적용
	 */
	public done() {

		if (_.isEmpty(this.group.name.trim())) {
			this.group.isGroupNmError = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (_.isEmpty(this.group.description.trim())) {
			this.group.isGroupDescError = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		this.group.name = this.group.name.trim();
		this.group.description = this.group.description.trim();

		Loading.show();

		this.groupService
			.create(this.group)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
					this.goGroupListPage();
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 그룹 목록 페이지로 이동
	 */
	private goGroupListPage(): void {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ 'view/management/groups' ])
	}

}
