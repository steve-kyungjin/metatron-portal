/**
 * Environment context path ( baseUrl )
 *
 * @returns {string}
 */
import {environment} from '../environments/environment';

export function getBasePath(): string {
	return environment.contextPath;
}
