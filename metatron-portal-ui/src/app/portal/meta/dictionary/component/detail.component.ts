import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Meta} from '../../value/meta';
import {MetaService} from '../../service/meta.service';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {CommonConstant} from '../../../common/constant/common-constant';
import {Loading} from '../../../../common/util/loading-util';

@Component({
	selector: '[dictionary-detail]',
	templateUrl: './detail.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class DetailComponent extends AbstractComponent implements OnInit, OnDestroy {

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
	 * 데이터 표준 단어 사전
	 */
	public dictionary: Meta.Dictionary;

	/**
	 * 데이터 웨어하우스 데이터 표준 단어 사전 아이디
	 */
	@Input()
	public dictionaryId: string;

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
		this.getDictionary(this.dictionaryId);
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
	private getDictionary(id: string): void {

		Loading.show();

		this.metaService
			.getDictionary(id)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.dictionary = result.data.dictionary;
					this.tagging(this.TaggingType.DETAIL, this.TaggingAction.VIEW, this.dictionary.id, this.dictionary ? this.dictionary.nmEn === undefined || this.dictionary.nmEn.trim() === '' ? this.dictionary.nmKr : this.dictionary.nmKr + '(' + this.dictionary.nmEn + ')' : '');
				} else {
					this.dictionary = undefined;
				}

				Loading.hide();
			})
			.catch(() => {
				this.dictionary = undefined;
			});
	}

}
