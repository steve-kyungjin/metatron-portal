import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {TreeComponent} from './component/tree.component';
import {MetaService} from '../../service/meta.service';
import {ListTreeModule} from '../../../../common/component/tree/list-tree.module';

@NgModule({
	imports: [
		SharedModule,
		ListTreeModule
	],
	declarations: [
		TreeComponent
	],
	exports: [
		TreeComponent
	],
	providers: [
		MetaService
	]
})
export class TreeModule {
}
