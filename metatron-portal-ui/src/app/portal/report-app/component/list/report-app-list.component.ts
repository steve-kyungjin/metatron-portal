import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import {ReportAppService} from '../../service/report-app.service';
import {ReportApp} from '../../value/report-app.value';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Page, Sort} from '../../../common/value/result-value';
import {CommonConstant} from '../../../common/constant/common-constant';
import {SwiperSlide} from '../../../../common/component/swiper-slide/swiper-slide.value';
import {Loading} from '../../../../common/util/loading-util';
import {Code} from '../../../common/value/code';

@Component({
	selector: 'report-app-list',
	templateUrl: './report-app-list.component.html'
})
export class ReportAppListComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
   	| Private Variables
   	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild('searchInput')
	private searchInput: ElementRef;

	private pageable: Page;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 현재 선택한 카테고리 ID
	public currentCategoryId: string;
	// 현재 선택한 카테고리명
	public currentCategoryName: string;
	// 검색어
	public searchText: string = '';

	// 카테고리 목록
	public categoryList: Array<Code.Entity>;
	// 이미지 목록
	public slideList: Array<SwiperSlide>;
	// 신규 앱 목록
	public latestAppList: Array<ReportApp.Entity>;
	// 앱 목록
	public appList: Array<ReportApp.Entity>;
	// 인기 앱 목록
	public addAppList: Array<ReportApp.Entity>;
	// 실행 앱 목록
	public execAppList: Array<ReportApp.Entity>;
	// 정렬 목록
	public sortList: Array<Object>;

	// 검색 object
	public search$: Subject<string> = new Subject<string>();

	// 목록 끝인지 체크
	public isLast: boolean;
	// 초기 화면에서 자동으로 카테고리가 선택되기 때문에 앱조회 중복을 피하기 위한..
	public isFirstLoad: boolean;
	// 목록 더보기 show/hide
	public existData: boolean = true;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				public reportAppService: ReportAppService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.isFirstLoad = true;

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.VIEW, this.gnbService.permission.name);

		Loading.show();

		// 검색어 입력
		this.subscriptions.push(
			this.search$
				.switchMap((value) => Observable.of<string>(value))
				.subscribe((text) => {
					Loading.show();
					this.searchText = text.trim();
					this.search(true);

					// 태깅
					this.tagging(this.TaggingType.LIST, this.TaggingAction.BTN, this.searchText);
				})
		);

		super.ngOnInit();

		// parameter 가져오기
		this.subscriptions.push(
			this.activatedRoute.queryParams.subscribe(params => {

				Loading.show();

				this.currentCategoryId = undefined;

				if (params[ 'category' ] !== undefined) {
					this.currentCategoryId = params[ 'category' ];
				}

				// 화면 초기화
				this.init();
			})
		);

		// 정렬 목록
		this.sortList = [
			{ title: this.translateService.instant('ANALYSIS.APP.LIST.SORT.UPDATE'), sort: 'createdDate', direction: 'desc' },
			{ title: this.translateService.instant('ANALYSIS.APP.LIST.SORT.NAME'), sort: 'appNm', direction: 'asc' }
		];
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 초기화
	 */
	public init() {
		// 페이지 리셋
		this.pageReset();

		// main 데이터 조회
		this.reportAppService
			.getMain(this.currentCategoryId, this.pageable)
			.then(result => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {

					const data = result.data;
					// 앱 목록
					this.appList = [];
					this.setList(data.reportAppList);
					// 카테고리 목록
					this.categoryList = data.categoryList;
					// 추천 앱 목록
					this.latestAppList = data.latestAppList;
					// 사용자 추가 앱 탑3
					this.addAppList = data.addAppList;
					// 사용자 실행 앱 탑3
					this.execAppList = data.execAppList;

					this.slideList = [];
					for (let i = 0; i < this.latestAppList.length; i++) {
						let img: SwiperSlide = new SwiperSlide(
							this.reportAppService.getFirstImage(this.latestAppList[ i ], true),
							this.latestAppList[ i ].appNm,
							this.latestAppList[ i ].summary);
						this.slideList.push(img);
					}

					Loading.hide();
				}
			});
	}

	/**
	 * Swiper Slide item 클릭
	 */
	public swiperItemClick(item: SwiperSlide) {
		const index: number = this.slideList.findIndex((value: SwiperSlide) => {
			return item == value;
		});
		this.appClick(this.latestAppList[ index ]);
	}

	/**
	 * 정렬 변경
	 */
	public changeSort(index) {
		Loading.show();
		const sort = this.sortList[ index ][ 'sort' ];
		const direction = this.sortList[ index ][ 'direction' ];
		this.pageable.sort.property = sort;
		this.pageable.sort.direction = direction;
		this.search(true);
	}

	/**
	 * 앱 클릭
	 */
	public appClick(item: ReportApp.Entity) {
		if (item.id) {
			this.router.navigate([ `view/report-app/${item.id}` ]);
		}
	}

	/**
	 * 목록 더보기 클릭
	 */
	public listMoreClick() {
		this.pageable.number++;
		Loading.show();
		this.search();
	}

	/**
	 * 카테고리 클릭
	 */
	public categoryClickHandler(category: Code.Entity) {

		this.currentCategoryId = category.id;
		this.currentCategoryName = category.nmKr;

		if (!this.isFirstLoad) {
			Loading.show();
			this.search(true);
		}
		this.isFirstLoad = false;
	}

	/**
	 * 검색
	 */
	public search(isInit: boolean = false) {

		// 초기화
		if (isInit) {
			this.pageable.number = 0;
		}

		this.searchInput.nativeElement.value = this.searchText;

		this.reportAppService
			.getAppListByCategory(this.currentCategoryId, this.searchText, this.pageable)
			.then(result => {

				// 초기화
				if (isInit) {
					this.appList = [];
				}

				// 앱 목록
				this.setList(result.data.reportAppList);

				Loading.hide();
			});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 페이지 초기화
	private pageReset() {
		this.pageable = new Page();
		// 현재 페이지
		this.pageable.number = 0;
		// 페이지 사이즈
		this.pageable.size = 10;
		if (!this.pageable.sort) {
			this.pageable.sort = new Sort();
			// sort
			this.pageable.sort.property = 'createdDate';
			// sort
			this.pageable.sort.direction = 'desc';
		}
	}

	// set list
	private setList(appContent: ReportApp.ListContent) {
		this.pageable = appContent;
		this.appList = this.appList.concat(appContent.content);
		this.existData = this.appList.length ? true : false;

		// 더보기 버튼 숨김 여부
		if (this.pageable.totalElements == 0 || this.pageable.totalPages == this.pageable.number + 1) {
			this.isLast = true;
		} else {
			this.isLast = false;
		}
	}
}
