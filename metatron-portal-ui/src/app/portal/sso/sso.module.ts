import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../common/shared.module';
import {LoadingTangoComponent} from './component/tango/loading-tango.component';
import {LoadingTnetComponent} from './component/tnet/loading-tnet.component';
import {LoadingTnetPreComponent} from "./component/tnet/loading-tnet-pre.component";

@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild([
			{ path: '', redirectTo: 'loading/tnet', pathMatch: 'full' },
			{ path: 'loading/tnet/pre', component: LoadingTnetPreComponent },
			{ path: 'loading/tnet', component: LoadingTnetComponent },
			{ path: 'loading/tango2', component: LoadingTangoComponent }
		])
	],
	declarations: [
		LoadingTnetPreComponent,
		LoadingTnetComponent,
		LoadingTangoComponent
	]
})
export class SSOModule {
}
