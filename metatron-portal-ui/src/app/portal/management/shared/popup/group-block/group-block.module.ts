import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/shared.module';
import {GroupService} from '../../../../common/service/group.service';
import {GroupBlockComponent} from './component/group-block.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		GroupBlockComponent
	],
	exports: [
		GroupBlockComponent
	],
	providers: [
		GroupService
	]
})
export class GroupBlockModule {
}
