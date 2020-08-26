import {Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../../common/component/abstract.component';
import {Organization} from '../../../../../common/value/organization';
import {OrganizationService} from '../../../../../common/service/organization.service';
import {CommonConstant} from '../../../../../common/constant/common-constant';
import {TreeNode} from '../../../../../common/value/tree-node';
import {Alert} from '../../../../../../common/util/alert-util';
import {ListTreeComponent} from '../../../../../../common/component/tree/component/list-tree.component';
import {TranslateService} from 'ng2-translate';
import {PaginationComponent} from '../../../../../../common/component/pagination/pagination.component';
import {Page, Sort} from 'app/portal/common/value/result-value';
import {Observable, Subject} from 'rxjs';
import {Utils} from '../../../../../../common/util/utils';

@Component({
	selector: '[organization-block]',
	templateUrl: './organization-block.component.html',
	host: { '[class.organization-block]': 'true' }
})
export class OrganizationBlockComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 선택시
	 *
	 * @type {EventEmitter<any>}
	 */
	@Output('oSelected')
	private selectedEvent: EventEmitter<Organization.Entity> = new EventEmitter();

	/**
	 * 조직 트리 컴포넌트
	 */
	@ViewChild(ListTreeComponent)
	private treeComponent: ListTreeComponent;

	/**
	 * 페이징 컴포넌트
	 */
	@ViewChild(PaginationComponent)
	private pagination: PaginationComponent;

	/**
	 * 현재 페이지
	 *
	 * @type {number}
	 */
	private currentPage: number = 0;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 목록
	 *
	 * @type {any[]}
	 */
	public list: Organization.Entity[] = [];

	/**
	 * 트리노드 목록
	 */
	public nodes: TreeNode<Organization.Entity>[] = [];

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 검색
	 *
	 * @type {Subject<string>}
	 */
	public search$: Subject<string> = new Subject<string>();

	/**
	 * 검색어
	 *
	 * @type {string}
	 */
	public keyWord: string = '';

	/**
	 * UUID
	 */
	public UUID: string = Utils.Generate.UUID();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param organizationService
	 * @param translateService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private organizationService: OrganizationService,
				private translateService: TranslateService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		// 검색
		this.subscriptions.push(
			this.search$
				.switchMap((value) => Observable.of<string>(value))
				.subscribe((value) => {

					this.list = [];
					this.pagingInit();
					this.keyWord = value.trim();

					if (this.keyWord.length > 0) {
						this.getOrgList();
					}
				})
		);

		this.getList();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 선택시
	 *
	 * @param org
	 */
	public selected(org: Organization.Entity): void {
		this.selectedEvent.emit(org);
	}

	/**
	 *
	 *
	 * @param $event
	 */
	public onFolderSelect($event) {

		const isOpen: boolean = $event.isOpen;

		if (isOpen) {
			this.treeComponent.showLoading();

			this.organizationService
				.getOrgRootChildren($event.id)
				.then(result => {

					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
						if (result.data.groupList.length > 0) {
							this.treeComponent
								.append(
									$event.index,
									this.convertArrayDataAsTreeNode(
										result.data.groupList,
										$event
									)
								);
						} else {
							this.nodes[ $event.index ].isOpen = false;
						}
					} else {
						Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
					}

					this.treeComponent.hideLoading();
				})
				.catch(error => {
					this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
					this.treeComponent.hideLoading();
				});
		}
	}

	/**
	 * 목록 데이터를 트리에서 사용할 수 있는 데이터로 변경
	 *
	 * @param array
	 * @param $event
	 */
	private convertArrayDataAsTreeNode(array: Array<Organization.Entity>, $event): TreeNode<Organization.Entity>[] {

		const nodes: TreeNode<Organization.Entity>[] = [];

		array
			.forEach(data => {
				const node: TreeNode<Organization.Entity> = new TreeNode<Organization.Entity>();
				node.id = data.id;
				node.name = data.name;
				node.type = data.type.toString();
				node.depth = $event.depth + 1;
				node.parentId = $event.id;
				node.hasChildren = data.childrenCnt !== 0;
				node.value = <Organization.Entity>data;
				nodes.push(node);
			});

		return nodes;
	}

	/**
	 *
	 *
	 * @param org
	 */
	public onSubjectSelect(org: TreeNode<Organization.Entity>) {
		this.selected(org.value);
	}

	/**
	 * 페이징에서 선택한 페이지로 리로드
	 *
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {
		this.currentPage = currentPage;
		this.page.number = this.currentPage;
		this.getOrgList();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Loading show
	 */
	private showLoading() {
		this.jQuery(`#${this.UUID}`).attr('aria-hidden', 'false');
	}

	/**
	 * Loading hide
	 */
	private hideLoading() {
		this.jQuery(`#${this.UUID}`).attr('aria-hidden', 'true');
	}

	/**
	 * 목록 조회
	 */
	private getList(): void {

		this.treeComponent.showLoading();

		this.organizationService
			.getOrgRoot()
			.then((result) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					result.data.groupList
						.forEach(org => {
							// 최상위 데이터 세팅
							const node: TreeNode<Organization.Entity> = new TreeNode<Organization.Entity>();
							node.id = org.id;
							node.type = org.type.toString();
							node.hasChildren = org.childrenCnt !== 0;
							node.name = org.name;
							node.depth = 0;
							node.parentId = null;
							node.isOpen = false;
							node.value = <Organization.Entity>org;
							this.nodes.push(node);
						});

					this.treeComponent.hideLoading();
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
				this.treeComponent.hideLoading();
			});
	}

	/**
	 * 페이징 처리
	 *
	 * @param totalPage
	 */
	private pagingInit(totalPage: number = 0): void {
		this.page.totalPages = totalPage;
		this.page.number = 0;
		this.page.totalElements = 0;
		this.pagination.init(this.page);
	}

	/**
	 * 목록 조회
	 */
	private getOrgList(): void {

		this.showLoading();

		this.organizationService
			.getList(this.keyWord, this.page)
			.then((result) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.groupList);
					this.pagination.init(this.page);
					this.list = result.data.groupList.content;
				} else {
					this.pagingInit();
					this.list = [];
				}

				this.hideLoading();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
				this.treeComponent.hideLoading();
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

}

