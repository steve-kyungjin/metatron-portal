import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {ListComponent} from './component/list.component';
import {TreeBlockComponent} from './component/tree-block.component';
import {DetailComponent} from './component/detail.component';
import {ListTreeModule} from '../../../../common/component/tree/list-tree.module';
import {MetaService} from '../../service/meta.service';

@NgModule({
	imports: [
		SharedModule,
		ListTreeModule
	],
	declarations: [
		ListComponent,
		TreeBlockComponent,
		DetailComponent
	],
	exports: [
		ListComponent,
		TreeBlockComponent,
		DetailComponent
	],
	providers: [
		MetaService
	]
})
export class SubjectModule {
}
