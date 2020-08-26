import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Meta} from '../value/meta';

@Injectable()
export class TableService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private getTableObservable: Subject<any> = new Subject();
	private initializeObservable: Subject<any> = new Subject();
	private selectedObservable: Subject<Meta.Subject> = new Subject();
	private selectedCriteriaIdObservable: Subject<string> = new Subject();
	private changePageSizeObservable: Subject<string> = new Subject();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public getTable$: Observable<any> = this.getTableObservable.asObservable();
	public initialize$: Observable<any> = this.initializeObservable.asObservable();
	public selected$: Observable<Meta.Subject> = this.selectedObservable.asObservable();
	public selectedCriteriaId$: Observable<string> = this.selectedCriteriaIdObservable.asObservable();
	public changePageSize$: Observable<string> = this.changePageSizeObservable.asObservable();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor() {}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * DW 페이지 사이즈 변경 알림
	 */
	public pageSizeChangeNoti() {
		this.changePageSizeObservable.next();
	}

	/**
	 * 테이블 조회
	 *
	 * @param criteriaId
	 */
	public getTable(criteriaId: string = null) {

		if (criteriaId) {
			this.selectedCriteriaIdObservable.next(criteriaId);
		} else {
			this.selectedCriteriaIdObservable.next(null);
		}

		this.getTableObservable.next();
	}

	/**
	 * 초기화
	 */
	public initialize() {
		this.initializeObservable.next();
	}

	/**
	 * 선택 시
	 *
	 * @param subject
	 */
	public selected(subject: Meta.Subject) {
		this.selectedObservable.next(subject);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
