/**
 * 스테이지
 */
import {NgxLoggerLevel} from 'ngx-logger';

const CONTEXT_PATH: string = '';
const API: string = '/api';
const API_PORT: string = '8880';
const BASE_URL = `http://${window.location.hostname}:${API_PORT}${CONTEXT_PATH}`;
const PREP_URL = `http://prep.incross.metatron.app`;
const API_URL: string = `${BASE_URL}${API}`;

export const environment = {
	production: false,
	isLocalMode: false,
	contextPath: CONTEXT_PATH,
	apiUrl: API_URL,
	prepUrl : PREP_URL,
	level: NgxLoggerLevel.TRACE,
	routerTracingEnabled: true,
	sso: {
		tangoSysCode: '1023',
		tangoUrl: 'https://ssostg.tango.sktelecom.com:443',
		metatronUrl: 'http://sat-013-07:8180',
		tnetUrl: BASE_URL
	},
	taggingEnabled: false
};
