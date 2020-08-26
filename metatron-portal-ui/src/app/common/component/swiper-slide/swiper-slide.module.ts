import {NgModule} from '@angular/core';
import {SharedModule} from '../../../portal/common/shared.module';
import {SwiperSlideComponent} from './swiper-slide.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		SwiperSlideComponent
	],
	exports: [
		SwiperSlideComponent
	]
})
export class SwiperSlideModule {
}
