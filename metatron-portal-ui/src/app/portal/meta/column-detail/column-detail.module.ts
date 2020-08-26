import {NgModule} from '@angular/core';
import {SharedModule} from '../../common/shared.module';
import {ColumnDetailComponent} from './component/column-detail.component';
import {MetaService} from '../service/meta.service';
import {GridModule} from '../../../common/component/grid/grid.module';
import {ColumnEditComponent} from './component/column-edit.component';

@NgModule({
	imports: [
		SharedModule,
		GridModule
	],
	declarations: [
		ColumnDetailComponent,
		ColumnEditComponent
	],
	exports: [
		ColumnDetailComponent
	],
	providers: [
		MetaService
	]
})
export class ColumnDetailModule {
}
