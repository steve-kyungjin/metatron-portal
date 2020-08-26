import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {AnalysisIframeComponent} from './component/analysis-iframe.component';
import {AnalysisAppService} from '../../service/analysis-app.service';
import {ExtractService} from '../../../management/shared/extract/service/extract.service';
import {DataSourceService} from '../../../management/shared/datasource/service/data-source.service';
import {GridModule} from '../../../../common/component/grid/grid.module';
import {AnalysisExtractAppComponent} from '../extract-app/analysis-extract-app.component';
import {CustomVariableExecuteModule} from '../../../management/shared/custom-variable-execute/custom-variable-execute.module';

@NgModule({
	imports: [
		SharedModule,
		GridModule,
		CustomVariableExecuteModule
	],
	declarations: [
		AnalysisIframeComponent,
		AnalysisExtractAppComponent
	],
	exports: [
		AnalysisIframeComponent
	],
	providers: [
		AnalysisAppService,
		ExtractService,
		DataSourceService
	]
})
export class AnalysisIframeModule {
}
