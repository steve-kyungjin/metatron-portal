import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {CustomVariableExecuteComponent} from './component/custom-variable-execute.component';
import {ExtractService} from '../extract/service/extract.service';
import {SearchPipeModule} from './pipe/search-pipe-module';

@NgModule({
	imports: [
		SharedModule,
		SearchPipeModule
	],
	declarations: [
		CustomVariableExecuteComponent
	],
	exports: [
		CustomVariableExecuteComponent
	],
	providers: [
		ExtractService
	]
})
export class CustomVariableExecuteModule {
}
