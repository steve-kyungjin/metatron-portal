import {
	Component,
	ElementRef,
	EventEmitter,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges
} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {AbstractComponent} from "../../../portal/common/component/abstract.component";
import {SwiperSlide} from "./swiper-slide.value";

declare const Swiper: any;

@Component({
	selector: 'swiper-slide',
	templateUrl: './swiper-slide.component.html'
})
export class SwiperSlideComponent extends AbstractComponent implements OnInit, OnDestroy, OnChanges {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
   	| Private Variables
   	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private swiper;
	private item;
	private wrapper;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 이미지 목록
	@Input()
	public slideList: Array<SwiperSlide>;

	// 이미지 클릭 시 event emit
	@Output()
	public itemClick: EventEmitter<SwiperSlide> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService
	) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		super.ngOnInit();

		this.wrapper = this.jQuery('#swiperWrapper');
		this.item = this.jQuery('#swiperItem').clone();
		this.jQuery('#swiperItem').remove();

		// 초기화
		this.swiper = new Swiper(`.type-app .swiper-container`, {
			slidesPerView: 3,
			spaceBetween: 8,
			slidesPerGroup: 1,
			loop: false,
			loopFillGroupWithBlank: true,
			pagination: {
				el: '',
				clickable: false
			},
			navigation: {
				nextEl: '.type-app .swiper-button-next',
				prevEl: '.type-app .swiper-button-prev'
			}
		});

		this.updateSwiper();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		for (let propName in changes) {
			if (propName === 'slideList') {
				// 생성 시점 문제로 jquery 로 element 생성

				if (this.slideList && this.wrapper) {
					this.updateSwiper();
				}
			}
		}

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 이미지 클릭
	 */
	public imageClick(index: number) {
		const item = this.slideList[ index ];
		this.itemClick.emit(item);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 목록 다시 그리기
	 */
	private updateSwiper() {
		this.wrapper.empty();
		let self = this;
		for (let i = 0; i < this.slideList.length; i++) {
			let item = this.item.clone();
			item.attr('onclick', 'imageClick(' + i + ')');
			item.find('.img-swipe').css('background-image', 'url(' + this.slideList[ i ].image + ')');
			item.find('.txt-title').text(this.slideList[ i ].title);
			item.find('.txt-desc').text(this.slideList[ i ].desc);
			item.on('click', function () {
				self.imageClick(i);
			});
			this.wrapper.append(item);
		}

		this.swiper.update();
	}
}
