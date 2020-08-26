import {Http} from '@angular/http';
import {TranslateLoader, TranslateModule, TranslateStaticLoader} from 'ng2-translate';
import {CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutGuard} from './portal/layout/guard/layout.guard';
import {LoginGuard} from './portal/login/guard/login.guard';
import {AppComponent} from './app.component';
import {LoadingComponent} from './common/component/loading/loading.component';
import {DialogComponent} from './common/component/dialog/dialog.component';
import {BrowserModule} from '@angular/platform-browser';
import {SharedServiceModule} from './portal/common/shared-service.module';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {APP_BASE_HREF} from '@angular/common';
import {getBasePath} from './app.basepath';
import {COMPOSITION_BUFFER_MODE} from '@angular/forms';
import {environment} from '../environments/environment';
import {GlobalSearchDeactivateGuard} from './portal/global-search/guard/deactivate-guard.service';
import {UpdateSelectMenuGuard} from './portal/layout/guard/update-select-menu.guard';
import {MetaService} from './portal/meta/service/meta.service';

/**
 * 다국어 파일 경로 지정
 *
 * @param {Http} http
 * @returns {TranslateStaticLoader}
 */
export function createTranslateLoader(http: Http): TranslateStaticLoader {

	const I18N_PATH: string = 'assets/i18n';

	let contextPathI18nPath: string = '';

	if (!environment.isLocalMode) {

		// 컨텍스트 패스가 공백인 경우
		// I18N_PATH 로 설정
		if (environment.contextPath === '') {
			contextPathI18nPath = `${I18N_PATH}`;
		}

		// 컨텍스트 패스가 공백이 아닌 경우
		// 컨텍스트 패스 + I18N_PATH 로 설정
		else {
			contextPathI18nPath = `${environment.contextPath}/${I18N_PATH}`;
		}
	} else {
		contextPathI18nPath = I18N_PATH;
	}

	return new TranslateStaticLoader(http, `./${contextPathI18nPath}`, '.json');
}

/**
 * 다국어 모듈 생성
 *
 * @type {ModuleWithProviders}
 */
export const appTranslateModule: ModuleWithProviders = TranslateModule.forRoot({
	provide: TranslateLoader,
	useFactory: (createTranslateLoader),
	deps: [ Http ]
});

/**
 * 앱 라우트
 */
const ROUTES: Routes = [
	{
		path: '',
		redirectTo: 'view/intro',
		pathMatch: 'full'
	},
	{
		path: 'view/search',
		loadChildren: 'app/portal/global-search/global-search.module#GlobalSearchModule',
		canActivate: [
			LoginGuard,
			LayoutGuard,
			UpdateSelectMenuGuard
		],
		canDeactivate: [
			GlobalSearchDeactivateGuard
		]
	},
	{
		path: 'view/intro',
		loadChildren: 'app/portal/intro/intro.module#IntroModule',
		canActivate: [
			LoginGuard,
			LayoutGuard,
			UpdateSelectMenuGuard
		]
	},
	{
		path: 'view',
		loadChildren: 'app/portal/layout/layout.module#LayoutModule',
		canActivate: [
			LoginGuard,
			LayoutGuard
		]
	},
	{
		path: 'view/user',
		loadChildren: 'app/portal/login/login.module#LoginModule'
	},
	{
		path: 'view/new-window',
		loadChildren: 'app/portal/new-window/new-window.module#NewWindowModule'
	},
	{
		path: 'view/sso',
		loadChildren: 'app/portal/sso/sso.module#SSOModule'
	},
	{
		path: 'view/approach-analysis',
		loadChildren: 'app/custom-app/approach-analysis/approach-analysis.module#ApproachAnalysisModule'
	},
	{
		path: 'view/error',
		loadChildren: 'app/portal/common/error/error.module#ErrorModule'
	},
	{
		path: '**',
		redirectTo: 'view/error/404',
		pathMatch: 'full'
	}
];

/**
 * Root Module
 */
@NgModule({
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	declarations: [
		AppComponent,
		LoadingComponent,
		DialogComponent
	],
	imports: [
		BrowserModule,
		SharedServiceModule,
		RouterModule
			.forRoot(ROUTES, {
				enableTracing: environment.routerTracingEnabled
			}),
		appTranslateModule,
		LoggerModule
			.forRoot({
				serverLoggingUrl: '',
				level: environment.level,
				serverLogLevel: NgxLoggerLevel.OFF
			})
	],
	providers: [
		{
			provide: APP_BASE_HREF,
			useFactory: getBasePath
		},
		{
			provide: COMPOSITION_BUFFER_MODE,
			useValue: false
		},
		GlobalSearchDeactivateGuard,
		UpdateSelectMenuGuard,
		MetaService
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {
}
