import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Meta} from '../../value/meta';
import {GridComponent} from '../../../../common/component/grid/grid.component';
import {MetaService} from '../../service/meta.service';
import {header, SlickGridHeader} from '../../../../common/component/grid/grid.header';
import {GridOption} from 'app/common/component/grid/grid.option';
import {Loading} from '../../../../common/util/loading-util';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Page} from 'app/portal/common/value/result-value';
import {TranslateService} from 'ng2-translate';

@Component({
	selector: '[database-detail]',
	templateUrl: './database-detail.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class DatabaseDetailComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	 * @type {EventEmitter<Meta.Table>}
	 */
	@Output('onRowSelected')
	private oRowSelected: EventEmitter<Meta.Table> = new EventEmitter();

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

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터 웨어하우스 데이터베이스
	 *
	 * @type {Meta.Database}
	 */
	public database: Meta.Database = new Meta.Database();

	/**
	 * 데이터 웨어하우스 데이터베이스 아이디
	 */
	@Input()
	public databaseId: string;

	/**
	 * 테이블 목록
	 */
	public tableList: Meta.Table[] = [];

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
				return this.getDatabase(this.databaseId);
			})
			.then(() => {
				return this.getDatabaseTableList();
			})
			.then(() => {
				return Loading.hide();
			})
			.catch(error => {
				return Loading.hide();
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
		} else if (value > 1) {
			value = 1;
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

			if (this.tableList.length > 0) {

				const headers: header[] = [];
				headers.push(new SlickGridHeader()
					.Id('physicalNm')
					.Name('테이블 물리명')
					.Field('physicalNm')
					.Behavior('physicalNm')
					.CssClass('cell-selection')
					.Width(155)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(false)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('logicalNm')
					.Name('테이블 논리명')
					.Field('logicalNm')
					.Behavior('logicalNm')
					.CssClass('cell-selection')
					.Width(155)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(false)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('description')
					.Name('테이블 설명')
					.Field('description')
					.Behavior('description')
					.CssClass('cell-selection')
					.Width(340)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(false)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('subjectFqnStr')
					.Name('주제 영역')
					.Field('subjectFqnStr')
					.Behavior('subjectFqnStr')
					.CssClass('cell-selection')
					.Width(340)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(false)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('databasePhysicalNm')
					.Name('데이터베이스명')
					.Field('databasePhysicalNm')
					.Behavior('databasePhysicalNm')
					.CssClass('cell-selection')
					.Width(135)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(false)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('primaryKeyDelimiter')
					.Name('보안통제등급')
					.Field('primaryKeyDelimiter')
					.Behavior('primaryKeyDelimiter')
					.CssClass('cell-selection')
					.Width(130)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(false)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('statusNm')
					.Name('관리상태')
					.Field('statusNm')
					.Behavior('statusNm')
					.CssClass('cell-selection')
					.Width(120)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(false)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('retentionNm')
					.Name('데이터 보관기간')
					.Field('retentionNm')
					.Behavior('retentionNm')
					.CssClass('cell-selection')
					.Width(130)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(false)
					.build()
				);
				headers.push(new SlickGridHeader()
					.Id('columnCnt')
					.Name('하위 컬럼 수')
					.Field('columnCnt')
					.Behavior('columnCnt')
					.CssClass('cell-selection')
					.Width(130)
					.CannotTriggerInsert(true)
					.Resizable(true)
					.Unselectable(true)
					.Sortable(false)
					.build()
				);

				this[ `grid${tabIndex}` ].create(headers, this.tableList, new GridOption()
					.SyncColumnCellResize(true)
					.MultiColumnSort(true)
					.RowHeight(32)
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
		row: Meta.Table,
		selected: boolean,
		error: boolean
	}): void {
		if (selectedRow.selected) {
			this.oRowSelected.emit(selectedRow.row);
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터베이스 조회
	 *
	 * @param {string} id
	 */
	private getDatabase(id: string) {

		return this.metaService
			.getDatabase(id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.database = result.data.database;
					this.tagging(this.TaggingType.DETAIL, this.TaggingAction.VIEW, this.database.id, this.database.logicalNm === undefined || this.database.logicalNm.trim() == '' ? this.database.physicalNm : this.database.logicalNm + ' / ' + this.database.physicalNm);
				} else {
					this.database = new Meta.Database();
				}

			});
	}

	/**
	 * getDatabaseTableList
	 */
	private getDatabaseTableList() {
		return this.metaService
			.getDatabaseTable(this.databaseId, Meta.Target.ALL, null, null, new Page().createNonPagingValueObject())
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.tableList = result.data.tableList.content;
				} else {
					this.tableList = [];
				}

			});
	}

}
