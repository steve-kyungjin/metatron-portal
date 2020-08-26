import {NgModule} from '@angular/core';
import {AppManagementComponent} from './component/app-management.component';
import {RouterModule} from '@angular/router';
import {RegisterStep1Component} from './component/register/register-step1.component';
import {AuthAdminGuard} from '../../../common/guard/auth.admin.guard';
import {RegisterStep2Component} from './component/register/register-step2.component';
import {ManagementSharedModule} from '../../shared/management-shared.module';
import {AuthenticationSettingsModule} from '../../shared/authentication-settings/authentication-settings.module';

@NgModule({
	imports: [
		ManagementSharedModule,
		AuthenticationSettingsModule,
		RouterModule.forChild([
			{
				path: '',
				component: AppManagementComponent,
				canActivate: [ AuthAdminGuard ]
			},
			{
				path: 'register-step1',
				component: RegisterStep1Component,
				canActivate: [ AuthAdminGuard ]
			},
			{
				path: 'register-step2',
				component: RegisterStep2Component,
				canActivate: [ AuthAdminGuard ]
			},
			{
				path: ':appId',
				component: RegisterStep2Component,
				canActivate: [ AuthAdminGuard ]
			}
		])
	],
	declarations: [
		AppManagementComponent,
		RegisterStep1Component,
		RegisterStep2Component
	],
	providers: [
		AuthAdminGuard
	]
})
export class AppManagementModule {
}
