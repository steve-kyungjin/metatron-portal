import {Injectable} from '@angular/core';

declare const document: any;

@Injectable()
export class ScriptService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private scripts: any = {};

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor() {
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 다중 JS 파일 로드
	 * @param {string} scripts
	 * @returns {Promise<any[]>}
	 */
	public load(...scripts: string[]) {
		const promises: any[] = [];
		scripts.forEach((script) => promises.push(this.loadScript(script)));
		return Promise.all(promises);
	}

	/**
	 * JS 파일 로드
	 * @param {string} path
	 * @returns {Promise<any>}
	 */
	public loadScript(path: string) {
		return new Promise((resolve, reject) => {
			//resolve if already loaded
			if (this.scripts[ path ] && this.scripts[ path ].loaded) {
				resolve({ script: path, loaded: true, status: 'Already Loaded' });
			}
			else {
				this.scripts[ path ] = { loaded: false };

				//load script
				let script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = path;
				if (script.readyState) {  //IE
					script.onreadystatechange = () => {
						if (script.readyState === 'loaded' || script.readyState === 'complete') {
							script.onreadystatechange = null;
							this.scripts[ path ].loaded = true;
							resolve({ script: path, loaded: true, status: 'Loaded' });
						}
					};
				} else {  //Others
					script.onload = () => {
						this.scripts[ path ].loaded = true;
						resolve({ script: path, loaded: true, status: 'Loaded' });
					};
				}
				script.onerror = (error: any) => resolve({ script: path, loaded: false, status: 'Loaded' });
				document.getElementsByTagName('head')[ 0 ].appendChild(script);
			}
		});
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
