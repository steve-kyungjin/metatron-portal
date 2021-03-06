import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../common/shared.module';
import {CommunityManagementComponent} from './component/management/community-management.component';
import {CommunityManagement2Component} from './component/management/community-management2.component';
import {CommunityService} from './service/community.service';
import {EditorModule} from '../../common/component/editor/editor.module';
import {CommunityListMainComponent} from './component/list/community-list-main.component';
import {CommunityListMain2Component} from './component/list/community-list-main2.component';
import {CommunityListCardComponent} from './component/list/community-list-card.component';
import {CommunityListDefaultComponent} from './component/list/community-list-default.component';
import {CommunityDetailComponent} from './component/detail/community-detail.component';
import {CommunityDetail2Component} from './component/detail/community-detail2.component';
import {FileModule} from '../common/file-upload/file.module';
import {CommunityCommentComponent} from './component/detail/community-comment.component';
import {UpdateSelectMenuGuard} from '../layout/guard/update-select-menu.guard';
import {UserSelectModule} from "../management/shared/popup/user-select/user-select.module";
import {UserService} from "../common/service/user.service";
import {CommunityLandingComponent} from "./component/landing/community-landing.component";
import {AuthenticationSettingsModule} from "../management/shared/authentication-settings/authentication-settings.module";
import {CommunityGuard} from "./service/community.guard";

@NgModule({
	imports: [
		SharedModule,
		UserSelectModule,
		AuthenticationSettingsModule,
		RouterModule.forChild([
			{
				// 랜딩
				path: '',
				component: CommunityLandingComponent,
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				// 등록
				path: ':slug/post/create',
				component: CommunityManagementComponent,
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				// 상세
				path: ':slug/post/:postId',
				component: CommunityDetailComponent,
				canActivate: [
					UpdateSelectMenuGuard,
					CommunityGuard
				]
			},
			{
				// 수정
				path: ':slug/post/:postId/edit',
				component: CommunityManagementComponent,
				canActivate: [
					UpdateSelectMenuGuard,
					CommunityGuard
				]
			},
			{
				// 신규목록
				path: 'mypage',
				component: CommunityListMain2Component,
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				// 신규Mypage등록
				path: 'mypage/create',
				component: CommunityManagement2Component,
				canActivate: [
					UpdateSelectMenuGuard
				]
			},
			{
				// 신규상세
				path: 'mypage/:postId',
				component: CommunityDetail2Component,
				canActivate: [
					UpdateSelectMenuGuard,
					CommunityGuard
				]
			},
			{
				// 수정
				path: 'mypage/post/:postId/edit',
				component: CommunityManagement2Component,
				canActivate: [
					UpdateSelectMenuGuard,
					CommunityGuard
				]
			},
			{
				// 목록
				path: ':slug',
				component: CommunityListMainComponent,
				canActivate: [
					UpdateSelectMenuGuard
				]
			}
		]),
		EditorModule,
		FileModule
	],
	declarations: [
		CommunityManagementComponent,
		CommunityManagement2Component,
		CommunityListMainComponent,
		CommunityListMain2Component,
		CommunityListCardComponent,
		CommunityListDefaultComponent,
		CommunityDetailComponent,
		CommunityDetail2Component,
		CommunityCommentComponent,
		CommunityLandingComponent
	],
	providers: [
		UserService,
		CommunityService,
		UpdateSelectMenuGuard,
		CommunityGuard
	]
})
export class CommunityModule {
}
