import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './component/layout.component';
import {IntroRedirectGuard} from '../intro/guard/intro-redirect.guard';
import {SampleModuleGuard} from '../../template/sample/guard/sample-module.guard';
import {ReportIframeComponent} from '../report-app/component/iframe/component/report-iframe.component';
import {NgModule} from '@angular/core';
import {SharedModule} from '../common/shared.module';
import {GnbModule} from './gnb/gnb.module';
import {GridModule} from '../../common/component/grid/grid.module';
import {ReportAppService} from '../report-app/service/report-app.service';
import {AnalysisAppService} from '../analysis-app/service/analysis-app.service';
import {ExtractService} from '../management/shared/extract/service/extract.service';
import {DataSourceService} from '../management/shared/datasource/service/data-source.service';
import {GnbTopComponent} from './gnb/component/gnb-top/gnb-top.component';
import {UpdateSelectMenuGuard} from './guard/update-select-menu.guard';
import {LnbModule} from './lnb/lnb.module';
import {LoginService} from '../login/service/login.service';
import {AnalysisIframeModule} from '../analysis-app/component/iframe/analysis-iframe.module';
import {AnalysisIframeComponent} from '../analysis-app/component/iframe/component/analysis-iframe.component';
import {ReportIframeModule} from '../report-app/component/iframe/report-iframe.module';

const ROUTE: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: '',
				canActivate: [
					IntroRedirectGuard
				]
			},
			{
				path: 'sample',
				loadChildren: 'app/template/sample/sample.module#SampleModule',
				canActivate: [
					SampleModuleGuard
				]
			},
			{
				path: 'report-app',
				loadChildren: 'app/portal/report-app/report-app.module#ReportAppModule',
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				path: 'report-app/my-app/:appId',
				component: ReportIframeComponent,
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				path: 'analysis-app',
				loadChildren: 'app/portal/analysis-app/analysis-app.module#AnalysisAppModule',
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				path: 'analysis-app/my-app/:appId',
				component: AnalysisIframeComponent,
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				path: 'management',
				loadChildren: 'app/portal/management/management.module#ManagementModule',
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				path: 'community',
				loadChildren: 'app/portal/community/community.module#CommunityModule',
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				path: 'project',
				loadChildren: 'app/portal/project/project.module#ProjectModule',
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				path: 'metadata',
				loadChildren: 'app/portal/meta/meta.module#MetaModule',
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				path: 'site-map',
				loadChildren: 'app/portal/site-map/site-map.module#SiteMapModule',
				canActivate: [
					UpdateSelectMenuGuard
				]
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(ROUTE),
		SharedModule,
		LnbModule,
		GnbModule,
		GridModule,
		AnalysisIframeModule,
		ReportIframeModule
	],
	declarations: [
		LayoutComponent,
		GnbTopComponent
	],
	providers: [
		LoginService,
		AnalysisAppService,
		ReportAppService,
		IntroRedirectGuard,
		ExtractService,
		DataSourceService,
		SampleModuleGuard,
		UpdateSelectMenuGuard
	]
})
export class LayoutModule {
}
