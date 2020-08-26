import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './component/layout/layout.component';
import {AllComponent} from './component/all/all.component';
import {ReportAppComponent} from './component/report-app/report-app.component';
import {AnalysisAppComponent} from './component/analysis-app/analysis-app.component';
import {SharedModule} from '../common/shared.module';
import {QuickModule} from '../layout/quick/quick.module';
import {TopComponent} from './component/layout/top/top.component';
import {TabComponent} from './component/layout/tab/tab.component';
import {GnbModule} from '../layout/gnb/gnb.module';
import {MetaTableComponent} from './component/meta-table/meta-table.component';
import {MetaColumnComponent} from './component/meta-column/meta-column.component';
import {ProjectComponent} from './component/project/project.component';
import {CommunicationComponent} from './component/communication/communication.component';
import {TableDetailModule} from '../meta/table-detail/table-detail.module';
import {ColumnDetailModule} from '../meta/column-detail/column-detail.module';
import {LnbModule} from '../layout/lnb/lnb.module';

const ROUTES: Routes = [
	{
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	},
	{
		path: 'all',
		component: LayoutComponent,
		children: [
			{
				path: '',
				component: AllComponent
			},
			{
				path: 'report-app',
				component: ReportAppComponent
			},
			{
				path: 'analysis-app',
				component: AnalysisAppComponent
			},
			{
				path: 'meta-table',
				component: MetaTableComponent
			},
			{
				path: 'meta-column',
				component: MetaColumnComponent
			},
			{
				path: 'communication',
				component: CommunicationComponent
			},
			{
				path: 'project',
				component: ProjectComponent
			}
		]
	}
];

@NgModule({
	imports: [
		SharedModule,
		LnbModule,
		QuickModule,
		GnbModule,
		TableDetailModule,
		ColumnDetailModule,
		RouterModule.forChild(ROUTES)
	],
	declarations: [
		LayoutComponent,
		TopComponent,
		TabComponent,
		AllComponent,
		ReportAppComponent,
		AnalysisAppComponent,
		MetaTableComponent,
		MetaColumnComponent,
		ProjectComponent,
		CommunicationComponent
	]
})
export class GlobalSearchModule {
}
