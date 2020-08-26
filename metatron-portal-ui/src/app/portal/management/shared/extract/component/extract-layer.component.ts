import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DataSourceService} from '../../datasource/service/data-source.service';
import {DataSource} from '../../datasource/value/data-source';
import {TranslateService} from 'ng2-translate';
import {CodemirrorComponent} from '../../../../../common/component/codemirror/codemirror.component';
import {ExtractService} from '../service/extract.service';
import {ExtractSql} from '../value/extract-app-process';
import {ExecuteConditionEnterInformationComponent} from './execute-condition-enter-information.component';
import {AnalysisApp} from '../../../../analysis-app/value/analysis-app.value';
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
import {ReportApp} from '../../../../report-app/value/report-app.value';
import ExecuteSelectQueryParameter = DataSource.ExecuteSelectQueryParameter;

@Component({
	selector: '[extract-layer]',
	templateUrl: './extract-layer.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class ExtractLayerComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	 *
	 * @type {EventEmitter<any>}
	 */
	@Output()
	private onClose: EventEmitter<any> = new EventEmitter();

	/**
	 * 적용 이벤트
	 */
	@Output()
	private onDone: EventEmitter<AnalysisApp.ExtractHeader | ReportApp.ExtractHeader> = new EventEmitter();

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
	 * 도움말 레이어 숨김 여부
	 *
	 * @type {boolean}
	 */
	public isHelpLayerHidden: boolean = true;

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
	 * 기존 헤더 값
	 */
	private _defaultExtractHeader: AnalysisApp.ExtractHeader = null;

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
	 * 실행 조건 입력 팝업 보여줄지 여부
	 *
	 * @type {boolean}
	 */
	public isShowExecuteConditionEnterInformation: boolean = false;

	/**
	 * 쿼리 결과 성공 여부
	 *
	 * @type {boolean}
	 */
	public isQueryResultSuccess: boolean = false;

	/**
	 * ExtractSql
	 */
	public extractSql: ExtractSql.ExtractSql = null;

	public isSelectVariableLayerOpen: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param dialogService
	 * @param translateService
	 * @param dataSourceService
	 * @param extractService
	 */
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
		// 빈 데이터 소스 목록이있는 경우 도움말 팝업 표시
		this.showHelpPopupIfEmptyDataSourceListExists();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	get defaultExtractHeader(): AnalysisApp.ExtractHeader {
		return this._defaultExtractHeader;
	}

	@Input()
	set defaultExtractHeader(value: AnalysisApp.ExtractHeader) {
		if (value.sqlTxt !== '' && value.dataSource.id !== '') {
			this._defaultExtractHeader = value;
		} else {
			this._defaultExtractHeader = null;
		}
	}

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

		Loading.show();

		this.dataSourceService
			.dataSourceValidByDataSourceId(this.selectedDataSource.id)
			.then(result => {
				try {
					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

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

						const extractHeader: AnalysisApp.ExtractHeader | ReportApp.ExtractHeader = new AnalysisApp.ExtractHeader();
						extractHeader.dataSource = new DataSource.Entity();
						extractHeader.dataSource.id = this.selectedDataSource.id;
						extractHeader.dataSource.name = this.selectedDataSource.name;
						extractHeader.sqlTxt = query;

						Loading.hide();

						this.onDone.emit(extractHeader);
					} else {
						Alert.warning(`${this.translateService.instant('EXTRACT.LAYER.NOT.FOUND.DATASOURCE', '삭제된 데이터 소스 입니다.')}`);
						this.selectedDataSource = null;
						this.getDataSourceList();
					}
				} catch (e) {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
					Loading.hide();
				}

			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
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
		this.extractParse(query);
	}

	/**
	 * Query 파싱
	 *
	 * @param {string} query
	 */
	private extractParse(query: string) {

		Loading.show();

		this.extractService
			.extractParse(query)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					this.extractSql = result.data.extractSql;

					if (this.extractSql.modules.length === 0) {
						this.isShowExecuteConditionEnterInformation = false;
						this.extractProcess(this.extractSql);
					} else {
						this.isShowExecuteConditionEnterInformation = true;
						Loading.hide();
					}

				} else {
					this.extractSql = null;
					Loading.hide();
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * extractProcess
	 *
	 * @param extractSql
	 * @param isLoading
	 */
	private extractProcess(extractSql: ExtractSql.ExtractSql, isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		this.extractService
			.extractProcess(extractSql)
			.then(result => {
				try {
					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

						const query = result.data.processed;
						this.executeSelectQueryParameter.dataSourceId = this.selectedDataSource.id;
						this.executeSelectQueryParameter.sql = query;

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

								if (isLoading) {
									Loading.hide();
								}
							})
							.catch((error) => {
								this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
							});

					} else {

						this.extractSql = null;

						if (isLoading) {
							Loading.hide();
						}
					}
				} catch (e) {

					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);

					if (isLoading) {
						Loading.hide();
					}
				}
			})
			.catch(error => {
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

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 도움말 관련
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 도움말 모달 열기
	 */
	public showHelpModal(): void {
		this.isHelpLayerHidden = false;
	}

	/**
	 * 도움말 모달 닫기
	 */
	public hideHelpModal(): void {
		this.isHelpLayerHidden = true;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 실행조건 입력 모달 관련
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 실행조건 입력 완료 이벤트
	 *
	 * @param {ExtractSql.ModulesEntity[]} modules
	 */
	public doneExecuteConditionEnterInformationModal(modules: ExtractSql.ModulesEntity[]) {
		this.extractSql.modules = modules;
		this.isShowExecuteConditionEnterInformation = false;
		this.extractProcess(this.extractSql);
	}

	public selectVariableLayerOpen() {
		this.isSelectVariableLayerOpen = true;
	}

	public insertQueryExpression(expression) {
		this.editor.appendQueryExpression(expression);
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

				if (isShowLoading) {
					Loading.hide();
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 빈 데이터 소스 목록이있는 경우 도움말 팝업 표시
	 */
	private showHelpPopupIfEmptyDataSourceListExists(): void {

		Loading.show();

		Promise
			.resolve()
			.then(() => {
				return this.getDataSourceList(false);
			})
			.then(() => {

				if (this.defaultExtractHeader !== null) {
					this.dataSourceList
						.forEach(dataSource => {
							if (dataSource.id === this.defaultExtractHeader.dataSource.id) {
								this.selectedDataSource = dataSource;
							}
						})
				}

				if (this.dataSourceList.length === 0) {
					this.showHelpModal()
				}

				Loading.hide();
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
