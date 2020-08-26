import {Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Alert} from '../../../../../common/util/alert-util';
import {TreeNode} from '../../../../common/value/tree-node';
import {Meta} from '../../../value/meta';
import {CommonConstant} from '../../../../common/constant/common-constant';
import {TranslateService} from 'ng2-translate';
import {MetaService} from '../../../service/meta.service';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {ListTreeComponent} from '../../../../../common/component/tree/component/list-tree.component';

@Component({
	selector: 'subject-tree',
	templateUrl: './subject-tree.component.html'
})
export class SubjectTreeComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터 주제영역 분류 기준
	 */
	private metaSubjectClassificationCriteriaGroupCode = 'GC0001001';

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
		this.getRootSubjectListBySubjectClassificationCode()
			.then(() => {
				if (this.treeComponent.nodes.length > 0) {
					this.treeComponent.select(0, this.treeComponent.nodes[ 0 ], 'folder');
					this.treeComponent.select(0, this.treeComponent.nodes[ 0 ], 'subject');
				}
			});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터 LAYER 분류 코드 조회
	 */
	private getRootSubjectListBySubjectClassificationCode() {

		this.treeComponent.showLoading();

		return this.codeService
			.getCodesByGrpCdKey(this.metaSubjectClassificationCriteriaGroupCode)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					if (result.data.codeList.length > 0) {

						const subjectList = [];
						result.data.codeList
							.forEach(code => {
								const subject = new Meta.Subject();
								subject.id = code.id;
								subject.nmKr = code.nmKr;
								subject.nmEn = code.nmEn;
								subject.description = code.cdDesc;
								subject.isRootSubject = true;
								subjectList.push(subject);
							});

						// 트리 노드
						const treeNodeTemp: TreeNode<object> = new TreeNode<object>();
						treeNodeTemp.depth = 0;
						treeNodeTemp.index = -1;
						treeNodeTemp.parentId = null;

						this.treeComponent.nodes = this.convertArrayDataAsTreeNode(
							subjectList,
							treeNodeTemp,
							'CLASSIFICATION'
						);
					}
				}

				this.treeComponent.hideLoading();
			})
			.catch(error => {
				this.treeComponent.hideLoading();
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 트리 폴더 선택 시
	 *
	 * @param $event
	 */
	public folderSelect($event) {
		if ($event.isOpen) {
			if ($event.type === 'CLASSIFICATION') {
				this.getRootSubjectList($event.id, $event);
			} else if ($event.type === 'SUBJECT') {
				this.clickSubject($event, $event.index);
			} else if ($event.type === 'TABLE') {
				//
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
		this.onSubjectSelect.emit($event);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 루트 서브젝트 조회
	 *
	 * @param criteriaId
	 * @param $event
	 */
	private getRootSubjectList(criteriaId: string, $event: TreeNode<object>): void {

		if (!criteriaId) {
			Alert.warning(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			return;
		}

		this.treeComponent.showLoading();

		this.metaService
			.getRootSubjectList(criteriaId)
			.then((result: Meta.Result.Subject.RootList) => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					// isSelected 값 false 로 초기화 처리
					result.data.subjectRootList
						.map(subject => {
							subject.isRootSubject = subject.children.length > 0;
							subject.isSelected = false;
							return subject;
						});

					if (result.data.subjectRootList.length > 0) {

						this.treeComponent
							.append(
								$event.index,
								this.convertSubjectArrayDataAsTreeNode(
									result.data.subjectRootList,
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
			.catch(error => {
				this.treeComponent.hideLoading();
				this.treeComponent.nodes = [];
				this.treeComponent.nodes[ $event.index ].isOpen = false;
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	/**
	 * 목록 데이터를 트리에서 사용할 수 있는 데이터로 변경
	 *
	 * @param array
	 * @param $event
	 * @param treeType
	 */
	private convertArrayDataAsTreeNode(array: Array<Meta.Subject>, $event: TreeNode<object>, treeType: string): TreeNode<object>[] {

		const nodes: TreeNode<Meta.Subject>[] = [];

		array
			.forEach(data => {
				const node: TreeNode<Meta.Subject> = new TreeNode<Meta.Subject>();
				node.id = data.id;
				node.name = data.nmKr;
				node.depth = $event.depth + 1;
				node.parentId = $event.id;
				node.hasChildren = data.isRootSubject;
				node.isOpen = data.isSelected != undefined && data.isSelected === true;
				node.type = treeType;
				node.value = <Meta.Subject>data;
				nodes.push(node);
			});

		return nodes;
	}

	/**
	 * 목록 데이터를 트리에서 사용할 수 있는 데이터로 변경
	 *
	 * @param array
	 * @param $event
	 */
	private convertSubjectArrayDataAsTreeNode(array: Array<Meta.Subject>, $event: TreeNode<object>): TreeNode<object>[] {

		const nodes: TreeNode<Meta.Subject>[] = [];

		array
			.forEach(data => {
				const node: TreeNode<Meta.Subject> = new TreeNode<Meta.Subject>();
				node.id = data.id;
				node.name = data.nmKr;
				node.depth = $event.depth + 1;
				node.parentId = $event.id;
				node.hasChildren = data.isRootSubject;
				node.isOpen = data.isSelected != undefined && data.isSelected === true;
				node.type = data.children.length > 0 ? 'SUBJECT' : 'TABLE';
				node.value = <Meta.Subject>data;
				nodes.push(node);
			});

		return nodes;
	}

	/**
	 * getChildren
	 *
	 * @param {string} id
	 */
	public getChildren(id: string): Promise<Meta.Subject> {
		return Promise.resolve()
			.then(() => {
				return this.metaService
					.getSubjectListById(id)
					.then((result: Meta.Result.Subject.ListById) => {
						return result.data.subject;
					})
			});
	}

	/**
	 * 서브젝트 클릭 시
	 *
	 * @param {Meta.Subject} $event
	 * @param {number} index
	 */
	public clickSubject($event: TreeNode<Meta.Subject>, index: number) {

		this.treeComponent.showLoading();

		const children: Promise<Meta.Subject> = this.getChildren($event.id);

		children
			.then((subject) => {

				subject.children
					.map(subject => {
						subject.isRootSubject = false;
						return subject;
					});

				if (subject.children.length > 0) {
					this.treeComponent
						.append(
							$event.index,
							this.convertArrayDataAsTreeNode(
								subject.children,
								$event,
								'TABLE'
							)
						);
				} else {
					this.treeComponent.nodes[ $event.index ].isOpen = false;
				}

				this.treeComponent.hideLoading();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
				this.treeComponent.hideLoading();
			});
	}

}
