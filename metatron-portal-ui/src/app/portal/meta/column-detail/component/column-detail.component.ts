import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {MetaService} from '../../service/meta.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Loading} from '../../../../common/util/loading-util';
import {Meta} from '../../value/meta';
import {GridComponent} from '../../../../common/component/grid/grid.component';
import * as  _ from 'lodash';
import {header, SlickGridHeader} from '../../../../common/component/grid/grid.header';
import {GridOption} from '../../../../common/component/grid/grid.option';
import {Page, Sort} from '../../../common/value/result-value';
import {PaginationComponent} from '../../../../common/component/pagination/pagination.component';
import {PERMISSION_CODE} from '../../../common/value/page-permission';
import {Utils} from '../../../../common/util/utils';
import {TranslateService} from 'ng2-translate';

@Component({
	selector: '[column-detail]',
	templateUrl: './column-detail.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class ColumnDetailComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 테이블 목록 그리드
	 */
	@ViewChild('tableListGrid')
	private tableListGrid: GridComponent;

	/**
	 * 탭 인덱스
	 *
	 * @type {number}
	 */
	private _selectedTabIndex: number = 0;

	/**
	 * 닫기
	 *
	 * @type {EventEmitter<Meta.Table>}
	 */
	@Output('onCancel')
	private oCancel: EventEmitter<any> = new EventEmitter();

	/**
	 * 선택시
	 *
	 * @type {EventEmitter<Meta.Column>}
	 */
	@Output('onRowSelected')
	private oRowSelected: EventEmitter<Meta.Table> = new EventEmitter();

	/**
	 * 현재 페이지
	 */
	private currentPage: number = 0;

	/**
	 * 페이징 컴포넌트
	 */
	@ViewChild(PaginationComponent)
	private pagination: PaginationComponent;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 컬럼
	 */
	public column: Meta.Column = new Meta.Column();

	/**
	 * 테이블 목록
	 */
	public tableList: Meta.Table[] = [];

	/**
	 * 데이터 웨어하우스 컬럼 아이디
	 */
	@Input()
	public metaColumnId: string;

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 수정 가능 여부
	 */
	@Input()
	public editEnabled: boolean = this.layoutService.getPagePermissionByIACode(this.layoutService.iaCodes.metadataIaCode).permission === PERMISSION_CODE.RW || this.layoutService.getPagePermissionByIACode(this.layoutService.iaCodes.metadataIaCode).permission === PERMISSION_CODE.SA;

	/**
	 * 수정 모드
	 */
	public isEditMode: boolean = false;

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

		if (_.isUndefined(this.metaColumnId)) {
			this.oCancel.emit();
			return;
		}

		// 페이징 기본값 세팅
		this.page.number = 0;
		this.page.size = 14;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		this.getColumn(this.metaColumnId);
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
				this.pagination.init(this.page);
				this.createGrid();
			}
		}

		this.selectedTabIndex = tabIndex;
	}

	/**
	 * 닫기
	 */
	public cancel(): void {
		this.oCancel.emit();
	}

	/**
	 * 테이블 그리드에 아이템 선택시
	 *
	 * @param selectedRow
	 */
	public tableGridSelect(selectedRow: {
		event: Event,
		row: Meta.Table,
		selected: boolean,
		error: boolean
	}): void {
		if (selectedRow.selected) {
			this.oRowSelected.emit(selectedRow.row);
		}
	}

	/**
	 * 페이징에서 선택한 페이지로 리로드
	 *
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {
		this.currentPage = currentPage;
		this.page.number = this.currentPage;
		this.getColumn(this.metaColumnId);
	}

	/**
	 * 페이징 처리
	 *
	 * @param totalPage
	 */
	public pagingInit(totalPage: number = 0): void {
		this.page.totalPages = totalPage;
		this.page.number = this.currentPage;
		this.page.totalElements = 0;
		this.pagination.init(this.page);
	}

	/**
	 * 컬럼 수정 완료
	 */
	public columnEditDone() {
		this.isEditMode = false;
		this.getColumn(this.metaColumnId);
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
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 컬럼 조회
	 *
	 * @param {string} id
	 */
	private getColumn(id: string): void {

		Loading.show();

		this.metaService
			.getColumn(id, this.page)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.column = result.data.column;

					this.tagging(this.TaggingType.DETAIL, this.TaggingAction.VIEW, this.column.id, this.column.logicalNm === undefined || this.column.logicalNm.trim() == '' ? '(C)' + this.column.physicalNm : '(C)' + this.column.logicalNm + ' / ' + this.column.physicalNm);

					this.tableList = result.data.tableList.content
						.map(table => {

							if (table.status) {
								table.statusNm = table.status.nmKr;
							} else {
								table.statusNm = '';
							}

							if (table.layer) {
								table.layerNm = table.layer.nmKr;
							} else {
								table.layerNm = '';
							}

							if (table.cycle) {
								table.cycleNm = table.cycle.nmKr;
							} else {
								table.cycleNm = '';
							}

							if (table.retention) {
								table.retentionNm = table.retention.nmKr;
							} else {
								table.retentionNm = '';
							}

							if (table.security) {
								table.securityNm = table.security.nmKr;
							} else {
								table.securityNm = '';
							}

							return table;
						});

					this.setPageInfo(result.data.tableList);

					if (this.selectedTabIndex === 1) {
						this.pagination.init(this.page);
						this.createGrid();
					}

				} else {
					this.column = null;
					this.tableList = [];
					this.pagingInit();
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 페이지 정보 세팅
	 *
	 * @param page
	 */
	private setPageInfo(page): void {
		this.page.first = page.first;
		this.page.last = page.last;
		this.page.number = page.number;
		this.page.numberOfElements = page.numberOfElements;
		this.page.size = page.size;
		this.page.totalElements = page.totalElements;
		this.page.totalPages = page.totalPages;
	}

	/**
	 *  그리드 생성
	 */
	private createGrid() {
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
			.Id('fqn')
			.Name('주제 영역')
			.Field('fqn')
			.Behavior('fqn')
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

		this.tableListGrid.create(headers, this.tableList, new GridOption()
			.SyncColumnCellResize(true)
			.MultiColumnSort(false)
			.RowHeight(32)
			.MultiSelect(false)
			.build()
		);
	}
}
