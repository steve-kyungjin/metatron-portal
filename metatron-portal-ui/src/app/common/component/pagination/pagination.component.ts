import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Page} from '../../../portal/common/value/result-value';

@Component({
	selector: '[pagination]',
	templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Output()
	private pageMove = new EventEmitter();

	@Input('size')
	private pageRange: number = 10;

	@Input('range')
	private range: number = 10;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	//페이지
	public pageList = [];
	// 페이지 그룹
	public groupPage = [];
	// 전체 페이지 개수
	public totalPage: number;
	// next 페이지 이동 가능여부
	public lastPageFl: boolean;
	// prev 페이지 이동 가능여부
	public prevPageFl: boolean;
	// 현재 페이지
	public currentPage: number = 0;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor() {
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
	}

	public ngOnDestroy(): void {
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 페이징
	public init(page: Page) {

		// 현재 페이지가 처음 페이지라면 초기화
		if (page[ 'number' ] == 0) {
			this.pageList = [];
			this.groupPage = [];
		}

		// 총 페이지수가 0 이라면 페이지 목록을 초기화하고 멈춘다
		if (page.totalPages == 0) {
			this.pageList = [];
			this.groupPage = [];
			return;
		}

		// total page
		this.totalPage = page.totalPages;

		// 페이지값 넣어줄 리스트
		let pageList = [];

		// 페이지 범위만큼 나누기
		let eachPage = Math.ceil(page.totalPages / this.range);

		// 각 해당 범위 설정
		for (var num2 = 1; num2 <= eachPage; num2++) {

			let pageArray = [];

			// 해당 범위의 페이지
			let num = num2 == 1 ? 1 : (this.range * (num2 - 1)) + 1;

			// 해당 범위의 페이지만큼 push
			for (num; num <= this.range * num2; num++) {

				// total 페이지보다 작은지 체크
				if (num <= page.totalPages) {

					pageArray.push(num);
				}
			}

			pageList.push(pageArray);
		}
		// page list
		this.pageList = pageList;

		// 해당 범위의 페이지들
		this.groupPage = this.groupPage.length == 0 ? this.pageList[ 0 ] : this.groupPage;

		// 해당 페이지범위의 next 이동 가능여부
		this.lastPageFl = this.groupPage[ this.groupPage.length - 1 ] < this.totalPage;

		// 해당 페이지범위의 prev 이동 가능여부
		this.prevPageFl = this.groupPage[ this.groupPage.length - 1 ] / this.range > 1;

		// 현재 페이지를 셀렉트 표시하기 위해서 값을 세팅한다
		this.currentPage = page[ 'number' ];
	}

	// 이전 페이지(true) 다음 페이지(false)
	public move(groupPage, prevNextFl) {

		// 이전페이지 -1, 다음 페이지 1
		let setPageNum = prevNextFl ? -1 : 1;

		// 같은 데이터의 바로 다음데이터 입력
		for (let num: number = 0; num < this.pageList.length; num++) {

			if (this.pageList[ num ].toString() == groupPage.toString()) {

				this.groupPage = this.pageList[ num + setPageNum ];

				// 해당 페이지범위의 next 이동 가능여부
				this.lastPageFl = this.groupPage[ this.groupPage.length - 1 ] < this.totalPage;

				// 해당 페이지범위의 prev 이동 가능여부
				this.prevPageFl = this.groupPage[ this.groupPage.length - 1 ] / this.pageRange > 1;

				break;
			}
		}

		// 현재 페이지
		this.currentPage = this.groupPage[ 0 ] - 1;

		// 현재 페이지 parent로 noti
		this.pageMove.emit(this.currentPage);
	}

	// 선택 페이지
	public setPage(item: number) {

		if (this.isCurrentPage(item)) {
			return;
		}

		// 현재 페이지
		this.currentPage = item - 1;
		// 현재 페이지 parent로 noti
		this.pageMove.emit(this.currentPage);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 현제 페이지 번호와 같은지 검사
	public isCurrentPage(item: number): boolean {
		return this.currentPage == item - 1;
	}

}
