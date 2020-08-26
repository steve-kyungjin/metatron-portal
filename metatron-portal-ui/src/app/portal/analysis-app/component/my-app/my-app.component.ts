import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import {AnalysisApp} from '../../value/analysis-app.value';
import {AnalysisAppService} from '../../service/analysis-app.service';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Page, Sort} from '../../../common/value/result-value';
import {DialogService} from '../../../../common/component/dialog/dialog.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Alert} from '../../../../common/util/alert-util';
import {Loading} from '../../../../common/util/loading-util';

@Component({
	selector: 'analysis-app-my-app',
	templateUrl: './my-app.component.html'
})
export class AnalysisAppMyAppComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
   	| Private Variables
   	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 검색 인풋
	 */
	@ViewChild('searchInput')
	private searchInput: ElementRef;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 검색어
	public searchText: string = '';

	// 페이지
	public pageable: Page;

	// 앱 목록
	public appList: Array<AnalysisApp.Entity>;

	// 인기 앱 목록
	public addAppList: Array<AnalysisApp.Entity>;

	// 신규 앱 목록
	public latestAppList: Array<AnalysisApp.Entity>;

	// 검색 object
	public search$: Subject<string> = new Subject<string>();

	// 목록 끝인지 체크
	public isLast: boolean = true;

	// 더보기 show/hide
	public existData: boolean = true;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				public analysisAppService: AnalysisAppService,
				private dialogService: DialogService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

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

		// 페이지 리셋
		this.pageReset();

		// main 데이터 조회
		this.analysisAppService
			.getMyAppMain(this.searchText, this.pageable)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					//
					const data: AnalysisApp.MyAppMain = result.data;
					// 마이 앱 목록
					this.appList = [];
					//
					this.setList(result.data.myAppList);
					// 사용자 추가 앱 탑3
					this.addAppList = data.addAppList;
					// 최신 앱 리스트
					this.latestAppList = data.latestAppList;
				}

				Loading.hide();
			})
			.catch(error => {
				Loading.hide();
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 앱 클릭
	 */
	public appClick(item: AnalysisApp.Entity) {
		if (item.id) {
			this.router.navigate([ `view/analysis-app/${item.id}` ]);
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
	 * 삭제 클릭
	 */
	public appDeleteClick(app: AnalysisApp.Entity) {
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
				this.analysisAppService.deleteMyApp(app.id).then(result => {
					if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
						Alert.success(this.translateService.instant('COMMON.MESSAGE.DELETE', '삭제되었습니다.'));

						this.layoutService.createDataSetUsedByLnb();
						this.search(true);
					}
				})
			});
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

		this.analysisAppService.getMyAppList(this.searchText, this.pageable).then(result => {
			// 초기화
			if (isInit) {
				this.appList = [];
			}

			this.setList(result.data.myAppList);

			Loading.hide()
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
		this.pageable.sort = new Sort();
		// sort
		this.pageable.sort.property = 'createdDate,desc';
		// sort
		this.pageable.sort.direction = 'desc';
	}

	// set list
	private setList(appContent: AnalysisApp.ListContent) {
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
