import {Code} from '../../common/value/code';
import {CommonResult} from '../../common/value/result-value';
import {User} from '../../common/value/user';
import {File} from '../../common/file-upload/value/file';
import {Abstract} from '../../common/value/abstract';
import {Organization} from '../../common/value/organization';

export namespace Project {

	export function getProgressLabel(progress: Project.Progress): string {
		switch (progress) {
			case Project.Progress.PLANNING: {
				return String(Project.ProgressLabel.PLANNING);
			}
			case Project.Progress.DESIGN: {
				return String(Project.ProgressLabel.DESIGN);
			}
			case Project.Progress.DEVELOP: {
				return String(Project.ProgressLabel.DEVELOP);
			}
			case Project.Progress.TEST: {
				return String(Project.ProgressLabel.TEST);
			}
			case Project.Progress.PRODUCT: {
				return String(Project.ProgressLabel.PRODUCT);
			}
			default: {
				return ' ';
			}
		}
	}

	export enum Progress {
		// 기획/분석
		PLANNING = <any>'PLANNING',
		// 설계
		DESIGN = <any>'DESIGN',
		// 구현
		DEVELOP = <any>'DEVELOP',
		// 테스트
		TEST = <any>'TEST',
		// 상용화
		PRODUCT = <any>'PRODUCT'
	}

	export namespace Result {

		export class List extends CommonResult {
			data: {
				projectList: ProjectList;
			}
		}

		export class Detail extends CommonResult {
			data: {
				project: Entity;
			}
		}
	}

	export class ProjectList {
		content?: (Entity)[] | null;
		totalElements: number;
		last: boolean;
		totalPages: number;
		size: number;
		number: number;
		first: boolean;
		numberOfElements: number;
	}

	export class Entity extends Abstract.Entity {
		// 아이디
		id: string;
		// 과제명
		name: string;
		// 과제개요
		summary: string;
		// 기대효과
		benefit: string;
		// 시작일
		startDate: string;
		// 종료일
		endDate: string;
		// 진행현황
		progress: Progress;
		// 구분
		type: Code.Entity;
		// 담당부서
		workOrg: Organization.Entity;
		// 담당자
		worker: User.Entity;
		// 협업조직
		coworkOrg: Organization.Entity;
		// 비고
		description: string;
		// 첨부파일
		fileGroup: File.Group;

		////////////////////////////////////////////////////////////////
		// View
		////////////////////////////////////////////////////////////////

		isTypeValidationFail: boolean;
		isNameValidationFail: boolean;
		isProgressValidationFail: boolean;
		isSummaryValidationFail: boolean;
		isStartEndDateValidationFail: boolean;

		////////////////////////////////////////////////////////////////
		// Params
		////////////////////////////////////////////////////////////////

		typeId: string;
		fileGroupId: string;
		workOrgId: string;
		workerId: string;
		coworkOrgId: string;
	}

	////////////////////////////////////////////////////////////////
	// View
	////////////////////////////////////////////////////////////////

	export enum ProgressLabel {
		// 기획/분석
		PLANNING = <any>'기획/분석',
		// 설계
		DESIGN = <any>'설계',
		// 구현
		DEVELOP = <any>'구현',
		// 테스트
		TEST = <any>'테스트',
		// 상용화
		PRODUCT = <any>'상용화'
	}

}
