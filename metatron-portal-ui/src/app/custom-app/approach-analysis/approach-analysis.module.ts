import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../portal/common/shared.module';
import {GridModule} from '../../common/component/grid/grid.module';
import {ApproachAnalysisComponent} from './component/approach-analysis.component';
import {ScriptService} from '../../portal/common/service/script.service';
import {ApproachAnalysisService} from './service/approach-analysis.service';

@NgModule({
	imports: [
		SharedModule,
		GridModule,
		RouterModule.forChild([
			{ path: '', component: ApproachAnalysisComponent }
		])
	],
	declarations: [
		ApproachAnalysisComponent
	],
	providers: [
		ScriptService,
		ApproachAnalysisService
	]
})
export class ApproachAnalysisModule {
}
