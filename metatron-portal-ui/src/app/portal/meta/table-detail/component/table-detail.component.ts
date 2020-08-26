import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {MetaService} from '../../service/meta.service';
import {Loading} from '../../../../common/util/loading-util';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Meta} from '../../value/meta';
import * as _ from 'lodash';
import {GridComponent} from '../../../../common/component/grid/grid.component';
import {header, SlickGridHeader} from '../../../../common/component/grid/grid.header';
import {GridOption} from '../../../../common/component/grid/grid.option';
import {PERMISSION_CODE} from '../../../common/value/page-permission';
import {Utils} from '../../../../common/util/utils';
import {TranslateService} from 'ng2-translate';

@Component({
	selector: '[table-detail]',
	templateUrl: './table-detail.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class TableDetailComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 선택 시
	 *
	 * @type {EventEmitter<Meta.Table>}
	 */
	@Output('onSelected')
	private oSelected: EventEmitter<Meta.Table> = new EventEmitter();

	/**
	 * 선택 시
	 *
	 * @type {EventEmitter<Meta.Column>}
	 */
	@Output('onRowSelected')
	private oRowSelected: EventEmitter<Meta.Column> = new EventEmitter();

	/**
	 * 닫기
	 *
	 * @type {EventEmitter<Meta.Table>}
	 */
	@Output('onCancel')
	private oCancel: EventEmitter<any> = new EventEmitter();

	/**
	 * 탭 인덱스
	 *
	 * @type {number}
	 */
	private _selectedTabIndex: number = 0;

	/**
	 *
	 */
	@ViewChild('grid1')
	private grid1: GridComponent;

	/**
	 *
	 */
	@ViewChild('grid2')
	private grid2: GridComponent;

	/**
	 *
	 */
	private sampleDataHeaderList: object[] = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 수정 가능 여부
	 */
	@Input()
	public editEnabled: boolean = this.layoutService.getPagePermissionByIACode(this.layoutService.iaCodes.metadataIaCode).permission === PERMISSION_CODE.RW || this.layoutService.getPagePermissionByIACode(this.layoutService.iaCodes.metadataIaCode).permission === PERMISSION_CODE.SA;

	/**
	 * 수정 모드
	 */
	public isEditMode: boolean = false;

	/**
	 * 데이터 웨어하우스 테이블
	 *
	 * @type {Meta.Table}
	 */
	public table: Meta.Table = new Meta.Table();

	/**
	 * 컬럼 목록
	 */
	public columnList: Meta.Column[] = [];

	/**
	 * 데이터 웨어하우스 테이블 아이디
	 */
	@Input()
	public metaTableId: string;

	/**
	 *
	 */
	public sampleDataResultList: object[] = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param translateService
	 * @param metaService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private metaService: MetaService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		Promise.resolve()
			.then(() => {
				return Loading.show();
			})
			.then(() => {
				return this.getTable(this.metaTableId, false);
			})
			.then(() => {
				return this.getSampleDataList(this.table.id);
			})
			.then(() => {
				return Loading.hide();
			})
			.catch((error) => {
				Loading.hide();
			});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	get selectedTabIndex(): number {
		return this._selectedTabIndex;
	}

	set selectedTabIndex(value: number) {

		if (value === null || _.isUndefined(value)) {
			value = 0;
		} else if (value < 0) {
			value = 0;
		} else if (value > 2) {
			value = 2;
		}

		this._selectedTabIndex = value;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 닫기
	 */
	public cancel(): void {
		this.oCancel.emit();
	}

	/**
	 * 탭 변경
	 *
	 * @param {number} tabIndex
	 */
	public changeTab(tabIndex: number) {

		if (this.selectedTabIndex === tabIndex) {
			return;
		}

		if (tabIndex === 1) {

			if (this.columnList.length > 0) {

				const headers: header[] = [];
				headers.push(new SlickGridHeader()
					.Id('physicalNm')
					.Name('컬럼 물리명')
					.Field('physicalNm')
					.Behavior('physicalNm')
					.CssClass('cell-selection')
					.Width(129)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(true)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('logicalNm')
					.Name('컬럼 논리명')
					.Field('logicalNm')
					.Behavior('logicalNm')
					.CssClass('cell-selection')
					.Width(140)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(true)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('description')
					.Name('컬럼 설명')
					.Field('description')
					.Behavior('description')
					.CssClass('cell-selection')
					.Width(337)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(true)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('dataType')
					.Name('물리 데이터 유형')
					.Field('dataType')
					.Behavior('dataType')
					.CssClass('cell-selection')
					.Width(120)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(true)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('dataSize')
					.Name('물리 데이터 사이즈')
					.Field('dataSize')
					.Behavior('dataSize')
					.CssClass('cell-selection')
					.Width(133)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(true)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('primaryKeyDelimiter')
					.Name('Primary Key 여부')
					.Field('primaryKeyDelimiter')
					.Behavior('primaryKeyDelimiter')
					.CssClass('cell-selection column-center')
					.Width(130)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(true)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('nullableDelimiter')
					.Name('NULL 허용 여부')
					.Field('nullableDelimiter')
					.Behavior('nullableDelimiter')
					.CssClass('cell-selection column-center')
					.Width(130)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(true)
					.build()
				);

				this[ `grid${tabIndex}` ].create(headers, this.columnList, new GridOption()
					.SyncColumnCellResize(true)
					.MultiColumnSort(true)
					.RowHeight(32)
					.MultiSelect(false)
					.build()
				);
			}
		}

		if (tabIndex === 2) {

			if (this.sampleDataHeaderList.length > 0 && this.sampleDataResultList.length > 0) {
				this[ `grid${tabIndex}` ].create(this.sampleDataHeaderList, this.sampleDataResultList, new GridOption()
					.SyncColumnCellResize(true)
					.MultiColumnSort(true)
					.RowHeight(32)
					.ColumnGroup(false)
					.MultiSelect(false)
					.build()
				);
			}

		}

		this.selectedTabIndex = tabIndex;
	}

	/**
	 * 컬럼 그리드에 아이템 선택시
	 *
	 * @param selectedRow
	 */
	public columnGridSelect(selectedRow: {
		event: Event,
		row: Meta.Column,
		selected: boolean,
		error: boolean
	}): void {
		if (selectedRow.selected) {
			this.oRowSelected.emit(selectedRow.row);
		}
	}

	/**
	 * 테이블 샘플 데이터 다운로드
	 */
	public downloadTableSampleData() {
		this.metaService.downloadTableSampleData(this.table.id, `${this.table.physicalNm}.${this.table.databasePhysicalNm}.xlsx`);
	}

	/**
	 *
	 *
	 * @param $event
	 */
	public tableEditDone($event) {
		this.isEditMode = false;
		return this.getTable(this.metaTableId);
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
		return Utils.EscapeUtil.lineBreakOrTabOrSpaceCharacter(text);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 테이블 조회
	 *
	 * @param {string} id
	 * @param isLoading
	 */
	private getTable(id: string, isLoading: boolean = true) {

		if (isLoading) {
			Loading.show();
		}

		return this.metaService
			.getTable(id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.table = result.data.table;

					this.tagging(this.TaggingType.DETAIL, this.TaggingAction.VIEW, this.table.id, this.table.logicalNm === undefined || this.table.logicalNm.trim() == '' ? this.table.physicalNm : this.table.logicalNm + ' / ' + this.table.physicalNm);

					this.columnList = result.data.columnList
						.map(column => {
							column.nullableDelimiter = column.nullable ? 'Y' : 'N';
							column.primaryKeyDelimiter = column.primaryKey ? 'PK' : '';
							return column;
						});
				}

				if (isLoading) {
					Loading.hide();
				}
			});
	}

	/**
	 * 샘플 데이터 목록 가져오기
	 */
	private getSampleDataList(tableId: string) {
		return this.metaService
			.getTableSampleDataList(tableId)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					if (result.data.queryResult.headList.length === 0 && result.data.queryResult.resultList.length === 0) {
						this.sampleDataHeaderList = [];
						this.sampleDataResultList = [];
					} else {

						const headers: header[] = [];
						result.data.queryResult.headList
							.forEach(columnHeaderName => {
								headers.push(new SlickGridHeader()
									.Id(columnHeaderName)
									.Name(columnHeaderName)
									.Field(columnHeaderName)
									.Behavior('select')
									.CssClass('cell-selection')
									.Width(130)
									.CannotTriggerInsert(true)
									.Resizable(true)
									.Unselectable(true)
									.Sortable(true)
									.build()
								);
							});

						this.sampleDataHeaderList = headers;
						this.sampleDataResultList = result.data.queryResult.resultList;
					}
				}

			});
	}

}
