import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ManagementSharedModule} from '../shared/management-shared.module';

@NgModule({
	imports: [
		ManagementSharedModule,
		RouterModule.forChild([
			{
				path: '',
				redirectTo: 'report',
				pathMatch: 'full'
			},
			{
				path: 'report',
				loadChildren: 'app/portal/management/report-app/report/app-management.module#AppManagementModule'
			},
			{
				path: 'category',
				loadChildren: 'app/portal/management/report-app/category/category-management.module#CategoryManagementModule'
			}
		])
	]
})
export class ReportManagementModule {
}
