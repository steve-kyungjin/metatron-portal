import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '../../common/service/abstract.service';
import {Project} from '../value/project';
import {CommonResult, Page} from '../../common/value/result-value';
import * as _ from 'lodash';

@Injectable()
export class ProjectService extends AbstractService {

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
		super(injector)
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 목록 조회
	 *
	 * @param {number} year
	 * @param {Page} page
	 * @returns {Promise<Project.Result.List>}
	 */
	public getList(year: number, page: Page): Promise<Project.Result.List> {

		let url = `${this.environment.apiUrl}/projects?size=${page.size}&page=${page.number}`;

		if (year > -1) {
			url += `&year=${year}`;
		}

		if (page.sort.property) {
			url += `&sort=${page.sort.property}`;
		}

		return this.get(url);
	}

	/**
	 * 상세 조회
	 *
	 * @param {string} id
	 * @returns {Promise<Project.Result.Detail>}
	 */
	public getDetail(id: string): Promise<Project.Result.Detail> {
		return this.get(`${this.environment.apiUrl}/projects/${id}`);
	}

	/**
	 * 생성
	 *
	 * @param {Project.Entity} project
	 * @returns {Promise<CommonResult>}
	 */
	public create(project: Project.Entity): Promise<CommonResult> {

		if (project.type && _.isEmpty(project.type.id) === false) {
			project.typeId = project.type.id;
		}

		if (project.fileGroup && _.isEmpty(project.fileGroup.id) === false) {
			project.fileGroupId = project.fileGroup.id;
		}

		if (project.worker) {

			project.workerId = project.worker.userId;

			if (project.worker.org && _.isEmpty(project.worker.org.id) === false) {
				project.workOrgId = project.worker.org.id;
			} else {
				project.workOrgId = '';
			}
		}

		if (project.coworkOrg && _.isEmpty(project.coworkOrg.id) === false) {
			project.coworkOrgId = project.coworkOrg.id;
		}

		return this.post(`${this.environment.apiUrl}/projects`, project);
	}

	/**
	 * 수정
	 *
	 * @param {Project.Entity} project
	 * @returns {Promise<CommonResult>}
	 */
	public update(project: Project.Entity): Promise<CommonResult> {

		if (project.type && _.isEmpty(project.type.id) === false) {
			project.typeId = project.type.id;
		}

		if (project.fileGroup && _.isEmpty(project.fileGroup.id) === false) {
			project.fileGroupId = project.fileGroup.id;
		}

		if (project.worker) {

			project.workerId = project.worker.userId;

			if (project.worker.org && _.isEmpty(project.worker.org.id) === false) {
				project.workOrgId = project.worker.org.id;
			} else {
				project.workOrgId = '';
			}
		}

		if (project.coworkOrg && _.isEmpty(project.coworkOrg.id) === false) {
			project.coworkOrgId = project.coworkOrg.id;
		}

		return this.put(`${this.environment.apiUrl}/projects/${project.id}`, project);
	}

	/**
	 * 삭제
	 *
	 * @param {string} id
	 * @returns {Promise<CommonResult>}
	 */
	public deleteProjectById(id: string): Promise<CommonResult> {
		return this.delete(`${this.environment.apiUrl}/projects/${id}`);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
