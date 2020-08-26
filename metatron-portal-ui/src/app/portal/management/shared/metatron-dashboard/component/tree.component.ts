import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TreeNode} from '../../../../common/value/tree-node';
import {AbstractComponent} from '../../../../common/component/abstract.component';

@Component({
	selector: 'tree',
	templateUrl: './tree.component.html'
})
export class TreeComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private _nodes: Array<TreeNode<object>> = [];

	private _selected: TreeNode<object> = null;

	@Output('select')
	private selectEvent: EventEmitter<TreeNode<object>> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	get nodes(): Array<TreeNode<object>> {
		return this._nodes;
	}

	@Input('nodes')
	set nodes(value: Array<TreeNode<object>>) {
		this._nodes = value;
	}

	get selected(): TreeNode<object> {
		return this._selected;
	}

	set selected(value: TreeNode<object>) {
		this._selected = value;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector) {
		super(elementRef, injector)
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
	}

	public ngOnDestroy(): void {
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 선택 이벤트 발생시
	 *
	 * @param {number} index
	 * @param {TreeNode<object>} treeNode
	 */
	public select(index: number, treeNode: TreeNode<object>): void {

		treeNode.index = index;

		if (treeNode.type !== 'workbook') {
			treeNode.isOpen = !treeNode.isOpen;
		}

		this.selectEvent.emit(treeNode);

		this.selected = treeNode;

		if (treeNode.isOpen === false && (treeNode.type === 'folder' || treeNode.type === 'workspace')) {
			this.removeNodes(treeNode.index);
		}
	}

	/**
	 *
	 *
	 * @param index
	 * @param childrenList
	 */
	public append(index: number, childrenList: TreeNode<object>[]): void {
		this.inPlacePush(index, childrenList);
	}

	// noinspection JSMethodCanBeStatic
	/**
	 *
	 */
	public showLoading(): void {
		this.jQuery('#dtLoading').attr('aria-hidden', 'false');
	}

	// noinspection JSMethodCanBeStatic
	/**
	 *
	 */
	public hideLoading(): void {
		this.jQuery('#dtLoading').attr('aria-hidden', 'true');
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 *
	 *
	 * @param index
	 * @param childrenList
	 */
	private inPlacePush(index: number, childrenList: TreeNode<object>[]): void {
		this._nodes.splice(index + 1, 0, ...childrenList);
	}

	/**
	 * 해당 인덱스의 노드 목록 삭제
	 *
	 * @param index
	 */
	private removeNodes(index: number): void {

		if (this._nodes.length === index) {
			return;
		}

		const targetNode: TreeNode<object> = this._nodes[ index ];
		const fromIndex: number = index + 1;

		if ((targetNode.depth > this._nodes[ fromIndex ].depth) === false) {
			for (let i = fromIndex - 1; i < this._nodes.length;) {
				i++;
				if (targetNode.depth === this._nodes[ i ].depth) {
					this._nodes.splice(fromIndex, i - fromIndex);
					return;
				}
			}
		}
	}

}
