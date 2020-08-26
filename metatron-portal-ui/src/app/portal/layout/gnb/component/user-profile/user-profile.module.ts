import {NgModule} from '@angular/core';
import {UserProfileComponent} from './user-profile.component';
import {SharedModule} from '../../../../common/shared.module';
import {UserProfileDetailLayerComponent} from './user-profile-detail-layer.component';
import {FileModule} from '../../../../common/file-upload/file.module';

@NgModule({
	imports: [
		SharedModule,
		FileModule
	],
	declarations: [
		UserProfileComponent,
		UserProfileDetailLayerComponent
	],
	exports: [
		UserProfileComponent,
		UserProfileDetailLayerComponent
	]
})
export class UserProfileModule {
}
