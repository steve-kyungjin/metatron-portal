import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../common/shared.module';

@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild([
			{
				path: '',
				redirectTo: 'analysis-app',
				pathMatch: 'full'
			},
			{
				path: 'analysis-app',
				loadChildren: 'app/portal/management/analysis-app/analysis-management.module#AnalysisManagementModule'
			},
			{
				path: 'report-app',
				loadChildren: 'app/portal/management/report-app/report-management.module#ReportManagementModule'
			},
			{
				path: 'authority',
				loadChildren: 'app/portal/management/authority/authority.module#AuthorityModule'
			},
			{
				path: 'users',
				loadChildren: 'app/portal/management/users/users.module#UsersModule'
			},
			{
				path: 'groups',
				loadChildren: 'app/portal/management/groups/groups.module#GroupsModule'
			},
			{
				path: 'menu',
				loadChildren: 'app/portal/management/menu/menu.module#MenuModule'
			},
			{
				path: 'log',
				loadChildren: 'app/portal/management/log/log.module#LogModule'
			},
			{
				path: 'metadata',
				loadChildren: 'app/portal/management/metadata/metadata.module#MetadataModule'
			}
		])
	]
})
export class ManagementModule {
}
