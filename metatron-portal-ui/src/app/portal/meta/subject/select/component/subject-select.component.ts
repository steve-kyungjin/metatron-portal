import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {Meta} from '../../../value/meta';
import {Alert} from '../../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';
import * as _ from 'lodash';
import {Utils} from '../../../../../common/util/utils';

@Component({
	selector: 'subject-select',
	templateUrl: './subject-select.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class SubjectSelectComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 닫기
	 */
	@Output('oClose')
	private close: EventEmitter<any> = new EventEmitter();

	/**
	 * 적용
	 */
	@Output('oDone')
	private done: EventEmitter<Meta.Subject[]> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 멀티 선택 모드인지
	 */
	@Input()
	public isUserMultipleSelectMode: boolean = true;

	/**
	 * 선택된 서브젝트 목록
	 */
	public selectList: Meta.Subject[] = [];

	/**
	 * 기존에 서브젝트 목록
	 */
	@Input()
	private defaultSelectList: Meta.Subject[] = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param elementRef
	 * @param injector
	 * @param translateService
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
	 * 트리 제목 선택 시
	 *
	 * @param $event
	 */
	public subjectSelect($event) {
		if (this.isUserMultipleSelectMode) {
			if ($event.type === 'CLASSIFICATION') {
				// Classification Skip
			} else if ($event.type === 'SUBJECT') {
				this.selectList.push($event.value);
				this.selectList = _.uniqWith(this.selectList, _.isEqual);
			} else if ($event.type === 'TABLE') {
				this.selectList.push($event.value);
				this.selectList = _.uniqWith(this.selectList, _.isEqual);
			} else {
				Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			}
		} else {
			if ($event.type === 'CLASSIFICATION') {
				// Classification Skip
			} else if ($event.type === 'SUBJECT') {
				this.selectList = [];
				this.selectList.push($event.value);
				this.selectList = _.uniqWith(this.selectList, _.isEqual);
				this.doneClick();
			} else if ($event.type === 'TABLE') {
				this.selectList = [];
				this.selectList.push($event.value);
				this.selectList = _.uniqWith(this.selectList, _.isEqual);
				this.doneClick();
			} else {
				Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			}
		}
	}

	/**
	 *
	 */
	public allDeleteSelectedList(): void {
		this.selectList = [];
	}

	/**
	 *
	 *
	 * @param index
	 */
	public deleteSelectedSubject(index) {
		this.selectList = Utils.ArrayUtil.remove(this.selectList, index);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
