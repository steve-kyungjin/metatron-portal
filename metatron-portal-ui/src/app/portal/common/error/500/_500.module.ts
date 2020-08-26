import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared.module';
import {_500Component} from './_500.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild([
			{
				path: '',
				component: _500Component
			}
		])
	],
	declarations: [
		_500Component
	]
})
export class _500Module {
}
