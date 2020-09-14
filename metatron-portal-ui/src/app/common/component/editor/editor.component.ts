import {
	AfterViewInit,
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
} from '@angular/core';
import {AbstractComponent} from '../../../portal/common/component/abstract.component';
import {CommonConstant} from '../../../portal/common/constant/common-constant';
import {Alert} from '../../util/alert-util';
import {TranslateService} from 'ng2-translate';
import {EditorService} from './editor.service';
import {Utils} from '../../util/utils';
import {environment} from '../../../../environments/environment';
import {FileUploadService} from '../../../portal/common/file-upload/service/file-upload.service';

@Component({
	selector: '[common-editor]',
	templateUrl: './editor.component.html'
})
export class EditorComponent extends AbstractComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private $editor: any;

	private files: Array<Object>;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Input()
	public text: string;

	@Input()
	public fileGroupId: string;

	@Input()
	public isViewMode: boolean = false;

	@Input()
	public placeholder: string = '';

	@Output()
	public textChange: EventEmitter<Object> = new EventEmitter();

	@Output()
	public imageClick: EventEmitter<Object> = new EventEmitter();

	/**
	 * UUID
	 *
	 * @type {string}
	 */
	public uuid: string = Utils.Generate.UUID();

	public editorId: string;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private translateService: TranslateService,
				private editorService: EditorService,
				private fileUploadService: FileUploadService) {
		super(elementRef, injector);

		this.editorId = `${this.uuid}_summernote`;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		super.ngOnInit();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();

		this.jQuery('.note-popover').remove();
	}

	public ngAfterViewInit(): void {
		this.createEditor();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		for (let propName in changes) {
			if (propName === 'text') {
				this.setText(this.text);
			} else if (propName === 'placeholder') {
				this.setPlaceholder(this.placeholder);
			}
		}

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public getText() {
		return this.$editor ? this.$editor.summernote('code') : '';
	}

	public setText(text: string) {
		if (this.$editor) {
			this.$editor.summernote('code', text);
			const self = this;
			this.jQuery('.note-editable').find('img').attr('onclick', '').click(function(e) {
				self.imageClick.emit(e.target);
			});
		}
	}

	public isEmpty() {
		if (this.$editor) {
			return this.$editor.summernote('isEmpty');
		}

		return true;
	}

	public focus() {
		if (this.$editor) {
			return this.$editor.summernote('focus');
		}
	}

	public getFileGroupId() {
		return this.fileGroupId;
	}

	public setPlaceholder(placeholder: string) {
		if (this.$editor) {
			this.$editor.summernote('placeholder', placeholder);
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 이미지 업로드
	 */
	private uploadImage() {
		if (!this.files || !this.files.length) {
			return;
		}

		let file = this.files[ 0 ];
		this.fileUploadService.uploadFile('communication', file, this.fileGroupId).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				// Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
				let fileGroup = result.data.fileGroup;
				let files = fileGroup.files;
				let file = files[ files.length - 1 ];
				this.fileGroupId = fileGroup.id;
				this.$editor.summernote('insertImage', `${environment.apiUrl}/file/download/${file.id}`);
			} else {
				Alert.error(this.translateService.instant('COMMON.MESSAGE.ERROR', '에러'));
			}
			this.files.splice(0, 1);
			this.uploadImage();
		});

	}

	/**
	 * 에디터 생성
	 */
	private createEditor() {
		const self = this;
		this.fileGroupId = null;
		const defaultFontSize = 14;

		if (!this.$editor) {
			this.$editor = this.jQuery(`#${this.editorId}`);

			let config = {
				toolbar: [
					[ 'style', [ 'bold', 'italic', 'underline', 'clear' ] ],
					[ 'fontname', [ 'fontname' ] ],
					[ 'fontsize', [ 'fontsize' ] ],
					[ 'color', [ 'color' ] ],
					[ 'para', [ 'ul', 'ol', 'paragraph' ] ],
					[ 'height', [ 'height' ] ],
					[ 'insert', [ 'picture', 'link', 'table', 'hr' ] ]
				],
				fontNames: [ 'NanumBarunGothic' ],
				fontNamesIgnoreCheck: [ 'NanumBarunGothic' ],
				lang: 'ko-KR',
				airMode: this.isViewMode,
				placeholder: this.placeholder,
				// tooltip: false,
				callbacks: {
					// 이미지를 업로드할 경우 이벤트를 발생
					onImageUpload: function (files) {
						if (!self.files) {
							self.files = [];
						}
						Array.from(files).forEach(value => {
							let fileType = value[ 'type' ];
							// 이미지만 허용
							if (fileType.includes('image')) {
								self.files.push(value);
							}
						});
						self.uploadImage();
					},
					// 텍스트 변경 이벤트
					onChange: function (contents, $editable) {
						self.text = contents;
						self.textChange.emit(contents);
					}
				}
			}

			if (this.isViewMode) {
				config[ 'popover' ] = {
					image: [],
					link: [],
					air: []
				}
				config[ 'disableDragAndDrop' ] = true;
				this.$editor.summernote(config);
				this.$editor.summernote('disable');
			} else {
				this.$editor.summernote(config);
				this.$editor.summernote('enable');
				this.jQuery('.note-editable').height(336);
				this.jQuery('.note-editable').css('font-size', defaultFontSize + 'px');
				this.$editor.summernote('fontSize', defaultFontSize);
				// this.$editor.summernote('reset');
			}
		}

		this.setText(this.text);
	}
}
