import {NgModule} from '@angular/core';
import {SharedModule} from '../../../portal/common/shared.module';
import {ImageListComponent} from './image-list.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		ImageListComponent
	],
	exports: [
		ImageListComponent
	]
})
export class ImageListModule {
}
