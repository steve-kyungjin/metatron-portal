import {Injectable, Injector} from '@angular/core';
import {Loading} from '../../../common/util/loading-util';
import {AbstractService} from '../../common/service/abstract.service';
import {CommonConstant} from '../../common/constant/common-constant';
import {PagePermission} from '../../common/value/page-permission';
import {Indicator} from '../gnb/value/indicator';
import {Menu} from '../lnb/value/menu';
import {EnvironmentUtil} from '../../../common/util/environment-util';
import * as _ from 'lodash';
import {Ia} from '../../common/value/ia';

@Injectable()
export class LayoutService extends AbstractService {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Ia 코드 목록
	 */
	public iaCodes = new Ia.Codes();

	/**
	 * 메뉴
	 */
	public menus: Menu.Entity[] = [];

	/**
	 * 페이지별 퍼미션 정보
	 */
	public pagePermissionList: Array<PagePermission> = [];

	/**
	 * 페이지별 퍼미션 전체 정보
	 */
	public pagePermissionAllList: Array<PagePermission> = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected injector: Injector) {
		super(injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 메뉴 IA 조회
	 */
	public getMenu(): Promise<Menu.Result.List> {
		return this.get(`${this.environment.apiUrl}/ia/menu`);
	}

	/**
	 * 메뉴 목록 조회
	 */
	public getMenus(): Promise<boolean> {
		return this.getMenu()
			.then((result: Menu.Result.List) => {
				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.menus = result.data.menu;
					return true;
				} else {
					return false;
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > getMenus() > error`, error);
				return false;
			});
	}

	/**
	 * LNB 에서 사용하는 데이터 생성
	 *
	 * @returns {Promise<boolean>}
	 */
	public createDataSetUsedByLnb(): Promise<boolean> {

		Loading.show();

		return Promise
			.resolve()
			.then(() => {
				return this.getMenus();
			})
			.then(isCreatedMenuDataSetSuccess => {

				this.pagePermissionListInitialize();

				if (isCreatedMenuDataSetSuccess) {
					return this.createPagePermissionDataList(this.menus);
				}

				return isCreatedMenuDataSetSuccess;
			})
			.then(isSuccess => {

				Loading.hide();

				return isSuccess;
			})
			// 예외가 발생하는 경우 처리
			.catch(error => {

				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > LNB 에서 사용하는 데이터 생성`, error);

				Loading.hide();

				return false;
			});
	}

	/**
	 * URL 로 해당 페이지 퍼미션 정보 가져오기
	 *
	 * @param {string} pageUrl
	 * @returns {PagePermission}
	 */
	public getPagePermissionByPageUrl(pageUrl: string): PagePermission {

		const createPagePermissionObject = (pagePermissions: PagePermission[]): PagePermission => {
			return pagePermissions[ 0 ];
		};

		return createPagePermissionObject(this.findPagePermissionByPageUrl(pageUrl));
	}

	/**
	 * IA code 로 해당 페이지 퍼미션 정보 가져오기
	 *
	 * @param {string} id
	 * @returns {PagePermission}
	 */
	public getPagePermissionByIACode(id: string): PagePermission {

		const createPagePermissionObject = (pagePermissions: PagePermission[]): PagePermission => {
			return pagePermissions[ 0 ];
		};

		return createPagePermissionObject(this.findPagePermissionByIACode(id));
	}

	/**
	 * 페이지 퍼미션 목록 생성
	 *
	 * @param {Menu[]} menus
	 */
	public createPagePermissionDataList(menus: Menu.Entity[]): Promise<true | false> {
		return Promise
			.resolve()
			.then(() => {

				// 페이지별 퍼미션 목록 생성
				this.createPagePermissionList(menus);

				this.addManagementPage('그리드', '/view/sample/grid', '그리드', '샘플 > 그리드');
				this.addManagementPage('전체 서비스', '/view/site-map', '전체 서비스 보기입니다.', '전체 서비스');
				this.addManagementPage('리포트 관리', '/view/management/report-app/report', '리포트 메뉴에 노출되는 앱을 관리할 수 있습니다.', '관리자 메뉴 > 추천 리포트/앱 관리 > 리포트 관리');
				this.addManagementPage('리포트 카테고리 관리', '/view/management/report-app/category', '리포트 카테고리를 관리할 수 있습니다.', '관리자 메뉴 > 추천 리포트/앱 관리 > 리포트 카테고리 관리');
				this.addManagementPage('분석 앱 관리', '/view/management/analysis-app/app', '분석 앱 메뉴에 노출되는 앱을 관리할 수 있습니다.', '관리자 메뉴 > 추천 리포트/앱 관리 > 분석 앱 관리');
				this.addManagementPage('분석 앱 카테고리 관리', '/view/management/analysis-app/category', '분석 앱 카테고리를 관리할 수 있습니다.', '관리자 메뉴 > 추천 리포트/앱 관리 > 분석 앱 카테고리 관리');
				this.addManagementPage('권한 관리', '/view/management/authority', '생성된 그룹 별 권한을 관리할 수 있습니다.', '관리자 메뉴 > 사용자 관리 > 권한 관리');
				this.addManagementPage('권한 승인 관리', '/view/management/authority/request-approval', '앱 권한을 신청한 사용자 목록을 관리할 수 있습니다.', '관리자 메뉴 > 추천 리포트/앱 관리 > 권한 승인 관리');
				this.addManagementPage('사용자 조회', '/view/management/users', '메타트론 포털 사용자를 조회할 수 있습니다.', '관리자 메뉴 > 사용자 관리 > 사용자 조회');
				this.addManagementPage('그룹 관리', '/view/management/groups', '그룹을 생성하여 사용자를 관리할 수 있습니다.', '관리자 메뉴 > 사용자 관리 > 그룹 관리');
				this.addManagementPage('메뉴 관리', '/view/management/menu', '메타트론 포털에 대한 메뉴를 관리할 수 있습니다.', '관리자 메뉴 > 메뉴 관리 > 메뉴 관리');
				this.addManagementPage('앱 로그', '/view/management/log/app', '앱 로그를 확인할 수 있습니다.', '관리자 메뉴 > 사용자 로그 조회 > 앱 로그');
				this.addManagementPage('사용자 접속 로그', '/view/management/log/connect', '사용자 접속 로그를 확인할 수 있습니다.', '관리자 메뉴 > 사용자 로그 조회 > 사용자 접속 로그');

				this.addManagementPage('데이터 주제영역', '/view/management/metadata/subject', '메타데이터 관리메뉴 입니다.', '관리자 메뉴 > 메타데이터 관리 > 데이터 주제영역');
				this.addManagementPage('연계 시스템', '/view/management/metadata/system', '연계 시스템 관리메뉴 입니다.', '관리자 메뉴 > 메타데이터 관리 > 연계 시스템');
				this.addManagementPage('데이터 주제영역', '/view/management/metadata/temp/subject', '메타데이터 관리메뉴 입니다.', '관리자 메뉴 > 메타데이터 관리 > 데이터 주제영역(임시)');
				this.addManagementPage('데이터 표준 단어집', '/view/management/metadata/temp/dictionary', '메타데이터 관리메뉴 입니다.', '관리자 메뉴 > 메타데이터 관리 > 데이터 표준 단어집(임시)');

				if (EnvironmentUtil.isNotProductionMode()) {

					this.logger.debug(`======================================================================== 페이지 퍼미션 START ========================================================================`);
					this.pagePermissionList.forEach(pagePermission => this.logger.debug(`[${this[ '__proto__' ].constructor.name}] 페이지 퍼미션 > ${pagePermission.pageUrl} - ${pagePermission.permission}`));
					this.logger.debug(`======================================================================== 페이지 퍼미션 END ==========================================================================`);

					this.logger.debug(`========================================================================== 페이지 전체 퍼미션 START ========================================================================`);
					this.pagePermissionAllList.forEach(pagePermission => this.logger.debug(`[${this[ '__proto__' ].constructor.name}] 페이지 퍼미션 > ${pagePermission.pageUrl} - ${pagePermission.permission}`));
					this.logger.debug(`========================================================================== 페이지 전체 퍼미션 END ==========================================================================`);
				}

				return true;
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > createPagePermissionDataList() > error`, error);
				return false;
			});
	}

	/**
	 * 첫 번째 메뉴 Display flag 가 True 인지 검사
	 */
	public isFirstMenuDisplayFlagTrue(iaCode: string): boolean {
		return _.isUndefined(_.findKey(this.menus, { 'id': iaCode, 'display': true })) === false;
	}

	/**
	 * 메뉴 가져오기
	 *
	 * @param iaCode
	 */
	public getMenuByIaCode(iaCode: string): Menu.Entity | null {

		const menuIndex: string = _.findKey(this.menus, [ 'id', iaCode ]);

		if (_.isUndefined(menuIndex) === false) {
			return this.menus[ Number(menuIndex) ];
		}

		return null;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Protected Method
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 페이지 퍼미션 목록 생성
	 *
	 * @param menus
	 */
	private createPagePermissionList(menus: Menu.Entity[]) {
		menus.forEach(menu => this.menuTwoDepth(menu, this.menuOneDepth(menu)));
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 메타트론 메뉴가 아닌 경우
	 *
	 * @param menu
	 */
	private isNotMetaTronMenu(menu): boolean {
		return menu.id !== this.iaCodes.metaTronIaCode;
	}

	/**
	 * pageUrl로 페이지에 퍼미션 정보 찾기
	 *
	 * @param {string} pageUrl
	 * @returns {PagePermission[]}
	 */
	private findPagePermissionByPageUrl(pageUrl: string): PagePermission[] {
		return this.pagePermissionList
			.filter((pagePermission: PagePermission) => pagePermission.pageUrl === pageUrl);
	}

	/**
	 * IA code 로 퍼미션 정보 찾기
	 *
	 * @param {string} id
	 * @returns {PagePermission[]}
	 */
	private findPagePermissionByIACode(id: string): PagePermission[] {
		return this.pagePermissionAllList
			.filter((pagePermission: PagePermission) => pagePermission.id === id);
	}

	/**
	 * Create page permission data
	 *
	 * @param {PagePermission | null} parent
	 * @param menu
	 * @returns {PagePermission}
	 */
	private createPagePermissionData(parent: PagePermission | null, menu: any): PagePermission {

		if (menu.path) {
			menu.path =
				menu.path.startsWith('http', 0) || menu.path.startsWith('https', 0)
					? menu.path
						.replace(
							this.environment.apiUrl
								.replace(
									'/api',
									''
								)
							, ''
						)
					: menu.path
						.replace(
							this.environment.contextPath
							, ''
						);
		} else {
			menu.path = '';
		}

		return new PagePermission()
			.create(
				menu.id,
				menu.name,
				menu.path,
				menu.desc,
				menu.permission,
				parent,
				menu
			);
	}

	// noinspection JSUnusedLocalSymbols
	/**
	 * 페이지 퍼미션 정보 추가
	 *    - 권한 관리하지 않는 페이지를 등록해야 되는 경우
	 */
	private addPage(name: string, path: string, desc: string, indication: string = null): void {

		const pagePermission: PagePermission = this.createPagePermissionData(
			null,
			new Menu.Entity()
				.create(
					'',
					name,
					path,
					'EMPTY',
					desc
				)
		);

		pagePermission.indicator = new Indicator(
			pagePermission.name,
			pagePermission.description,
			[
				indication === null
					? pagePermission.name
					: indication
			]
		);

		this.pagePermissionList.push(pagePermission);
		this.pagePermissionAllList.push(pagePermission);
	}

	/**
	 * 관리 페이지 퍼미션 정보 추가
	 *
	 * @param name
	 * @param path
	 * @param desc
	 * @param indication
	 */
	private addManagementPage(name: string, path: string, desc: string, indication: string = null): void {

		const pagePermission: PagePermission = this.createPagePermissionData(
			null,
			new Menu.Entity()
				.create(
					this.iaCodes.managementIaCode,
					name,
					path,
					'SA',
					desc
				)
		);

		pagePermission.indicator = new Indicator(
			pagePermission.name,
			pagePermission.description,
			[
				indication === null
					? pagePermission.name
					: indication
			]
		);

		this.pagePermissionList.push(pagePermission);
		this.pagePermissionAllList.push(pagePermission);
	}

	/**
	 * 1 Depth
	 *
	 * @param menu
	 */
	private menuOneDepth(menu): PagePermission {

		const permission: PagePermission = this.createPagePermissionData(null, menu);

		permission.indicator
			= new Indicator(
			permission.name,
			permission.description,
			[ permission.name ]
		);

		if (menu.link === true) {
			if (this.isNotMetaTronMenu(menu)) {
				if (menu.display === true) {
					this.pagePermissionList.push(permission);
					this.pagePermissionAllList.push(permission);
				}
			}
		} else {
			if (this.isNotMetaTronMenu(menu)) {
				this.pagePermissionAllList.push(permission);
			}
		}

		return permission;
	}

	/**
	 * 2 Depth
	 *
	 * @param menu
	 * @param pagePermission
	 */
	private menuTwoDepth(menu, pagePermission): void {

		menu.children.forEach(menu => {

			const permission: PagePermission = this.createPagePermissionData(pagePermission, menu);

			permission.indicator
				= new Indicator(
				permission.name,
				permission.description,
				[
					permission.parent.name,
					permission.name
				]
			);

			if (menu.link === true) {
				if (menu.display === true) {
					this.pagePermissionList.push(permission);
				}
			}

			this.menuThreeDepth(menu, permission);
		});
	}

	/**
	 * 3 Depth
	 *
	 * @param children
	 * @param pagePermission
	 */
	private menuThreeDepth(children, pagePermission): void {

		if (children.id !== this.iaCodes.myAppSpaceAnalysisAppIaCode && children.id !== this.iaCodes.myAppSpaceReportAppIaCode) {
			children.children.forEach(menu => {

				const permission: PagePermission = this.createPagePermissionData(pagePermission, menu);

				permission.indicator
					= new Indicator(
					permission.name,
					permission.description,
					[
						permission.parent.parent.name,
						permission.parent.name,
						permission.name
					]
				);

				this.pagePermissionAllList.push(permission);

				if (menu.link === true) {
					if (menu.display === true) {
						if (_.isUndefined(menu.appType)) {
							this.pagePermissionList.push(permission);
						}
					}
				}
			})
		} else {

			children.children.forEach(menu => {

				const permission: PagePermission = this.createPagePermissionData(pagePermission, menu);

				permission.indicator
					= new Indicator(
					permission.name,
					permission.description,
					[
						permission.parent.parent.name,
						permission.parent.name,
						permission.name
					]
				);

				this.pagePermissionAllList.push(permission);
			});
		}
	}

	/**
	 * PagePermission 목록 초기화
	 */
	private pagePermissionListInitialize(): void {
		this.pagePermissionList = [];
		this.pagePermissionAllList = [];
	}

}
