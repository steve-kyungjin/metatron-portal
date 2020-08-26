/**
 * Swiper slide
 */
export class SwiperSlide {
	constructor(
		private _image: string,
		private _title: string,
		private _desc: string
	) {
		this.image = _image;
		this.title = _title;
		this.desc = _desc;
	}

	public image: string;
	public title: string;
	public desc: string;
}
