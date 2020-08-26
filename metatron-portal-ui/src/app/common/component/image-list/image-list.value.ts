/**
 * Image list
 */
export class ImageList {
	constructor(
		private _image: string,
		private _thumb: string,
		private _title: string,
		private _desc: string
	) {
		this.image = _image;
		this.thumb = _thumb;
		this.title = _title;
		this.desc = _desc;
	}

	public image: string;
	public thumb: string;
	public title: string;
	public desc: string;
}
