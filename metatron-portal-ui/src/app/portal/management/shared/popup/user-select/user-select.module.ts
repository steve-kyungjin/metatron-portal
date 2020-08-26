import {NgModule} from '@angular/core';
import {UserSelectComponent} from './component/user-select.component';
import {SharedModule} from '../../../../common/shared.module';
import {OrganizationBlockModule} from '../organization-block/organization-block.module';
import {GroupBlockModule} from '../group-block/group-block.module';
import {GroupService} from '../../../../common/service/group.service';
import {OrganizationService} from '../../../../common/service/organization.service';
import {UserService} from '../../../../common/service/user.service';

@NgModule({
	imports: [
		SharedModule,
		GroupBlockModule,
		OrganizationBlockModule
	],
	declarations: [
		UserSelectComponent
	],
	exports: [
		UserSelectComponent
	],
	providers: [
		UserService,
		GroupService,
		OrganizationService
	]
})
export class UserSelectModule {
}
