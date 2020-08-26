import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Validate} from '../../../common/util/validate-util';
import {CookieService} from 'ng2-cookies';
import {CookieConstant} from '../../common/constant/cookie-constant';
import {Loading} from '../../../common/util/loading-util';

@Injectable()
export class CheckLoginGuard implements CanActivate {

	constructor(private cookieService: CookieService,
				private router: Router) {
	}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		if (!Validate.isEmpty(this.cookieService.get(CookieConstant.KEY.TOKEN))) {
			Loading.show();
			this.router.navigate([ '/' ]);
		}

		return true;
	}

}
