import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../common/shared.module';
import {ListComponent as TableListComponent} from './component/table/list.component';
import {MetaService} from './service/meta.service';
import {TableDetailModule} from './table-detail/table-detail.module';
import {ColumnDetailModule} from './column-detail/column-detail.module';
import {ListComponent as DatabaseListComponent} from './component/database/list.component';
import {ListTreeModule} from '../../common/component/tree/list-tree.module';
import {TreeBlockComponent as DatabaseTreeBlockComponent} from './component/database/tree-block.component';
import {SystemListComponent} from './component/system/component/system-list.component';
import {SystemDetailComponent} from './component/system/component/system-detail.component';
import {GridModule} from '../../common/component/grid/grid.module';
import {SubjectContentComponent} from './component/table/subject/subject-content.component';
import {DatabaseTreeComponent} from './component/table/database/database-tree.component';
import {DatabaseContentComponent} from './component/table/database/database-content.component';
import {DatabaseService} from './service/database.service';
import {TableService} from './service/table.service';
import {DatabaseDetailModule} from './database-detail/database-detail.module';
import {ListComponent as SubjectComponent} from './subject/page/component/list.component';
import {ListComponent as DictionaryComponent} from './dictionary/component/list.component';
import {DictionaryModule} from './dictionary/dictionary.module';
import {SubjectTreeModule} from './subject/tree/subject-tree.module';

const ROUTE: Routes = [
	{
		path: '',
		redirectTo: 'table',
		pathMatch: 'full'
	},
	{
		path: 'table',
		component: TableListComponent
	},
	{
		path: 'subject',
		component: SubjectComponent
	},
	{
		path: 'database',
		component: DatabaseListComponent
	},
	{
		path: 'system',
		component: SystemListComponent
	},
	{
		path: 'dictionary',
		component: DictionaryComponent
	}
];

@NgModule({
	imports: [
		SharedModule,
		DatabaseDetailModule,
		TableDetailModule,
		ColumnDetailModule,
		GridModule,
		ListTreeModule,
		SubjectTreeModule,
		DictionaryModule,
		RouterModule.forChild(ROUTE)
	],
	declarations: [
		TableListComponent,
		DatabaseListComponent,
		DatabaseTreeBlockComponent,
		SystemListComponent,
		SystemDetailComponent,
		SubjectContentComponent,
		DatabaseTreeComponent,
		DatabaseContentComponent
	],
	providers: [
		MetaService,
		TableService,
		DatabaseService
	]
})
export class MetaModule {
}
