import {NgModule} from '@angular/core';
import {SharedModule} from '../../common/shared.module';
import {QuickComponent} from './component/quick.component';
import {CommunityService} from '../../community/service/community.service';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		QuickComponent
	],
	exports: [
		QuickComponent
	],
	providers: [
		CommunityService
	]
})
export class QuickModule {
}
