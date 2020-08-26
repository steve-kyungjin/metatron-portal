import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExampleGridComponent} from './component/grid/example-grid.component';
import {ExampleSelectboxComponent} from './component/selectbox/example-selectbox.component';
import {ExampleDatepickerComponent} from './component/datepicker/example-datepicker.component';
import {ExampleFileUploadComponent} from './component/file-upload-sample/example-file-upload.component';
import {GridModule} from '../../common/component/grid/grid.module';
import {SharedModule} from '../../portal/common/shared.module';
import {FileModule} from '../../portal/common/file-upload/file.module';

const layoutRoutes: Routes = [
	{ path: '', redirectTo: 'grid', pathMatch: 'full' },
	{ path: 'grid', component: ExampleGridComponent },
	{ path: 'selectbox', component: ExampleSelectboxComponent },
	{ path: 'datepiker', component: ExampleDatepickerComponent },
	{ path: 'file-upload', component: ExampleFileUploadComponent }
];

@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild(layoutRoutes),
		GridModule,
		FileModule,
	],
	declarations: [
		ExampleGridComponent,
		ExampleSelectboxComponent,
		ExampleDatepickerComponent,
		ExampleFileUploadComponent
	]
})

export class SampleModule {
}
