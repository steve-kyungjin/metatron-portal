import {environment} from '../../../environments/environment';

export class EnvironmentUtil {

	public static isProductionMode(): boolean {
		return environment.production;
	}

	public static isNotProductionMode(): boolean {
		return environment.production === false;
	}
}
