import {NgModule} from '@angular/core';
import {ListTreeComponent} from './component/list-tree.component';
import {SharedModule} from '../../../portal/common/shared.module';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		ListTreeComponent
	],
	exports: [
		ListTreeComponent
	]
})
export class ListTreeModule {
}
