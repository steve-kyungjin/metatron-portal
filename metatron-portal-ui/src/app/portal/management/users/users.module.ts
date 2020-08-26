import {NgModule} from '@angular/core';
import {SharedModule} from '../../common/shared.module';
import {RouterModule} from '@angular/router';
import {UsersComponent} from './component/users.component';
import {DetailComponent} from './component/detail.component';
import {AuthAdminGuard} from '../../common/guard/auth.admin.guard';

@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild([
			{
				path: '',
				component: UsersComponent,
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
		UsersComponent,
		DetailComponent
	],
	providers: [
		AuthAdminGuard
	]
})
export class UsersModule {
}
