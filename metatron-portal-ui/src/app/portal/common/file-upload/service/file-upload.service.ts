import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '../../service/abstract.service';
import {CommonResult} from '../../value/result-value';
import {ContentType} from '../../value/content-type';
import {FileLikeObject} from 'ng2-file-upload';
import {File} from '../value/file';

@Injectable()
export class FileUploadService extends AbstractService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected injector: Injector) {
		super(injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public upload(url: string, formData: FormData): Promise<any> {
		// return this.multiPart(url, formData);
		return null;
	}

	/**
	 * 파일 업로드
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public uploadFile(module: string, file, fileGroupId: string = null): Promise<File.Result.FileUpload> {
		const formData = new FormData();
		formData.append('file', file instanceof FileLikeObject ? file.rawFile : file, file.name);
		return this.post(`${this.environment.apiUrl}/file/upload?module=${module}` + (fileGroupId ? `&groupId=${fileGroupId}` : ''), formData, ContentType.FORM_DATA);
	}

	/**
	 * 파일 삭제
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public deleteFile(fileIds: string[], fileGroupId: string): Promise<CommonResult> {
		let params = {
			delFileIds: fileIds
		};

		return this.delete(`${this.environment.apiUrl}/file/${fileGroupId}`, params);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
