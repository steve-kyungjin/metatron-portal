import {CommonResult} from '../../common/value/result-value';

export class Auth {
	access_token: string;
	token_type: string;
	scope: string;
	metatron: MetatronToken;
}

export class MetatronToken {
	access_token: string;
	refresh_token: string;
	scope: string;
	token_type: string;
}

export class AuthResult extends CommonResult {
	// Data
	public data: Auth;
}
