import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CategoryManagementComponent} from './component/category-management.component';
import {ManagementSharedModule} from '../../shared/management-shared.module';
import {AuthAdminGuard} from '../../../common/guard/auth.admin.guard';

@NgModule({
	imports: [
		ManagementSharedModule,
		RouterModule.forChild([
			{
				path: '',
				component: CategoryManagementComponent,
				canActivate: [ AuthAdminGuard ]
			}
		])
	],
	declarations: [
		CategoryManagementComponent
	],
	providers: [
		AuthAdminGuard
	]
})
export class CategoryManagementModule {
}
