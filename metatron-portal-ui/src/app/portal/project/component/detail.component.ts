import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../common/component/abstract.component';
import {CommonConstant} from '../../common/constant/common-constant';
import {Loading} from '../../../common/util/loading-util';
import {ProjectService} from '../service/project.service';
import {Project} from '../value/project';
import {Alert} from '../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import {DialogService} from '../../../common/component/dialog/dialog.service';
import {PERMISSION_CODE} from '../../common/value/page-permission';
import {Utils} from '../../../common/util/utils';
import {UserService} from '../../common/service/user.service';

@Component({
	selector: '[detail]',
	templateUrl: './detail.component.html',
	host: { '[class.page-assignment]': 'true' }
})
export class DetailComponent extends AbstractComponent implements OnInit, OnDestroy {

	readonly ENUM_PROJECT_PROGRESS: typeof Project.Progress = Project.Progress;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 프로젝트
	public entity: Project.Entity;

	// 수정 가능 여부
	public enableEdit: boolean;

	// 삭제 가능 여부
	public enableDelete: boolean;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param projectService
	 * @param dialogService
	 * @param translateService
	 * @param userService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private projectService: ProjectService,
				private dialogService: DialogService,
				private translateService: TranslateService,
				public userService: UserService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.subscriptions.push(
			this.activatedRoute
			.params
			.subscribe((params: { id }) => {
				this.getDetail(params.id);
			})
		);
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public goListPage(): void {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ 'view/project' ]);
	}

	public goEditPage(): void {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ `view/project/${this.entity.id}/edit` ]);
	}

	/**
	 * 석제
	 *
	 * @param {string} id
	 */
	public deleteProject(id: string) {

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

					Loading.show();

					this.projectService
						.deleteProjectById(id)
						.then(result => {

							Loading.hide();

							if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
								Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
								this.goListPage();
							} else {
								Alert.success(this.translateService.instant('COMMON.MESSAGE.ERROR', '에러'));
							}
						})
						.catch(error => {
							this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
						});
				});
	}

	// noinspection JSMethodCanBeStatic
	/**
	 *
	 *
	 * @param progress
	 */
	public getProgressLabel(progress) {
		return Project.getProgressLabel(progress)
	};

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
		return Utils.EscapeUtil.lineBreakOrTabOrSpaceCharacter(text);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 상세 조회
	 *
	 * @param {string} id
	 */
	private getDetail(id: string): void {

		Loading.show();

		this.projectService
			.getDetail(id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					this.entity = result.data.project;

					// 권한 체크
					if (this.gnbService.permission.permission == PERMISSION_CODE.RW && this.entity.createdBy.userId == this.sessionInfo.getUser().userId) {
						this.enableEdit = true;
						this.enableDelete = true;
					} else if (this.gnbService.permission.permission == PERMISSION_CODE.SA) {
						this.enableEdit = true;
						this.enableDelete = true;
					} else {
						this.enableEdit = false;
						this.enableDelete = false;
					}
				} else {
					this.entity = null;
				}

				// 태깅
				this.tagging(this.TaggingType.DETAIL, this.TaggingAction.VIEW, this.entity.id, this.entity.name);

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}
}
