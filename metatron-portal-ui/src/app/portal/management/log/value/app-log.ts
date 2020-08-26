import {User} from '../../../common/value/user';
import {AnalysisApp} from '../../../analysis-app/value/analysis-app.value';
import {ReportApp} from '../../../report-app/value/report-app.value';
import {CommonResult} from '../../../common/value/result-value';
import {Abstract} from '../../../common/value/abstract';
import * as _ from 'lodash';

export namespace AppLog {

	export function getApp(appLog: AppLog.Entity): ReportApp.Entity | AnalysisApp.Entity {
		return appLog.type === Type.ANALYSIS ? appLog.analysisApp : appLog.reportApp;
	}

	export namespace getLabelFunctions {

		export function getType(appLog: AppLog.Entity) {
			if (_.isUndefined(appLog)) {
				return '';
			} else if (_.isUndefined(appLog.action)) {
				return '';
			} else if (appLog.type === Type.ANALYSIS) {
				return '분석 앱';
			} else if (appLog.type === Type.REPORT) {
				return '리포트';
			} else {
				return '';
			}
		}

		export function getAction(appLog: AppLog.Entity) {
			if (_.isUndefined(appLog)) {
				return '';
			} else if (_.isUndefined(appLog.action)) {
				return '';
			} else if (appLog.action === Action.ADD) {
				return appLog.type == AppLog.Type.REPORT ? '나의 리포트 추가' : '나의 분석 앱 추가';
			} else if (appLog.action === Action.DELETE) {
				return appLog.type == AppLog.Type.REPORT ? '나의 리포트 삭제' : '나의 분석 앱 삭제';
			} else if (appLog.action === Action.EXEC) {
				return appLog.type == AppLog.Type.REPORT ? '나의 리포트 실행' : '나의 분석 앱 실행';
			} else {
				return '';
			}
		}

	}

	export enum Type {
		ANALYSIS = <any>'ANALYSIS',
		REPORT = <any>'REPORT'
	}

	export enum Action {
		ADD = <any>'ADD',
		DELETE = <any>'DELETE',
		EXEC = <any>'EXEC'
	}

	export class Entity extends Abstract.Entity {

		id: string;
		user: User.Entity;
		type: Type;
		action: Action;
		analysisApp: AnalysisApp.Entity;
		reportApp: ReportApp.Entity;
	}

	export namespace Result {

		export class LogList extends CommonResult {
			data: {
				logList: {
					content?: (AppLog.Entity)[] | null;
					last: boolean;
					totalPages: number;
					totalElements: number;
					size: number;
					number: number;
					numberOfElements: number;
					first: boolean;
				};
			};
		}

	}

}
