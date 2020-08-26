import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {IntroComponent} from './component/intro.component';
import {SharedModule} from '../common/shared.module';
import {QuickModule} from '../layout/quick/quick.module';
import {UserProfileModule} from '../layout/gnb/component/user-profile/user-profile.module';
import {MainContentComponent} from './component/main-content.component';
import {MainContentService} from './service/main-content.service';
import {NoticeLayerModule} from '../layout/gnb/component/notice-layer/notice-layer.module';
import {LnbModule} from '../layout/lnb/lnb.module';
import {HelpModule} from "../layout/gnb/component/help/help.module";

const ROUTE: Routes = [
	{
		path: '', component: IntroComponent
	}
];

@NgModule({
	imports: [
		SharedModule,
		LnbModule,
		QuickModule,
		UserProfileModule,
		NoticeLayerModule,
		HelpModule,
		RouterModule.forChild(ROUTE)
	],
	declarations: [
		IntroComponent,
		MainContentComponent
	],
	providers: [
		MainContentService
	]
})
export class IntroModule {
}
