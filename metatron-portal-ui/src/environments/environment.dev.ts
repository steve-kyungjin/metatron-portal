import {NgxLoggerLevel} from 'ngx-logger';

const CONTEXT_PATH: string = '';
const API: string = '/api';
const API_PORT: string = '8880';
const BASE_URL = `http://${window.location.hostname}:${API_PORT}${CONTEXT_PATH}`;
const PREP_URL = `http://skt-campaignhub.koreacentral.cloudapp.azure.com:8283`;
const API_URL: string = `${BASE_URL}${API}`;

export const environment = {
	production: false,
	isLocalMode: true,
	contextPath: CONTEXT_PATH,
	apiUrl: API_URL,
	prepUrl : PREP_URL,
	level: NgxLoggerLevel.TRACE,
	routerTracingEnabled: true,
	sso: {
		tangoSysCode: '172',
		tangoUrl: BASE_URL,
		metatronUrl: 'http://52.231.189.217:8180',
		tnetUrl: BASE_URL
	},
	taggingEnabled: false
};
