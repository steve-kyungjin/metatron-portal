import {NgModule} from '@angular/core';
import {MenuSearchComponent} from './component/menu-search.component';
import {SharedModule} from '../../../common/shared.module';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		MenuSearchComponent
	],
	exports: [
		MenuSearchComponent
	]
})
export class MenuSearchModule {
}
