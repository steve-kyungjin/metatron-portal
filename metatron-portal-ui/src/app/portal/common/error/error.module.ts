import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared.module';
import {SharedServiceModule} from '../shared-service.module';

@NgModule({
	imports: [
		SharedModule,
		SharedServiceModule,
		RouterModule.forChild([
			{
				path: '',
				redirectTo: '404',
				pathMatch: 'full'
			},
			{
				path: '404',
				loadChildren: 'app/portal/common/error/404/_404.module#_404Module'
			},
			{
				path: '500',
				loadChildren: 'app/portal/common/error/500/_500.module#_500Module'
			},
			{
				path: '403',
				loadChildren: 'app/portal/common/error/403/_403.module#_403Module'
			}
		])
	]
})
export class ErrorModule {
}
