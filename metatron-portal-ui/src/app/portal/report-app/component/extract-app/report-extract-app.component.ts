import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {ExtractService} from '../../../management/shared/extract/service/extract.service';
import {Loading} from '../../../../common/util/loading-util';
import {CommonConstant} from '../../../common/constant/common-constant';
import {DataSource} from '../../../management/shared/datasource/value/data-source';
import {DataSourceService} from '../../../management/shared/datasource/service/data-source.service';
import {TranslateService} from 'ng2-translate';
import {ExtractSql} from '../../../management/shared/extract/value/extract-app-process';
import * as _ from 'lodash';
import {SelectValue} from '../../../../common/component/select/select.value';
import {Alert} from '../../../../common/util/alert-util';
import {header, SlickGridHeader} from '../../../../common/component/grid/grid.header';
import {GridOption} from 'app/common/component/grid/grid.option';
import {GridComponent} from '../../../../common/component/grid/grid.component';
import {ReportAppService} from '../../service/report-app.service';

@Component({
	selector: '[report-extract-app]',
	templateUrl: './report-extract-app.component.html'
})
export class ReportExtractAppComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild('grid') private grid: GridComponent;

	private parsedSql: ExtractSql.ExtractSql = null;

	private appName: string = '';

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public extractParseParameter: DataSource.ExecuteSelectQueryParameter = new DataSource.ExecuteSelectQueryParameter();

	public modules: ExtractSql.ModulesEntity[][] = [];

	public isConditionFolding: boolean = true;

	public selectedCustomVariable: ExtractSql.ModulesEntity = null;

	public customVariableSelectLayerCallBackFn: Function = () => {};

	public isQueryFail: boolean = false;

	public isResultEmpty: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private appService: ReportAppService,
				private dataSourceService: DataSourceService,
				public translateService: TranslateService,
				private extractService: ExtractService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		this.extractParseParameter.max = 1000;
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public init(id: string) {

		Loading.show();

		this.extractParseParameter.max = 1000;
		this.modules = [];
		this.isQueryFail = false;
		this.isResultEmpty = false;

		if (!this.isGridUndefined()) {
			this.grid.destroy();
		}

		this.appService
			.getDetail(id)
			.then((result) => {

				if (result.code !== CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Loading.hide();
					return;
				}

				this.saveAppName(result.data.reportApp.appNm);
				this.saveExtractParseParamDatasourceId(result.data.reportApp.extractHeader.dataSource.id);
				this.saveExtractParseParamSql(result.data.reportApp.extractHeader.sqlTxt);

				this.sqlParser(this.extractParseParameter.sql);

			});
	}

	public execute() {

		for (let i = 0; i < this.modules.length; i++) {
			for (let j = 0; j < this.modules[ i ].length; j++) {
				const module: ExtractSql.ModulesEntity = this.modules[ i ][ j ];
				if (typeof module.input === 'undefined' || module.input === '') {
					module.isSuccess = false;
					Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
					this.isConditionFolding = true;
					return;
				}
			}
		}

		if (typeof this.extractParseParameter.max === 'undefined') {
			this.extractParseParameter.isValidationMax = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (String(this.extractParseParameter.max) === '') {
			this.extractParseParameter.isValidationMax = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (Number(this.extractParseParameter.max) < 0) {
			this.extractParseParameter.isValidationMax = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (Number(this.extractParseParameter.max) === 0) {
			this.extractParseParameter.isValidationMax = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (this.extractParseParameter.isMaxRowExcess(Number(this.extractParseParameter.max))) {
			this.extractParseParameter.max = this.extractParseParameter.MAX_ROW;
		}

		this.process(this.parsedSql, () => this.executeQuery());
	}

	public reset() {
		this.initialize();
	}

	public showCustomVariableSelectLayer(module: ExtractSql.ModulesEntity) {
		this.selectedCustomVariable = module;
		this.customVariableSelectLayerCallBackFn = (codes: string, labels: string) => {
			module.label = labels;
			module.input = codes;
			if (_.isNil(module.input) === false && _.isEmpty(module.input) === false) {
				module.isSuccess = true;
			}
		};
	}

	public completeCustomVariableSelect($event) {
		$event.fn($event.codes, $event.labels);
		this.selectedCustomVariable = null;
	}

	public downloadExcel() {

		for (let i = 0; i < this.modules.length; i++) {
			for (let j = 0; j < this.modules[ i ].length; j++) {
				const module: ExtractSql.ModulesEntity = this.modules[ i ][ j ];
				if (typeof module.input === 'undefined' || module.input === '') {
					module.isSuccess = false;
					Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
					this.isConditionFolding = true;
					return;
				}
			}
		}

		if (typeof this.extractParseParameter.max === 'undefined') {
			this.extractParseParameter.isValidationMax = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (String(this.extractParseParameter.max) === '') {
			this.extractParseParameter.isValidationMax = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (Number(this.extractParseParameter.max) < 0) {
			this.extractParseParameter.isValidationMax = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (Number(this.extractParseParameter.max) === 0) {
			this.extractParseParameter.isValidationMax = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (this.extractParseParameter.isMaxRowExcess(Number(this.extractParseParameter.max))) {
			this.extractParseParameter.max = this.extractParseParameter.MAX_ROW;
		}

		this.process(this.parsedSql, () => {
			this.dataSourceService.excelExport(this.extractParseParameter, this.appName);
			Loading.hide();
		});

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private sqlParser(sql: string) {

		Loading.show();

		this.extractService
			.extractParse(sql)
			.then(result => {

				if (result.code !== CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Loading.hide();
					this.parsedSql = null;
					return;
				}

				this.parsedSql = result.data.extractSql;

				if (this.parsedSql.modules.length === 0) {
					Loading.hide();
					return;
				}

				this.modules = _.chunk(this.parsedSql.modules, 3);
				this.initialize();

				Loading.hide();

			});
	}

	private saveExtractParseParamSql(sqlTxt: string) {
		this.extractParseParameter.sql = sqlTxt;
	}

	private saveExtractParseParamDatasourceId(dataSourceId: string) {
		this.extractParseParameter.dataSourceId = dataSourceId;
	}

	private saveAppName(appName: string) {
		this.appName = appName;
	}

	private initialize() {
		this.modules.forEach(data => {
			data.map(module => {

				if (_.isUndefined(module.args) === false) {
					if (module.namespace === 'TEXT') {
						module.input = module.args[ 0 ];
					} else if (module.namespace === 'NUMBER') {
						module.input = module.args[ 0 ];
					} else if (module.namespace === 'SELECT') {
						const selectBoxItems: SelectValue[] = [];
						module.args.forEach((argument, index) => {
							selectBoxItems.push(new SelectValue(argument, argument, index === 0))
						});
						module.selectValues = selectBoxItems;
						if (module.selectValues.length > 0) {
							module.input = module.selectValues[ 0 ].value;
						}
					} else if (module.namespace === 'ARRAY') {
						module.input = module.args
							.map(argument => {
								return argument;
							}).join(',');
					} else if (module.namespace === 'DATE') {
						module.input = '';
					} else if (module.namespace === 'DATETIME') {
						module.input = '';
					}
				}

				if (module.moduleType === 'CUSTOM') {
					module.input = '';
					module.label = '';
				}

				module.isSuccess = true;

			})
		});
	}

	private executeQuery() {

		Loading.show();

		if (!this.isGridUndefined()) {
			this.grid.destroy();
		}

		this.dataSourceService
			.executeSelectQuery(this.extractParseParameter)
			.then(result => {

				this.isQueryFail = false;

				if (result.code !== CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.isResultEmpty = true;
					this.isQueryFail = true;
					Loading.hide();
					return;
				}

				const queryResult: DataSource.QueryResult = result.data.queryResult;
				this.isResultEmpty = this.hasHeader(queryResult);

				const headers: header[] = [];
				queryResult.headList.forEach(columnHeaderName => {
					headers.push(new SlickGridHeader()
						.Id(columnHeaderName)
						.Name(columnHeaderName)
						.Field(columnHeaderName)
						.Behavior('select')
						.CssClass('cell-selection')
						.Width(330)
						.CannotTriggerInsert(true)
						.Resizable(true)
						.Unselectable(true)
						.Sortable(true)
						.build()
					);
				});

				if (headers.length > 0) {
					this.grid.create(headers, queryResult.resultList, new GridOption()
						.SyncColumnCellResize(true)
						.MultiColumnSort(true)
						.RowHeight(38)
						.MultiSelect(false)
						.build()
					);
				}

				Loading.hide();
			});
	}

	private isGridUndefined() {
		return typeof this.grid.dataView === 'undefined';
	}

	private hasHeader(queryResult: DataSource.QueryResult) {
		return queryResult.headList.length > 0;
	}

	private process(parsedSql: ExtractSql.ExtractSql, service: Function) {

		Loading.show();

		this.extractService
			.extractProcess(parsedSql)
			.then(result => {

				if (result.code !== CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.parsedSql = null;
					Loading.hide();
				}

				this.extractParseParameter.sql = result.data.processed;
				service.call(this);

			});
	}

}
