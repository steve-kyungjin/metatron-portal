import {Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {SelectVariableDefaultAreaComponent} from './select-variable-default-area.component';
import {SelectVariableCustomAreaComponent} from './select-variable-custom-area.component';

@Component({
	selector: '[select-variable]',
	templateUrl: './select-variable.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class SelectVariableComponent extends AbstractComponent implements OnInit, OnDestroy {

	private CLICK: string = 'click';

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
   | Private Variables
   |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@ViewChild('cancelEl')
	private cancelEl: ElementRef;

	@ViewChild('completeEl')
	private completeEl: ElementRef;

	@ViewChild('defaultVariableRadio01')
	private defaultVariableRadio01: ElementRef;

	@ViewChild('defaultVariableRadio02')
	private defaultVariableRadio02: ElementRef;

	@ViewChild('defaultArea')
	private defaultArea: SelectVariableDefaultAreaComponent;

	@ViewChild('customArea')
	private customArea: SelectVariableCustomAreaComponent;

	@Output('cancel')
	private onCancel = new EventEmitter();

	@Output('complete')
	private onComplete = new EventEmitter();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public defaultVariableMode: boolean = true;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		fromEvent(this.cancelEl.nativeElement, this.CLICK)
			.subscribe(() => {
				this.onCancel.emit();
			});
		fromEvent(this.completeEl.nativeElement, this.CLICK)
			.subscribe(() => {
				this.complete();
			});
		fromEvent(this.defaultVariableRadio01.nativeElement, this.CLICK)
			.subscribe(() => {
				this.defaultVariableMode = true;
			});
		fromEvent(this.defaultVariableRadio02.nativeElement, this.CLICK)
			.subscribe(() => {
				this.defaultVariableMode = false;
			});
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
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

	private complete() {
		this.onComplete.emit(this.isDefaultVariableMode() ? this.defaultArea.getVariable() : this.customArea.getVariable());
	}

	private isDefaultVariableMode(): boolean {
		return this.defaultVariableMode;
	}

}
