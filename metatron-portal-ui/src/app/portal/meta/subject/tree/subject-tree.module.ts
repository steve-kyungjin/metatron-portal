import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {SubjectTreeComponent} from './component/subject-tree.component';
import {ListTreeModule} from '../../../../common/component/tree/list-tree.module';
import {MetaService} from '../../service/meta.service';

@NgModule({
	imports: [
		SharedModule,
		ListTreeModule
	],
	declarations: [
		SubjectTreeComponent
	],
	exports: [
		SubjectTreeComponent
	],
	providers: [
		MetaService
	]
})
export class SubjectTreeModule {
}
