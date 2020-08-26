import {NgModule} from '@angular/core';
import {SharedModule} from '../../common/shared.module';
import {MetaService} from '../service/meta.service';
import {ListComponent} from './component/list.component';
import {DetailComponent} from './component/detail.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		ListComponent,
		DetailComponent
	],
	exports: [
		ListComponent,
		DetailComponent
	],
	providers: [
		MetaService
	]
})
export class DictionaryModule {
}
