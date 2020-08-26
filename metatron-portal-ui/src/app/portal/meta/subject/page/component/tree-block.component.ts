import {AfterViewInit, Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {ListTreeComponent} from '../../../../../common/component/tree/component/list-tree.component';
import {Meta} from '../../../value/meta';
import {TreeNode} from '../../../../common/value/tree-node';
import {TranslateService} from 'ng2-translate';
import {MetaService} from '../../../service/meta.service';
import {Alert} from '../../../../../common/util/alert-util';
import {CommonConstant} from '../../../../common/constant/common-constant';

@Component({
	selector: '[subject-tree-block]',
	templateUrl: './tree-block.component.html'
})
export class TreeBlockComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewInit {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터 주제영역 분류 기준
	 */
	private metaSubjectClassificationCriteriaGroupCode = 'GC0001001';

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
	 * SUBJECT 상수
	 */
	private treeTypeSubject: string = 'SUBJECT';

	/**
	 * 전체 선택 시
	 */
	@Output('OnAllSelected')
	private onAllSelected: EventEmitter<TreeNode<object>> = new EventEmitter();

	/**
	 * 서브젝트 선택 시
	 */
	@Output('OnSubjectSelected')
	private onSubjectSelected: EventEmitter<TreeNode<object>> = new EventEmitter();

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
		node.isOpen = false;
		node.type = 'ALL';
		node.index = 0;
		this.nodes.push(node);

		this.treeComponent.nodes = this.nodes;
	}

	public ngAfterViewInit(): void {
		if (this.treeComponent.nodes.length > 0) {
			this.treeComponent.select(0, this.treeComponent.nodes[ 0 ], 'folder');
			this.treeComponent.select(0, this.treeComponent.nodes[ 0 ], 'subject');
		}
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
	public onFolderSelect($event) {
		if ($event.isOpen) {
			if ($event.type === 'ALL') {
				this.getAllSubjectList();
			} else if ($event.type === 'SUBJECT') {
				this.onSubjectSelect($event)
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
	public onSubjectSelect($event) {
		if ($event.type === 'ALL') {
			this.onAllSelected.emit($event);
		} else if ($event.type === 'SUBJECT') {
			this.onSubjectSelected.emit($event);
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터 LAYER 분류 코드 조회
	 */
	private getAllSubjectList() {

		this.treeComponent.showLoading();

		this.codeService
			.getCodesByGrpCdKey(this.metaSubjectClassificationCriteriaGroupCode)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					const resultCodeList = result.data.codeList;
					if (resultCodeList.length > 0) {

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

						subjectList
							.map(subject => {
								subject.isRootSubject = false;
								subject.isSelected = false;
								return subject;
							});

						const convertArrayDataAsTreeNode: TreeNode<object>[] = this.convertArrayDataAsTreeNode(
							subjectList,
							this.nodes[ 0 ],
							'SUBJECT'
						);

						convertArrayDataAsTreeNode.forEach((node, index) => {
							this.nodes.push(node);

							if (convertArrayDataAsTreeNode.length - 1 === index) {
								this.treeComponent.hideLoading();
							}
						});

						// const promises = resultCodeList.map(code => {
						// 	return this.metaService.getRootSubjectList(code.id);
						// });

						// Promise
						// 	.all(promises)
						// 	.then(promiseAllResult => {
						// 		promiseAllResult
						// 			.forEach(result => {
						// 				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
						// 					result.data.subjectRootList
						// 						.map(subject => {
						// 							subject.isRootSubject = false;
						// 							subject.isSelected = false;
						// 							return subject;
						// 						})
						// 						.forEach(subject => {
						// 							subjectList.push(subject);
						// 						});
						// 				}
						// 			});
						// 	})
						// 	.then(() => {
						// 		const convertArrayDataAsTreeNode: TreeNode<object>[] = this.convertArrayDataAsTreeNode(
						// 			subjectList,
						// 			this.nodes[ 0 ],
						// 			'SUBJECT'
						// 		);
						// 		convertArrayDataAsTreeNode.forEach((node, index) => {
						// 			this.nodes.push(node);
						//
						// 			if (convertArrayDataAsTreeNode.length - 1 === index) {
						// 				this.treeComponent.hideLoading();
						// 			}
						// 		});
						// 	});
					}
				}
			})
			.catch(() => {
				this.treeComponent.hideLoading();
			})
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

}
