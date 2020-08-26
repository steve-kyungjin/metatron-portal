import {NgModule} from '@angular/core';
import {ManagementSharedModule} from '../../shared/management-shared.module';
import {SubjectModule} from '../../../meta/subject/page/subject.module';
import {RouterModule} from '@angular/router';
import {ListComponent as SubjectComponent} from '../../../meta/subject/page/component/list.component';
import {AuthAdminGuard} from '../../../common/guard/auth.admin.guard';
import {ListComponent as DictionaryComponent} from '../../../meta/dictionary/component/list.component';
import {DictionaryModule} from '../../../meta/dictionary/dictionary.module';

@NgModule({
	imports: [
		ManagementSharedModule,
		SubjectModule,
		DictionaryModule,
		RouterModule.forChild([
			{
				path: 'subject',
				component: SubjectComponent,
				canActivate: [
					AuthAdminGuard
				]
			},
			{
				path: 'dictionary',
				component: DictionaryComponent,
				canActivate: [
					AuthAdminGuard
				]
			}
		])
	],
	providers: [
		AuthAdminGuard
	]
})
export class TempModule {
}
