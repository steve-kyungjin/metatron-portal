import {Component, ElementRef, Injector, OnDestroy, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {AbstractComponent} from "../../../../common/component/abstract.component";
import {TranslateService} from "ng2-translate";
import {Help} from "../../value/help";

declare const Swiper: any;

@Component({
	selector: 'help',
	templateUrl: 'help.component.html'
})
export class HelpComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private swiper: any;

	private swiperWrapper;
	private swiperItem;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 팝업 show/hide
	@Input()
	public isShow: boolean = false;

	@Output()
	public close: EventEmitter<Object> = new EventEmitter();

	// 도움말 목록
	public helpList: Help.Entity[];

	// 현재 도움말 파일 목록
	public currentFiles: string[] = ['/assets/images/help/default_help.jpg'];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService) {
		super(elementRef, injector);

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.swiperWrapper = this.jQuery('#helpSwiperWrapper');
		this.swiperItem = this.jQuery('#helpSwiperItem').clone();
		this.jQuery('#helpSwiperItem').remove();

		this.helpList = [
			new Help.Entity(this.translateService.instant('HELP.LEFT.TITLE1'), '', [
				'/assets/images/help/intro/01.jpg',
				'/assets/images/help/intro/02.jpg'
			], true),
			new Help.Entity(this.translateService.instant('HELP.LEFT.TITLE2'), '', [
				'/assets/images/help/community/01.jpg'
			]),
			new Help.Entity(this.translateService.instant('HELP.LEFT.TITLE3'), '', [
				'/assets/images/help/my-app/01.jpg',
				'/assets/images/help/my-app/02.jpg',
				'/assets/images/help/my-app/03.jpg',
				'/assets/images/help/my-app/04.jpg',
				'/assets/images/help/my-app/05.jpg',
				'/assets/images/help/my-app/06.jpg',
				'/assets/images/help/my-app/07.jpg'
			]),
			new Help.Entity(this.translateService.instant('HELP.LEFT.TITLE4'), '', [
				'/assets/images/help/app-place/01.jpg',
				'/assets/images/help/app-place/02.jpg'
			]),
			new Help.Entity(this.translateService.instant('HELP.LEFT.TITLE5'), '', [
				'/assets/images/help/meta/01.jpg',
				'/assets/images/help/meta/02.jpg'
			])
		];

		this.swiper = new Swiper('.type-help .swiper-container', {
			slidesPerView: 1,
			spaceBetween: 0,
			slidesPerGroup: 1,
			pagination: {
				el: '.type-help .swiper-pagination',
				clickable: true
			},
			navigation: {
				nextEl: '.type-help .swiper-button-next',
				prevEl: '.type-help .swiper-button-prev',
			}
		});

		// 첫번째 도움말 선택
		this.currentFiles = this.helpList[0].files;
		this.updateSwiper();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 도움말 선택
	 * @param help
	 */
	public helpClick(help: Help.Entity) {
		Array.from(this.helpList).forEach(value => {
			if (help == value) {
				value.selected = true;
			} else {
				value.selected = false;
			}
		});
		help.selected = true;
		this.currentFiles = help.files;
		this.updateSwiper();
	}

	/**
	 * 이미지 로드 핸들러
	 * @param obj
	 */
	public imageLoad(obj) {
		const w = obj.naturalWidth;
		const h = obj.naturalHeight;
		const maxW = 960;
		const maxH = 475;
		if (w - maxW > h - maxH) {
			if (w > maxW) {
				// maxW 보다 클 경우 사이즈 고정
				this.jQuery(obj).css('width', maxW);
			}
		} else {
			if (h > maxH) {
				// maxH 보다 클 경우 사이즈 고정
				this.jQuery(obj).css('height', maxH);
			}
		}
		this.jQuery(obj).show();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Swiper update
	 */
	private updateSwiper() {
		this.swiperWrapper.empty();

		const self = this;
		Array.from(this.currentFiles).forEach(value => {
			let item = this.swiperItem.clone();
			let img = item.find('img')[0];
			img.onload = function() {
				self.imageLoad(this);
			};
			img.src = value;
			img.style.display = 'none';
			this.swiperWrapper.append(item);
		});
		this.swiper.update();
		this.swiper.slideTo(0, 0);
	}
}
