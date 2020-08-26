import {NgModule} from '@angular/core';
import {AnalysisAppListComponent} from './component/list/analysis-app-list.component';
import {RouterModule} from '@angular/router';
import {AnalysisAppDetailComponent} from './component/detail/analysis-app-detail.component';
import {AnalysisAppMyAppComponent} from './component/my-app/my-app.component';
import {SharedModule} from '../common/shared.module';
import {SwiperSlideModule} from '../../common/component/swiper-slide/swiper-slide.module';
import {ImageListModule} from '../../common/component/image-list/image-list.module';
import {AnalysisAppCategoryComponent} from './component/category/analysis-app-category.component';

@NgModule({
	imports: [
		SharedModule,
		SwiperSlideModule,
		ImageListModule,
		RouterModule.forChild([
			{
				path: '',
				component: AnalysisAppListComponent
			},
			{
				path: 'my-app',
				component: AnalysisAppMyAppComponent
			},
			{
				path: ':appId',
				component: AnalysisAppDetailComponent
			}
		])
	],
	declarations: [
		AnalysisAppListComponent,
		AnalysisAppDetailComponent,
		AnalysisAppMyAppComponent,
		AnalysisAppCategoryComponent
	]
})
export class AnalysisAppModule {
}
