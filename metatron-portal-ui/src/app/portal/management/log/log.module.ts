import {NgModule} from '@angular/core';
import {AppComponent} from './component/app/app.component';
import {ConnectComponent} from './component/connect/connect.component';
import {LogService} from './service/log.service';
import {RouterModule} from '@angular/router';
import {AuthAdminGuard} from '../../common/guard/auth.admin.guard';
import {ManagementSharedModule} from '../shared/management-shared.module';

@NgModule({
	imports: [
		ManagementSharedModule,
		RouterModule.forChild([
			{
				path: '',
				redirectTo: 'app',
				pathMatch: 'full'
			},
			{
				path: 'app',
				component: AppComponent,
				canActivate: [
					AuthAdminGuard
				]
			},
			{
				path: 'connect',
				component: ConnectComponent,
				canActivate: [
					AuthAdminGuard
				]
			}
		])
	],
	declarations: [
		AppComponent,
		ConnectComponent
	],
	providers: [
		AuthAdminGuard,
		LogService
	]
})
export class LogModule {
}
