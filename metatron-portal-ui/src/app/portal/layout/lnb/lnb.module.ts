import {NgModule} from '@angular/core';
import {SharedModule} from '../../common/shared.module';
import {MenuSearchModule} from './menu-search/menu-search.module';
import {LNBComponent} from './component/lnb.component';

@NgModule({
	imports: [
		SharedModule,
		MenuSearchModule
	],
	declarations: [
		LNBComponent
	],
	exports: [
		LNBComponent
	]
})
export class LnbModule {
}
