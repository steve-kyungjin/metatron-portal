import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Meta} from '../value/meta';

@Injectable()
export class DatabaseService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private getDatabaseObservable: Subject<any> = new Subject();
	private getInstanceTableListObservable: Subject<any> = new Subject();
	private initializeObservable: Subject<any> = new Subject();
	private selectedObservable: Subject<Meta.Instance | Meta.Database> = new Subject();
	private databaseContentLoadCompleteObservable: Subject<any> = new Subject();
	private changePageSizeObservable: Subject<string> = new Subject();
	private selectedMetaTypeObservable: Subject<'ALL' | 'INSTANCE' | 'DATABASE'> = new Subject();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public getDatabase$: Observable<any> = this.getDatabaseObservable.asObservable();
	public getInstanceTableList$: Observable<any> = this.getInstanceTableListObservable.asObservable();
	public initialize$: Observable<any> = this.initializeObservable.asObservable();
	public selected$: Observable<Meta.Instance | Meta.Database> = this.selectedObservable.asObservable();
	public databaseContentLoadComplete$: Observable<any> = this.databaseContentLoadCompleteObservable.asObservable();
	public changePageSize$: Observable<string> = this.changePageSizeObservable.asObservable();
	public selectedMetaType$: Observable<'ALL' | 'INSTANCE' | 'DATABASE'> = this.selectedMetaTypeObservable.asObservable();

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
	 * 메타 타입 선택
	 *
	 * @param type
	 */
	public selectMetaType(type: 'ALL' | 'INSTANCE' | 'DATABASE') {
		this.selectedMetaTypeObservable.next(type);
	}

	/**
	 * 인스턴스하위 테이블 목록 조회
	 */
	public getInstanceTableList() {
		this.getInstanceTableListObservable.next();
	}

	/**
	 * DW 페이지 사이즈 변경 알림
	 */
	public pageSizeChangeNoti() {
		this.changePageSizeObservable.next();
	}

	/**
	 * 데이터베이스 컨텐츠 영역 로드 완료 알림
	 */
	public databaseContentLoadComplete() {
		this.databaseContentLoadCompleteObservable.next();
	}

	/**
	 * 데이터베이스 조회
	 */
	public getDatabase() {
		this.getDatabaseObservable.next();
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
	 * @param data
	 */
	public selected(data: Meta.Instance | Meta.Database) {
		this.selectedObservable.next(data);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
