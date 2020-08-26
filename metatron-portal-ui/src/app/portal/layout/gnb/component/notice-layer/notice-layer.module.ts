import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/shared.module';
import {NoticeLayerComponent} from './notice-layer.component';
import {NoticeLayerMainComponent} from "./notice-layer-main.component";

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		NoticeLayerComponent,
		NoticeLayerMainComponent
	],
	exports: [
		NoticeLayerComponent,
		NoticeLayerMainComponent
	]
})
export class NoticeLayerModule {
}
