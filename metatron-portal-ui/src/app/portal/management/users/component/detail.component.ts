import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {Loading} from '../../../../common/util/loading-util';
import {CommonConstant} from '../../../common/constant/common-constant';
import {User} from '../../../common/value/user';
import {Group} from '../../../common/value/group';
import {Ia} from '../../../common/value/ia';
import {UserService} from '../../../common/service/user.service';

@Component({
	selector: '[detail]',
	templateUrl: './detail.component.html',
	host: { '[class.page-management-user]': 'true' }
})
export class DetailComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	 * User
	 */
	public user: User.Entity = new User.Entity();

	/**
	 * IaAndPermissionListEntity
	 */
	public iaAndPermissionList: Ia.IaAndPermissionListEntity[] = [];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param userService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public userService: UserService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		this.subscriptions.push(
			this.activatedRoute
				.params
				.subscribe((params: { id }) => {
					this.getDetail(params.id);
				})
		);
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// noinspection JSMethodCanBeStatic
	/**
	 * Connect ia name permission with comma
	 *
	 * @param iaAndPermissionListEntityList
	 */
	public connectIaNamePermissionWithComma(iaAndPermissionListEntityList: Ia.IaAndPermissionListEntity[]) {
		return Ia.connectIaNamePermissionWithComma(iaAndPermissionListEntityList);
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * 그룹 목록에서 그룹 이름을 콤마로 연결
	 *
	 * @param {Group.Entity[]} groupList
	 * @returns {string}
	 */
	public connectGroupNmWithCommaInGroupList(groupList: Group.Entity[]): string {
		return Group.connectGroupNmWithCommaInGroupList(groupList);
	}

	/**
	 * 목록 화면 이동
	 */
	public goListPage(): void {
		// noinspection JSIgnoredPromiseFromCall
		this.router.navigate([ `view/management/users` ]);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 상세 조회
	 *
	 * @param {string} userId
	 */
	private getDetail(userId: string): void {

		Loading.show();

		this.userService
			.getDetail(userId)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.user = result.data.user;
					this.iaAndPermissionList = result.data.iaAndPermissionList;
				} else {

				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}

}

