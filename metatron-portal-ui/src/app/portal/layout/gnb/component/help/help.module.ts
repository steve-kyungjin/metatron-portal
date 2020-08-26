import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/shared.module';
import {HelpComponent} from "./help.component";

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		HelpComponent
	],
	exports: [
		HelpComponent
	]
})
export class HelpModule {
}
