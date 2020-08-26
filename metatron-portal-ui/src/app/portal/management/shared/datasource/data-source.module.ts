import {NgModule} from '@angular/core';
import {SharedModule} from '../../../common/shared.module';
import {DataSourceComponent} from './component/data-source.component';
import {HiveComponent} from './component/hive/hive.component';
import {MysqlComponent} from './component/mysql/mysql.component';
import {DataSourceService} from './service/data-source.service';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		DataSourceComponent,
		HiveComponent,
		MysqlComponent
	],
	exports: [
		DataSourceComponent,
		HiveComponent,
		MysqlComponent
	],
	providers: [
		DataSourceService
	]
})
export class DataSourceModule {
}
