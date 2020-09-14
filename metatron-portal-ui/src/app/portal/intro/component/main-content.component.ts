// noinspection TypeScriptCheckImport
import {Component, ElementRef, Injector, OnDestroy, OnInit} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {AbstractComponent} from "../../common/component/abstract.component";
import {MainContentService} from "../service/main-content.service";
import {CommonConstant} from "../../common/constant/common-constant";
import {MainContent, MainContentList} from "../value/main-content.value";
import {environment} from "../../../../environments/environment";

declare const Swiper: any;

@Component({
	selector: 'main-content',
	templateUrl: './main-content.component.html'
})
export class MainContentComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
   	| Private Variables
   	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private swiper: any;
	private swiperMin: any;

	private wrapper: any;
	private wrapperMin: any;
	private swiperItem: any;
	private analysisItem: any;
	private reportItem: any;
	private commItem: any;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public isFinish: boolean = false;

	public allList: MainContentList = new MainContentList();
	public analysisAppList: MainContent[] = [];
	public reportAppList: MainContent[] = [];
	public communicationList: MainContent[] = [];

	public tabList: Array<Object> = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private mainContentService: MainContentService
	) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		super.ngOnInit();

		this.wrapper = this.jQuery('#mainSwiperWrapper');
		this.wrapperMin = this.jQuery('#mainSwiperWrapperMin');
		this.analysisItem = this.jQuery('#mainAnalysisItem').clone();
		this.reportItem = this.jQuery('#mainReportItem').clone();
		this.commItem = this.jQuery('#mainCommItem').clone();

		this.jQuery('#mainSwiperItem').find('li').remove();
		this.swiperItem = this.jQuery('#mainSwiperItem').clone();

		this.mainContentService.getMain().then(result => {
			if (CommonConstant.CODE.RESULT_CODE.SUCCESS === result.code) {
				let analysisAppList = result.data.main.analysisApps ? result.data.main.analysisApps : [];
				let reportAppList = result.data.main.reportApps ? result.data.main.reportApps : [];
				let communicationList = result.data.main.communications ? result.data.main.communications : [];

				this.analysisAppList = [];
				Array.from(analysisAppList).forEach(value => {
					value.categoryString = this.getCategoriesToString(value.categories);
					value.media = `${environment.apiUrl}/media/${value.media}/t`;
					this.analysisAppList.push(value);
				});

				this.reportAppList = [];
				Array.from(reportAppList).forEach((value, index) => {
					value.categoryString = this.getCategoriesToString(value.categories);
					value.media = `${environment.apiUrl}/media/${value.media}/t`;

					this.reportAppList.push(value);
				});

				this.communicationList = [];
				Array.from(communicationList).forEach((value, index) => {
					value.media = this.getCommImage(value.media, index);
				});

				// 순서 변경
				if (communicationList.length > 5) {
					this.communicationList.push(communicationList[ 0 ]);
					this.communicationList.push(communicationList[ 2 ]);
					this.communicationList.push(communicationList[ 3 ]);
					this.communicationList.push(communicationList[ 1 ]);
					this.communicationList.push(communicationList[ 4 ]);
					this.communicationList.push(communicationList[ 5 ]);
				} else {
					this.communicationList = communicationList;
				}

				this.allList = new MainContentList();
				this.tabList = [];
				let existAll = false;

				if ((this.analysisAppList.length && this.reportAppList.length) ||
					(this.analysisAppList.length && this.communicationList.length) ||
					(this.reportAppList.length && this.communicationList.length)) {

					existAll = true;

					if (this.analysisAppList.length && this.reportAppList.length && this.communicationList.length) {
						this.allList.analysisApps = [];
						Array.from(this.analysisAppList).forEach((value, index) => {
							if (index < 1) {
								this.allList.analysisApps.push(value);
							}
						});

						this.allList.reportApps = [];
						Array.from(this.reportAppList).forEach((value, index) => {
							if (index < 1) {
								this.allList.reportApps.push(value);
							}
						});
					} else if (this.analysisAppList.length && this.reportAppList.length) {
						this.allList.analysisApps = [];
						Array.from(this.analysisAppList).forEach((value, index) => {
							if (index < 2) {
								this.allList.analysisApps.push(value);
							}
						});

						this.allList.reportApps = [];
						Array.from(this.reportAppList).forEach((value, index) => {
							if (index < 2) {
								this.allList.reportApps.push(value);
							}
						});
					} else if (this.analysisAppList.length && this.communicationList.length) {
						this.allList.analysisApps = [];
						Array.from(this.analysisAppList).forEach((value, index) => {
							if (index < 2) {
								this.allList.analysisApps.push(value);
							}
						});
					} else if (this.reportAppList.length && this.communicationList.length) {
						this.allList.reportApps = [];
						Array.from(this.reportAppList).forEach((value, index) => {
							if (index < 2) {
								this.allList.reportApps.push(value);
							}
						});
					}

					if (this.communicationList.length) {
						this.allList.communications = [];
						Array.from(this.communicationList).forEach((value, index) => {
							if (index < 3) {
								this.allList.communications.push(value);
							}
						});
					}

					let tabChildrenCnt = 0;
					if ((this.allList.analysisApps.length || this.allList.reportApps.length) && this.allList.communications.length) {
						tabChildrenCnt = 2;
					} else {
						tabChildrenCnt = 1;
					}
					this.tabList.push({
						title: this.translateService.instant('COMMON.TOTAL', '전체'),
						type: 'ALL',
						selected: true,
						children: this.createTabChildrenWithPageCnt(tabChildrenCnt, true)
					});
				}

				if (this.reportAppList.length) {
					this.tabList.push({
						title: this.translateService.instant('INTRO.MAIN.REPORT.APP', '리포트'),
						type: 'report',
						selected: this.tabList.length ? false : true,
						children: this.createTabChildren(this.reportAppList.length, 2)
					});
				}
				if (this.analysisAppList.length) {
					this.tabList.push({
						title: this.translateService.instant('INTRO.MAIN.ANALYSIS.APP', '분석 앱'),
						type: 'analysis',
						selected: this.tabList.length ? false : true,
						children: this.createTabChildren(this.analysisAppList.length, 2)
					});
				}
				if (this.communicationList.length) {
					this.tabList.push({
						title: this.translateService.instant('INTRO.MAIN.COMMUNICATION', '커뮤니케이션'),
						type: 'comm',
						selected: this.tabList.length ? false : true,
						children: this.createTabChildren(this.communicationList.length, 3)
					});
				}

				this.createSwiper(existAll);

				this.createSwiper(existAll, true);

				this.isFinish = true;
			}
		});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public tabClick(index, item, isMin = false) {

		let currentPage = 0;
		Array.from(this.tabList).forEach((value, i) => {
			if (i < index) {
				currentPage += value['children'].length;
			}
		});

		if (isMin) {
			if (this.swiperMin) {
				this.swiperMin.slideToLoop(currentPage);
			}
		} else {
			if (this.swiper) {
				this.swiper.slideToLoop(index);
			}
		}

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.BTN, item['title']);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Category to String
	 *
	 * @param categories
	 * @returns {string}
	 */
	private getCategoriesToString(categories: string[]) {
		let returnValue = '';

		Array.from(categories).forEach(value => {
			returnValue += '#' + value + ', ';
		});

		if (returnValue.endsWith(', ')) {
			returnValue = returnValue.substr(0, returnValue.lastIndexOf(', '));
		}

		return returnValue;
	}

	/**
	 * 커뮤니케이션 이미지
	 *
	 * @param media
	 * @param index
	 * @returns {string}
	 */
	private getCommImage(media: string, index: number) {
		if (media) {
			return `${environment.apiUrl}/media/${media}/t`;
		} else {
			if (!index) {
				return `${(environment.isLocalMode ? '' : environment.contextPath)}/assets/images/default_comm_01.png`;
			} else {
				return `${(environment.isLocalMode ? '' : environment.contextPath)}/assets/images/default_comm_02.png`;
			}
		}
	}

	/**
	 * Swiper 생성(시점 문제로 jquery로 생성)
	 *
	 * @param createAll
	 */
	private createSwiper(createAll: boolean, isMin: boolean = false) {

		let wrapper = this.wrapper;
		let swiperSelector = '.type-main.type-max .swiper-container';
		let nextSelector = '.type-main.type-max .swiper-button-next';
		let prevSelector = '.type-main.type-max .swiper-button-prev';
		if (isMin) {
			wrapper = this.wrapperMin;
			swiperSelector = '.type-main.type-min .swiper-container';
			nextSelector = '.type-main.type-min .swiper-button-next';
			prevSelector = '.type-main.type-min .swiper-button-prev';
		}

		wrapper.empty();

		// 전체
		if (createAll) {
			let swiperItem = this.swiperItem.clone();
			let ul = swiperItem.find('ul');
			ul.addClass('type-all');

			// 리포트
			Array.from(this.allList.reportApps).forEach((value, index) => {
				let li = this.createAppItem(value, true);
				ul.append(li);
			});

			// 분석 앱
			Array.from(this.allList.analysisApps).forEach((value, index) => {
				let li = this.createAppItem(value, false);
				ul.append(li);
			});

			if (isMin) {
				wrapper.append(swiperItem);

				swiperItem = this.swiperItem.clone();
				ul = swiperItem.find('ul');
				ul.addClass('type-all');
			}

			// 커뮤니케이션
			if (this.allList.communications.length > 0) {
				ul.addClass('is-comm');
				let li = document.createElement('li');
				Array.from(this.allList.communications).forEach((value, index) => {
					let comm = this.createCommItem(value, index);
					this.jQuery(li).append(comm);
				});
				ul.append(li);
			}
			wrapper.append(swiperItem);
		}

		// 리포트
		if (this.reportAppList.length) {
			if (isMin) {
				let swiperItem = this.swiperItem.clone();
				let ul = swiperItem.find('ul');
				Array.from(this.reportAppList).forEach((value, index) => {
					if (index < 2) {
						let li = this.createAppItem(value, true);
						ul.append(li);
					}
				});

				wrapper.append(swiperItem);

				if (this.reportAppList.length > 2) {
					swiperItem = this.swiperItem.clone();
					ul = swiperItem.find('ul');
					Array.from(this.reportAppList).forEach((value, index) => {
						if (index > 1) {
							let li = this.createAppItem(value, true);
							ul.append(li);
						}
					});

					wrapper.append(swiperItem);
				}
			} else {
				let swiperItem = this.swiperItem.clone();
				let ul = swiperItem.find('ul');
				Array.from(this.reportAppList).forEach((value, index) => {
					let li = this.createAppItem(value, true);
					ul.append(li);
				});

				wrapper.append(swiperItem);
			}
		}

		// 분석 앱
		if (this.analysisAppList.length) {
			if (isMin) {
				let swiperItem = this.swiperItem.clone();
				let ul = swiperItem.find('ul');
				Array.from(this.analysisAppList).forEach((value, index) => {
					if (index < 2) {
						let li = this.createAppItem(value, false);
						ul.append(li);
					}
				});

				wrapper.append(swiperItem);

				if (this.analysisAppList.length > 2) {
					swiperItem = this.swiperItem.clone();
					ul = swiperItem.find('ul');
					Array.from(this.analysisAppList).forEach((value, index) => {
						if (index > 1) {
							let li = this.createAppItem(value, false);
							ul.append(li);
						}
					});

					wrapper.append(swiperItem);
				}

			} else {
				let swiperItem = this.swiperItem.clone();
				let ul = swiperItem.find('ul');
				Array.from(this.analysisAppList).forEach((value, index) => {
					let li = this.createAppItem(value, false);
					ul.append(li);
				});

				wrapper.append(swiperItem);
			}
		}

		// 커뮤니케이션
		if (this.communicationList.length) {
			if (isMin) {
				let swiperItem = this.swiperItem.clone();
				let ul = swiperItem.find('ul');
				ul.addClass('type-communication');
				let li = document.createElement('li');
				Array.from(this.communicationList).forEach((value, index) => {
					if (index < 3) {
						let comm = this.createCommItem(value, index);
						this.jQuery(li).append(comm);
					}
				});
				ul.append(li);

				wrapper.append(swiperItem);

				if (this.communicationList.length > 2) {
					let swiperItem = this.swiperItem.clone();
					let ul = swiperItem.find('ul');
					ul.addClass('type-communication');
					let li = document.createElement('li');
					Array.from(this.communicationList).forEach((value, index) => {
						if (index > 2) {
							let comm = this.createCommItem(value, index);
							this.jQuery(li).append(comm);
						}
					});
					ul.append(li);

					wrapper.append(swiperItem);
				}
			} else {
				let swiperItem = this.swiperItem.clone();
				let ul = swiperItem.find('ul');
				ul.addClass('type-communication');
				let li = document.createElement('li');
				Array.from(this.communicationList).forEach((value, index) => {
					let comm = this.createCommItem(value, index);
					this.jQuery(li).append(comm);
				});
				ul.append(li);

				wrapper.append(swiperItem);
			}
		}

		let swiper = new Swiper(swiperSelector, {
			slidesPerView: 1,
			spaceBetween: 0,
			slidesPerGroup: 1,
			loop: true,
			loopFillGroupWithBlank: true,
			navigation: {
				nextEl: nextSelector,
				prevEl: prevSelector
			}
		});

		let self = this;


		if (isMin) {
			this.swiperMin = swiper;
			this.swiperMin.on('transitionEnd', function () {
				if (self.jQuery('.intro-content.type-min').css('left') == '-9999px') {
					// min swiper 가 보이지 않는 상태에서는 아래 로직 수행 필요 X
					return;
				}
				// 현재 탭의 최대 swipe page (min swiper)
				let currentMinTotalPage = 0;
				let selectedMain = false;
				// 이동할 index (default swiper)
				let slideIndex = 0;
				Array.from(self.tabList).forEach((value, index) => {
					currentMinTotalPage += value['children'].length;
					if (currentMinTotalPage > self.swiperMin.realIndex && !selectedMain) {
						value[ 'selected' ] = true;
						selectedMain = true;
						slideIndex = index;
					} else {
						value[ 'selected' ] = false;
					}

					Array.from(value['children']).forEach((v, i) => {
						if (selectedMain && i == value['children'].length - (currentMinTotalPage - self.swiperMin.realIndex)) {
							v[ 'selected' ] = true;
						} else {
							v[ 'selected' ] = false;
						}
					});
				});

				self.swiper.slideToLoop(slideIndex, 0, false);
			});
		} else {
			this.swiper = swiper;
			this.swiper.on('transitionEnd', function () {
				if (self.jQuery('.intro-content.type-max').css('left') == '-9999px') {
					// max swiper 가 보이지 않는 상태에서는 아래 로직 수행 필요 X
					return;
				}
				// 현재 탭의 최대 swipe page (min swiper)
				let currentMinTotalPage = 0;
				// 이동할 index (min swiper)
				let slideIndex = 0;
				Array.from(self.tabList).forEach((value, index) => {

					if (index == self.swiper.realIndex) {
						value[ 'selected' ] = true;
						slideIndex = currentMinTotalPage;
					} else {
						value[ 'selected' ] = false;
					}

					Array.from(value['children']).forEach((v, i) => {
						if (value[ 'selected' ] == true && i == 0) {
							v[ 'selected' ] = true;
						} else {
							v[ 'selected' ] = false;
						}
					});

					currentMinTotalPage += value['children'].length;
				});

				self.swiperMin.slideToLoop(slideIndex, 0, false);
			});
		}
	}

	/**
	 * 리포트/분석 앱 아이템 생성
	 *
	 * @param mainContent
	 * @param isReportItem
	 * @returns {HTMLElementTagNameMap[string]}
	 */
	private createAppItem(mainContent: MainContent, isReportItem: boolean) {
		let appItem;
		if (isReportItem) {
			appItem = this.reportItem.clone();
		} else {
			appItem = this.analysisItem.clone();
		}

		const self = this;
		appItem.find('.link-box').click(function () {
			self.appContentClick(isReportItem, mainContent);
		});
		appItem.find('.bg-img').css('background-image', `url( ${mainContent.media} )`);
		if (isReportItem) {
			appItem.find('.badge-report').text(this.translateService.instant('INTRO.MAIN.REPORT.APP', '리포트'));
			appItem.find('.badge-my').text(this.translateService.instant('INTRO.MAIN.REPORT.APP.MY', '나의 리포트'));
		} else {
			appItem.find('.badge-analysis').text(this.translateService.instant('INTRO.MAIN.ANALYSIS.APP', '분석 앱'));
			appItem.find('.badge-my').text(this.translateService.instant('INTRO.MAIN.ANALYSIS.APP.MY', '나의 분석 앱'));
		}
		if (!mainContent.my) appItem.find('.badge-my').remove();
		appItem.find('.txt-category').text(mainContent.categoryString);
		appItem.find('.txt-title').text(mainContent.title);
		appItem.find('.txt-desc').text(mainContent.description);

		let li = document.createElement('li');
		this.jQuery(li).append(appItem);

		return li;
	}

	/**
	 * 커뮤니케이션 아이템 생성
	 *
	 * @param mainContent
	 * @param index
	 * @returns {any}
	 */
	private createCommItem(mainContent: MainContent, index: number) {
		let commItem = this.commItem.clone();

		const self = this;
		commItem.find('.link-box').click(function () {
			self.commContentClick(mainContent);
		});
		if (index != 0 && index != 3) {
			commItem.removeClass('type-thumb');
			commItem.find('.bg-img').remove();
		} else {
			commItem.find('.bg-img').css('background-image', `url( ${mainContent.media} )`);
		}
		let category = commItem.find('.category');
		let badgeClone = category.find('.badge-comm').clone();
		category.empty();
		Array.from(mainContent.categories).forEach(value => {
			let badge = badgeClone.clone();
			badge.text(value.split('#')[ 0 ]);
			category.append(badge);
		});

		commItem.find('.txt-title').text(mainContent.title);
		commItem.find('.txt-desc').text(mainContent.description);

		if (!mainContent.acceptable) {
			commItem.find('.txt-title').addClass('type-lock');
		}

		return commItem;
	}

	/**
	 * 리포트/분석 앱 클릭
	 *
	 * @param isReportItem
	 * @param mainContent
	 */
	private appContentClick(isReportItem: boolean, mainContent: MainContent) {
		let returnUrl = '';

		if (mainContent.my) {
			if (isReportItem) {
				returnUrl = `view/report-app/my-app/${mainContent.id}`;
			} else {
				returnUrl = `view/analysis-app/my-app/${mainContent.id}`;
			}
		} else {
			if (isReportItem) {
				returnUrl = `view/report-app/${mainContent.id}`;
			} else {
				returnUrl = `view/analysis-app/${mainContent.id}`;
			}
		}

		if (mainContent.externalUrl) {
			window.open(mainContent.externalUrl, mainContent.id);
		} else {
			this.router.navigate([ returnUrl ]);
		}

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.ITEM, mainContent.title);
	}

	/**
	 * 커뮤니케이션 클릭
	 *
	 * @param mainContent
	 */
	private commContentClick(mainContent: MainContent) {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ `view${mainContent.extra}` ]);

		// 태깅
		this.tagging(this.TaggingType.LIST, this.TaggingAction.ITEM, mainContent.title);
	}

	/**
	 * create tab child
	 * @param cnt
	 * @returns {Array}
	 */
	private createTabChildrenWithPageCnt(cnt: number, isFirst: boolean = false) {
		let child = [];
		for(let i = 0; i < cnt; i++) {
			child.push({selected : isFirst && i == 0});
		}
		return child;
	}
	private createTabChildren(totalCnt: number, pageSize: number) {
		let cnt = Math.ceil(totalCnt / pageSize);

		return this.createTabChildrenWithPageCnt(cnt);
	}

}
