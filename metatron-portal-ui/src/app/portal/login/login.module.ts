import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './component/login.component';
import {SharedModule} from '../common/shared.module';
import {CheckLoginGuard} from './guard/check-login.guard';

@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild([
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full'
			},
			{
				path: 'login',
				component: LoginComponent,
				canActivate: [
					CheckLoginGuard
				]
			}
		])
	],
	declarations: [
		LoginComponent
	],
	providers: [
		CheckLoginGuard
	]
})
export class LoginModule {
}
