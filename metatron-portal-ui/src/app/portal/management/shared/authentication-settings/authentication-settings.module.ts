import {NgModule} from '@angular/core';
import {AuthenticationSettingsComponent} from './component/authentication-settings.component';
import {SharedModule} from '../../../common/shared.module';
import {UserSelectModule} from '../popup/user-select/user-select.module';
import {GroupSelectModule} from '../popup/group-select/group-select.module';
import {OrganizationSelectModule} from '../popup/organization-select/organization-select.module';

@NgModule({
	imports: [
		SharedModule,
		UserSelectModule,
		GroupSelectModule,
		OrganizationSelectModule
	],
	declarations: [
		AuthenticationSettingsComponent
	],
	exports: [
		AuthenticationSettingsComponent
	]
})
export class AuthenticationSettingsModule {
}
