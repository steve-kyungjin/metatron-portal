import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthAdminGuard} from '../../common/guard/auth.admin.guard';
import {ManagementSharedModule} from '../shared/management-shared.module';
import {ListTreeModule} from '../../../common/component/tree/list-tree.module';
import {MenuManagementService} from './service/menu-management.service';
import {MenuManagementComponent} from './component/menu-management.component';

@NgModule({
	imports: [
		ManagementSharedModule,
		ListTreeModule,
		RouterModule.forChild([
			{
				path: '',
				component: MenuManagementComponent,
				canActivate: [ AuthAdminGuard ]
			}
		])
	],
	declarations: [
		MenuManagementComponent
	],
	providers: [
		AuthAdminGuard,
		MenuManagementService
	]
})
export class MenuModule {
}
