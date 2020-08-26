import {Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TreeNode} from '../../../../common/value/tree-node';
import {Meta} from '../../../value/meta';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {ListTreeComponent} from '../../../../../common/component/tree/component/list-tree.component';
import {MetaService} from '../../../service/meta.service';
import {TranslateService} from 'ng2-translate';
import {Alert} from '../../../../../common/util/alert-util';
import {Page} from 'app/portal/common/value/result-value';
import {DatabaseService} from '../../../service/database.service';

@Component({
	selector: 'database-tree',
	templateUrl: './database-tree.component.html'
})
export class DatabaseTreeComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 리스트 트리 컴포넌트
	 */
	@ViewChild(ListTreeComponent)
	private treeComponent: ListTreeComponent;

	/**
	 * ALL 상수
	 */
	private treeTypeAll: string = 'ALL';

	/**
	 * INSTANCE 상수
	 */
	private treeTypeInstance: string = 'INSTANCE';

	/**
	 * DATABASE 상수
	 */
	private treeTypeDatabase: string = 'DATABASE';

	/**
	 * 전체 선택 아웃풋
	 */
	@Output('onSelectedAll')
	private onSelectedAll: EventEmitter<TreeNode<object>> = new EventEmitter();

	/**
	 * 데이터베이스 선택 아웃풋
	 */
	@Output('onSelectedDatabase')
	private onSelectedDatabase: EventEmitter<TreeNode<object>> = new EventEmitter();

	/**
	 * 인스턴스 목록
	 */
	private instanceIdList = [];

	/**
	 * 컴포넌트에 처음 진입했는지 체크하기 위한 값
	 */
	private isFirstInit: boolean = true;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 트리 노드
	 */
	public nodes: Array<TreeNode<object>> = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param translateService
	 * @param metaService
	 * @param databaseService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private metaService: MetaService,
				private databaseService: DatabaseService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 최상위 데이터 세팅
		const node: TreeNode<object> = new TreeNode<object>();
		node.hasChildren = true;
		node.name = '전체';
		node.depth = 0;
		node.parentId = null;
		node.isOpen = false;
		node.id = 'ALL';
		node.type = 'ALL';
		node.index = 0;
		this.nodes.push(node);

		this.treeComponent.nodes = this.nodes;

		this.subscriptions.push(
			this.databaseService
				.databaseContentLoadComplete$
				.subscribe(() => {
					if (this.treeComponent.nodes.length > 0) {
						this.treeComponent.select(0, this.treeComponent.nodes[ 0 ], 'folder');
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
	 * 폴더 선택 시
	 *
	 * @param $event
	 */
	public onFolderSelect($event: TreeNode<Meta.Instance>) {
		if ($event.isOpen) {
			if ($event.type === this.treeTypeAll) {
				if (this.isFirstInit === true) {
					this.getInstanceList(this.treeComponent.nodes[ 0 ], false);
				} else {
					this.getInstanceList(this.treeComponent.nodes[ 0 ]);
					this.databaseService.initialize();
					this.databaseService.selectMetaType('ALL');
					this.databaseService.selected(null);
					this.databaseService.getDatabase();
				}
			} else if ($event.type === this.treeTypeInstance) {
				this.getDatabaseList($event);
			} else if ($event.type === this.treeTypeDatabase) {
				this.databaseService.initialize();
				this.databaseService.selectMetaType('DATABASE');
				this.databaseService.selected($event.value);
				this.databaseService.getDatabase();
			} else {
				Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			}
		}
	}

	/**
	 * 제목 선택 시
	 *
	 * @param $event
	 */
	public onSubjectSelect($event: TreeNode<Meta.Instance>) {
		if ($event.type === this.treeTypeAll) {
			this.databaseService.initialize();
			this.databaseService.selectMetaType('ALL');
			this.databaseService.selected(null);
			this.databaseService.getDatabase();
		} else if ($event.type === this.treeTypeInstance) {
			this.databaseService.initialize();
			this.databaseService.selectMetaType('INSTANCE');
			this.databaseService.selected($event.value);
			this.databaseService.getInstanceTableList();
		} else if ($event.type === this.treeTypeDatabase) {
			this.databaseService.initialize();
			this.databaseService.selectMetaType('DATABASE');
			this.databaseService.selected($event.value);
			this.databaseService.getDatabase();
		} else {
			Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
		}
	}

	/**
	 * 선택된 트리 노드 가져오기
	 */
	public getSelected(): TreeNode<object> {
		return this.treeComponent.selected;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 목록 데이터를 트리에서 사용할 수 있는 데이터로 변경
	 *
	 * @param array
	 * @param $event
	 * @param type
	 */
	private convertArrayDataAsTreeNode(array: Array<Meta.Instance | Meta.Database>, $event, type: string): TreeNode<object>[] {

		const nodes: TreeNode<object>[] = [];

		array
			.forEach(data => {
				const node: TreeNode<object> = new TreeNode<object>();
				node.id = data.id;
				node.name = data.logicalNm === null || data.logicalNm.trim() == '' ? data.physicalNm : data.logicalNm + ' / ' + data.physicalNm;
				node.depth = $event.depth + 1;
				node.parentId = $event.id;
				node.hasChildren = type === this.treeTypeInstance;
				node.isOpen = false;
				node.type = type;
				node.value = data;
				nodes.push(node);
			});

		return nodes;
	}

	/**
	 * 인스턴스 목록 조회
	 *
	 * @param $event
	 * @param isLoading
	 */
	private getInstanceList($event: TreeNode<object>, isLoading: boolean = true) {

		if (isLoading) {
			this.treeComponent.showLoading();
		}

		return this.metaService
			.getInstanceList()
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					if (result.data.instanceList.length > 0) {

						this.treeComponent
							.append(
								$event.index,
								this.convertArrayDataAsTreeNode(
									result.data.instanceList,
									$event,
									this.treeTypeInstance
								)
							);
					} else {
						this.nodes = [];
					}
				} else {
					this.nodes = [];
				}

				if (isLoading) {
					this.treeComponent.hideLoading();
				}

				// 인스턴스 목록 함수 가져 오기 함수안에서 isFirstInit 플래그 True 인 경우 호출되는 함수
				this.getInstanceListFunctionFunctionIfIsFirstInitFlagInFunctionCallWhenTrue();
			})
			.catch(error => {
				this.treeComponent.hideLoading();
				this.nodes = [];
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 데이터베이스 목록 조회
	 *
	 * @param $event
	 * @param isLoading
	 */
	private getDatabaseList($event: TreeNode<object>, isLoading: boolean = true) {

		if (isLoading === true) {
			this.treeComponent.showLoading();
		}

		this.metaService
			.getDatabaseList($event.id, Meta.Target.ALL, null, null, new Page().createNonPagingValueObject())
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					if (result.data.databaseList.content.length > 0) {
						this.treeComponent
							.append(
								$event.index,
								this.convertArrayDataAsTreeNode(
									result.data.databaseList.content,
									$event,
									this.treeTypeDatabase
								)
							);
					} else {
						this.nodes[ $event.index ].isOpen = false;
					}
				} else {
					this.nodes[ $event.index ].isOpen = false;
				}

				if (isLoading === true) {
					this.treeComponent.hideLoading();
				}

				// 데이터베이스 목록 함수 가져 오기 함수안에서 isFirstInit 플래그 True 인 경우 호출되는 함수
				this.getDatabaseListFunctionFunctionIfIsFirstInitFlagInFunctionCallWhenTrue();
			})
			.catch(error => {

				if (isLoading === true) {
					this.treeComponent.hideLoading();
				}

				this.nodes[ $event.index ].isOpen = false;

				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 인스턴스 목록 함수 가져 오기 함수안에서 isFirstInit 플래그 True 인 경우 호출되는 함수
	 */
	private getInstanceListFunctionFunctionIfIsFirstInitFlagInFunctionCallWhenTrue() {

		if (this.isFirstInit === true) {

			// 처음 진입시 모든 트리 노드를 열여주기 위해서
			// 인스턴스 아이디를 리스트에 추가한다
			this.treeComponent.nodes
				.forEach((node, index) => {
					if (index > 0) {
						this.instanceIdList.push(node.id);
					}
				});

			this.databaseService.initialize();
			this.databaseService.selectMetaType('ALL');
			this.databaseService.selected(null);
			this.databaseService.getDatabase();

			this.instanceIdListLoop();
		}
	}

	/**
	 * 데이터베이스 목록 함수 가져 오기 함수안에서 isFirstInit 플래그 True 인 경우 호출되는 함수
	 */
	private getDatabaseListFunctionFunctionIfIsFirstInitFlagInFunctionCallWhenTrue(): void {

		if (this.isFirstInit === true) {
			this.instanceIdList = this.instanceIdList.slice(1);
			this.instanceIdListLoop();
		}
	}

	/**
	 * 인스턴스 목록를 루프 돌면서 선택 이벤트 처리
	 * 인스턴스 아이디 목록이 0 이 되면 트리의 로딩을 꺼주고
	 * isFirstInit 플래그를 false 로 변경한다
	 */
	private instanceIdListLoop(): void {

		for (let i = 0; i < this.instanceIdList.length; i++) {
			const instanceId = this.instanceIdList[ i ];
			for (let j = 0; j < this.treeComponent.nodes.length; j++) {
				const data = this.treeComponent.nodes[ j ];
				if (data.id === instanceId) {
					this.treeComponent.select(j, data, 'folder');
					return;
				}
			}
		}

		if (this.instanceIdList.length === 0) {
			this.isFirstInit = false;
			this.treeComponent.hideLoading();
		}
	}

}
