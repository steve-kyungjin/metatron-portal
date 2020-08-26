import {Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractComponent} from '../../../portal/common/component/abstract.component';
import {SelectValue} from './select.value';
import {TranslateService} from "ng2-translate";

@Component({
	selector: '[common-select]',
	templateUrl: './select.component.html',
	host: {
		'(document:click)': 'onClick($event)'
	}
})
export class SelectComponent extends AbstractComponent implements OnInit, OnDestroy, OnChanges {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public DEFAULT_PLACEHOLDER: string = '선택해주세요.';

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Input('className')
	public className: string = '';

	@Input()
	public items: SelectValue[];

	@Input('placeholder')
	public placeholder: string = null;

	// 로딩중인지 여부
	@Input()
	public isLoading: boolean;

	// dimmed 처리 할 것인지 여부
	@Input()
	public dimmed: boolean = false;

	// 다중 선택 가능한지 여부
	@Input()
	public allowMultiSelect: boolean = false;

	// 전체 선택 기능
	@Input()
	public showAll: boolean = false;

	@Output()
	public beforeItemSelect: EventEmitter<SelectValue[]> = new EventEmitter();

	@Output()
	public itemSelect: EventEmitter<SelectValue> = new EventEmitter();

	@Output()
	public itemSelects: EventEmitter<SelectValue[]> = new EventEmitter();

	@Output()
	public listOpen: EventEmitter<boolean> = new EventEmitter();

	public isOpen: boolean = false;

	public uuid: string;

	private _selectedItem: SelectValue = null;

	private _selectedItems: SelectValue[] = [];

	public currentLabel: string;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				private translateService: TranslateService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	get selectedItem(): SelectValue {
		return this._selectedItem;
	}

	set selectedItem(value: SelectValue) {
		this._selectedItem = value;
	}

	get selectedItems(): SelectValue[] {
		return this._selectedItems;
	}

	set selectedItems(value: SelectValue[]) {
		this._selectedItems = value;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {
		this.uuid = this.generateUUID();
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();

		this.isOpen = false;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		for (let propName in changes) {
			if (propName === 'items') {
				if (this.items) {
					if (this.allowMultiSelect) {
						this.selectedItems = [];
					} else {
						this.selectedItem = null;
					}

					if (this.showAll) {

						let existAll = false;
						Array.from(this.items).find((value) => {
							if (value.value == 'ALL') {
								existAll = true;
								return true;
							} else {
								return false;
							}
						});

						if (!existAll) {
							this.items.splice(0, 0, new SelectValue(this.translateService.instant("COMMON.TOTAL"), 'ALL', true));
						}

						Array.from(this.items).forEach((value) => {
							if (value.checked) {
								if (this.allowMultiSelect) {
									this.selectedItems.push(value);
								} else {
									this.selectedItem = value;
								}
							}
						});

						if (this.allowMultiSelect) {
							if (!this.selectedItems.length) {
								this.selectedItems.push(this.items[ 0 ]);
							}
						} else {
							if (!this.selectedItem) {
								this.selectedItem = this.items[ 0 ];
							}
						}
					} else {
						Array.from(this.items).forEach((value) => {
							if (value.checked) {
								if (this.allowMultiSelect) {
									this.selectedItems.push(value);
								} else {
									this.selectedItem = value;
								}
							}
						});
					}

				}

				this.setCurrentLabel();
			}
		}

	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * Document click
	 *
	 * @param event
	 */
	public onClick(event) {
		if (!this.elementRef.nativeElement.contains(event.target)) {
			this.isOpen = false;
		}
	}

	/**
	 * select click
	 */
	public selectClick() {
		if (this.items.length > 0 || this.isLoading) {
			this.isOpen = !this.isOpen;
		}

		this.listOpen.emit(this.isOpen);
	}

	/**
	 * Item select
	 *
	 * @param {SelectValue} item
	 */
	public itemClick(item: SelectValue) {

		this.beforeItemSelect.emit(this.items);

		if (this.allowMultiSelect) {
			item.checked = !item.checked;

			if (this.showAll) {
				if (item.value == 'ALL') {
					Array.from(this.items).forEach((value) => {
						if (value.value != 'ALL') {
							value.checked = false;
						}
					});
				} else {
					this.items[ 0 ].checked = false;
				}
			}

			let selectedItems = [];
			Array.from(this.items).forEach((value) => {
				if (value.checked) {
					selectedItems.push(value);
				}
			});
			this.selectedItems = selectedItems;

			this.itemSelects.emit(this.selectedItems);
		} else {
			if (!this.selectedItem || this.selectedItem.value != item.value) {
				item.checked = true;
				this.selectedItem = item;
				this.itemSelect.emit(this.selectedItem);
			}

			this.isOpen = false;
		}

		this.setCurrentLabel();
	}

	/**
	 * Get selected item
	 *
	 * @returns {SelectValue}
	 */
	public getSelectedItem(): SelectValue {
		return this.selectedItem;
	}

	/**
	 * Get selected items
	 *
	 * @returns {SelectValue}
	 */
	public getSelectedItems(): SelectValue[] {
		return this.selectedItems;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * UUID 생성
	 * @returns {string}
	 */
	private generateUUID(): string {
		let d = new Date().getTime();
		let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			let r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	}

	/**
	 * set current label
	 */
	private setCurrentLabel() {

		if (this.allowMultiSelect) {
			if (this.selectedItems.length == 0) {
				this.currentLabel = this.placeholder ? this.placeholder : this.DEFAULT_PLACEHOLDER;
			} else if (this.selectedItems.length == 1) {
				this.currentLabel = this.selectedItems[ 0 ].label;
			} else {
				this.currentLabel = `${this.selectedItems.length} selected`;
			}
		} else {
			if (this.selectedItem) {
				this.currentLabel = this.selectedItem.label;
			} else {
				this.currentLabel = this.placeholder ? this.placeholder : this.DEFAULT_PLACEHOLDER;
			}
		}
	}

}
