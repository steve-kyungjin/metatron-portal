import {NgModule} from '@angular/core';
import {ListComponent} from './component/list.component';
import {SharedModule} from '../common/shared.module';
import {RouterModule} from '@angular/router';
import {DetailComponent} from './component/detail.component';
import {CreateOrUpdateComponent} from './component/create-or-update.component';
import {FileModule} from '../common/file-upload/file.module';
import {UserSelectModule} from '../management/shared/popup/user-select/user-select.module';
import {MyProjectCheckGuard} from './guard/my-project-check.guard';
import {OrganizationSelectModule} from '../management/shared/popup/organization-select/organization-select.module';

@NgModule({
	imports: [
		SharedModule,
		FileModule,
		UserSelectModule,
		OrganizationSelectModule,
		RouterModule.forChild([
			{
				path: '',
				component: ListComponent
			},
			{
				path: 'create',
				component: CreateOrUpdateComponent
			},
			{
				path: ':id',
				component: DetailComponent
			},
			{
				path: ':id/edit',
				component: CreateOrUpdateComponent,
				canActivate: [ MyProjectCheckGuard ]
			}
		])
	],
	declarations: [
		ListComponent,
		DetailComponent,
		CreateOrUpdateComponent
	],
	providers: [
		MyProjectCheckGuard
	]
})
export class ProjectModule {
}
