import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../common/component/abstract.component';
import {SelectValue} from '../../../common/component/select/select.value';
import {TranslateService} from 'ng2-translate';
import {Project} from '../value/project';
import {CookieService} from 'ng2-cookies';
import {CookieConstant} from '../../common/constant/cookie-constant';
import {Loading} from '../../../common/util/loading-util';
import {CommonConstant} from '../../common/constant/common-constant';
import {File} from '../../common/file-upload/value/file';
import {SelectComponent} from '../../../common/component/select/select.component';
import {Alert} from '../../../common/util/alert-util';
import * as _ from 'lodash';
import {FileItem} from 'ng2-file-upload';
import {User} from '../../common/value/user';
import {FileUploadService} from '../../common/file-upload/service/file-upload.service';
import {FileFieldComponent} from '../../common/file-upload/component/file-field.component';
import * as moment from 'moment';
import {ProjectService} from '../service/project.service';
import {DialogService} from '../../../common/component/dialog/dialog.service';
import {Organization} from '../../common/value/organization';
import {UserService} from '../../common/service/user.service';

@Component({
	selector: '[create-or-update]',
	templateUrl: './create-or-update.component.html',
	host: { '[class.page-assignment]': 'true' }
})
export class CreateOrUpdateComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 *
	 */
	private files: Array<Object>;

	/**
	 * 수정 모드인지
	 *
	 * @type {boolean}
	 */
	public isEditMode: boolean = true;

	/**
	 * 시작일 / 종료일 설정 데이트 피커 인풋
	 */
	@ViewChild('startAndEndDatePickerSettingsInputElement')
	private startAndEndDatePickerSettingsInputElement: ElementRef;

	/**
	 * 타입 셀렉트박스
	 */
	@ViewChild('typeSelectBox')
	private typeSelectBox: SelectComponent;

	/**
	 * 파일 필드 컴포넌트
	 */
	@ViewChild(FileFieldComponent)
	private fileUploader: FileFieldComponent;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 선택해주세요.
	 *
	 * @type {string}
	 */
	public typeSelectBoxPlaceholder: string = '';

	/**
	 * 프로젝트 프로그래스 셀렉트 박스 목록
	 *
	 * @type {SelectValue[]}
	 */
	public projectProgressList: SelectValue[] = [];

	/**
	 * 프로젝트
	 *
	 * @type {Project.Entity}
	 */
	public project: Project.Entity = new Project.Entity();

	/**
	 * 프로젝트 구분 목록
	 *
	 * @type {any[]}
	 */
	public typeList: SelectValue[] = [];

	/**
	 *
	 *
	 * @type {boolean}
	 */
	public isOpenWorkerUserSelectPopup: boolean = false;

	/**
	 *
	 */
	public isOpenCoworkerOrgSelectPopup: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param translateService
	 * @param userService
	 * @param dialogService
	 * @param cookieService
	 * @param projectService
	 * @param fileUploadService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				public userService: UserService,
				private dialogService: DialogService,
				private cookieService: CookieService,
				private projectService: ProjectService,
				private fileUploadService: FileUploadService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private datePickerInputEl;

	public ngOnInit(): void {

		this.subscriptions.push(
			this.activatedRoute
				.params
				.subscribe(params => {

					this.isEditMode = !!params[ 'id' ];

					this.typeSelectBoxPlaceholder = this.translateService.instant('COMMON.PLEASE SELECT', '선택해주세요.');

					if (this.isEditMode === false) {
						this.project.name = '';
						this.project.progress = Project.Progress.PLANNING;
						this.project.startDate = new Date().toString();
						this.project.endDate = new Date().toString();
						this.project.summary = '';
						this.project.benefit = '';
						this.project.description = '';
						this.project.worker = new User.Entity();
						this.project.worker.userId = '';
						const org = new Organization.Entity();
						org.id = '';
						this.project.worker.org = org;
						this.project.worker.orgNm = '';
						this.project.fileGroup = new File.Group();
						this.project.fileGroup.id = '';
						this.project.isTypeValidationFail = false;
						this.project.isNameValidationFail = false;
						this.project.isProgressValidationFail = false;
						this.project.isSummaryValidationFail = false;
						this.project.isStartEndDateValidationFail = false;

						this.createSelectBoxProjectTypeList();

						this.init();
					} else {

						Loading.show();

						this.projectService
							.getDetail(params[ 'id' ])
							.then(result => {

								if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
									this.project = result.data.project;
									this.createSelectBoxProjectTypeList(this.project);
									this.fileUploader.setUploadedFileList(this.project.fileGroup);
									this.init();
								}

								Loading.hide();
							})
							.catch(error => {
								this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
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
	 * 취소
	 */
	public cancel() {

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
					this.goListPage();
				});
	}

	/**
	 * 적용
	 */
	public done() {

		if (this.typeSelectBox.getSelectedItem() === null) {
			this.project.isTypeValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		this.project.type = this.typeSelectBox.getSelectedItem().value;

		if (_.isEmpty(this.project.name)) {
			this.project.isNameValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (_.isEmpty(this.project.progress)) {
			this.project.isProgressValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (_.isEmpty(this.project.startDate) || _.isEmpty(this.project.endDate)) {
			this.project.isStartEndDateValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		if (_.isEmpty(this.project.summary)) {
			this.project.isSummaryValidationFail = true;
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			return;
		}

		Loading.show();

		this.setUploadList();

		this.deleteFiles();
	}

	/**
	 * 첨부파일 삭제
	 */
	private deleteFiles() {
		if (this.fileUploader.deleteFileList && this.fileUploader.deleteFileList.length) {
			this.fileUploadService
				.deleteFile(this.fileUploader.deleteFileList, this.project.fileGroup.id)
				.then(() => {
					this.uploadFile();
				});
		} else {
			this.uploadFile();
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

	/**
	 * 첨부파일 업로드
	 */
	private uploadFile() {

		if (!this.files || !this.files.length) {

			if (this.isEditMode) {
				this.update(false);
			} else {
				this.create(false);
			}

			Loading.hide();

			return;
		}

		const fileGroupId = this.project.fileGroup ? this.project.fileGroup.id : null;
		this.fileUploadService
			.uploadFile('project', this.files[ 0 ], fileGroupId)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.project.fileGroup = result.data.fileGroup;
					this.files.splice(0, 1);
					this.uploadFile();
				}
			});

	}

	/**
	 * 진행현황 선택시
	 *
	 * @param {number} index
	 * @param {SelectValue} progress
	 */
	public selectProgress(index: number, progress: SelectValue): void {
		this.projectProgressList[ index ].checked = true;
		this.project.progress = progress.value;
		this.project.isProgressValidationFail = false;
	}

	/**
	 * 파일 첨부 변경시
	 *    - Output event
	 *
	 * @param {FileItem[]} files
	 */
	public oChangeFile(files: FileItem[]): void {
		// this.validation.isFilesValidationFail = files.length === 0;
	}

	/**
	 * 협업조직 선택 팝업 완료
	 *
	 * @param orgs
	 */
	public doneCoworkerOrgSelectPopup(orgs: Organization.Entity[]): void {
		this.project.coworkOrg = orgs[ 0 ];
		this.isOpenCoworkerOrgSelectPopup = false;
	}

	/**
	 * 협업조직 선택 팝업 닫기
	 */
	public closeCoworkerOrgSelectPopup() {
		this.isOpenCoworkerOrgSelectPopup = false;
	}

	/**
	 * 협업조직 삭제
	 */
	public deleteCoworkerOrg(): void {
		this.project.coworkOrg = null;
	}

	/**
	 * 담당자 선택 팝업 완료
	 *
	 * @param {User.Entity} user
	 */
	public doneWorkerUserSelectPopup(users: User.Entity[]): void {
		this.project.worker = users[ 0 ];
		this.isOpenWorkerUserSelectPopup = false;
	}

	/**
	 * 담당자 선택 팝업 닫기
	 */
	public closeWorkerUserSelectPopup() {
		this.isOpenWorkerUserSelectPopup = false;
	}

	/**
	 * 담당자 삭제
	 */
	public deleteWorker(): void {
		const worker = new User.Entity();
		worker.userId = '';
		worker.orgNm = '';
		const org = new Organization.Entity();
		org.id = '';
		worker.org = org;
		this.project.worker = worker;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 프로젝트 셀렉트박스 타입 목록 생성
	 *
	 * @param {Project.Entity} project
	 */
	private createSelectBoxProjectTypeList(project?: Project.Entity): void {

		Loading.show();

		this.codeService
			.getCodesByGrpCdKey(`GC0000007`)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					const typeListTemp: SelectValue[] = [];
					result.data.codeList
						.forEach(code => {
							typeListTemp.push(
								new SelectValue(
									this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
										? code.nmKr
										: code.nmEn
									, code
									, project ? project.type.id === code.id : false
								)
							)
						});
					this.typeList = typeListTemp;
				} else {
					this.typeList = [];
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 프로젝트 진행현황 목록 아이템 만들기
	 *  - 라디오 버튼인데 공통 셀렉트박스 값 오브젝트 이용
	 *
	 * @param {Project.Progress} progress
	 */
	private createProjectProgressListItem(progress: Project.Progress): void {
		this.projectProgressList.push(
			new SelectValue(
				this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'ko'
					? Project.getProgressLabel(progress)
					: progress.toString().substr(0, 1).concat(progress.toString().substr(1, progress.toString().length).toLocaleLowerCase()),
				progress,
				this.project.progress === progress)
		);
	}

	/**
	 * 시작일 - 종료일 설정 데이트 피커 선택시
	 */
	private startEndDateSelect(): void {
		// noinspection TypeScriptUnresolvedVariable
		const selectedDates = this.datePickerInputEl.selectedDates;
		if (selectedDates.length > 1) {
			this.project.startDate = moment(selectedDates[ 0 ]).format('YYYY-MM-DD');
			this.project.endDate = moment(selectedDates[ 1 ]).format('YYYY-MM-DD');
			this.project.isStartEndDateValidationFail = false;
		} else {
			this.project.endDate = '';
		}
	}

	/**
	 * 프로젝트 생성
	 *
	 * @param isLoading
	 */
	private create(isLoading: boolean = true): void {

		if (isLoading === true) {
			Loading.show();
		}

		this.projectService
			.create(this.project)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
					this.goListPage();
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

				if (isLoading === true) {
					Loading.hide();
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 수정
	 *
	 * @param isLoading
	 */
	private update(isLoading: boolean = true) {

		if (isLoading === true) {
			Loading.show();
		}

		return this.projectService
			.update(this.project)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));
					this.goListPage();
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

				if (isLoading === true) {
					Loading.hide();
				}
			});
	}

	/**
	 * 목록 화면으로 이동
	 */
	private goListPage() {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ 'view/project' ]);
	}

	/**
	 *
	 */
	private init() {

		this.createProjectProgressListItem(Project.Progress.PLANNING);
		this.createProjectProgressListItem(Project.Progress.DESIGN);
		this.createProjectProgressListItem(Project.Progress.DEVELOP);
		this.createProjectProgressListItem(Project.Progress.TEST);
		this.createProjectProgressListItem(Project.Progress.PRODUCT);

		const minDate = new Date(2017, 0, 1);
		// noinspection JSUnusedGlobalSymbols
		// noinspection TypeScriptValidateJSTypes
		this.datePickerInputEl = this.jQuery(this.startAndEndDatePickerSettingsInputElement.nativeElement)
			.datepicker({
				language: 'ko',
				autoClose: true,
				class: 'dtp-datepicker',
				dateFormat: 'yyyy-mm-dd',
				navTitles: { days: 'yyyy<span>년&nbsp;</span> MM' },
				onHide: function () {},
				position: 'bottom left',
				timepicker: false,
				toggleSelected: true,
				range: true,
				multipleDatesSeparator: ' ~ ',
				minDate: minDate
			})
			.data('datepicker');

		if (this.isEditMode) {
			const startDate = this.project.startDate.split('-');
			const endDate = this.project.endDate.split('-');
			this.datePickerInputEl.selectDate([ new Date(Number(startDate[ 0 ]), Number(startDate[ 1 ]) - 1, Number(startDate[ 2 ])), new Date(Number(endDate[ 0 ]), Number(endDate[ 1 ]) - 1, Number(endDate[ 2 ])) ]);
		} else {
			const now = new Date();
			this.datePickerInputEl.selectDate([ now, now ]);
			this.project.startDate = moment(now).format('YYYY-MM-DD');
			this.project.endDate = moment(now).format('YYYY-MM-DD');
		}

		const scope = this;
		this.datePickerInputEl.update('onSelect', () => {
			scope.startEndDateSelect();
		});
	}
}
