import {NgModule} from '@angular/core';
import {SharedModule} from '../../common/shared.module';
import {GNBComponent} from './component/gnb.component';
import {UserProfileModule} from './component/user-profile/user-profile.module';
import {NoticeLayerModule} from './component/notice-layer/notice-layer.module';
import {HelpModule} from "./component/help/help.module";
import {QuickModule} from "../quick/quick.module";

@NgModule({
	imports: [
		SharedModule,
		UserProfileModule,
		NoticeLayerModule,
		HelpModule,
		QuickModule
	],
	declarations: [
		GNBComponent
	],
	exports: [
		GNBComponent
	]
})
export class GnbModule {
}
