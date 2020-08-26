import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../common/shared.module';
import {SiteMapComponent} from './component/site-map.component';
import {MenuSearchModule} from '../layout/lnb/menu-search/menu-search.module';

const ROUTE: Routes = [
	{
		path: '', component: SiteMapComponent
	}
];

@NgModule({
	imports: [
		SharedModule,
		MenuSearchModule,
		RouterModule.forChild(ROUTE)
	],
	declarations: [
		SiteMapComponent
	]
})
export class SiteMapModule {
}
