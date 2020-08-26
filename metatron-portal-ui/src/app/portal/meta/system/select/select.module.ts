import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {SelectComponent} from './component/select.component';
import {MetaService} from '../../service/meta.service';
import {ListTreeModule} from '../../../../common/component/tree/list-tree.module';
import {TreeModule as SystemTreeModule} from '../tree/tree.module';

@NgModule({
	imports: [
		SharedModule,
		ListTreeModule,
		SystemTreeModule
	],
	declarations: [
		SelectComponent
	],
	exports: [
		SelectComponent
	],
	providers: [
		MetaService
	]
})
export class SelectModule {
}
