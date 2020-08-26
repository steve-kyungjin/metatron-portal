import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {PaginationComponent} from '../../../../../common/component/pagination/pagination.component';
import {Observable, Subject} from 'rxjs';
import {Page, Sort} from '../../../../common/value/result-value';
import {Meta} from '../../../../meta/value/meta';
import {MetaService} from '../../../../meta/service/meta.service';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import * as _ from 'lodash';
import {DialogService} from '../../../../../common/component/dialog/dialog.service';
import {TranslateService} from 'ng2-translate';
import {Alert} from '../../../../../common/util/alert-util';

@Component({
	selector: '[subject-list]',
	templateUrl: './list.component.html'
})
export class ListComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 현재 페이지
	 *
	 * @type {number}
	 */
	private currentPage: number = 0;

	/**
	 * 검색어
	 *
	 * @type {string}
	 */
	public keyWord: string = '';

	/**
	 * 페이징 컴포넌트
	 */
	@ViewChild(PaginationComponent)
	private pagination: PaginationComponent;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 검색
	 *
	 * @type {Subject<string>}
	 */
	public search$: Subject<string> = new Subject<string>();

	/**
	 * 페이지 객체
	 *
	 * @type {Page}
	 */
	public page: Page = new Page();

	/**
	 * 총 엘리먼트 카운트
	 */
	public tableTotalElements: number = 0;

	/**
	 * 목록
	 */
	public list: (Meta.Subject)[] = [];

	/**
	 * 선택된 주제영역
	 */
	public selectedSubject: Meta.Subject = null;

	/**
	 * 주제영역 생성/수정 레이어 팝업 보여줄지 여부
	 */
	public isShowCreateOrUpdateLayer: boolean = false;

	/**
	 * 주제영역 생성/수정 레이어 생성/수정 구분값
	 */
	public isEditMode: boolean = false;

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
	 * @param dialogService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private metaService: MetaService,
				private dialogService: DialogService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 페이징 기본값 세팅
		this.page.number = 0;
		this.page.size = 10;
		this.page.sort = new Sort();
		this.page.sort.property = 'createdDate,desc';
		this.page.sort.direction = 'desc';

		// 검색
		this.subscriptions.push(
			this.search$
				.switchMap((value) => Observable.of<string>(value))
				.subscribe((value) => {
					this.keyWord = value.trim();
					this.pagingInit();
					this.getList();
				})
		);

		this.getList();

	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 페이징에서 선택한 페이지로 리로드
	 *
	 * @param currentPage
	 */
	public setCurrentPage(currentPage: number): void {
		this.currentPage = currentPage;
		this.page.number = this.currentPage;
		this.getList();
	}

	/**
	 * 데이터 주제영역 생성 완료
	 */
	public createSubjectDone(): void {
		this.isShowCreateOrUpdateLayer = false;
		this.pagingInit();
		this.getList();
	}

	/**
	 * 데이터 주제영역 삭제 컨펌 모달 열기
	 *
	 * @param id
	 */
	public openDeleteSubjectConfirmModal(id: string): void {
		this.dialogService
			.confirm(
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.MESSAGE.CONFIRM.DELETE', '삭제하시겠습니까?'),
				null,
				this.translateService.instant('COMMON.CANCEL', '취소'),
				this.translateService.instant('COMMON.CONFIRM', '확인'),
				() => {
					this.logger.debug(`주제영역 삭제 컨펌 취소 클릭`);
				},
				() => {
					this.deleteAnalysisAppByAppId(id);
				});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 주제영역 목록 조회
	 *
	 * @param isLoading
	 */
	private getList(isLoading: boolean = true): void {

		if (isLoading) {
			Loading.show();
		}

		this.metaService
			.getSubjectList(this.keyWord, null, this.page)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.setPageInfo(result.data.subjectList);
					this.pagination.init(this.page);
					this.list = result.data.subjectList.content;
					this.tableTotalElements = result.data.subjectList.totalElements;
				} else {
					this.pagingInit();
					this.list = [];
					this.tableTotalElements = 0;
				}

				if (isLoading) {
					Loading.hide();
				}
			});
	}

	/**
	 * 페이징 처리
	 *
	 * @param totalPage
	 */
	private pagingInit(totalPage: number = 0): void {
		this.page.totalPages = totalPage;
		this.page.number = 0;
		this.page.totalElements = 0;
		this.pagination.init(this.page);
	}

	/**
	 * 페이지 정보 세팅
	 *
	 * @param page
	 */
	private setPageInfo(page): void {
		this.page.first = page.first;
		this.page.last = page.last;
		this.page.number = page.number;
		this.page.numberOfElements = page.numberOfElements;
		this.page.size = page.size;
		this.page.totalElements = page.totalElements;
		this.page.totalPages = page.totalPages;
	}

	/**
	 * 분석 앱 삭제
	 *
	 * @param {string} appId
	 */
	private deleteAnalysisAppByAppId(appId: string): void {

		Loading.show();

		this.metaService
			.deleteSubjectById(appId)
			.then(result => {

				Loading.hide();

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));
					this.pagingInit();
					this.getList();
				} else {
					Alert.warning('삭제할 수 없습니다.');
				}
			});
	}

	/**
	 * 선택된 주제영역 아이디 가져오기
	 */
	public getSelectedSubjectId(): string {
		return _.isNil(this.selectedSubject) || _.isNil(this.selectedSubject.id) ? '' : this.selectedSubject.id;
	}

}
