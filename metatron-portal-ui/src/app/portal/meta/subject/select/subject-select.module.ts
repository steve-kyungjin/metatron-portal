import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {SubjectSelectComponent} from './component/subject-select.component';
import {SubjectTreeModule} from '../tree/subject-tree.module';

@NgModule({
	imports: [
		SharedModule,
		SubjectTreeModule
	],
	declarations: [
		SubjectSelectComponent
	],
	exports: [
		SubjectSelectComponent
	]
})
export class SubjectSelectModule {
}
