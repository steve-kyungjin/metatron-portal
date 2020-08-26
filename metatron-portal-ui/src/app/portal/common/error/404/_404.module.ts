import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared.module';
import {_404Component} from './_404.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild([
			{
				path: '',
				component: _404Component
			}
		])
	],
	declarations: [
		_404Component
	]
})
export class _404Module {
}
