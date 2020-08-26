import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {MetaService} from '../../../service/meta.service';
import {ListTreeComponent} from '../../../../../common/component/tree/component/list-tree.component';
import {TreeNode} from '../../../../common/value/tree-node';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {Meta} from '../../../value/meta';
import {Alert} from '../../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';

@Component({
	selector: 'system-tree',
	templateUrl: './tree.component.html'
})
export class TreeComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 트리 컴포넌트
	 */
	@ViewChild(ListTreeComponent)
	private treeComponent: ListTreeComponent;

	/**
	 * 서브젝트 선택 시
	 */
	@Output()
	private onSubjectSelect = new EventEmitter<TreeNode<object>>();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Input()
	public notSelectionSystemIdList: string[] = [];

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

		this.treeComponent.showLoading();

		this.metaService
			.getRootSystemList()
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					if (result.data.systemList.length > 0) {

						// 트리 노드
						const treeNodeTemp: TreeNode<object> = new TreeNode<object>();
						treeNodeTemp.depth = 0;
						treeNodeTemp.index = -1;
						treeNodeTemp.parentId = null;

						this.treeComponent.nodes = this.convertArrayDataAsTreeNode(result.data.systemList, treeNodeTemp);
					}
				} else {

				}

				this.treeComponent.hideLoading();
			})
			.catch(() => {
				this.treeComponent.hideLoading();
			});
	}

	/**
	 * 목록 데이터를 트리에서 사용할 수 있는 데이터로 변경
	 *
	 * @param array
	 * @param $event
	 */
	private convertArrayDataAsTreeNode(array: Array<Meta.System>, $event: TreeNode<object>): TreeNode<object>[] {

		const nodes: TreeNode<Meta.System>[] = [];

		array.forEach(data => {
			const node: TreeNode<Meta.System> = new TreeNode<Meta.System>();
			node.id = data.id;
			node.name = data.stdNm;
			node.depth = $event.depth + 1;
			node.parentId = $event.id;
			node.hasChildren = data.childrenCnt > 0;
			node.isOpen = false;
			node.type = data.childrenCnt > 0 ? 'CLASSIFICATION' : 'SYSTEM';
			node.value = <Meta.System>data;
			nodes.push(node);
		});

		return nodes;
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 트리 폴더 선택 시
	 *
	 * @param $event
	 */
	public folderSelect($event) {
		if ($event.isOpen) {
			if ($event.type === 'CLASSIFICATION') {
				this.getSystemChildren($event, $event.index);
			} else if ($event.type === 'SYSTEM') {
				this.getSystemChildren($event, $event.index);
			} else {
				Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			}
		}
	}

	/**
	 * 트리 제목 선택 시
	 *
	 * @param $event
	 */
	public subjectSelect($event) {

		if (this.notSelectionSystemIdList.length === 0) {
			this.onSubjectSelect.emit($event);
		} else {

			let hasId: number = 0;
			this.notSelectionSystemIdList.forEach(id => {
				if (id === $event.id) {
					hasId++;
				}
			});

			if (hasId === 0) {
				this.onSubjectSelect.emit($event);
			}
		}

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 시스템 하위 목록 조회
	 *
	 * @param $event
	 * @param index
	 */
	private getSystemChildren($event: TreeNode<Meta.System>, index: number) {

		this.treeComponent.showLoading();

		this.metaService
			.getSystemChildren($event.id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					if (result.data.systemList.length > 0) {
						this.treeComponent
							.append(
								$event.index,
								this.convertArrayDataAsTreeNode(
									result.data.systemList,
									$event
								)
							);
					} else {
						this.treeComponent.nodes[ $event.index ].isOpen = false;
					}
				} else {
					this.treeComponent.nodes[ $event.index ].isOpen = false;
				}

				this.treeComponent.hideLoading();
			})
			.catch(() => {
				this.treeComponent.hideLoading();
			});
	}

}
