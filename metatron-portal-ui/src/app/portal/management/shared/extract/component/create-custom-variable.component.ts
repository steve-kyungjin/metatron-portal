import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DataSourceService} from '../../datasource/service/data-source.service';
import {DataSource} from '../../datasource/value/data-source';
import {TranslateService} from 'ng2-translate';
import {CodemirrorComponent} from '../../../../../common/component/codemirror/codemirror.component';
import {ExtractService} from '../service/extract.service';
import {ExecuteConditionEnterInformationComponent} from './execute-condition-enter-information.component';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {GridOption} from '../../../../../common/component/grid/grid.option';
import {Loading} from '../../../../../common/util/loading-util';
import {Alert} from '../../../../../common/util/alert-util';
import {GridComponent} from '../../../../../common/component/grid/grid.component';
import {Validate} from '../../../../../common/util/validate-util';
import {header, SlickGridHeader} from '../../../../../common/component/grid/grid.header';
import {DialogService} from '../../../../../common/component/dialog/dialog.service';
import {CommonConstant} from '../../../../common/constant/common-constant';
import * as _ from 'lodash';
import {ExtractSql} from '../value/extract-app-process';
import ExecuteSelectQueryParameter = DataSource.ExecuteSelectQueryParameter;

@Component({
	selector: '[extract-custom-variable-layer]',
	templateUrl: './create-custom-variable.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class CreateCustomVariableComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 에디터 모드
	 */
	private EDITOR_MODES: { MYSQL: string; HIVE: string } = {
		'MYSQL': 'text/x-mariadb',
		'HIVE': 'text/x-hive'
	};

	/**
	 * 그리드
	 */
	@ViewChild(GridComponent)
	private grid: GridComponent;

	/**
	 * 에디터
	 */
	@ViewChild('codemirror')
	private editor: CodemirrorComponent;

	/**
	 * 에디터를 감싸는 Div 엘리먼트
	 */
	@ViewChild('editorWrapperDiv')
	private editorWrapperDiv: ElementRef;

	/**
	 * 취소 이벤트
	 */
	@Output()
	private onClose = new EventEmitter();

	/**
	 * 적용 이벤트
	 */
	@Output()
	private onDone = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 에디터 옵션
	 */
	public config: {
		mode: string;
		indentWithTabs: boolean;
		lineNumbers: boolean;
		matchBrackets: boolean;
		autofocus: boolean;
		indentUnit: number;
		showSearchButton: boolean;
		extraKeys: {
			'Ctrl-Space': string;
			'Ctrl-/': string;
			'Shift-Tab': string;
			Tab: string;
			'Shift-Ctrl-Space': string;
			'Cmd-Alt-Space': string
		};
		hintOptions: {
			tables: {}
		}
	} = {
		mode: 'text/x-mariadb',
		indentWithTabs: true,
		lineNumbers: true,
		matchBrackets: true,
		autofocus: true,
		indentUnit: 4,
		showSearchButton: true,
		extraKeys: {
			'Ctrl-Space': 'autocomplete',
			'Ctrl-/': 'toggleComment',
			'Shift-Tab': 'indentLess',
			'Tab': 'indentMore',
			'Shift-Ctrl-Space': 'autocomplete',
			'Cmd-Alt-Space': 'autocomplete'
		},
		hintOptions: {
			tables: {}
		}
	};

	/**
	 * 선택된 데이터 소스
	 *    - 기본값 null 처리
	 *
	 * @type {null}
	 */
	public selectedDataSource: DataSource.Entity = null;

	/**
	 * 에디터 레이아웃 확장 여부
	 *
	 * @type {boolean}
	 */
	public isEditorLayoutEnlarge: boolean = false;

	/**
	 * 그리드 레아아웃 확장 여부
	 *
	 * @type {boolean}
	 */

	public isGridLayoutEnlarge: boolean = false;

	/**
	 * 데이터 소스 생성 레이어 Show, Hide 플래그
	 *
	 * @type {boolean}
	 */
	public isShowCreateDataSourceModal: boolean = false;

	/**
	 * 데이터 소스 목록
	 *
	 * @type {boolean}
	 */
	public dataSourceList: DataSource.Entity[] = [];

	/**
	 * Query 성공 실패 여부
	 *
	 * @type {boolean}
	 */
	public isQueryFail: boolean = false;

	/**
	 * 선택된 쿼리 실행 파라미터
	 *
	 * @type {DataSource.ExecuteSelectQueryParameter}
	 */
	public executeSelectQueryParameter: ExecuteSelectQueryParameter = new ExecuteSelectQueryParameter();

	/**
	 * 실행 조건 입력 팝업
	 */
	@ViewChild(ExecuteConditionEnterInformationComponent)
	public executeConditionEnterInformationComponent: ExecuteConditionEnterInformationComponent;

	/**
	 * 쿼리 결과 성공 여부
	 *
	 * @type {boolean}
	 */
	public isQueryResultSuccess: boolean = false;

	public customVariable: ExtractSql.CustomVariable = new ExtractSql.CustomVariable();

	@Input()
	public defaultCustomVariable: ExtractSql.CustomVariable = null;

	public isValidationName: boolean = false;
	public isValidationDescription: boolean = false;
	public isValidationSearchKey: boolean = false;

	public isEditMode: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private dialogService: DialogService,
				private translateService: TranslateService,
				private dataSourceService: DataSourceService,
				private extractService: ExtractService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		Promise.resolve()
			.then(() => this.getDataSourceList())
			.then(() => {

				if (this.defaultCustomVariable !== null) {
					this.isEditMode = true;
					this.extractService.getCustomVariable(this.defaultCustomVariable.id)
						.then(result => {
							if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
								const customVariableResult: ExtractSql.CustomVariable = result.data.var;
								this.defaultCustomVariable.id = customVariableResult.id;
								this.defaultCustomVariable.name = customVariableResult.name;
								this.defaultCustomVariable.description = customVariableResult.description;
								this.defaultCustomVariable.sqlTxt = customVariableResult.sqlTxt;
								this.defaultCustomVariable.searchKey = customVariableResult.searchKey;
								this.defaultCustomVariable.dataSourceId = customVariableResult.dataSourceId;
								this.customVariable = _.cloneDeep(this.defaultCustomVariable);
								this.editor.setText(this.customVariable.sqlTxt);
								const savedDatasource: DataSource.Entity = this.dataSourceList.find(datasource => datasource.id === this.customVariable.dataSourceId);
								if (savedDatasource) {
									this.selectedDataSource = savedDatasource;
								} else {
									Alert.warning(`사용중인 데이터소스가 삭제되었습니다.`);
								}
							}
						})
				}

			})
			.catch(() => {
				Loading.hide();
				Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			});

	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 취소
	 */
	public cancel(): void {
		this.onClose.emit();
	}

	/**
	 * 적용
	 */
	public done(): void {

		if (this.selectedDataSource === null) {
			Alert.warning(`${this.translateService.instant('EXTRACT.LAYER.PLEASE.SELECT.DATASOURCE', '데이터 소스를 선택해주세요.')}`);
			return;
		}

		if (_.isEmpty(this.customVariable.name)) {
			this.isValidationName = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (/^[a-z0-9_]*$/.test(this.customVariable.name) === false) {
			this.isValidationName = true;
			Alert.warning('변수명은 영어 소문자, 숫자, _ 만 사용할 수 있습니다.');
			return;
		}

		if (this.customVariable.name.length > 20) {
			this.isValidationName = true;
			Alert.warning('변수명은 최대 20자까지 입력할 수 있습니다.');
			return;
		}

		let query: string = '';

		if (this.editor.value.indexOf(';') === -1) {
			query = this.editor.value;
		} else {
			const queryList: string[] = this.editor.value.split(';');
			query = queryList[ 0 ];
		}

		if (_.isNil(query) || Validate.isEmpty(query)) {
			Alert.warning(`${this.translateService.instant('EXTRACT.LAYER.PLEASE.QUERY.ENTER.INFORMATION', '쿼리를 입력해주세요.')}`);
			return;
		}

		if (query.indexOf('code') === -1 || query.indexOf('label') === -1) {
			Alert.warning(`SQL 구문에는 반드시 code, label 에 대한 Alias가 존재해야 합니다`);
			return;
		}

		Loading.show();

		this.dataSourceService
			.dataSourceValidByDataSourceId(this.selectedDataSource.id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					if (!this.isEditMode) {

						this.extractService.customVarNameDuplicateCheck(this.customVariable.name)
							.then(result => {

								if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

									if (result.data.exists) {
										this.isValidationName = true;
										Alert.warning(`사용중인 이름 입니다.`);
										Loading.hide();
										return;
									}

									this.customVariable.sqlTxt = query;
									this.customVariable.dataSourceId = this.selectedDataSource.id;

									this.extractService.createCustomVariable(this.customVariable)
										.then(result => {
											if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
												Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
												this.onDone.emit();
											} else {
												Alert.warning(`사용중인 이름 입니다.`);
											}
										});
								}
							});

					} else {

						if (this.defaultCustomVariable.name !== this.customVariable.name) {
							Alert.warning(`변수명은 수정할 수 없습니다.`);
							Loading.hide();
							return;
						}

						this.customVariable.sqlTxt = query;
						this.customVariable.dataSourceId = this.selectedDataSource.id;

						this.extractService.updateCustomVariable(this.customVariable)
							.then(result => {
								if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
									Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));
									this.onDone.emit();
								} else {
									Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
									Loading.hide();
								}
							});

					}

				} else {
					Alert.warning(`${this.translateService.instant('EXTRACT.LAYER.NOT.FOUND.DATASOURCE', '삭제된 데이터 소스 입니다.')}`);
					this.selectedDataSource = null;
					this.getDataSourceList();
				}

			});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 데이터 소스 관련
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 데이터 소스 선택 시
	 *
	 * @param datasource
	 */
	public selectDataSource(datasource): void {

		if (_.isNil(datasource)) {
			Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			return;
		}

		// Config 모드 수정
		this.changeConfigInMode(datasource.databaseType);
		// 에디터 옵션 수정
		this.changeEditorOption(this.config);
		// 선택된 데이터 소스 값 변경
		this.selectedDataSource = datasource;
	}

	/**
	 * 데이터 소스 생성 모달 열기
	 */
	public showCreateDataSourceModal(): void {
		this.isShowCreateDataSourceModal = true;
	}

	/**
	 * 데이터 소스 생성 취소
	 */
	public dataSourceCreateCancel(): void {
		this.isShowCreateDataSourceModal = false;
	}

	/**
	 * 데이터 소스 생성 완료
	 */
	public dataSourceCreateDone(): void {
		this.isShowCreateDataSourceModal = false;
		this.getDataSourceList();
	}

	/**
	 * 데이터 소스 아이디로 데이터 소스 삭제
	 *
	 * @param {string} dataSourceId
	 */
	public deleteDataSourceByDataSourceId(dataSourceId: string): void {

		Loading.show();

		this.dataSourceService
			.deleteDataSourceByDataSourceId(dataSourceId)
			.then(result => {
				try {
					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
						Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
						this.getDataSourceList();
					} else {
						Alert.warning(this.translateService.instant('EXTRACT.LAYER.NOT.DELETE.ACTIVE.DATASOURCE', '사용 중인 데이터 소스는 삭제할 수 없습니다.'));
						Loading.hide();
					}
				} catch (e) {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
					Loading.hide();
				}
			})
			.catch((error) => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			})
	}

	/**
	 * 데이터 소스 삭제 컨펌 모달 열기
	 *
	 * @param {string} dataSourceId
	 */
	public showDeleteDataSourceConfirmModal(dataSourceId: string): void {
		this.dialogService
			.confirm(
				this.translateService.instant('COMMON.DELETE', '삭제'),
				this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제하시겠습니까?'),
				null,
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.CONFIRM', '확인'),
				() => {
					this.logger.debug(`분석 앱 삭제 컨펌 취소 클릭`);
				},
				() => {
					this.deleteDataSourceByDataSourceId(dataSourceId);
				});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 에디터 관련
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 에디터 초기화
	 */
	public editorReset(): void {
		this.editorTextClear();
	}

	/**
	 * 에디터 레이아웃 확대
	 */
	public editorLayoutEnlarge(): void {
		this.isGridLayoutEnlarge = false;
		this.isEditorLayoutEnlarge = !this.isEditorLayoutEnlarge;
		setTimeout(() => {
			this.editor.resize(this.editorWrapperDiv.nativeElement.clientHeight);
			this.editor.editorFocus();
		}, 50);
	}

	/**
	 * 쿼리 실행
	 */
	public executeQuery(): void {

		if (this.selectedDataSource === null) {
			Alert.warning(`${this.translateService.instant('EXTRACT.LAYER.PLEASE.SELECT.DATASOURCE', '데이터 소스를 선택해주세요.')}`);
			return;
		}

		let query: string = '';
		if (this.editor.value.indexOf(';') === -1) {
			query = this.editor.value;
		} else {
			const queryList: string[] = this.editor.value.split(';');
			query = queryList[ 0 ];
		}

		if (_.isNil(query) || Validate.isEmpty(query)) {
			Alert.warning(`${this.translateService.instant('EXTRACT.LAYER.PLEASE.QUERY.ENTER.INFORMATION', '쿼리를 입력해주세요.')}`);
			return;
		}

		if (_.isNil(this.executeSelectQueryParameter.max)) {
			this.executeSelectQueryParameter.max = 1000;
		}

		if (Number(this.executeSelectQueryParameter.max) < 0) {
			Alert.warning(`${this.translateService.instant('EXTRACT.LAYER.EXEC.VALUE.VALIDATION.CHECK.MSG', '실행 값을 1 이상 입력해주세요.')}`);
			return;
		}

		if (Number(this.executeSelectQueryParameter.max) === 0) {
			Alert.warning(`${this.translateService.instant('EXTRACT.LAYER.EXEC.VALUE.VALIDATION.CHECK.MSG', '실행 값을 1 이상 입력해주세요.')}`);
			return;
		}

		if (String(this.executeSelectQueryParameter.max) === '') {
			this.executeSelectQueryParameter.max = 1000;
		}

		if (Number(this.executeSelectQueryParameter.max) > 100000) {
			this.executeSelectQueryParameter.max = 100000;
		}

		// 쿼리 파서 실행
		this.sqlExecute(query);

	}

	private sqlExecute(query) {

		Loading.show();

		this.executeSelectQueryParameter.sql = query;
		this.executeSelectQueryParameter.dataSourceId = this.selectedDataSource.id;

		this.dataSourceService
			.executeSelectQuery(this.executeSelectQueryParameter)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					if (result.data.queryResult.headList.length === 0 && result.data.queryResult.resultList.length === 0) {

						if (this.isGridUndefined() === false) {
							this.grid.destroy();
							this.isQueryResultSuccess = false;
						}

						this.isQueryFail = true;
					} else {

						this.isQueryFail = false;
						this.isQueryResultSuccess = true;

						const headers: header[] = [];

						result.data.queryResult.headList
							.forEach(columnHeaderName => {
								headers.push(new SlickGridHeader()
									.Id(columnHeaderName)
									.Name(columnHeaderName)
									.Field(columnHeaderName)
									.Behavior('select')
									.CssClass('cell-selection')
									.Width(200)
									.CannotTriggerInsert(true)
									.Resizable(true)
									.Unselectable(true)
									.Sortable(true)
									.build()
								);
							});

						this.grid.create(headers, result.data.queryResult.resultList, new GridOption()
							.SyncColumnCellResize(true)
							.MultiColumnSort(true)
							.RowHeight(38)
							.ColumnGroup(false)
							.MultiSelect(false)
							.build()
						);
					}

				} else {

					this.isQueryFail = true;

					if (this.isGridUndefined() === false) {
						this.grid.destroy();
						this.isQueryResultSuccess = false;
					}
				}

				Loading.hide();
			})
			.catch((error) => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 그리드 관련
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 그리드 레이아웃 확대
	 */
	public gridLayoutEnlarge(): void {

		this.isEditorLayoutEnlarge = false;
		this.isGridLayoutEnlarge = !this.isGridLayoutEnlarge;

		setTimeout(() => {
			this.grid.resize();
		}, 500)

	}

	/**
	 * 그리드가 생성되었는지 여부
	 *
	 * @returns {boolean}
	 */
	public isGridUndefined() {
		return typeof this.grid.dataView === 'undefined';
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터 소스 목록 조회
	 *
	 * @param {boolean} isShowLoading
	 * @returns {Promise<void>}
	 */
	private getDataSourceList(isShowLoading: boolean = true): Promise<void> {

		if (isShowLoading) {
			Loading.show();
		}

		return this.dataSourceService
			.getDataSourceList()
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.dataSourceList = result.data[ 'dataSourceList' ];
				} else {
					this.dataSourceList = [];
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

				// if (this.defaultCustomVariable !== null) {
				//
				// 	this.isEditMode = true;
				// 	this.customVariable = this.defaultCustomVariable;
				// 	this.editor.setText(this.customVariable.sqlTxt);
				//
				// 	const savedDatasource: DataSource.Entity = this.dataSourceList.find(datasource => datasource.id === this.customVariable.dataSourceId);
				// 	if (savedDatasource) {
				// 		this.selectedDataSource = savedDatasource;
				// 	} else {
				// 		Alert.warning(`사용중인 데이터소스가 삭제되었습니다.`);
				// 	}
				//
				// }

				if (isShowLoading) {
					Loading.hide();
				}
			});
	}

	/**
	 * 에디터 텍스트 지우기
	 */
	private editorTextClear(): void {
		this.editor.writeValue('');
	}

	/**
	 * 에디터 옵션 수정
	 *
	 * @param config
	 */
	private changeEditorOption(config: {
		mode: string;
		indentWithTabs: boolean;
		lineNumbers: boolean;
		matchBrackets: boolean;
		autofocus: boolean;
		indentUnit: number;
		showSearchButton: boolean;
		extraKeys: {
			'Ctrl-Space': string;
			'Ctrl-/': string;
			'Shift-Tab': string;
			Tab: string;
			'Shift-Ctrl-Space': string;
			'Cmd-Alt-Space': string
		};
		hintOptions: {
			tables: {}
		}
	}) {

		if (_.isNil(config)) {
			Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			return;
		}

		if (_.isNil(config.mode)) {
			Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			return;
		}

		if (_.isNil(this.editor)) {
			Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			return;
		}

		this.editor.instance.setOption('mode', config.mode);
		this.editor.instance.refresh();
	}

	/**
	 * Config 모드 수정
	 *
	 * @param databaseType
	 */
	private changeConfigInMode(databaseType: string): void {

		if (_.isNil(databaseType)) {
			Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			return;
		}

		this.config.mode = this.EDITOR_MODES[ databaseType ];
	}

}
