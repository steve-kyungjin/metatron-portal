import {NgModule} from '@angular/core';
import {GroupsComponent} from './component/groups.component';
import {RouterModule} from '@angular/router';
import {DetailComponent} from './component/detail.component';
import {GroupService} from '../../common/service/group.service';
import {ManagementSharedModule} from '../shared/management-shared.module';
import {CreateComponent} from './component/create.component';
import {AuthAdminGuard} from '../../common/guard/auth.admin.guard';

@NgModule({
	imports: [
		ManagementSharedModule,
		RouterModule.forChild([
			{
				path: '',
				component: GroupsComponent,
				canActivate: [ AuthAdminGuard ]
			},
			{
				path: 'create',
				component: CreateComponent,
				canActivate: [ AuthAdminGuard ]
			},
			{
				path: ':id',
				component: DetailComponent,
				canActivate: [ AuthAdminGuard ]
			}
		])
	],
	declarations: [
		GroupsComponent,
		CreateComponent,
		DetailComponent
	],
	providers: [
		AuthAdminGuard,
		GroupService
	]
})
export class GroupsModule {
}
