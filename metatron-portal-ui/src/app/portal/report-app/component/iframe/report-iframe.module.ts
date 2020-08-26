import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {ExtractService} from '../../../management/shared/extract/service/extract.service';
import {DataSourceService} from '../../../management/shared/datasource/service/data-source.service';
import {GridModule} from '../../../../common/component/grid/grid.module';
import {ReportIframeComponent} from './component/report-iframe.component';
import {ReportAppService} from '../../service/report-app.service';
import {ReportExtractAppComponent} from '../extract-app/report-extract-app.component';
import {CustomVariableExecuteModule} from '../../../management/shared/custom-variable-execute/custom-variable-execute.module';

@NgModule({
	imports: [
		SharedModule,
		GridModule,
		CustomVariableExecuteModule
	],
	declarations: [
		ReportIframeComponent,
		ReportExtractAppComponent
	],
	exports: [
		ReportIframeComponent
	],
	providers: [
		ReportAppService,
		ExtractService,
		DataSourceService
	]
})
export class ReportIframeModule {
}
