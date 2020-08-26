import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TreeComponent} from './tree.component';
import {TreeNode} from '../../../../common/value/tree-node';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {Alert} from '../../../../../common/util/alert-util';
import {environment} from '../../../../../../environments/environment';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {Loading} from '../../../../../common/util/loading-util';
import {TranslateService} from 'ng2-translate';
import {ReportApp} from '../../../../report-app/value/report-app.value';
import * as _ from 'lodash';
import {MetatronService} from '../../../../common/service/metatron.service';
import {Metatron} from '../value/metatron';
import MetatronHeader = ReportApp.MetatronHeader;

@Component({
	selector: '[dashboard-layer]',
	templateUrl: './dashboard-layer.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class DashboardLayerComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 워크스페이스
	 *
	 * @type {string}
	 */
	private WORKSPACE: string = 'workspace';

	/**
	 * 워크북
	 *
	 * @type {string}
	 */
	private WORKBOOK: string = 'workbook';

	/**
	 * 폴더
	 *
	 * @type {string}
	 */
	private FOLDER: string = 'folder';

	/**
	 * 대시보드
	 *
	 * @type {string}
	 */
	private DASHBOARD: string = 'dashboard';

	/**
	 * 트리 컴포넌트
	 *
	 */
	@ViewChild('treeComp')
	private treeComponent: TreeComponent;

	/**
	 * 선택된 대시보드 반환시
	 *
	 * @type {EventEmitter<SelectedDashboard>}
	 */
	@Output('done')
	private selectedEvent: EventEmitter<Metatron.SelectedDashboard> = new EventEmitter<Metatron.SelectedDashboard>();

	/**
	 *
	 *
	 * @type {EventEmitter<any>}
	 */
	@Output('close')
	private closeEvent: EventEmitter<any> = new EventEmitter();

	/**
	 * 워크북 선택 여부
	 *
	 * @type {boolean}
	 */
	private isSelectedWorkbook: boolean = false;

	/**
	 * 선택된 대시보드
	 *
	 * @type {null}
	 */
	private selectedDashboard = null;

	/**
	 * 메타트론 헤더
	 *
	 * @type {null}
	 */
	private _metatronHeader: MetatronHeader = null;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 노드 목록
	 *
	 * @type {any[]}
	 */
	public nodes: TreeNode<object>[] = [];

	/**
	 * 대시보드 목록
	 *
	 * @type {any[]}
	 */
	public dashBoards = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param translateService
	 * @param metatronService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private translateService: TranslateService,
				private metatronService: MetatronService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.treeComponent.showLoading();

		Promise.resolve()
			.then(() => {
				return this.metatronService
					.getMetatronWorkspace()
					.then(result => {

						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

							// 최상위 데이터 세팅
							const node: TreeNode<object> = new TreeNode<object>();
							node.id = result.data.id;
							node.type = this.WORKSPACE;
							node.name = result.data.name;
							node.depth = 0;
							node.parentId = null;
							node.isOpen = false;
							this.nodes = [ node ];

							this.treeComponent.nodes = this.nodes;
						} else {
							Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
						}
					});
			})
			.then(() => {
				return this.metatronService
					.getPublicWorkspaceList()
					.then(result => {

						const publicWorkspaceList: any = result.data[ '_embedded' ][ 'workspaces' ];
						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

							publicWorkspaceList
								.forEach(workspace => {
									// 최상위 데이터 세팅
									const node: TreeNode<object> = new TreeNode<object>();
									node.id = workspace.id;
									node.type = this.WORKSPACE;
									node.name = workspace.name;
									node.depth = 0;
									node.parentId = null;
									node.isOpen = false;
									this.nodes.push(node);
								});

							this.treeComponent.nodes = this.nodes;
							this.treeComponent.hideLoading();
						} else {
							Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
						}
					});
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
				this.treeComponent.hideLoading();
			});

		if (this.metatronHeader !== null) {
			const workbookId: string = this.metatronHeader.locationId;
			if (_.isEmpty(workbookId) === false) {
				this.getWorkbook(null, workbookId, this.metatronHeader.contentsId);
			}
		}
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	get metatronHeader(): ReportApp.MetatronHeader {
		return this._metatronHeader;
	}

	@Input('metatronHeader')
	set metatronHeader(value: ReportApp.MetatronHeader) {
		this._metatronHeader = value;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Event select
	 *
	 * @param $event
	 */
	public select($event: TreeNode<object>): void {

		const id: string = $event.id;
		const type: string = $event.type;
		const isOpen: boolean = $event.isOpen;

		if (isOpen) {
			// 트리 노드 선택시 프로퍼티 검사
			this.dashboardTreeNodeDataValidation(id, type);

			// 워크스페이스 조회
			if (this.isTypeWorkspace(type)) {
				this.isSelectedWorkbook = false;
				this.getMyWorkspaceInWorkBookList(id, $event.index);
			}

			// 폴더 조회
			if (this.isTypeFolder(type)) {
				this.isSelectedWorkbook = false;
				this.getFolder($event, id);
			}
		} else {
			// 워크북 조회
			if (this.isTypeWorkbook(type)) {
				this.isSelectedWorkbook = true;
				this.getWorkbook($event, id);
			}
		}
	}

	/**
	 * 대시보드 선택
	 *
	 * @param dashBoardsEntity
	 * @param event
	 */
	public selectDashboard(dashBoardsEntity, event: Event): void {
		event.stopPropagation();
		dashBoardsEntity.isSelected = true;
		this.selectedDashboard = dashBoardsEntity;
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 메타트론 대시보드 썸네일 이미지 가져오기
	 *    - 링크 생성
	 *
	 * @param {string} thumbnailUrl
	 * @returns {string}
	 */
	public getDashBoardThumbnailImageByThumbnailUrl(thumbnailUrl: string): string {
		return this.sessionInfo.getUser().metatronUrl + `/api/images/load/url?url=${thumbnailUrl}`;
	}

	/**
	 * 취소
	 */
	public cancel(): void {
		this.closeEvent.emit();
	}

	/**
	 * 적용
	 */
	public done(): void {

		if (this.isSelectedWorkbook === false && this.selectedDashboard === null) {
			Alert.warning(`워크북을 선택해주세요.`);
			return;
		}

		const returnValue: Metatron.SelectedDashboard = new Metatron.SelectedDashboard(this.selectedDashboard.id, this.selectedDashboard.type.toLocaleUpperCase(), this.selectedDashboard.name, this.dashBoards[ 0 ].id);
		this.selectedEvent.emit(returnValue);

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 대시보드 트리 선택시 전달받은 데이터가 유효한지 검증
	 *
	 * @param {string} id
	 * @param {string} type
	 */
	private dashboardTreeNodeDataValidation(id: string, type: string): void {

		try {
			if (!id) {
				this.propertyUndefinedIfThrownError();
			}

			if (!type) {
				this.propertyUndefinedIfThrownError();
			}
		} catch (error) {

			this.nodes = [];

			Alert.error(`오류가 발생했습니다.`);

			this.logger.error(`[${this[ '__proto__' ].constructor.name}] > error`, error);
		}

	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 트리노드 선택시 발생하는 아웃풋에서 전달한 데이터에서 id / type 프로퍼티가 없는 경우
	 */
	private propertyUndefinedIfThrownError(): void {
		throw new Error(`Metatron data in [ Id or Type ] property undefined.`)
	}

	/**
	 * 북 목록 데이터를 트리에서 사용할 수 있는 데이터로 변경
	 *
	 * @param books
	 * @param $event
	 */
	private convertBookAsTreeNode(books: Array<any>, $event): TreeNode<object>[] {

		const nodes: TreeNode<object>[] = [];

		books.forEach(book => {
			if (book.type === this.WORKBOOK || book.type === this.FOLDER) {
				const node: TreeNode<object> = new TreeNode<object>();
				node.id = book.id;
				node.type = book.type;
				node.name = book.name;
				node.depth = $event.depth + 1;
				node.parentId = $event.id;
				nodes.push(node);
			}
		});

		return nodes;
	}

	/**
	 * 타입이 워크스페이스인 경우
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	private isTypeWorkspace(type: string): boolean {
		return type === this.WORKSPACE;
	}

	/**
	 * 타입이 폴더인 경우
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	private isTypeFolder(type: string) {
		return type === this.FOLDER;
	}

	/**
	 * 타입이 워크북인 경우
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	private isTypeWorkbook(type: string) {
		return type === this.WORKBOOK;
	}

	/**
	 * 워크스페이스 조회
	 *
	 * @param workspaceId
	 * @param index
	 */
	private getMyWorkspaceInWorkBookList(workspaceId: string, index: number): void {

		this.treeComponent.showLoading();

		this.metatronService
			.getWorkspaceById(workspaceId)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					// 최상위 데이터 세팅
					const node: TreeNode<object> = new TreeNode<object>();
					node.id = result.data.id;
					node.type = this.WORKSPACE;
					node.name = result.data.name;
					node.depth = 0;
					node.parentId = null;
					node.isOpen = false;

					if (result.data.books.length > 0) {
						this.treeComponent.append(index, this.convertBookAsTreeNode(result.data.books, node));
					} else {
						this.nodes[ index ].isOpen = false;
					}

					this.treeComponent.hideLoading();
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
					this.treeComponent.hideLoading();
				}
			});
	}

	/**
	 * 폴더 조회
	 *
	 * @param $event
	 * @param {string} id
	 */
	private getFolder($event, id: string) {

		this.treeComponent.showLoading();

		this.metatronService
			.getMetatronWorkspaceFolder(id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					if (result.data.books.length > 0) {
						this.treeComponent.append($event.index, this.convertBookAsTreeNode(result.data.books, $event));
					} else {
						this.nodes[ $event.index ].isOpen = false;
					}
				} else {
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

				this.treeComponent.hideLoading();
			});
	}

	/**
	 * 워크북 조회
	 *
	 * @param $event
	 * @param id
	 * @param selectedDashboardId
	 */
	private getWorkbook($event, id: string, selectedDashboardId: string = null) {

		Loading.show();

		this.metatronService
			.getMetatronWorkbookDetail(id)
			.then(result => {

				this.dashBoards = [];

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					result.data.dashBoards = result.data.dashBoards
						.filter(dashboard => (typeof dashboard.imageUrl === 'undefined') === false);

					result.data.dashBoards
						.map(dashboard => {
							dashboard.isSelected = false;
							dashboard.type = this.DASHBOARD;
						});

					const dashBoardsEntity: any = {};
					dashBoardsEntity.name = result.data.name;
					dashBoardsEntity.id = result.data.id;
					dashBoardsEntity.isSelected = true;
					dashBoardsEntity.type = this.WORKBOOK;
					result.data.dashBoards.unshift(dashBoardsEntity);

					this.dashBoards = result.data.dashBoards;

					this.selectedDashboard = this.dashBoards[ 0 ];

					if (selectedDashboardId !== null) {
						this.selectedDashboard.isSelected = false;
						this.dashBoards
							.forEach((dashBoard) => {
								dashBoard.isSelected = dashBoard.id === selectedDashboardId;
								if (dashBoard.isSelected) {
									this.selectedDashboard = dashBoard;
								}
								return dashBoard;
							});
					}

				} else {
					this.dashBoards = [];
					Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
				}

				Loading.hide();
			});
	}

}
