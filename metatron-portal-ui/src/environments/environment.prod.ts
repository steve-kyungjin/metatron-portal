import {NgxLoggerLevel} from 'ngx-logger';

const CONTEXT_PATH: string = '';
const API: string = '/api';
const API_PORT: string = '8880';
const BASE_URL = `http://${window.location.hostname}:${API_PORT}${CONTEXT_PATH}`;
const API_URL: string = `${BASE_URL}${API}`;

export const environment = {
	production: true,
	isLocalMode: false,
	contextPath: CONTEXT_PATH,
	apiUrl: API_URL,
	level: NgxLoggerLevel.ERROR,
	routerTracingEnabled: false,
	sso: {
		tangoSysCode: '172',
		tangoUrl: 'https://sso.tango.sktelecom.com',
		metatronUrl: 'http://idcube.sktelecom.com:8086',
		tnetUrl: 'http://tnetproxy.sktelecom.com:8081/proxy/sso_idcubelink.jsp'
	},
	taggingEnabled: true
};
