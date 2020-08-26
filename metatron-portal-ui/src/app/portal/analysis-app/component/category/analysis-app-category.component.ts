import {Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Code} from '../../../common/value/code';
import {CookieConstant} from "../../../common/constant/cookie-constant";
import {CookieService} from "ng2-cookies";

@Component({
	selector: 'analysis-app-category',
	templateUrl: './analysis-app-category.component.html'
})
export class AnalysisAppCategoryComponent extends AbstractComponent implements OnInit, OnDestroy, OnChanges {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 카테고리 명으로 선택
	@Input()
	public selectedCategoryName: string;

	// 카테고리 ID로 선택
	@Input()
	public selectedCategoryId: string;

	// 카테고리 인덱스로 선택
	@Input()
	public selectedCategoryIndex: number = -1;

	// 카테고리 목록
	@Input()
	public categoryList: Array<Code.Entity>;

	// radio 형태인지 여부
	@Input()
	public isRadio: boolean = true;

	// 카테고리 선택 시 event emit
	@Output()
	public selectCategory: EventEmitter<Code.Entity> = new EventEmitter<Code.Entity>();

	// 현재 선택한 카테고리
	public currentCategory: Code.Entity;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private cookieService: CookieService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		super.ngOnInit();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		for (let propName in changes) {
			if (propName === 'categoryList') {
				this.categoryChange();
			}
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 카테고리 색상 조회
	 */
	public getColor(index) {
		return String.fromCharCode(97 + index % 10);
	}

	/**
	 * 카테고리 클릭
	 */
	public categoryClick(index) {

		this.currentCategory = null;
		for (let i = 0; i < this.categoryList.length; i++) {
			if (i == index) {
				this.currentCategory = this.categoryList[ i ];
				break;
			}
		}

		if (this.currentCategory != null) {
			this.selectCategory.emit(this.currentCategory);
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * category list 변경
	 */
	private categoryChange() {
		if (!this.categoryList) {
			return;
		}

		let code = new Code.Entity();
		code.nmKr = '전체';
		code.nmEn = 'All';

		let initCategoryList = [];
		initCategoryList.push({ nmKr: '전체', nmEn: 'All' });

		this.categoryList = initCategoryList.concat(this.categoryList);

		// 초기 선택 값에 따라 버튼 선택
		let index = -1;
		if (this.selectedCategoryId) {
			this.currentCategory = this.categoryList.find((value: Code.Entity, i: number) => {
				if (value.id == this.selectedCategoryId) {
					index = i;
					return true;
				} else {
					return false;
				}
			});
		} else if (this.selectedCategoryIndex > -1) {
			if (this.categoryList.length > this.selectedCategoryIndex) {
				this.currentCategory = this.categoryList[ this.selectedCategoryIndex ];
				index = this.selectedCategoryIndex;
			}
		} else if (this.selectedCategoryName) {
			this.currentCategory = this.categoryList.find((value: Code.Entity, i: number) => {
				if (value.nmKr == this.selectedCategoryName) {
					index = i;
					return true;
				} else {
					return false;
				}
			});
		} else {
			index = 0;
			this.currentCategory = this.categoryList[ index ];
		}

		// Radio 타입이 아니면 초기 선택하지 않음
		if (this.isRadio) {
			if (index == -1) {
				index = 0;
			}
			this.categoryClick(index);
		} else {
			this.currentCategory = null;
		}
	}

	public getName(category: Code.Entity) {
		if (this.cookieService.get(CookieConstant.KEY.LANGUAGE) === 'en') {
			return category.nmEn;
		} else {
			return category.nmKr;
		}
	}

}
