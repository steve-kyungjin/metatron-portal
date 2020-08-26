import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared.module';
import {_403Component} from './_403.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild([
			{
				path: '',
				component: _403Component
			}
		])
	],
	declarations: [
		_403Component
	]
})
export class _403Module {
}
