import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {TranslateService} from 'ng2-translate';
import {DialogService} from '../../../../common/component/dialog/dialog.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import {ListTreeComponent} from '../../../../common/component/tree/component/list-tree.component';
import {TreeNode} from '../../../common/value/tree-node';
import {MenuManagementService} from '../service/menu-management.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {MenuManagement} from '../value/menu-management.value';
import {Alert} from '../../../../common/util/alert-util';
import {Validate} from '../../../../common/util/validate-util';
import {Loading} from '../../../../common/util/loading-util';
import {SelectValue} from "../../../../common/component/select/select.value";

@Component({
	selector: 'menu',
	templateUrl: 'menu-management.component.html'
})
export class MenuManagementComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 트리 컴포넌트
	 */
	@ViewChild(ListTreeComponent)
	private treeComponent: ListTreeComponent;

	/**
	 * 하위 메뉴 추가 가능 여부
	 */
	public enableAdd: boolean;

	/**
	 * 트리노드 목록
	 */
	public nodes: TreeNode<MenuManagement.Entity>[] = [];

	public currentMenu: MenuManagement.Entity;
	public currentNavigate: string;

	public errorMenuName: boolean;
	public errorPath: boolean;

	public iconList: Array<SelectValue> = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private dialogService: DialogService,
				private menuService: MenuManagementService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		Loading.hide();

		this.showLoading();
		this.menuService.getMenuRoot().then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				// 최상위 데이터 세팅
				this.nodes = this.convertArrayDataAsTreeNode(result.data.iaList);
			}
			this.hideLoading();
		});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/**
	 * 하위 메뉴 추가 클릭
	 */
	public addMenuClick() {
		const currentTreeItem = this.treeComponent.selected;
		let menu = new MenuManagement.Entity();
		menu.depth = currentTreeItem.depth + 1;
		menu.editYn = true;
		menu.linkYn = true;
		menu.childrenCnt = 0;
		menu.displayYn = true;
		menu.parentId = currentTreeItem.id;
		if (menu.depth == 1) {
			menu.icon = 'link-custom';
		}
		currentTreeItem.isOpen = true;

		if (currentTreeItem.hasChildren) {
			this.getMenuList(currentTreeItem, true, menu);
		} else {
			currentTreeItem.hasChildren = true;

			let nodes = this.convertArrayDataAsTreeNode([ menu ], currentTreeItem);
			this.treeComponent
				.append(
					currentTreeItem.index,
					nodes
				);

			this.menuSelect(nodes[ nodes.length - 1 ]);
		}
	}

	/**
	 * 메뉴 선택
	 * @param $event
	 */
	public onMenuSelect($event) {
		this.errorMenuName = false;
		this.errorPath = false;

		const isOpen: boolean = $event.isOpen;

		this.menuSelect($event);

		if (isOpen && $event.id && $event.hasChildren) {
			this.getMenuList($event);
		}
	}

	/**
	 * 메뉴명 변경 이벤트
	 * @param $event
	 */
	public menuNameChange($event) {
		this.treeComponent.selected.name = $event.target.value;
	}

	/**
	 * 게시판 여부 변경 이벤트
	 */
	public communityChange() {
		if (this.currentMenu.isCommunity && Validate.isEmpty(this.currentMenu.path)) {
			this.currentMenu.path = '/view/community/';
		}
	}

	/**
	 * 메뉴 아이콘 변경 이벤트
	 * @param item
	 */
	public iconSelect(item: SelectValue) {
		this.currentMenu.icon = item.value;
	}

	/**
	 * 저장 버튼 클릭
	 */
	public saveClick() {
		// 메뉴명 체크
		if (Validate.isEmpty(this.currentMenu.iaNm)) {
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			this.errorMenuName = true;
			return;
		}

		// 경로 체크
		if (this.currentMenu.linkYn && Validate.isEmpty(this.currentMenu.path)) {
			Alert.warning(`${this.translateService.instant(`COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION`, `필수 정보를 입력해주세요.`)}`);
			this.errorPath = true;
			return;
		}

		if (this.currentMenu.isCommunity) {
			let basePath = '/view/community/';
			if (!this.currentMenu.path.startsWith(basePath) || this.currentMenu.path.length == basePath.length) {
				Alert.warning(`${this.translateService.instant(`MANAGEMENT.MENU.DETAIL.VALIDATE.COMMUNITY`, ``)}`);
				this.errorPath = true;
				return;
			}
		}

		if (this.currentMenu.id) {
			this.menuService.updateMenu(this.currentMenu).then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.MODIFY', '수정되었습니다.'));
					this.refreshNode();
				}
			});
		} else {
			this.menuService.createMenu(this.currentMenu).then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
					this.treeComponent.selected.id = result.data.ia.id;
					this.treeComponent.selected.value[ 'id' ] = result.data.ia.id;
					this.refreshNode();
				}
			});
		}
	}

	/**
	 * 삭제 버튼 클릭
	 */
	public deleteClick() {
		this.dialogService.confirm(
			this.translateService.instant('COMMON.DELETE', '삭제'),
			this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제'),
			null,
			this.translateService.instant('COMMON.CANCEL', '취소'),
			this.translateService.instant('COMMON.CONFIRM', '확인'),
			() => {
				this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > Cancel click.`);
			},
			() => {
				let currentTreeItem = this.treeComponent.selected;
				if (currentTreeItem.hasChildren) {
					Alert.warning(this.translateService.instant('MANAGEMENT.MENU.VALIDATION.EXIST.CHILDREN', '하위 메뉴가 존재 합니다.'));
					return;
				}

				if (this.currentMenu.id) {
					this.menuService.deleteMenu(this.currentMenu.id).then(result => {
						if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
							Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
							this.refreshNode(true);
						}
					});
				} else {
					this.refreshNode(true);
				}
			});
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
	 * Loading show
	 */
	private showLoading() {
		this.elementRef.nativeElement.querySelector('.component-loading').setAttribute('aria-hidden', 'false');
	}

	/**
	 * Loading hide
	 */
	private hideLoading() {
		this.elementRef.nativeElement.querySelector('.component-loading').setAttribute('aria-hidden', 'true');
	}

	/**
	 * 메뉴 조회
	 * @param parent
	 * @param refreshNode
	 * @param appendChild
	 */
	private getMenuList(parent: TreeNode<object>, refreshNode: boolean = false, appendChild: MenuManagement.Entity = null) {
		if (!appendChild) {
			this.showLoading();
		}

		this.menuService.getMenuChildren(parent.id).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				if (refreshNode) {
					this.treeComponent.removeNodes(parent.index);
				}

				if (appendChild) {
					result.data.iaList.push(appendChild);
				}

				if (result.data.iaList.length > 0) {
					let nodes = this.convertArrayDataAsTreeNode(result.data.iaList, parent);
					this.treeComponent
						.append(
							parent.index,
							nodes
						);

					if (appendChild) {
						this.menuSelect(nodes[ nodes.length - 1 ]);
						this.enableAdd = false;
					}
				} else {
					this.nodes[ parent.index ].isOpen = false;
				}
			}
			this.hideLoading();
		});
	}

	/**
	 * 목록 데이터를 트리에서 사용할 수 있는 데이터로 변경
	 *
	 * @param array
	 * @param $event
	 */
	private convertArrayDataAsTreeNode(array: Array<MenuManagement.Entity>, $event = null): TreeNode<MenuManagement.Entity>[] {

		const nodes: TreeNode<MenuManagement.Entity>[] = [];

		Array.from(array)
			.forEach(data => {
				const node: TreeNode<MenuManagement.Entity> = new TreeNode<MenuManagement.Entity>();
				node.id = data.id;
				node.name = data.iaNm;
				if ($event) {
					node.depth = $event.depth + 1;
					node.parentId = $event.id;
					data.parentId = node.parentId;
				} else {
					node.depth = 0;
				}
				node.hasChildren = data.childrenCnt == 0 ? false : true;
				node.isOpen = false;
				node.value = <MenuManagement.Entity>data;
				nodes.push(node);
			});

		return nodes;
	}

	/**
	 * 메뉴 경로 찾기
	 */
	private getMenuNavigate(parentId: string) {
		let navigates = [];
		navigates = this.getMenuParents(parentId, navigates);
		return navigates.join(' > ') + (navigates.length ? ' > ' : '');
	}

	private getMenuParents(parentId: string, navigates: string[]) {
		if (!navigates) {
			navigates = [];
		}

		Array.from(this.nodes).find(value => {
			if (value.id == parentId && value.depth > 0) {
				navigates = this.getMenuParents(value.parentId, navigates);
				navigates.push(value.name);
				return true;
			} else {
				return false;
			}
		});

		return navigates;
	}

	/**
	 * 현재 노드 새로고침
	 */
	private refreshNode(isDelete: boolean = false) {
		const currentNode = this.treeComponent.selected;
		let parent: TreeNode<MenuManagement.Entity>;
		let existOtherChild: boolean = false;
		Array.from(this.nodes).forEach((value) => {
			if (value.id == currentNode.parentId) {
				parent = value;
			}

			if (value.parentId == currentNode.parentId && value.id != currentNode.id) {
				existOtherChild = true;
			}
		});

		if (parent) {
			parent.isOpen = true;
			this.getMenuList(parent, true);
		}

		if (isDelete) {
			if (!existOtherChild) {
				parent.hasChildren = false;
			}
			this.menuSelect(parent);
		} else {
			this.menuSelect(currentNode);
		}

		// LNB 메뉴 데이터 다시 생성
		this.layoutService.createDataSetUsedByLnb();
	}

	/**
	 * 메뉴 선택
	 * @param treeItem
	 */
	private menuSelect(treeItem: TreeNode<object>) {
		this.treeComponent.selected = treeItem;
		this.currentMenu = <MenuManagement.Entity>this.treeComponent.selected.value;
		this.currentNavigate = this.getMenuNavigate(this.currentMenu.parentId);

		// if (this.currentMenu.depth < 1 || this.currentMenu.depth > 2 || !this.currentMenu.editYn || !this.currentMenu.id) {
		// 	this.enableAdd = false;
		// } else {
		// 	this.enableAdd = true;
		// }
		this.enableAdd = true;
		this.setIcon(this.currentMenu);
		if (this.currentMenu.linkYn) {
			if (this.currentMenu.path.startsWith('/view/community')) {
				this.currentMenu.isCommunity = true;
			} else {
				this.currentMenu.isCommunity = false;
			}
		} else {
			this.currentMenu.isCommunity = false;
		}
	}

	/**
	 * 아이콘 선택
	 * @param menu
	 */
	private setIcon(menu: MenuManagement.Entity) {
		let icons = ['link-home', 'link-comm', 'link-my', 'link-app', 'link-meta', 'link-portal', 'link-all', 'link-custom'];

		this.iconList = icons.map(value => {
			return new SelectValue(value, value, value == menu.icon);
		});
	}

}
