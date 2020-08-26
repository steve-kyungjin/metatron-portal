import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileFieldComponent} from '../../../../../common/file-upload/component/file-field.component';
import {AnalysisApp} from '../../../../../analysis-app/value/analysis-app.value';
import {AnalysisAppService} from '../../../../../analysis-app/service/analysis-app.service';
import {FileItem, FileLikeObject, FileUploader} from 'ng2-file-upload';
import {TranslateService} from 'ng2-translate';
import {DataSource} from '../../../../shared/datasource/value/data-source';
import {AbstractComponent} from '../../../../../common/component/abstract.component';
import {Code} from '../../../../../common/value/code';
import {Loading} from '../../../../../../common/util/loading-util';
import {GroupCodeResult} from '../../../../../common/value/group-code';
import {CommonConstant} from '../../../../../common/constant/common-constant';
import {Alert} from '../../../../../../common/util/alert-util';
import {Validate} from '../../../../../../common/util/validate-util';
import * as _ from 'lodash';
import {RoleService} from '../../../../../common/service/role.service';
import {AuthenticationSettingsComponent} from '../../../../shared/authentication-settings/component/authentication-settings.component';
import {RoleGroup} from '../../../../../common/value/role-group';

@Component({
	selector: 'register-step2',
	templateUrl: './register-step2.component.html'
})
export class RegisterStep2Component extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild(FileFieldComponent)
	private fileFieldComponent: FileFieldComponent;

	@ViewChild(AuthenticationSettingsComponent)
	private authenticationSettingsComponent: AuthenticationSettingsComponent;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 분석 앱 타입
	 *    URL, METATRON, EXTRACT
	 *
	 * @type {string}
	 * @private
	 */
	public headerType: string = '';

	/**
	 * 분석 앱
	 */
	public app: AnalysisApp.Entity = new AnalysisApp.Entity();

	/**
	 * 카테고리 목록
	 *
	 * @type {any[]}
	 */
	public categories: Array<Code.Entity> = [];

	/**
	 * 유효성 검사 플래그
	 */
	public validation = {
		isUrlValidationFail: false,
		isAppNmValidationFail: false,
		isSummaryNmValidationFail: false,
		isContentsValidationFail: false,
		isVerValidationFail: false,
		isVerInfoValidationFail: false,
		isFilesValidationFail: false,
		isCategoryValidationFail: false,
		isRoleValidationFail: false,
		isMetatronHeaderContentsIdValidationFail: false,
		isExtractHeaderDataSourceIdValidationFail: false
	};

	/**
	 * 라우트 이동시 전달받는 파라미터
	 */
	public parameter: AnalysisApp.CreateAnalysisAppPageParameter = new AnalysisApp.CreateAnalysisAppPageParameter();

	/**
	 * 메타트론 대시보드 오픈 여부
	 *
	 * @type {boolean}
	 */
	public isDashboardLayerOpen: boolean = false;

	/**
	 * 데이터 추출 레이어 팝업 오픈 여부
	 *
	 * @type {boolean}
	 */
	public isExtractLayerOpen: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private roleService: RoleService,
				private analysisAppService: AnalysisAppService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		Loading.show();

		this.parameter = this.router.getNavigatedData();

		if (typeof this.parameter === 'undefined') {
			Loading.hide();
			this.routerLink('view/management/analysis-app/app/register-step1');
			return;
		}

		/**
		 *  분석 앱 아이디가
		 *    있는 경우
		 *        - 수정 모드
		 *    없는 경우
		 *        - 생성 모드
		 */
		const analysisAppId: string = this.parameter.id;

		try {
			if (this.isCreateMode(analysisAppId)) {

				this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > 분석 앱 생성 모드`);

				const AnalysisAppHeaderType: AnalysisApp.HeaderType = this.parameter.type;
				this.headerType = AnalysisApp.HeaderType[ AnalysisAppHeaderType ];
				if (this.headerType === '') {
					// noinspection ExceptionCaughtLocallyJS
					throw new Error(`UI validation fail.`);
				}

				if (typeof this.headerType === 'undefined') {
					// noinspection ExceptionCaughtLocallyJS
					throw new Error(`UI validation fail.`);
				}

				this.app.headerType = AnalysisApp.HeaderType[ this.headerType ];
			} else {
				this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > 분석 앱 수정 모드`);
			}

			// 분석 앱 헤더 데이터 생성
			switch (this.headerType) {
				case 'URL': {
					this.app.urlHeader = new AnalysisApp.UrlHeader();
					this.app.urlHeader.id = '';
					this.app.urlHeader.url = '';
					break;
				}
				case 'METATRON': {
					this.app.metatronHeader = new AnalysisApp.MetatronHeader();
					this.app.metatronHeader.type = '';
					this.app.metatronHeader.contentsId = '';
					this.app.metatronHeader.contentsNm = '';
					this.app.metatronHeader.locationId = '';
					break;
				}
				case 'EXTRACT': {
					this.app.extractHeader = new AnalysisApp.ExtractHeader();
					this.app.extractHeader.dataSource = new DataSource.Entity();
					this.app.extractHeader.dataSource.id = '';
					this.app.extractHeader.sqlTxt = '';
					break;
				}
			}
		} catch (error) {
			this.routerLink('view/management/analysis-app/app/register-step1');
			return;
		}

		Promise
			.resolve()
			.then(() => {
				// 카테고리 목록 조회
				this.codeService
					.getGroupCodeByGrpCdKey('GC0000004')
					.then((result: GroupCodeResult) => {

						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

							this.categories = [];

							const codeList: Array<Code.Entity> = result.data[ 'groupCode' ][ 'code' ];
							if (codeList.length > 0) {
								codeList.forEach((category) => {
									this.categories.push(category);
								});
							}
						} else {
							this.categories = [];
							throw new Error(`Group code list get API fail.`);
						}
					});
			})
			.then(() => {
				if (this.isCreateMode(analysisAppId) === false) {
					this.analysisAppService
						.getDetail(analysisAppId)
						.then((result) => {

							if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

								const analysisApp: AnalysisApp.Entity = result.data[ 'analysisApp' ];
								this.headerType = analysisApp.headerType.toString();
								this.app.headerType = AnalysisApp.HeaderType[ this.headerType ];
								this.app.id = analysisApp.id;

								switch (this.headerType) {
									case 'URL': {
										this.app.urlHeader = new AnalysisApp.UrlHeader();
										this.app.urlHeader.url = analysisApp.urlHeader.url;
										break;
									}
									case 'METATRON': {
										this.app.metatronHeader = new AnalysisApp.MetatronHeader();
										this.app.metatronHeader.contentsId = analysisApp.metatronHeader.contentsId;
										this.app.metatronHeader.type = analysisApp.metatronHeader.type;
										this.app.metatronHeader.contentsNm = analysisApp.metatronHeader.contentsNm;
										this.app.metatronHeader.locationId = analysisApp.metatronHeader.locationId;
										break;
									}
									case 'EXTRACT': {
										this.app.extractHeader = new AnalysisApp.ExtractHeader();
										this.app.extractHeader.dataSource = new DataSource.Entity();
										this.app.extractHeader.dataSource = analysisApp.extractHeader.dataSource;
										this.app.extractHeader.sqlTxt = analysisApp.extractHeader.sqlTxt;
										break;
									}
								}

								this.app.appNm = analysisApp.appNm;
								this.app.summary = analysisApp.summary;
								this.app.contents = analysisApp.contents;
								this.app.ver = analysisApp.ver;
								this.app.verInfo = analysisApp.verInfo;
								this.app.useYn = analysisApp.useYn;
								this.app.externalYn = analysisApp.externalYn;
								this.app.mediaGroupId = analysisApp.mediaGroup.id;

								const fileItems: FileItem[] = [];
								analysisApp.mediaGroup.medias.forEach(media => {
									const file: any = { 'path': [ '' ], 'name': media.name };
									const fileLikeObject: FileLikeObject = new FileLikeObject(file);
									fileLikeObject.type = 'O';
									fileLikeObject.lastModifiedDate = media.id;
									const uploader: FileUploader = new FileUploader({});
									const fileItem: FileItem = new FileItem(uploader, file, {});
									fileItem.file = fileLikeObject;
									fileItems.push(fileItem);
								});

								this.fileFieldComponent.originFiles = fileItems;

								// 카테고리 선택 표시
								analysisApp.categories.forEach(category => {
									this.categories.forEach(c => {
										if (category.id === c.id) {
											c.isChecked = true;
										}
									});
								});

								// 권한 표시
								if ((typeof analysisApp.roles === 'undefined') === false) {

									let userRoles = [];
									let groupRoles = [];
									let orgRoles = [];
									analysisApp.roles.forEach(role => {
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

								Loading.hide();
							} else {
								throw new Error(`Analysis app detail get API fail.`);
							}
						});
				}

				// 생성 모드인 경우
				else {

					// 상태 기본값 설정
					this.app.externalYn = false;
					this.app.useYn = false;

					Loading.hide();
				}
			})
			.catch((error) => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > error`, error);
			});
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
	public reset(): void {
		this.goBack();
	}

	/**
	 * 등록
	 */
	public save(): void {
		switch (this.headerType) {
			case 'URL': {

				if (this.app.urlHeader.url === '') {
					Alert.warning('URL을 입력해주세요.');
					this.validation.isUrlValidationFail = true;
					return;
				}

				if (Validate.checkMaxLength(this.app.urlHeader.url, 1024)) {
					Alert.warning('URL 최대 길이는 1024자 입니다.');
					this.validation.isUrlValidationFail = true;
					return;
				}

				// noinspection RegExpRedundantEscape
				if (/^(http\:|https\:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/i.test(this.app.urlHeader.url) === false) {
					Alert.warning('URL 형식이 아닙니다.');
					this.validation.isUrlValidationFail = true;
					return;
				}

				break;
			}

			case 'METATRON': {

				if (this.app.metatronHeader.contentsId === '') {
					Alert.warning('대시보드를 선택해주세요.');
					this.validation.isMetatronHeaderContentsIdValidationFail = true;
					return;
				}

				if (this.app.metatronHeader.type === '') {
					Alert.warning('대시보드를 선택해주세요.');
					this.validation.isMetatronHeaderContentsIdValidationFail = true;
					return;
				}

				break;
			}

			case 'EXTRACT': {

				if (this.app.extractHeader.dataSource.id === '') {
					Alert.warning('데이터 추출을 완료해주세요.');
					this.validation.isExtractHeaderDataSourceIdValidationFail = true;
					return;
				}

				if (this.app.extractHeader.sqlTxt === '') {
					Alert.warning('데이터 추출을 완료해주세요.');
					this.validation.isExtractHeaderDataSourceIdValidationFail = true;
					return;
				}

				break;
			}
		}

		if (typeof this.app.appNm === 'undefined') {
			Alert.warning('앱 이름을 입력해 주세요.');
			this.validation.isAppNmValidationFail = true;
			return;
		}

		if (this.app.appNm === '') {
			Alert.warning('앱 이름을 입력해 주세요.');
			this.validation.isAppNmValidationFail = true;
			return;
		}

		if (Validate.checkMinLength(this.app.appNm, 2)) {
			Alert.warning('앱 이름을 3자 이상 입력해주세요.');
			this.validation.isAppNmValidationFail = true;
			return;
		}

		if (Validate.checkMaxLength(this.app.appNm, 50)) {
			Alert.warning('앱 이름은 50자까지 입력할 수 있습니다.');
			this.validation.isAppNmValidationFail = true;
			return;
		}

		if (typeof this.app.summary === 'undefined') {
			Alert.warning('앱에 대한 간략한 설명을 입력해 주세요.');
			this.validation.isSummaryNmValidationFail = true;
			return;
		}

		if (this.app.summary === '') {
			Alert.warning('앱에 대한 간략한 설명을 입력해 주세요.');
			this.validation.isSummaryNmValidationFail = true;
			return;
		}

		if (Validate.checkMinLength(this.app.summary, 2)) {
			Alert.warning('앱에 대한 간략한 설명을 3자 이상 입력해주세요.');
			this.validation.isSummaryNmValidationFail = true;
			return;
		}

		if (Validate.checkMaxLength(this.app.summary, 100)) {
			Alert.warning('앱에 대한 간략한 설명은 100자까지 입력할 수 있습니다.');
			this.validation.isSummaryNmValidationFail = true;
			return;
		}

		if (typeof this.app.contents === 'undefined') {
			Alert.warning('앱 소개를 입력해주세요.');
			this.validation.isContentsValidationFail = true;
			return;
		}

		if (this.app.contents === '') {
			Alert.warning('앱 소개를 입력해주세요.');
			this.validation.isContentsValidationFail = true;
			return;
		}

		if (Validate.checkMaxLength(this.app.contents, 3000)) {
			Alert.warning('앱 소개 최대 길이는 3000자 입니다.');
			this.validation.isContentsValidationFail = true;
			return;
		}

		if (typeof this.app.ver === 'undefined') {
			Alert.warning('버전을 입력해 주세요.');
			this.validation.isVerValidationFail = true;
			return;
		}

		if (this.app.ver === '') {
			Alert.warning('버전을 입력해 주세요.');
			this.validation.isVerValidationFail = true;
			return;
		}

		if (Validate.checkMaxLength(this.app.ver, 10)) {
			Alert.warning('버전 최대 길이는 10자 입니다.');
			this.validation.isVerValidationFail = true;
			return;
		}

		if (typeof this.app.verInfo === 'undefined') {
			Alert.warning('버전정보를 입력해주세요.');
			this.validation.isVerInfoValidationFail = true;
			return;
		}

		if (this.app.verInfo === '') {
			Alert.warning('버전정보를 입력해주세요.');
			this.validation.isVerInfoValidationFail = true;
			return;
		}

		if (Validate.checkMaxLength(this.app.verInfo, 3000)) {
			Alert.warning('버전정보 최대 길이는 3000자 입니다.');
			this.validation.isVerInfoValidationFail = true;
			return;
		}

		// 스크린샷
		if (this.fileFieldComponent.files.length === 0) {
			Alert.warning('스크린샷을 등록해주세요.');
			this.validation.isFilesValidationFail = true;
			return;
		}

		// 카테고리
		if (this.categories.filter((category) => category.isChecked).length === 0) {
			Alert.warning('카테고리를 선택해주세요.');
			this.validation.isCategoryValidationFail = true;
			return;
		}

		// 생성 모드
		if (this.isCreateMode(this.parameter.id)) {
			this.app.files = this.fileFieldComponent.files;
		}

		// 수정 모드
		else {

			this.fileFieldComponent.files.forEach(file => {
				if ((file.file.type === 'O') === false) {
					this.app.files.push(file);
				}
			});

			this.app.delFileIds = this.fileFieldComponent.deleteFileList;
		}

		this.createAnalysisApp(this.createFormData());

	}

	/**
	 * 분석 앱 내부/외부 정보 변경
	 *
	 * @param {boolean} useYn
	 */
	public changeExternalUseYn(useYn: boolean): void {
		this.app.externalYn = useYn;
	}

	/**
	 * 분석 앱 상태 정보 변경
	 *
	 * @param {boolean} useYn
	 */
	public changeUseYn(useYn: boolean): void {
		this.app.useYn = useYn;
	}

	/**
	 * 카테고리 체크박스 이벤트
	 *
	 * @param {number} index
	 * @param {Event} event
	 */
	public analysisAppCategoryCheckbox(index: number, event: Event): void {
		event.stopPropagation();
		this.categories[ index ].isChecked = !this.categories[ index ].isChecked;
	}

	/**
	 * 파일 첨부 변경시
	 *    - Output event
	 *
	 * @param {FileItem[]} files
	 */
	public oChangeFile(files: FileItem[]): void {
		this.validation.isFilesValidationFail = files.length === 0;
	}

	/**
	 * 메타트론 대시보드 선택 팝업
	 *    - 적용
	 *
	 * @param $event
	 */
	public metatronDashboardSelectedDone($event) {
		this.isDashboardLayerOpen = false;
		this.validation.isMetatronHeaderContentsIdValidationFail = false;
		this.app.metatronHeader.type = $event.type;
		this.app.metatronHeader.contentsId = $event.id;
		this.app.metatronHeader.contentsNm = $event.name;
		this.app.metatronHeader.locationId = $event.workbookId;
	}

	/**
	 *
	 *
	 * @param {AnalysisApp.ExtractHeader} extractHeader
	 */
	public doneExtractModal(extractHeader: AnalysisApp.ExtractHeader): void {
		this.app.extractHeader = extractHeader;
		this.isExtractLayerOpen = false
	}

	public getMetatronDashboardContentName(): string {
		if (_.isEmpty(this.app.metatronHeader.contentsNm)) {
			return '';
		} else {
			return `[${this.app.metatronHeader.type.toUpperCase()}] ${this.app.metatronHeader.contentsNm}`;
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Router navigate
	 *
	 * @param {string} routerLink
	 */
	private routerLink(routerLink: string): void {
		this.router.navigate([ routerLink ]);
	}

	/**
	 * History back
	 */
	private goBack(): void {
		this.location.back();
	}

	/**
	 * 분석 앱 생성
	 *
	 * @param {FormData} formData
	 */
	private createAnalysisApp(formData: FormData): void {

		Loading.show();

		if (this.isCreateMode(this.parameter.id)) {
			this.analysisAppService
				.createAnalysisApp(formData)
				.then((result) => {
					if (result.code === 'C0000') {
						Alert.success('등록되었습니다');
						Loading.hide();
						this.router.navigate([ 'view/management/analysis-app' ]);
					} else {
						Loading.hide();
						Alert.error('서버 오류가 발생했습니다.');
					}
				})
				.catch((error) => {
					this.logger.error(`[${this[ '__proto__' ].constructor.name}] > error`, error);
				});
		} else {
			this.analysisAppService
				.updateAnalysisApp(this.parameter.id, formData)
				.then((result) => {
					if (result.code === 'C0000') {
						Alert.success('수정되었습니다.');

						// LNB 메뉴 데이터 다시 생성
						this.layoutService.createDataSetUsedByLnb();

						Loading.hide();
						this.router.navigate([ 'view/management/analysis-app' ]);
					} else {
						Loading.hide();
						Alert.error('서버 오류가 발생했습니다.');
					}
				})
				.catch((error) => {
					this.logger.error(`[${this[ '__proto__' ].constructor.name}] > error`, error);
				});
		}
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 생성 모드인지 검사
	 *    - 분석 앱을 생성하기 위해서 진입했는지 검사
	 *
	 * @param {string} analysisAppId
	 * @returns {boolean}
	 */
	private isCreateMode(analysisAppId: string): boolean {
		return analysisAppId === '' || typeof analysisAppId === 'undefined';
	}

	/**
	 * 폼 데이터 생성
	 *
	 * @returns {FormData}
	 */
	private createFormData(): FormData {

		const formData = new FormData();
		formData.append('headerType', this.app.headerType.toString());

		switch (this.headerType) {
			case 'URL': {
				formData.append('urlHeader.url', this.app.urlHeader.url);
				break;
			}
			case 'METATRON': {
				formData.append('metatronHeader.type', this.app.metatronHeader.type);
				formData.append('metatronHeader.contentsId', this.app.metatronHeader.contentsId);
				formData.append('metatronHeader.contentsNm', this.app.metatronHeader.contentsNm);
				formData.append('metatronHeader.locationId', this.app.metatronHeader.locationId);
				break;
			}
			case 'EXTRACT': {
				formData.append('extractHeader.dataSourceId', this.app.extractHeader.dataSource.id);
				formData.append('extractHeader.sqlTxt', this.app.extractHeader.sqlTxt);
				break;
			}
		}

		this.categories.forEach(category => {
			if (category.isChecked) {
				formData.append(`categories`, category.id);
			}
		});

		this.authenticationSettingsComponent
			.getRoleIdList()
			.forEach(roleId => {
				formData.append(`roles`, roleId);
			});

		formData.append('appNm', this.app.appNm);
		formData.append('summary', this.app.summary);
		formData.append('contents', this.app.contents);
		formData.append('ver', this.app.ver);
		formData.append('verInfo', this.app.verInfo);
		formData.append('useYn', this.app.useYn.toString());
		formData.append('externalYn', this.app.externalYn.toString());

		this.app.files.forEach((file) => {
			formData.append('files', file.file.rawFile, file.file.name);
		});

		if (this.isCreateMode(this.parameter.id) === false) {

			formData.append('id', this.app.id);
			formData.append('mediaGroupId', this.app.mediaGroupId);

			this.app[ 'delFileIds' ].forEach((delFileId) => {
				formData.append(`delFileIds`, delFileId);
			});
		}

		return formData;
	}

}
