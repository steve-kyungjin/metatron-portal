import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {AbstractComponent} from '../../../../../common/component/abstract.component';
import {Group} from '../../../../../common/value/group';
import * as _ from 'lodash';
import {Utils} from '../../../../../../common/util/utils';

@Component({
	selector: '[group-select]',
	templateUrl: 'group-select.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class GroupSelectComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	private done: EventEmitter<Group.Entity[]> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 선택된 그룹 목록
	 *
	 * @type {any[]}
	 */
	public selectedGroupList: Group.Entity[] = [];

	/**
	 * 기존에 선택된 그룹 목록
	 *
	 * @type {any[]}
	 */
	@Input()
	private defaultSelectedGroupList: Group.Entity[] = [];

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
		if (this.defaultSelectedGroupList.length > 0) {
			this.selectedGroupList = _.cloneDeep(this.defaultSelectedGroupList);
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
		this.done.emit(this.selectedGroupList);
	}

	/**
	 * 그룹 선택시
	 *
	 * @param {Group.Entity} group
	 */
	public groupSelected(group: Group.Entity): void {
		this.selectedGroupList.push(group);
		this.selectedGroupList = _.uniqWith(this.selectedGroupList, _.isEqual);
	}

	/**
	 * 선택된 사용자 삭제
	 *
	 * @param index
	 */
	public deleteSelectedUser(index: number) {
		this.selectedGroupList = Utils.ArrayUtil.remove(this.selectedGroupList, index);
	}

	/**
	 * 선택된 그룹 전체 삭제
	 */
	public allDeleteSelectedGroupList(): void {
		this.selectedGroupList = [];
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
