import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/shared.module';
import {OrganizationSelectComponent} from './component/organization-select.component';
import {OrganizationService} from '../../../../common/service/organization.service';
import {OrganizationBlockModule} from '../organization-block/organization-block.module';
import {ListTreeModule} from '../../../../../common/component/tree/list-tree.module';

@NgModule({
	imports: [
		SharedModule,
		OrganizationBlockModule,
		ListTreeModule
	],
	declarations: [
		OrganizationSelectComponent
	],
	exports: [
		OrganizationSelectComponent
	],
	providers: [
		OrganizationService
	]
})
export class OrganizationSelectModule {
}
