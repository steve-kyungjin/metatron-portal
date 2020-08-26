import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {QueryExpression} from '../value/query-expression';
import {DefaultVariable} from '../value/default-variable';
import {SelectValue} from '../../../../../common/component/select/select.value';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import {Alert} from '../../../../../common/util/alert-util';
import {TranslateService} from 'ng2-translate';

@Component({
	selector: '[default-area]',
	templateUrl: './select-variable-default-area.component.html',
	host: { '[class.default-area]': 'true' }
})
export class SelectVariableDefaultAreaComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild('nameEl')
	private readonly nameEl: ElementRef;

	@ViewChild('descriptionEl')
	private readonly descriptionEl: ElementRef;

	@ViewChild('argumentEl')
	private readonly argumentEl: ElementRef;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public queryExpression: QueryExpression;

	public readonly defaultVariableSelectValues: SelectValue[] = [
		new SelectValue(DefaultVariable.TEXT.toString(), DefaultVariable.TEXT, true),
		new SelectValue(DefaultVariable.NUMBER.toString(), DefaultVariable.NUMBER, false),
		new SelectValue(DefaultVariable.SELECT.toString(), DefaultVariable.SELECT, false),
		new SelectValue(DefaultVariable.ARRAY.toString(), DefaultVariable.ARRAY, false),
		new SelectValue(DefaultVariable.DATE.toString(), DefaultVariable.DATE, false),
		new SelectValue(DefaultVariable.DATETIME.toString(), DefaultVariable.DATETIME, false)
	];

	public isValidationDefaultVariable: boolean = false;
	public isNameValidation: boolean = false;
	public isDescriptionValidation: boolean = false;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private translateService: TranslateService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		fromEvent(this.nameEl.nativeElement, 'keyup')
			.switchMap(value => Observable.of(value))
			.debounceTime(200)
			.subscribe(() => {
				this.makePreviewVariable();
			});
		fromEvent(this.descriptionEl.nativeElement, 'keyup')
			.switchMap(value => Observable.of(value))
			.debounceTime(200)
			.subscribe(() => {
				this.makePreviewVariable();
			});
		fromEvent(this.argumentEl.nativeElement, 'keyup')
			.switchMap(value => Observable.of(value))
			.debounceTime(200)
			.subscribe(() => {
				this.makePreviewVariable();
			});

		this.queryExpression = QueryExpression.fromDefaultGeneral(DefaultVariable.TEXT);
		this.makePreviewVariable();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public getVariable() {

		if (this.validationDefaultVariable()) {
			this.isValidationDefaultVariable = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (this.validationName()) {
			this.isNameValidation = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		if (this.validationDescription()) {
			this.isDescriptionValidation = true;
			Alert.warning(this.translateService.instant('COMMON.MESSAGE.REQUIRED.ENTER.INFORMATION', '필수 정보를 입력해주세요.'));
			return;
		}

		return this.makePreviewVariable();
	}

	public changeDefaultVariable($event) {
		this.queryExpression.defaultVariable = $event.value;
		this.makePreviewVariable();
	}

	public makePreviewVariable(): string {
		const defaultVariable = this.queryExpression.defaultVariable;
		return this.makeExpression(
			this.queryExpression.type,
			defaultVariable,
			this.queryExpression.name,
			this.convertArgument(defaultVariable, _.cloneDeep(this.queryExpression.argument)),
			this.convertDescription(_.cloneDeep(this.queryExpression.description))
		);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Protected Method
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private validationDefaultVariable() {
		return (_.isNil(this.queryExpression.defaultVariable) || _.isEmpty(this.queryExpression.defaultVariable));
	}

	private validationName() {
		return (_.isNil(this.queryExpression.name) || _.isEmpty(this.queryExpression.name));
	}

	private validationDescription() {
		return (_.isNil(this.queryExpression.description) || _.isEmpty(this.queryExpression.description));
	}

	private convertDescription(description) {
		return `'${description}'`;
	}

	private makeExpression(type, defaultVariable, name, argument, description) {
		return this.queryExpression.ofGeneralExpressionString(type, defaultVariable, name, argument, description);
	}

	private convertArgument(defaultVariable, argument) {
		if (defaultVariable === DefaultVariable.SELECT || defaultVariable === DefaultVariable.ARRAY || defaultVariable === DefaultVariable.DATETIME) {
			const args = argument.split(',');
			if (args.length > 1) {
				argument = '';
				for (let i = 0; i < args.length; i++) {
					if (i !== args.length - 1) {
						argument += `'${args[ i ]}',`;
					} else {
						if (_.isEmpty(args[ i ])) {
							argument = argument.substring(0, argument.length - 1);
							continue;
						}
						argument += `'${args[ i ]}'`;
					}
				}
			}
		} else {
			argument = `'${argument}'`;
		}
		return argument;
	}

}
