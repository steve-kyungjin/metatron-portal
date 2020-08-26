import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {Meta} from '../../../value/meta';
import {MetaService} from '../../../service/meta.service';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';

@Component({
	selector: '[system-detail]',
	templateUrl: './system-detail.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class SystemDetailComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 닫기
	 *
	 * @type {EventEmitter<Meta.Table>}
	 */
	@Output('onCancel')
	private oCancel: EventEmitter<any> = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 시스템
	 */
	public system: Meta.System;

	/**
	 * 데이터 웨어하우스 시스템 아이디
	 */
	@Input()
	public systemId: string;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param metaService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private metaService: MetaService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		this.getSystem(this.systemId);
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 닫기
	 */
	public cancel(): void {
		this.oCancel.emit();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 테이블 조회
	 *
	 * @param {string} id
	 */
	private getSystem(id: string): void {

		Loading.show();

		this.metaService
			.getSystem(id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.system = result.data.system;
					this.tagging(this.TaggingType.DETAIL, this.TaggingAction.VIEW, this.system.id, this.system ? this.system.stdNm === undefined || this.system.stdNm.trim() === '' ? this.system.fullNm : this.system.stdNm + ( this.system.fullNm === undefined ? '' : this.system.fullNm.trim() === '' ? '' : this.system.fullNm ) : '');
				}

				Loading.hide();
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] error`, error);
			});
	}
}
