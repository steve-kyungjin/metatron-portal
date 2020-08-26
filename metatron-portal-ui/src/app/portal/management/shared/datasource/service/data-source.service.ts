import {Injectable, Injector} from '@angular/core';
import {DataSource} from '../value/data-source';
import {AbstractService} from '../../../../common/service/abstract.service';
import {CommonResult} from '../../../../common/value/result-value';

@Injectable()
export class DataSourceService extends AbstractService {

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
	 * 추출 앱 데이터소스 목록 조회
	 *
	 * @returns {Promise<DataSource.ResultDataSource>}
	 */
	public getDataSourceList(): Promise<DataSource.ResultDataSource> {
		return this.get(`${this.environment.apiUrl}/datasource`);
	}

	/**
	 * 추출 앱 데이터소스 삭제
	 *
	 * @param {string} dataSourceId
	 * @returns {Promise<CommonResult>}
	 */
	public deleteDataSourceByDataSourceId(dataSourceId: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/datasource/${dataSourceId}`);
	}

	/**
	 * 추출 앱 데이터 소스 생성
	 *
	 * @param {DataSource.Entity} dataSourceEntity
	 * @returns {Promise<CommonResult>}
	 */
	public createDataSource(dataSourceEntity: DataSource.Entity): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/datasource`, dataSourceEntity);
	}

	/**
	 * 추출 앱 데이터 소스 커넥션 테스트
	 *  - 데이터 소스 저장전
	 *
	 * @param {DataSource.Entity} dataSourceEntity
	 * @returns {Promise<CommonResult>}
	 */
	public testDataSourceConnection(dataSourceEntity: DataSource.Entity): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/datasource/connection/test`, dataSourceEntity);
	}

	/**
	 * 데이터 소스가 있는지 데이터 소스 아이디로 검사
	 *
	 * @param {string} dataSourceEntityId
	 * @returns {Promise<CommonResult>}
	 */
	public dataSourceValidByDataSourceId(dataSourceEntityId: string): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/datasource/${dataSourceEntityId}/valid`);
	}

	/**
	 * 조회 쿼리 실행
	 *
	 * @param {} executeSelectQueryParameter
	 * @returns {Promise<CommonResult>}
	 */
	public executeSelectQuery(executeSelectQueryParameter: DataSource.ExecuteSelectQueryParameter): Promise<DataSource.ResultQuery> {
		return this.post(`${this.environment.apiUrl}/datasource/${executeSelectQueryParameter.dataSourceId}/select?max=${executeSelectQueryParameter.max}`, { 'sql': executeSelectQueryParameter.sql });
	}

	/**
	 * 엑셀 다운로드
	 *
	 * @param executeSelectQueryParameter
	 * @param appName
	 */
	public excelExport(executeSelectQueryParameter: DataSource.ExecuteSelectQueryParameter, appName: string) {
		// noinspection JSIgnoredPromiseFromCall
		this.excelFileDownLoad(`${this.environment.apiUrl}/datasource/${executeSelectQueryParameter.dataSourceId}/select/export?max=1000000&appNm=${appName}`, `${appName}`, { 'sql': executeSelectQueryParameter.sql });
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
