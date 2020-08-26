import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {MetaService} from '../../service/meta.service';
import {CreateOrUpdateComponent} from './component/create-or-update.component';
import {UserSelectModule} from '../../../management/shared/popup/user-select/user-select.module';
import {SelectModule as SystemSelectModule} from '../select/select.module';

@NgModule({
	imports: [
		SharedModule,
		UserSelectModule,
		SystemSelectModule
	],
	declarations: [
		CreateOrUpdateComponent
	],
	exports: [
		CreateOrUpdateComponent
	],
	providers: [
		MetaService
	]
})
export class CreateOrUpdateModule {
}
