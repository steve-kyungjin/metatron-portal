import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/shared.module';
import {GroupSelectComponent} from './component/group-select.component';
import {GroupBlockModule} from '../group-block/group-block.module';

@NgModule({
	imports: [
		SharedModule,
		GroupBlockModule
	],
	declarations: [
		GroupSelectComponent
	],
	exports: [
		GroupSelectComponent
	]
})
export class GroupSelectModule {
}
