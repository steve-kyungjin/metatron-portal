import {Injectable, Injector} from '@angular/core';
import {AbstractService} from './abstract.service';
import {CommonResult, Page} from '../value/result-value';
import {User} from '../value/user';
import {FileItem} from 'ng2-file-upload';
import {ContentType} from '../value/content-type';
import * as _ from 'lodash';

@Injectable()
export class UserService extends AbstractService {

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

	/**
	 * 내정보 조회
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public getMyInfo(): Promise<User.Result.Detail> {
		return this.get(`${this.environment.apiUrl}/users/me`);
	}

	/**
	 * 프로필 이미지 업로드
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public uploadProfileImage(file: FileItem): Promise<CommonResult> {
		const formData = new FormData();
		formData.append('file', file.file.rawFile, file.file.name);
		return this.post(`${this.environment.apiUrl}/users/profile`, formData, ContentType.FORM_DATA);
	}

	/**
	 * 프로필 이미지 삭제
	 *
	 * @returns {Promise<CommonResult>}
	 */
	public deleteProfileImage(): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/users/profile`);
	}

	/**
	 * 프로필 이미지
	 */
	public getProfileImage(user: User.Entity): string {

		let userProfileImageUrl: string = '';

		// 사용자 기본 프로필 이미지 보여주기
		const showUserDefaultProfileImage: () => void = () => {
			if (this.environment.isLocalMode) {
				userProfileImageUrl = `/assets/images/default_profile.png`;
			} else {
				userProfileImageUrl = `${this.environment.contextPath}/assets/images/default_profile.png`;
			}
		};

		if (user && user.mediaGroup && user.mediaGroup.medias) {
			userProfileImageUrl = `${this.environment.apiUrl}/media/${user.mediaGroup.medias[ 0 ].id}`;
		} else {
			if (user !== null && _.isUndefined(user.picUrl) === false && _.isEmpty(user.picUrl) === false && user.picUrl !== null) {

				if (user.picUrl.startsWith('http', 0)) {
					userProfileImageUrl = user.picUrl;
				} else {
					showUserDefaultProfileImage.call(this);
				}
			} else {
				showUserDefaultProfileImage.call(this);
			}
		}

		return userProfileImageUrl;
	}

	/**
	 * 목록 조회
	 *
	 * @param {string} keyWord
	 * @param {Page} page
	 * @returns {Promise<User.Result.List>}
	 */
	public getList(keyWord: string, page: Page): Promise<User.Result.List> {

		let url = `${this.environment.apiUrl}/users?size=${page.size}&page=${page.number}`;

		if (_.isUndefined(keyWord) === false && _.isEmpty(keyWord) === false) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 상세 조회
	 *
	 * @param {string} userId
	 * @returns {Promise<User.Result.Detail>}
	 */
	public getDetail(userId: string): Promise<User.Result.Detail> {
		return this.get(`${this.environment.apiUrl}/users/${userId}`);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Protected Method
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
