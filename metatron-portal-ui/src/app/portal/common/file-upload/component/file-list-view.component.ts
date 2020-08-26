import {
	Component, ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges,
	Output, EventEmitter
} from '@angular/core';
import {File} from '../value/file';
import {FileUploadService} from '../service/file-upload.service';
import {AbstractComponent} from '../../component/abstract.component';
import {environment} from '../../../../../environments/environment';

@Component({
	selector: 'file-list-view',
	templateUrl: './file-list-view.component.html'
})
export class FileListViewComponent extends AbstractComponent implements OnInit, OnDestroy, OnChanges {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Input()
	public fileGroup: File.Group;

	@Output()
	public fileDownload: EventEmitter<File.Entity> = new EventEmitter();

	public fileList: File.Entity[] = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private fileUploadService: FileUploadService) {

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

	public ngOnChanges(changes: SimpleChanges): void {
		for (let propName in changes) {
			if (propName === 'fileGroup') {
				this.changeFileGroup();
			}
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public fileClick(file: File.Entity) {
		this.fileUploadService.fileDownload(`${environment.apiUrl}/file/download/${file.id}`, file.originalNm);
		this.fileDownload.emit(file);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private changeFileGroup() {
		if (this.fileGroup && this.fileGroup.files) {
			this.fileList = this.fileGroup.files;
		} else {
			this.fileList = [];
		}
	}

}
