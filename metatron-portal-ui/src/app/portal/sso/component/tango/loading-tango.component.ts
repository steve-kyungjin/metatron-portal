import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {CookieService} from 'ng2-cookies';
import {CookieConstant} from '../../../common/constant/cookie-constant';
import {CommonConstant} from '../../../common/constant/common-constant';
import {User} from '../../../common/value/user';
import {LoginService} from '../../../login/service/login.service';
import {Loading} from "../../../../common/util/loading-util";

@Component({
	selector: 'loading-tango',
	templateUrl: './loading-tango.component.html'
})
export class LoadingTangoComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public tokenId: string;

	public returnUrl: string;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private loginService: LoginService,
				private cookieService: CookieService) {

		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		super.ngOnInit();
		this.login();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public login(): void {
		Loading.show();

		this.subscriptions.push(
			this.activatedRoute
				.queryParams
				.subscribe(params => {

					const tokenId: string = params[ 'tokenId' ];
					this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > login() > tokenId`, tokenId);

					this.tokenId = tokenId;

					const returnUrl: string = params[ 'returnUrl' ];
					this.logger.debug(`[${this[ '__proto__' ].constructor.name}] > login() > returnUrl`, returnUrl);

					if (returnUrl) {
						this.returnUrl = returnUrl;
						this.cookieService.set(CookieConstant.KEY.RETURN_URL, returnUrl, null, '/');
					}
				})
		);

		this.loginService.verifyTango(this.tokenId).then(result => {
			if (CommonConstant.CODE.SUCCESS === result.loginUserStatus) {

				let user: User.Entity = result;
				user.orgGrpCd = user.orgId;
				// DT login and metatron login
				this.loginService.createSessionAndMetatronLogin(user, (resultCode) => {
					Loading.hide();
				});
			} else {
				Loading.hide();
				this.router.navigate(['view/user/login']);
			}
		}).catch(reason => {
			Loading.hide();
			this.router.navigate(['view/user/login']);
		});

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Protected Method
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
