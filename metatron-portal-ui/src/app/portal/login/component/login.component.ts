import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../common/component/abstract.component';
import {CookieService} from 'ng2-cookies';
import {CookieConstant} from '../../common/constant/cookie-constant';
import {LoginService} from '../service/login.service';
import {TranslateService} from 'ng2-translate';
import {Validate} from '../../../common/util/validate-util';
import {CommonConstant} from '../../common/constant/common-constant';
import {Loading} from '../../../common/util/loading-util';
import {User} from '../../common/value/user';
import * as buildTimestamp from '../../../../../build-timestamp.json';

@Component({
	selector: 'login',
	templateUrl: './login.component.html'
})
export class LoginComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Private Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Protected Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Public Variables
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild('inputUserId') inputUserId: ElementRef;

	public userId: string;
	public password: string;
	public checkUserId: boolean;
	public loginError: boolean;
	public errorMsg: string;
	public disableInput: boolean;

	public appBuildDate: string = buildTimestamp['date'];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Constructor
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				protected cookieService: CookieService,
				protected loginService: LoginService,
				public translateService: TranslateService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Override Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.loginError = false;

		// 저장된 로그인 아이디
		const cookieUserId = this.cookieService.get(CookieConstant.KEY.REM_USER_ID);
		if (cookieUserId != null && cookieUserId != '') {
			this.checkUserId = true;
			this.userId = cookieUserId;
		} else {
			this.checkUserId = false;
		}
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Public Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public login() {

		if (!this.checkValid()) {
			return;
		}

		Loading.show();

		this.loginError = false;

		let user: User.Entity = new User.Entity();
		user.userId = this.userId;
		user.password = this.password;

		// dt login and metatron login
		this.loginService.createSessionAndMetatronLogin(user, (resultCode) => {
			if (resultCode == CommonConstant.CODE.RESULT_CODE.FAIL) {
				let errorMsgCode = 'LOGIN.FAIL.MSG.ETC';
				this.showErrorMsg(errorMsgCode);
			}

			// 로그인 아이디 저장
			if (this.checkUserId) {
				this.cookieService.set(CookieConstant.KEY.REM_USER_ID, this.userId.toUpperCase(), 9999, '/');
			} else {
				this.cookieService.delete(CookieConstant.KEY.REM_USER_ID, '/');
			}

			Loading.hide();
		});

		// // Tango SSO
		// this.loginService
		// 	.loginTango(this.userId.toUpperCase(), this.password)
		// 	.then(tangoData => {
        //
		// 		if (tangoData.loginUserStatus === 200) {
        //
		// 			let user: User.Entity = tangoData;
		// 			user.userId = this.userId.toUpperCase();
        //
		// 			// dt login and metatron login
		// 			this.loginService.createSessionAndMetatronLogin(user, true, (resultCode) => {
		// 				if (resultCode == CommonConstant.CODE.RESULT_CODE.FAIL) {
		// 					let errorMsgCode = 'LOGIN.FAIL.MSG.ETC';
		// 					this.showErrorMsg(errorMsgCode);
		// 				}
        //
		// 				// 로그인 아이디 저장
		// 				if (this.checkUserId) {
		// 					this.cookieService.set(CookieConstant.KEY.REM_USER_ID, this.userId.toUpperCase(), 9999, '/');
		// 				} else {
		// 					this.cookieService.delete(CookieConstant.KEY.REM_USER_ID, '/');
		// 				}
        //
		// 				Loading.hide();
		// 			});
			// 	} else {
			// 		this.inputUserId.nativeElement.focus();
			// 		this.password = '';
            //
			// 		// -1000 : 'ID 불일치';
			// 		// -1001 : '로그인 불가';
			// 		// -1002 : '계정 잠김';
			// 		// -1003 : '탈퇴회원';
			// 		// -1004 : '임시계정 기간 만료';
			// 		// -1005 : '장기 미사용자(180일)';
			// 		// -1006 : '단기 미사용자(90 일)';
			// 		// -1007 : '비밀번호 미변경(90일)';
			// 		// -1008 : '5회이상 비밀번호 오류';
			// 		// -1009 : '약관 미동의';
			// 		// -1010 : '시스템 권한 없음';
			// 		// -1011 : '비밀번호 불일치';
			// 		// etc :'알 수 없는 오류';
            //
			// 		let errorMsgCode;
			// 		if (tangoData.loginUserStatus <= -1000 && tangoData.loginUserStatus >= -1011) {
			// 			let disableInputCodes = [ -1002, -1004, -1005, -1006, -1007, -1008, -1009, -1010 ];
			// 			if (disableInputCodes.indexOf(tangoData.loginUserStatus) > -1) {
			// 				this.disableInput = true;
			// 			} else {
			// 				this.disableInput = false;
			// 			}
            //
			// 			errorMsgCode = 'LOGIN.FAIL.MSG.' + Math.abs(tangoData.loginUserStatus).toString();
			// 		} else {
			// 			errorMsgCode = 'LOGIN.FAIL.MSG.ETC';
			// 		}
            //
			// 		this.showErrorMsg(errorMsgCode);
            //
			// 		Loading.hide();
			// 	}
            //
			// })
			// .catch(reason => {
			// 	this.showErrorMsg('COMMON.MESSAGE.ERROR');
            //
			// 	Loading.hide();
			// });
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Protected Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	 | Private Method
	 |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private checkValid(): boolean {
		let result = true;

		let errorMsgCode;
		if (Validate.isEmpty(this.password)) {
			errorMsgCode = 'LOGIN.VALID.PASSWORD';
			result = false;
		}
		if (Validate.isEmpty(this.userId)) {
			errorMsgCode = 'LOGIN.VALID.ID';
			result = false;
		}

		if (!result) {
			this.showErrorMsg(errorMsgCode);
		}

		return result;
	}

	private showErrorMsg(errorMsgCode: string) {
		this.errorMsg = this.translateService.instant(errorMsgCode, '로그인 오류 메시지');
		this.loginError = true;
	}
}
