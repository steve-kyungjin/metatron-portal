import {Injectable, Injector} from '@angular/core';
import {ZipcodeListResult} from '../value/zipcode.value';
import {AbstractService} from '../../../portal/common/service/abstract.service';
import {ApproachAnalysis} from '../value/approach-analysis.value';
import * as moment from 'moment';

@Injectable()
export class ApproachAnalysisService extends AbstractService {

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
	 * 시도 조회
	 */
	public getSido(): Promise<ZipcodeListResult> {
		return this.get(`${this.environment.apiUrl}/zipcodes/sido`);
	}

	/**
	 * 시군구 조회
	 */
	public getSigungu(sidoNm: string): Promise<ZipcodeListResult> {
		return this.get(`${this.environment.apiUrl}/zipcodes/sido/${sidoNm}/sigungu`);
	}

	/**
	 * 읍면동 조회
	 */
	public getDong(sidoNm: string, sigungu: string): Promise<ZipcodeListResult> {
		sigungu = sigungu == '' ? null : sigungu;
		return this.get(`${this.environment.apiUrl}/zipcodes/sido/${sidoNm}/sigungu/${sigungu}/dong`);
	}

	/**
	 * 우편번호 조회
	 */
	public getZipcode(sido: string[], sigungu: string[], dong: string[]): Promise<ZipcodeListResult> {
		Array.from(dong).forEach((value) => {
			if (value == 'ALL') {
				dong = [];
				return;
			}
		});

		const params = {
			sido: sido,
			sigungu: sigungu,
			dong: dong
		};

		return this.post(`${this.environment.apiUrl}/zipcodes`, params);
	}

	/**
	 * 우편번호 기반 침투율 조회
	 * @param sido
	 * @param sigungu
	 * @param dong
	 * @param zipcode
	 * @returns {Promise<any>}
	 */
	public getApproach(sido: string[], sigungu: string[], dong: string[], zipcode: string[], startDate: Date, endDate: Date): Promise<ApproachAnalysis.ListResult> {
		const params = this.getApproachParams(sido, sigungu, dong, zipcode, startDate, endDate);

		return this.post(`${this.environment.apiUrl}/custom/approach/zipcodes`, params);
	}

	/**
	 * 지도 데이터 조회
	 * @param sido
	 * @param sigungu
	 * @param dong
	 * @param zipcode
	 * @param sort
	 * @returns {Promise<any>}
	 */
	public getWkt(sido: string[], sigungu: string[], dong: string[], zipcode: string[]): Promise<ZipcodeListResult> {
		const params = {
			sido: sido,
			sigungu: sigungu,
			dong: dong,
			zipcode: zipcode
		};

		return this.post(`${this.environment.apiUrl}/zipcodes/wkt`, params);
	}

	/**
	 * 건물 목록 조회
	 * @param zipcode
	 * @returns {Promise<any>}
	 */
	public getBuildingList(sido: string[], sigungu: string[], dong: string[], zipcode: string[], startDate: Date, endDate: Date): Promise<ApproachAnalysis.BuildingListResult> {
		const params = this.getApproachParams(sido, sigungu, dong, zipcode, startDate, endDate);

		return this.post(`${this.environment.apiUrl}/custom/approach/zipcodes/buildings`, params);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * create params
	 * @param sido
	 * @param sigungu
	 * @param dong
	 * @param zipcode
	 * @param sort
	 * @returns {any}
	 */
	private getApproachParams(sido: string[], sigungu: string[], dong: string[], zipcode: string[], startDate: Date = null, endDate: Date = null) {

		if (sido && sido.length) {
			Array.from(sido).forEach((value) => {
				if (value == 'ALL') {
					sido = [];
					return;
				}
			});
		} else {
			sido = [];
		}

		if (sigungu && sigungu.length) {
			Array.from(sigungu).forEach((value) => {
				if (value == 'ALL') {
					sigungu = [];
					return;
				}
			});
		} else {
			sigungu = [];
		}

		if (dong && dong.length) {
			Array.from(dong).forEach((value) => {
				if (value == 'ALL') {
					dong = [];
					return;
				}
			});
		} else {
			dong = [];
		}

		if (zipcode && zipcode.length) {
			Array.from(zipcode).forEach((value) => {
				if (value == 'ALL') {
					zipcode = [];
					return;
				}
			});
		} else {
			zipcode = [];
		}

		let params = {
			sido: sido,
			sigungu: sigungu,
			dong: dong,
			zipcode: zipcode,
			startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : '',
			endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : ''
		};

		return params;
	}

}

