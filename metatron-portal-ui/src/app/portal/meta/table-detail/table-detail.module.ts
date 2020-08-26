import {NgModule} from '@angular/core';
import {SharedModule} from '../../common/shared.module';
import {TableDetailComponent} from './component/table-detail.component';
import {MetaService} from '../service/meta.service';
import {GridModule} from '../../../common/component/grid/grid.module';
import {TableEditComponent} from './component/table-edit.component';
import {UserSelectModule} from '../../management/shared/popup/user-select/user-select.module';
import {SubjectSelectModule} from '../subject/select/subject-select.module';

@NgModule({
	imports: [
		SharedModule,
		GridModule,
		UserSelectModule,
		SubjectSelectModule
	],
	declarations: [
		TableDetailComponent,
		TableEditComponent
	],
	exports: [
		TableDetailComponent
	],
	providers: [
		MetaService
	]
})
export class TableDetailModule {
}
