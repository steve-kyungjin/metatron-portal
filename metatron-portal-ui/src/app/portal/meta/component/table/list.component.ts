import {Component, ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../common/component/abstract.component';
import {MetaService} from '../../service/meta.service';
import {TranslateService} from 'ng2-translate';
import {CookieService} from 'ng2-cookies';
import {TableService} from '../../service/table.service';
import {DatabaseService} from '../../service/database.service';
import {Alert} from '../../../../common/util/alert-util';
import {ConnectLog} from '../../../management/log/value/connect';
import ActionType = ConnectLog.ActionType;

@Component({
	selector: '[table-list]',
	templateUrl: './list.component.html',
	host: {
		'[class.page-data-search]': 'true',
		'[class.type-fixed]': 'true'
	}
})
export class ListComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public isSubjectMode: boolean = true;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * constructor
	 *
	 * @param {ElementRef} elementRef
	 * @param {Injector} injector
	 * @param translateService
	 * @param tableService
	 * @param databaseService
	 * @param tableService
	 * @param databaseService
	 * @param metaService
	 * @param cookieService
	 */
	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				public tableService: TableService,
				public databaseService: DatabaseService,
				private metaService: MetaService,
				private cookieService: CookieService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		this.tagging(this.TaggingType.LIST, this.TaggingAction.VIEW, this.gnbService.permission.name);
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 트리 제목 선택 시
	 *
	 * @param $event
	 */
	public subjectSelect($event) {
		if ($event.type === 'CLASSIFICATION') {
			this.tableService.initialize();
			this.tableService.selected($event.value);
			this.tableService.getTable($event.id);
		} else if ($event.type === 'SUBJECT') {
			this.tableService.initialize();
			this.tableService.selected($event.value);
			this.tableService.getTable();
		} else if ($event.type === 'TABLE') {
			this.tableService.initialize();
			this.tableService.selected($event.value);
			this.tableService.getTable();
		} else {
			Alert.error(`${this.translateService.instant('COMMON.MESSAGE.ERROR', '알 수 없는 오류. 잠시후에 다시 시도해 주세요')}`);
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Protected Method
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
