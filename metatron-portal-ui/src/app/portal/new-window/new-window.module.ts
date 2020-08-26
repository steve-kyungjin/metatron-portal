import {NgModule} from '@angular/core';
import {SharedModule} from '../common/shared.module';
import {RouterModule} from '@angular/router';
import {AnalysisIframeComponent} from '../analysis-app/component/iframe/component/analysis-iframe.component';
import {AnalysisIframeModule} from '../analysis-app/component/iframe/analysis-iframe.module';
import {ViewComponent} from './view/view.component';
import {ReportIframeComponent} from '../report-app/component/iframe/component/report-iframe.component';
import {ReportIframeModule} from '../report-app/component/iframe/report-iframe.module';

@NgModule({
	imports: [
		SharedModule,
		AnalysisIframeModule,
		ReportIframeModule,
		RouterModule.forChild([
			{
				path: '',
				component: ViewComponent,
				children: [
					{
						path: 'analysis-app/my-app/:appId',
						component: AnalysisIframeComponent
					},
					{
						path: 'report-app/my-app/:appId',
						component: ReportIframeComponent
					}
				]
			}
		])
	],
	declarations: [ ViewComponent ]
})
export class NewWindowModule {
}
