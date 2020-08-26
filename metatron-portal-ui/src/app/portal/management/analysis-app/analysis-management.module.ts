import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
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
				loadChildren: 'app/portal/management/analysis-app/app/app-management.module#AppManagementModule'
			},
			{
				path: 'category',
				loadChildren: 'app/portal/management/analysis-app/category/category-management.module#CategoryManagementModule'
			}
		])
	]
})
export class AnalysisManagementModule {
}
