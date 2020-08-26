import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FileItem, FileLikeObject, FileUploader} from 'ng2-file-upload';
import * as _ from 'lodash';
import {FileUploadComponent} from './file-upload.component';
import {File} from '../value/file';
import {AbstractComponent} from '../../component/abstract.component';
import {Media} from '../../value/media';

@Component({
	selector: 'file-field',
	templateUrl: './file-field.component.html'
})
export class FileFieldComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Output('originRemove')
	private originRemoveEvent: EventEmitter<FileItem> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Input()
	public description: string = '';

	@Input()
	public fileMaxSize: number = -1;

	@Input()
	public fileMaxLength: number = 5;

	@Input('accept')
	public acceptFileExt: string[] = [ '.jpg', '.jpeg', '.png', '.bmp' ];

	@Output('change')
	public changeEvent: EventEmitter<FileItem[]> = new EventEmitter();

	@Output('find')
	public findEvent: EventEmitter<any> = new EventEmitter();

	@ViewChild(FileUploadComponent)
	public fileUploadComponent: FileUploadComponent;

	/**
	 * 화면에 표시할 파일 목록
	 *
	 * @type {any[]}
	 */
	public files: FileItem[] = [];

	/**
	 * 서버에서 가져온 파일 목록
	 *    - 저장된 파일 목록을 파일 인풋에 넣을 경우 사용
	 *
	 * @type {any[]}
	 * @private
	 */
	public _originFiles: FileItem[] = [];

	/**
	 * 삭제할 파일 목록
	 *    - 서버에 저장되었던 파일을 삭제하는 경우 아이디 목록 전달을 위해서 사용
	 *
	 * @type {any[]}
	 */
	public deleteFileList: string[] = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Getter & Setter
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	set originFiles(value: FileItem[]) {
		this._originFiles = value;
		this.fileUploadComponent.setFiles(this._originFiles);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public changeFile(files: FileItem[]): void {
		this.files = _.cloneDeep(files);
		this.changeEvent.emit(_.cloneDeep(this.files));
	}

	public removeFile(files: FileItem[]): void {
		this.files = _.cloneDeep(files);
	}

	public originRemoveFile(file: FileItem): void {
		this.deleteFileList.push(file.file.lastModifiedDate);
		this.originRemoveEvent.emit(file)
	}

	public remove(index): void {
		this.fileUploadComponent.remove(index);
	}

	public setUploadedFileList(fileGroup: File.Group) {
		if (fileGroup && fileGroup.files) {
			const fileItems: FileItem[] = [];
			fileGroup.files.forEach(value => {
				const file: any = { 'path': [ '' ], 'name': value.originalNm };
				const fileLikeObject: FileLikeObject = new FileLikeObject(file);
				fileLikeObject.type = 'O';
				fileLikeObject.lastModifiedDate = value.id;
				const uploader: FileUploader = new FileUploader({});
				const fileItem: FileItem = new FileItem(uploader, file, {});
				fileItem.file = fileLikeObject;
				fileItems.push(fileItem);
			});

			this.originFiles = fileItems;
		}
	}

	public setUploadedMediaList(mediaGroup: Media.Group) {
		if (mediaGroup && mediaGroup.medias) {
			const fileItems: FileItem[] = [];
			mediaGroup.medias.forEach(value => {
				const file: any = { 'path': [ '' ], 'name': value.name };
				const fileLikeObject: FileLikeObject = new FileLikeObject(file);
				fileLikeObject.type = 'O';
				fileLikeObject.lastModifiedDate = value.id;
				const uploader: FileUploader = new FileUploader({});
				const fileItem: FileItem = new FileItem(uploader, file, {});
				fileItem.file = fileLikeObject;
				fileItems.push(fileItem);
			});

			this.originFiles = fileItems;
		}
	}

	public removeAll() {
		this.fileUploadComponent.removeAll();
		this.files = [];
	}

	/**
	 * 파일 찾기 클릭
	 */
	public findClick() {
		this.findEvent.emit();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
