import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {PagePermission} from '../../common/value/page-permission';
import {LayoutService} from '../service/layout.service';
import {LnbService} from '../lnb/service/lnb.service';

@Injectable()
export class UpdateSelectMenuGuard implements CanActivate {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private index = 0;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(private lnbService: LnbService,
				private layoutService: LayoutService) {
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		let url: string = state.url;
		const questionMarkIndex: number = url.indexOf(`?`);

		if (questionMarkIndex > -1) {
			url = url.substring(0, questionMarkIndex);
		}

		this.index = url.split(`/`).length;
		this.getPermission(url);

		return true;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private getPermission(url: string): PagePermission {

		if (url === '') {
			this.lnbService.selectedMenuIaCode = '';
			return;
		}

		const pagePermission: PagePermission = this.layoutService.getPagePermissionByPageUrl(url);

		if (_.isUndefined(pagePermission)) {

			if (url === '/view/intro') {
				this.lnbService.selectedMenuIaCode = this.layoutService.iaCodes.introIaCode;
				return;
			}

			this.index--;
			const urls: string[] = url.split(`/`);
			let urlParam: string = '';

			for (let index = 1; index < this.index; index++) {
				urlParam += `/${urls[ index ]}`;
			}

			this.getPermission(urlParam)
		}

		if (_.isUndefined(pagePermission) === false) {
			if (pagePermission.parent === null) {
				this.lnbService.selectedMenuIaCode = pagePermission.id;
			} else if (pagePermission.parent.parent === null) {
				this.lnbService.selectedMenuIaCode = pagePermission.parent.id;
			} else if (pagePermission.parent.parent.parent === null) {
				this.lnbService.selectedMenuIaCode = pagePermission.parent.parent.id;
			}
		}
	}

}
