import {NgModule} from '@angular/core';
import {DialogService} from '../../common/component/dialog/dialog.service';
import {CookieService} from 'ng2-cookies';
import {LoginGuard} from '../login/guard/login.guard';
import {RoleService} from './service/role.service';
import {ProjectService} from '../project/service/project.service';
import {LayoutGuard} from '../layout/guard/layout.guard';
import {GnbService} from '../layout/gnb/service/gnb.service';
import {NGXLogger} from 'ngx-logger';
import {LayoutService} from '../layout/service/layout.service';
import {MetatronService} from './service/metatron.service';
import {SessionInfo} from './service/session-info.service';
import {CodeService} from './service/code.service';
import {QuickService} from '../layout/quick/service/quick.service';
import {GlobalSearchService} from '../global-search/service/global-search.service';
import {IaService} from './service/ia.service';
import {LnbService} from '../layout/lnb/service/lnb.service';
import {TaggingService} from "./service/tagging.service";
import {UserService} from './service/user.service';
import {LoginService} from '../login/service/login.service';

@NgModule({
	providers: [
		NGXLogger,
		SessionInfo,
		LoginService,
		MetatronService,
		CookieService,
		CodeService,
		GnbService,
		LoginGuard,
		LayoutService,
		LayoutGuard,
		RoleService,
		DialogService,
		QuickService,
		GlobalSearchService,
		ProjectService,
		UserService,
		IaService,
		LnbService,
		TaggingService
	]
})
export class SharedServiceModule {
}
