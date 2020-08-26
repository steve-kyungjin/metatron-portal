import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {TranslateService} from 'ng2-translate';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import {RoleGroup} from '../../../common/value/role-group';
import {AuthorityService} from '../service/authority.service';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Loading} from '../../../../common/util/loading-util';
import {Authority} from '../value/authority.value';
import {PERMISSION_CODE} from '../../../common/value/page-permission';
import {LayoutService} from '../../../layout/service/layout.service';
import {Alert} from '../../../../common/util/alert-util';
import RoleGroupType = RoleGroup.RoleGroupType;

@Component({
	selector: 'authority-detail',
	templateUrl: 'authority-detail.component.html'
})
export class AuthorityDetailComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	 * 현재 그룹/조직 아이디
	 */
	public currentAuthorityId: string;

	/**
	 * 화면에서 쓰는 권한 데이터
	 */
	public authorityList: Authority.ViewEntity[];

	/**
	 * 권한 상세
	 * @type {Authority.Entity}
	 */
	public authority: Authority.Entity = new Authority.Entity();

	/**
	 * @type {RoleGroup.RoleGroupType}
	 */
	public ROLE_GROUP_TYPE_GENERAL = RoleGroupType.GENERAL;

	/**
	 * @type {RoleGroup.RoleGroupType}
	 */
	public ROLE_GROUP_TYPE_ORG = RoleGroupType.ORGANIZATION;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public layoutService: LayoutService,
				public translateService: TranslateService,
				private authorityService: AuthorityService) {
		super(elementRef, injector);

		this.createAuthorityList();

		this.subscriptions.push(
			this.activatedRoute
				.params
				.subscribe(params => {
					if (params[ 'id' ]) {
						this.currentAuthorityId = params[ 'id' ];
						this.getAuthorityDetail();
					}
				})
		);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/**
	 * 권한 변경 이벤트
	 * @param event
	 * @param authItem
	 */
	public permissionChange(event, authItem: Authority.ViewEntity) {
		authItem.selectedPermission = event.target.value;
	}

	/**
	 * 저장 클릭
	 */
	public saveClick() {
		Loading.show();
		this.logger.debug(this.authorityList);
		this.authorityService.saveAuthority(this.authority.id, this.authorityList).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				Alert.success(this.translateService.instant('COMMON.MESSAGE.CREATE', '등록되었습니다.'));
			} else {
				Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
			}
			Loading.hide();
		}).catch(reason => {
			Loading.hide();
		});
	}

	/**
	 * 목록 보기 클릭
	 */
	public listViewClick() {
		this.router.navigate([ 'view/management/authority' ]);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 화면 표시용 데이터 생성
	 */
	private createAuthorityList() {
		this.authorityList = [
			new Authority.ViewEntity('사용자메뉴', '커뮤니케이션', this.layoutService.iaCodes.communityIaCode, 4, [ { label: '없음', value: -1 }, {
				label: 'RO',
				value: PERMISSION_CODE.RO
			}, { label: 'RW', value: PERMISSION_CODE.RW }, { label: 'ADMIN', value: PERMISSION_CODE.SA } ]),
			new Authority.ViewEntity(null, '추천 리포트/앱', this.layoutService.iaCodes.appPlaceIaCode, 1, [ { label: '없음', value: -1 }, {
				label: 'RO',
				value: PERMISSION_CODE.RO
			}, { label: 'RW', value: PERMISSION_CODE.RW }, { label: 'ADMIN', value: PERMISSION_CODE.SA } ]),
			new Authority.ViewEntity(null, '메타데이터', this.layoutService.iaCodes.metadataIaCode, 1, [ { label: '없음', value: -1 }, {
				label: 'RO',
				value: PERMISSION_CODE.RO
			}, { label: 'RW', value: PERMISSION_CODE.RW }, { label: 'ADMIN', value: PERMISSION_CODE.SA } ]),
			new Authority.ViewEntity(null, '시스템도움말', this.layoutService.iaCodes.helpIaCode, 1, [ { label: '없음', value: -1 }, {
				label: 'RO',
				value: PERMISSION_CODE.RO
			} ]),

			new Authority.ViewEntity('기타', '메타트론', this.layoutService.iaCodes.metaTronIaCode, 2, [ { label: '없음', value: -1 }, {
				label: 'RO',
				value: PERMISSION_CODE.RO
			} ])
			// ,new Authority.ViewEntity(null, 'KNIME', this.layoutService.iaCodes.knimeIaCode, 1, [ { label: '없음', value: -1 }, {
			// 	label: 'RO',
			// 	value: PERMISSION_CODE.RO
			// }, { label: 'RW', value: PERMISSION_CODE.RW }, { label: 'ADMIN', value: PERMISSION_CODE.SA } ])
		]
	}

	/**
	 * 권한 상세 조회
	 */
	private getAuthorityDetail() {
		Loading.show();

		this.authorityService.getAuthorityDetail(this.currentAuthorityId).then(result => {
			if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
				this.authority = result.data.group;

				Array.from(this.authorityList).forEach(authItem => {
					let exist = false;
					Array.from(result.data.iaAndPermissionList).forEach(value => {
						if (authItem.iaCode == value.ia.id) {
							authItem.selectedPermission = value.permission;
							exist = true;
						}
					});

					if (!exist) {
						authItem.selectedPermission = -1;
					}
				});

			}
			Loading.hide();
		}).catch(reason => {
			Loading.hide();
		});
	}

}
