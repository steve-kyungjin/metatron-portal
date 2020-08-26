import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {ExtractLayerComponent} from './component/extract-layer.component';
import {ExtractService} from './service/extract.service';
import {ExecuteConditionEnterInformationComponent} from './component/execute-condition-enter-information.component';
import {DataSourceModule} from '../datasource/data-source.module';
import {GridModule} from '../../../../common/component/grid/grid.module';
import {HelpLayerComponent} from './component/help-layer.component';
import {CreateCustomVariableComponent} from './component/create-custom-variable.component';
import {SelectVariableComponent} from './component/select-variable.component';
import {SelectVariableDefaultAreaComponent} from './component/select-variable-default-area.component';
import {SelectVariableCustomAreaComponent} from './component/select-variable-custom-area.component';
import {CustomVariableExecuteModule} from '../custom-variable-execute/custom-variable-execute.module';

@NgModule({
	imports: [
		SharedModule,
		DataSourceModule,
		GridModule,
		CustomVariableExecuteModule
	],
	declarations: [
		ExecuteConditionEnterInformationComponent,
		HelpLayerComponent,
		ExtractLayerComponent,
		SelectVariableComponent,
		SelectVariableDefaultAreaComponent,
		SelectVariableCustomAreaComponent,
		CreateCustomVariableComponent
	],
	exports: [
		ExtractLayerComponent
	],
	providers: [
		ExtractService
	]
})
export class ExtractModule {
}
