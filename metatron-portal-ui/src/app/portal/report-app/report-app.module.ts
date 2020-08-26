import {NgModule} from '@angular/core';
import {ReportAppListComponent} from './component/list/report-app-list.component';
import {RouterModule} from '@angular/router';
import {ReportAppDetailComponent} from './component/detail/report-app-detail.component';
import {ReportAppMyAppComponent} from './component/my-app/my-app.component';
import {ImageListModule} from '../../common/component/image-list/image-list.module';
import {SharedModule} from '../common/shared.module';
import {SwiperSlideModule} from '../../common/component/swiper-slide/swiper-slide.module';
import {ReportAppCategoryComponent} from './component/category/report-app-category.component';

@NgModule({
	imports: [
		SharedModule,
		SwiperSlideModule,
		ImageListModule,
		RouterModule.forChild([
			{
				path: '',
				component: ReportAppListComponent
			},
			{
				path: 'my-app',
				component: ReportAppMyAppComponent
			},
			{
				path: ':appId',
				component: ReportAppDetailComponent
			}
		])
	],
	declarations: [
		ReportAppListComponent,
		ReportAppDetailComponent,
		ReportAppMyAppComponent,
		ReportAppCategoryComponent
	]
})
export class ReportAppModule {
}
