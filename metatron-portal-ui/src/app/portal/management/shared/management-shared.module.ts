import {NgModule} from '@angular/core';
import {CreateCategoryLayerComponent} from './component/create-category-layer/create-category-layer.component';
import {FileModule} from '../../common/file-upload/file.module';
import {GridModule} from '../../../common/component/grid/grid.module';
import {SharedModule} from '../../common/shared.module';
import {UserSelectModule} from './popup/user-select/user-select.module';
import {GroupSelectModule} from './popup/group-select/group-select.module';
import {ExtractModule} from './extract/extract.module';
import {MetatronDashboardModule} from './metatron-dashboard/metatron-dashboard.module';

@NgModule({
	imports: [
		SharedModule,
		FileModule,
		GridModule,
		UserSelectModule,
		GroupSelectModule,
		ExtractModule,
		MetatronDashboardModule
	],
	declarations: [
		CreateCategoryLayerComponent
	],
	exports: [
		SharedModule,
		FileModule,
		GridModule,
		UserSelectModule,
		GroupSelectModule,
		ExtractModule,
		MetatronDashboardModule,
		CreateCategoryLayerComponent
	]
})
export class ManagementSharedModule {
}
