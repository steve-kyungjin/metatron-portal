import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {DashboardLayerComponent} from './component/dashboard-layer.component';
import {TreeComponent} from './component/tree.component';

@NgModule({
	imports: [
		SharedModule,
	],
	declarations: [
		DashboardLayerComponent,
		TreeComponent
	],
	exports: [
		DashboardLayerComponent
	]
})
export class MetatronDashboardModule {
}
