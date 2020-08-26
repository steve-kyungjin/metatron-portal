import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
	selector: '[help-layer]',
	templateUrl: './help-layer.component.html',
	host: { '[class.layer-help]': 'true' }
})
export class HelpLayerComponent implements OnInit {

	@Output()
	private onClose = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	public close() {
		this.onClose.emit();
	}

}
