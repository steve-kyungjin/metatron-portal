import {NgModule} from '@angular/core';
import {ManagementSharedModule} from '../shared/management-shared.module';
import {RouterModule} from '@angular/router';
import {AuthAdminGuard} from '../../common/guard/auth.admin.guard';
import {ListComponent as SubjectComponent} from './component/subject/list.component';
import {CreateOrUpdateModule as MetaSubjectCreateOrUpdateModule} from '../../meta/subject/create-or-update/create-or-update.module';
import {ListComponent as SystemComponent} from './component/system/list.component';
import {MetaService} from '../../meta/service/meta.service';
import {CreateOrUpdateModule as MetaSystemCreateOrUpdateModule} from '../../meta/system/create-or-update/create-or-update.module';

@NgModule({
	imports: [
		ManagementSharedModule,
		MetaSubjectCreateOrUpdateModule,
		MetaSystemCreateOrUpdateModule,
		RouterModule.forChild([
			{
				path: 'temp',
				loadChildren: 'app/portal/management/metadata/temp/temp.module#TempModule'
			},
			{
				path: 'subject',
				component: SubjectComponent,
				canActivate: [
					AuthAdminGuard
				]
			},
			{
				path: 'system',
				component: SystemComponent,
				canActivate: [
					AuthAdminGuard
				]
			}
		])
	],
	declarations: [
		SubjectComponent,
		SystemComponent
	],
	providers: [
		AuthAdminGuard,
		MetaService
	]
})
export class MetadataModule {
}
