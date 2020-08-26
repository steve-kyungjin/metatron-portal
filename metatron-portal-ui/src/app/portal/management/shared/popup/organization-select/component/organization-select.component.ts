import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {AbstractComponent} from '../../../../../common/component/abstract.component';
import * as _ from 'lodash';
import {Utils} from '../../../../../../common/util/utils';
import {Organization} from '../../../../../common/value/organization';
import {TreeNode} from '../../../../../common/value/tree-node';

@Component({
	selector: '[organization-select]',
	templateUrl: 'organization-select.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class OrganizationSelectComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 닫기
	 *
	 * @type {EventEmitter<any>}
	 */
	@Output('oClose')
	private close: EventEmitter<any> = new EventEmitter();

	/**
	 * 적용
	 *
	 * @type {EventEmitter<any>}
	 */
	@Output('oDone')
	private done: EventEmitter<Organization.Entity[]> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Input()
	public isUserMultipleSelectMode: boolean = true;

	/**
	 * 선택된 조직 목록
	 *
	 * @type {any[]}
	 */
	public selectList: Organization.Entity[] = [];

	/**
	 * 기존에 선택된 조직 목록
	 *
	 * @type {any[]}
	 */
	@Input()
	private defaultSelectList: Organization.Entity[] = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param {TranslateService} translateService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 기존에 선택된 그룹 목록
		if (this.defaultSelectList.length > 0) {
			this.selectList = _.cloneDeep(this.defaultSelectList);
		}
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 닫기
	 */
	public closeClick(): void {
		this.close.emit();
	}

	/**
	 * 적용
	 */
	public doneClick(): void {
		this.done.emit(this.selectList);
	}

	/**
	 * 그룹 선택시
	 *
	 * @param org
	 */
	public select(org: Organization.Entity): void {
		if (this.isUserMultipleSelectMode) {
			this.selectList.push(org);
			this.selectList = _.uniqWith(this.selectList, _.isEqual);
		} else {
			this.selectList = [];
			this.selectList.push(org);
			this.doneClick();
		}
	}

	/**
	 * 선택된 사용자 삭제
	 *
	 * @param index
	 */
	public deleteSelectedUser(index: number) {
		this.selectList = Utils.ArrayUtil.remove(this.selectList, index);
	}

	/**
	 * 선택된 그룹 전체 삭제
	 */
	public allDeleteSelectedGroupList(): void {
		this.selectList = [];
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
