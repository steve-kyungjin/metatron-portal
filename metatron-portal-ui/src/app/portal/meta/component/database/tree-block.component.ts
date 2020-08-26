import {Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {ListTreeComponent} from '../../../../common/component/tree/component/list-tree.component';
import {Meta} from '../../value/meta';
import {TreeNode} from '../../../common/value/tree-node';
import {TranslateService} from 'ng2-translate';
import {MetaService} from '../../service/meta.service';
import {Alert} from '../../../../common/util/alert-util';
import {CommonConstant} from '../../../common/constant/common-constant';

@Component({
	selector: '[database-tree-block]',
	templateUrl: './tree-block.component.html'
})
export class TreeBlockComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 리스트 트리 컴포넌트
	 */
	@ViewChild('treeComp')
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
	 *
	 */
	@Output('onInstanceAllSelected')
	private onInstanceAllSelected: EventEmitter<TreeNode<object>> = new EventEmitter();

	/**
	 *
	 */
	@Output('onInstanceSelected')
	private onInstanceSelected: EventEmitter<TreeNode<object>> = new EventEmitter();

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

		// 최상위 데이터 세팅
		const node: TreeNode<object> = new TreeNode<object>();
		node.hasChildren = true;
		node.name = '전체';
		node.depth = 0;
		node.parentId = null;
		node.isOpen = true;
		node.type = 'ALL';
		node.index = 0;
		this.nodes.push(node);

		this.treeComponent.nodes = this.nodes;

		this.getInstanceList(node);
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
	public onFolderSelect($event: TreeNode<object>) {
		if ($event.isOpen) {
			if ($event.type === this.treeTypeAll) {
				this.getInstanceList($event);
			} else if ($event.type === this.treeTypeInstance) {
				this.onInstanceSelected.emit($event);
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
	public onSubjectSelect($event: TreeNode<object>) {
		if ($event.type === this.treeTypeAll) {
			this.onInstanceAllSelected.emit($event);
		} else if ($event.type === this.treeTypeInstance) {
			this.onInstanceSelected.emit($event);
		} else {
			Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
		}
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
				node.hasChildren = false;
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
	 */
	private getInstanceList($event: TreeNode<object>) {

		this.treeComponent.showLoading();

		this.metaService
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
						this.nodes[ $event.index ].isOpen = false;
					}
				} else {
					this.nodes[ $event.index ].isOpen = false;
				}

				this.treeComponent.hideLoading();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

}
