import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/shared.module';
import {OrganizationBlockComponent} from './component/organization-block.component';
import {OrganizationService} from '../../../../common/service/organization.service';
import {ListTreeModule} from '../../../../../common/component/tree/list-tree.module';

@NgModule({
	imports: [
		SharedModule,
		ListTreeModule
	],
	declarations: [
		OrganizationBlockComponent
	],
	exports: [
		OrganizationBlockComponent
	],
	providers: [
		OrganizationService
	]
})
export class OrganizationBlockModule {
}
