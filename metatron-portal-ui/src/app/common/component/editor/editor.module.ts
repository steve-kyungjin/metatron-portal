import {NgModule} from '@angular/core';
import {EditorComponent} from './editor.component';
import {EditorService} from './editor.service';

@NgModule({
	declarations: [
		EditorComponent
	],
	exports: [
		EditorComponent
	],
	providers: [
		EditorService
	]
})
export class EditorModule {
}
