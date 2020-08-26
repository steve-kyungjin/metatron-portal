import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {CreateOrUpdateComponent} from './component/create-or-update.component';
import {SubjectSelectModule} from '../select/subject-select.module';

@NgModule({
	imports: [
		SharedModule,
		SubjectSelectModule
	],
	declarations: [
		CreateOrUpdateComponent
	],
	exports: [
		CreateOrUpdateComponent
	]
})
export class CreateOrUpdateModule {
}
