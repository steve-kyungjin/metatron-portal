export class TreeNode<T> {
	index: number;
	id: string;
	name: string;
	type: string;
	depth: number;
	value: T;
	parentId: string;
	isOpen: boolean = false;
	hasChildren: boolean;
}
