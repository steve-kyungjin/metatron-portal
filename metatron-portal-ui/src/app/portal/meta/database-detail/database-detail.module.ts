import {NgModule} from '@angular/core';
import {SharedModule} from '../../common/shared.module';
import {MetaService} from '../service/meta.service';
import {GridModule} from '../../../common/component/grid/grid.module';
import {DatabaseDetailComponent} from './component/database-detail.component';

@NgModule({
	imports: [
		SharedModule,
		GridModule
	],
	declarations: [
		DatabaseDetailComponent
	],
	exports: [
		DatabaseDetailComponent
	],
	providers: [
		MetaService
	]
})
export class DatabaseDetailModule {
}
