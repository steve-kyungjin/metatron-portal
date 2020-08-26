import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {RequestApprovalComponent} from './component/request-approval.component';
import {AuthAdminGuard} from '../../common/guard/auth.admin.guard';
import {ManagementSharedModule} from '../shared/management-shared.module';
import {RequestApprovalService} from './service/request-approval.service';
import {AuthorityService} from './service/authority.service';
import {AuthorityComponent} from './component/authority.component';
import {AuthorityDetailComponent} from './component/authority-detail.component';

@NgModule({
	imports: [
		ManagementSharedModule,
		RouterModule.forChild([
			{
				path: '',
				component: AuthorityComponent,
				canActivate: [ AuthAdminGuard ]
			},
			{
				path: 'request-approval',
				component: RequestApprovalComponent,
				canActivate: [ AuthAdminGuard ]
			},
			{
				path: ':id',
				component: AuthorityDetailComponent,
				canActivate: [ AuthAdminGuard ]
			}
		])
	],
	declarations: [
		RequestApprovalComponent,
		AuthorityComponent,
		AuthorityDetailComponent
	],
	providers: [
		AuthAdminGuard,
		RequestApprovalService,
		AuthorityService
	]
})
export class AuthorityModule {
}
