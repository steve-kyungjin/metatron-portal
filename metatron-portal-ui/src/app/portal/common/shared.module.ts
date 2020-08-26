import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DateFormatPipe} from './pipe/date-format.pipe';
import {PaginationComponent} from '../../common/component/pagination/pagination.component';
import {SelectComponent} from '../../common/component/select/select.component';
import {InputMaskDirective} from '../../common/component/directive/input-mask.directive';
import {CodemirrorComponent} from '../../common/component/codemirror/codemirror.component';
import {InputDatepickerComponent} from '../../common/component/directive/input-datepicker.component';

export const MODULES = [
	CommonModule,
	FormsModule,
	HttpModule,
	RouterModule
];

export const COMPONENTS = [
	PaginationComponent,
	DateFormatPipe,
	SelectComponent,
	InputMaskDirective,
	InputDatepickerComponent,
	CodemirrorComponent
];

/**
 * Common Modules and Components
 */
@NgModule({
	imports: [
		...MODULES
	],
	declarations: [
		...COMPONENTS
	],
	exports: [
		...MODULES,
		...COMPONENTS
	]
})
export class SharedModule {
}
