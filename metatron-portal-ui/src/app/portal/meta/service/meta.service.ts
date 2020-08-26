import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '../../common/service/abstract.service';
import {CommonResult, Page} from '../../common/value/result-value';
import {Meta} from '../value/meta';
import {CookieConstant} from '../../common/constant/cookie-constant';
import * as _ from 'lodash';
import {SelectValue} from '../../../common/component/select/select.value';
import {ExtractSql} from '../../management/shared/extract/value/extract-app-process';

@Injectable()
export class MetaService extends AbstractService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * DW 페이지 사이즈 기본 값
	 */
	private defaultDwPageSize: string = '10';

	/**
	 * 사용할 수 있는 DW 페이지 사이즈 목록
	 */
	private dwPageSizeAllowList: string[] = [ '5', '10', '15', '20' ];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {Injector} injector
	 */
	constructor(protected injector: Injector) {
		super(injector)
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 최상위 주제영역 목록 조회
	 *
	 * @returns {Promise<Meta.Result.RootList>}
	 */
	public getRootSubjectList(criteriaId: string): Promise<Meta.Result.Subject.RootList> {
		return this.get(`${this.environment.apiUrl}/meta/subjects/root?criteriaId=${criteriaId}`);
	}

	/**
	 * 주제영역 목록 조회
	 *
	 * @param {string} id
	 * @returns {Promise<Meta.Result.List>}
	 */
	public getSubjectListById(id: string): Promise<Meta.Result.Subject.ListById> {
		return this.get(`${this.environment.apiUrl}/meta/subjects/${id}`);
	}

	/**
	 * 주제영역 목록 조회
	 */
	public getSubjectList(keyWord: string, criteriaId: string, page: Page): Promise<Meta.Result.Subject.List> {

		let url = `${this.environment.apiUrl}/meta/subjects?size=${page.size}&page=${page.number}`;

		if (criteriaId) {
			url += `&criteriaId=${criteriaId}`;
		}

		if (keyWord) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 주제영역 테이블 조회
	 *
	 * @param {string} id
	 * @param {Meta.Target} target
	 * @param layerId
	 * @param keyWord
	 * @param page
	 * @param criteriaId
	 * @returns {Promise<CommonResult>}
	 */
	public getSubjectTable(id: string, target: Meta.Target, layerId: string, keyWord: string, page: Page, criteriaId: string): Promise<Meta.Result.Subject.TableList> {

		let url = `${this.environment.apiUrl}/meta/subjects/${id}/table?target=${target}&size=${page.size}&page=${page.number}`;

		if (criteriaId) {
			url += `&criteriaId=${criteriaId}`;
		}

		if (layerId) {
			url += `&layerId=${layerId}`;
		}

		if (keyWord) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 컬럼 조회
	 *
	 * @param {string} id
	 * @param page
	 * @returns {Promise<Meta.Result.Column>}
	 */
	public getColumn(id: string, page: Page): Promise<Meta.Result.Column> {

		let url = `${this.environment.apiUrl}/meta/column/${id}?size=${page.size}&page=${page.number}`;

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 테이블 조회
	 *
	 * @param {string} id
	 * @returns {Promise<Meta.Result.Table>}
	 */
	public getTable(id: string): Promise<Meta.Result.Table> {
		return this.get(`${this.environment.apiUrl}/meta/table/${id}`);
	}

	/**
	 * 인스턴스 목록 가져오기
	 */
	public getInstanceList(): Promise<Meta.Result.InstanceList> {
		return this.get(`${this.environment.apiUrl}/meta/instance`);
	}

	/**
	 * 데이터베이스 목록 가져오기
	 *
	 * @param id
	 * @param target
	 * @param layerId
	 * @param keyWord
	 * @param page
	 */
	public getDatabaseList(id: string, target: Meta.Target, layerId: string, keyWord: string, page: Page): Promise<Meta.Result.Database.List> {

		let url = `${this.environment.apiUrl}/meta/instance/${id}/database?target=${target}&size=${page.size}&page=${page.number}`;

		if (layerId) {
			url += `&layerId=${layerId}`;
		}

		if (keyWord) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 데이터베이스 하위 테이블 목록 가져오기
	 *
	 * @param id
	 * @param target
	 * @param layerId
	 * @param keyWord
	 * @param page
	 */
	public getDatabaseTable(id: string, target: Meta.Target, layerId: string, keyWord: string, page: Page): Promise<Meta.Result.Database.TableList> {

		let url = `${this.environment.apiUrl}/meta/database/${id}/table?target=${target}&size=${page.size}&page=${page.number}`;

		if (layerId) {
			url += `&layerId=${layerId}`;
		}

		if (keyWord) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 인스턴스 하위 테이블 목록 가져오기
	 *
	 * @param id
	 * @param target
	 * @param layerId
	 * @param keyWord
	 * @param page
	 */
	public getInstanceTable(id: string, target: Meta.Target, layerId: string, keyWord: string, page: Page): Promise<Meta.Result.Database.TableList> {

		let url = `${this.environment.apiUrl}/meta/instance/${id}/table?target=${target}&size=${page.size}&page=${page.number}`;

		if (layerId) {
			url += `&layerId=${layerId}`;
		}

		if (keyWord) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * DW 연계시스템 목록 조회
	 */
	public getSystemList(keyWord: string, page: Page, operTypeId: string, directionId: string, systemTarget: Meta.SystemTarget): Promise<Meta.Result.SystemList> {

		let url = `${this.environment.apiUrl}/meta/system?size=${page.size}&page=${page.number}`;

		if (systemTarget) {
			url += `&target=${systemTarget}`;
		}

		if (operTypeId) {
			url += `&operTypeId=${operTypeId}`;
		}

		if (directionId) {
			url += `&directionId=${directionId}`;
		}

		if (keyWord) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 시스템 조회
	 *
	 * @param {string} id
	 * @returns {Promise<Meta.Result.Table>}
	 */
	public getSystem(id: string): Promise<Meta.Result.System> {
		return this.get(`${this.environment.apiUrl}/meta/system/${id}`);
	}

	/**
	 * 연게 시스탬 생성
	 *
	 * @param system
	 */
	public createSystem(system: Meta.System): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/meta/system`, system);
	}

	/**
	 * 연계 시스템 수정
	 *
	 * @param system
	 */
	public updateSystem(system: Meta.System): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/meta/system/${system.id}`, system);
	}

	/**
	 * 데이터베이스 조회
	 *
	 * @param {string} id
	 * @returns {Promise<Meta.Result.Database>}
	 */
	public getDatabase(id: string): Promise<Meta.Result.Database.Detail> {
		return this.get(`${this.environment.apiUrl}/meta/database/${id}`);
	}

	/**
	 * 테이블 상세 팝업 - 셈플 데이터 목록 조회
	 *
	 * @param tableId
	 */
	public getTableSampleDataList(tableId: string): Promise<Meta.Result.ResultQuery> {
		return this.get(`${this.environment.apiUrl}/meta/table/${tableId}/sample-data/list`);
	}

	/**
	 * 테이블 상세 팝업 - 샘플 엑셀 다운로드
	 *
	 * @param tableId
	 * @param fileName
	 */
	public downloadTableSampleData(tableId: string, fileName: string): Promise<CommonResult> {
		return this.fileDownload(`${this.environment.apiUrl}/meta/table/${tableId}/sample-data`, `${fileName}`);
	}

	/**
	 * DW 페이지 사이즈 유효성 검증
	 */
	public checkDwPageSizeValidation(): boolean {

		const dwPageSize: string = this.getCookieDwPageSize();
		const dwPageSizeNumber: number = this.convertDwPageSizeNumber(dwPageSize);

		if (MetaService.isPageSizeTypeNumber(dwPageSizeNumber)) {
			return MetaService.isDwPageSizeNotAllowValue(dwPageSize) === false;
		}

		return false;
	}

	/**
	 * DW 페이지 사이즈 초기화
	 */
	public initializeDwPageSize() {
		this.setDwPageSize(this.defaultDwPageSize);
	}

	/**
	 * DW 페이지 사이즈 초기 값 설정
	 */
	public initializeDwPageSizeSetting(): void {
		if (MetaService.isDwPageSizeCookieValueEmpty()) {
			this.initializeDwPageSize();
		}
	}

	/**
	 * 쿠키에서 DW 페이지 사이즈 가져오기
	 */
	public getCookieDwPageSize() {
		return this.cookieService.get(CookieConstant.KEY.DW_PAGE_SIZE);
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * DW 페이지 사이즈 넘버 타입으로 변환
	 *
	 * @param dwPageSize
	 */
	public convertDwPageSizeNumber(dwPageSize: string): number {
		return Number(dwPageSize);
	}

	/**
	 * 페이지 사이즈 설정
	 *
	 * @param pageSize
	 */
	public setDwPageSize(pageSize: string) {
		this.cookieService.set(CookieConstant.KEY.DW_PAGE_SIZE, pageSize, 9999, '/');
	}

	/**
	 * DW 페이지 사이즈 셀렉트 아이템 목록 생성
	 */
	public createDwPageSizeSelectValueList() {

		// DW 페이지 사이즈
		this.initializeDwPageSizeSetting();

		// DW 페이지 사이즈 유효성 검증
		if (this.checkDwPageSizeValidation() === false) {
			this.initializeDwPageSize();
		}

		return this.dwPageSizeAllowList
			.map(pageSize => {
				return new SelectValue(`${pageSize}개씩 보기`, pageSize, this.getCookieDwPageSize() === pageSize);
			});
	}

	/**
	 * 테이블 수정
	 *
	 * @param table
	 */
	public updateTableByTableId(table: Meta.Table): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/meta/table/${table.id}`, table);
	}

	/**
	 * 컬럼 수정
	 *
	 * @param column
	 */
	public updateColumnByTableId(column: Meta.Column): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/meta/column/${column.id}`, column);
	}

	/**
	 * 주제영역 단 건 조회
	 *
	 * @param id
	 */
	public getSubject(id: string): Promise<Meta.Result.Subject.entity> {
		return this.get(`${this.environment.apiUrl}/meta/subjects/${id}`);
	}

	/**
	 * 데이터 표준 단어 사전 목록 조회
	 *
	 * @param keyWord
	 * @param page
	 */
	public getDictionarys(keyWord: string, page: Page): Promise<Meta.Result.Dictionary.List> {

		let url = `${this.environment.apiUrl}/meta/dic?size=${page.size}&page=${page.number}`;

		if (keyWord) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 데이터 표준 단어 사전 조회
	 *
	 * @param id
	 */
	public getDictionary(id: string): Promise<Meta.Result.Dictionary.Entity> {
		return this.get(`${this.environment.apiUrl}/meta/dic/${id}`);
	}

	/**
	 * 주제영역 생성
	 *
	 * @param subject
	 */
	public createSubject(subject: Meta.Subject): Promise<CommonResult> {
		return this.post(`${this.environment.apiUrl}/meta/subjects`, subject);
	}

	/**
	 * 주제영역 수정
	 *
	 * @param subject
	 */
	public updateSubject(subject: Meta.Subject): Promise<CommonResult> {
		return this.put(`${this.environment.apiUrl}/meta/subjects/${subject.id}`, subject);
	}

	/**
	 * 주제영역 삭제
	 *
	 * @param id
	 */
	public deleteSubjectById(id: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/meta/subjects/${id}`);
	}

	/**
	 * 연계 시스템 삭제
	 *
	 * @param id
	 */
	public deleteSystemById(id: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/meta/system/${id}`);
	}

	/**
	 * 시스템 최상위 목록 조회
	 */
	public getRootSystemList(): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/meta/system/root`);
	}

	/**
	 * 시스템 하위 목록 조회
	 *
	 * @param id
	 */
	public getSystemChildren(id: string): Promise<CommonResult> {
		return this.get(`${this.environment.apiUrl}/meta/system/${id}/children`);
	}

	public getVars(page: Page, keyWord: string = undefined): Promise<ExtractSql.Vars> {

		let url = `${this.environment.apiUrl}/extract/vars?size=${page.size}&page=${page.number}`;

		if (keyWord) {
			url += `&keyword=${encodeURIComponent(keyWord)}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * DW 페이지 사이즈 쿠키 값이 없는 경우
	 */
	private static isDwPageSizeCookieValueEmpty(): boolean {
		return document.cookie.indexOf(CookieConstant.KEY.DW_PAGE_SIZE) === -1;
	}

	/**
	 * DW 페이지 사이즈가 허용하지 않는 값인 경우
	 *
	 * @param dwPageSize
	 */
	private static isDwPageSizeNotAllowValue(dwPageSize: string): boolean {
		return !(dwPageSize === '5' || dwPageSize === '10' || dwPageSize === '15' || dwPageSize === '20');
	}

	/**
	 * 페이지 사이즈 타입인 넘버인 경우
	 *
	 * @param dwPageSizeNumber
	 */
	private static isPageSizeTypeNumber(dwPageSizeNumber: number): boolean {
		return _.isNumber(dwPageSizeNumber);
	}

}
