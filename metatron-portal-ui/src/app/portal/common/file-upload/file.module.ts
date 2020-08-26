import {NgModule} from '@angular/core';
import {FileUploadComponent} from './component/file-upload.component';
import {FileUploadService} from './service/file-upload.service';
import {FileUploadModule} from 'ng2-file-upload';
import {FileFieldComponent} from './component/file-field.component';
import {FileListViewComponent} from './component/file-list-view.component';
import {SharedModule} from '../shared.module';

@NgModule({
	imports: [
		SharedModule,
		FileUploadModule
	],
	declarations: [
		FileUploadComponent,
		FileFieldComponent,
		FileListViewComponent
	],
	exports: [
		FileUploadComponent,
		FileFieldComponent,
		FileListViewComponent
	],
	providers: [
		FileUploadService
	]
})
export class FileModule {
}
