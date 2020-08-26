import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../../../../portal/common/component/abstract.component';
import {TreeNode} from '../../../../portal/common/value/tree-node';
import {Organization} from '../../../../portal/common/value/organization';
import {Utils} from '../../../util/utils';

@Component({
	selector: 'list-tree',
	templateUrl: './list-tree.component.html'
})
export class ListTreeComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 *
	 */
	private _nodes: Array<TreeNode<object>> = [];

	/**
	 *
	 */
	private _selected: TreeNode<object> = null;

	/**
	 *
	 */
	@Output('onSelect')
	private oSelect: EventEmitter<TreeNode<object>> = new EventEmitter();

	/**
	 *
	 */
	@Output('onFolderSelect')
	private oFolderSelect: EventEmitter<TreeNode<object>> = new EventEmitter();

	/**
	 *
	 */
	@Output('onSubjectSelect')
	private oSubjectSelect: EventEmitter<TreeNode<object>> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 *
	 */
	@Input()
	public enableDivideIntoTowEvents: boolean = false;

	/**
	 * UUID
	 */
	public UUID: string = Utils.Generate.UUID();

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
	 * @param {TreeNode<Organization.Entity>} treeNode
	 * @param type
	 */
	public select(index: number, treeNode: TreeNode<object>, type: string): void {

		if (this.enableDivideIntoTowEvents) {
			if (type === 'folder') {
				treeNode.index = index;
				treeNode.isOpen = !treeNode.isOpen;
				this.oFolderSelect.emit(treeNode);
				this.selected = treeNode;
				if (treeNode.isOpen === false) {
					this.removeNodes(treeNode.index);
				}
			}

			if (type === 'subject') {
				treeNode.index = index;
				this.selected = treeNode;
				this.oSubjectSelect.emit(treeNode);
			}
		} else {

			treeNode.index = index;

			if (treeNode.hasChildren === true) {
				treeNode.isOpen = !treeNode.isOpen;
			} else {
				if (type === 'folder') {
					treeNode.isOpen = !treeNode.isOpen;
				} else {
					treeNode.isOpen = true;
				}
			}

			this.oSelect.emit(treeNode);

			this.selected = treeNode;

			if (treeNode.isOpen === false) {
				this.removeNodes(treeNode.index);
			}
		}
	}

	/**
	 * Append
	 *
	 * @param index
	 * @param childrenList
	 */
	public append(index: number, childrenList: Array<TreeNode<object>>): void {
		this.inPlacePush(index, childrenList);
	}

	/**
	 * showLoading
	 */
	public showLoading(): void {
		this.jQuery(`#${this.UUID}`).attr('aria-hidden', 'false');
	}

	/**
	 * hideLoading
	 */
	public hideLoading(): void {
		this.jQuery(`#${this.UUID}`).attr('aria-hidden', 'true');
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * inPlacePush
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
	public removeNodes(index: number): void {

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

				if (targetNode.depth > this._nodes[ i ].depth) {
					this._nodes.splice(fromIndex, i - fromIndex);
					return;
				}

				if (this._nodes.length - 1 === i) {
					if (targetNode.depth < this._nodes[ i ].depth) {
						this._nodes.splice(fromIndex, i);
						return;
					}
				}
			}
		}
	}

}
