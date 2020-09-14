import {CommonResult} from '../../common/value/result-value';

export class MainContent {
	constructor() {
	}

	public id: string;
	public title: string = '';
	public description: string = '';
	public categories: string[] = [];
	public my: boolean;
	public media: string;
	public extra: string;

	public url: string;
	public externalUrl: string;

	public categoryString = '';

	// 접근 가능 여부
	public acceptable: boolean;
}

export class MainContentList {
	// 커뮤니케이션
	public communications: MainContent[] = [];
	// 분석 앱
	public analysisApps: MainContent[] = [];
	// 리포트
	public reportApps: MainContent[] = [];
}

export class MainContentMain {
	public main: MainContentList;
}

export class MainContentListResult extends CommonResult {
	public data: MainContentMain;
}
