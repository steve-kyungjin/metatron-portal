import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../portal/common/component/abstract.component';
import {GridComponent} from '../../../../common/component/grid/grid.component';
import {header, SlickGridHeader} from '../../../../common/component/grid/grid.header';
import {GridOption} from '../../../../common/component/grid/grid.option';
import {CodemirrorComponent} from '../../../../common/component/codemirror/codemirror.component';

@Component({
	selector: 'example.grid',
	templateUrl: './example-grid.component.html'
})
export class ExampleGridComponent extends AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	private rows: any[] = [];

	public tabIndex: number;

	@ViewChild('grid')
	private grid: GridComponent;

	@ViewChild('editor1')
	private editor1: CodemirrorComponent;

	@ViewChild('editor2')
	private editor2: CodemirrorComponent;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

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
		this.tab0();
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

	public tab0(): void {

		this.tabIndex = 0;

		const headers: header[] = [];
		headers.push(new SlickGridHeader()
			.Id('id')
			.Name('id')
			.Field('id')
			.Behavior('select')
			.CssClass('cell-selection')
			.Width(100)
			.CannotTriggerInsert(true)
			.Resizable(true)
			.Unselectable(true)
			.Sortable(true)
			.build()
		);

		headers.push(new SlickGridHeader()
			.Id('name')
			.Name('Name')
			.Field('name')
			.Behavior('select')
			.CssClass('cell-selection')
			.Width(150)
			.CannotTriggerInsert(true)
			.Resizable(true)
			.Unselectable(true)
			.Sortable(true)
			.build()
		);

		headers.push(new SlickGridHeader()
			.Id('age')
			.Name('Age')
			.Field('age')
			.Behavior('select')
			.CssClass('cell-selection')
			.Width(150)
			.CannotTriggerInsert(true)
			.Resizable(true)
			.Unselectable(true)
			.Sortable(true)
			.build()
		);

		headers.push(new SlickGridHeader()
			.Id('column1')
			.Name('Column1')
			.Field('column1')
			.Behavior('select')
			.CssClass('cell-selection')
			.Width(200)
			.CannotTriggerInsert(true)
			.Resizable(true)
			.Unselectable(true)
			.Sortable(true)
			.build()
		);

		headers.push(new SlickGridHeader()
			.Id('column2')
			.Name('Column2')
			.Field('column2')
			.Behavior('select')
			.CssClass('cell-selection')
			.Width(400)
			.CannotTriggerInsert(true)
			.Resizable(true)
			.Unselectable(true)
			.Sortable(true)
			.build()
		);

		headers.push(new SlickGridHeader()
			.Id('column3')
			.Name('Column3')
			.Field('column3')
			.Behavior('select')
			.CssClass('cell-selection')
			.Width(300)
			.CannotTriggerInsert(true)
			.Resizable(true)
			.Unselectable(true)
			.Sortable(true)
			.build()
		);

		headers.push(new SlickGridHeader()
			.Id('column4')
			.Name('Column4')
			.Field('column4')
			.Behavior('select')
			.CssClass('cell-selection')
			.Width(300)
			.CannotTriggerInsert(true)
			.Resizable(true)
			.Unselectable(true)
			.Sortable(true)
			.build()
		);

		headers.push(new SlickGridHeader()
			.Id('column5')
			.Name('Column5')
			.Field('column5')
			.Behavior('select')
			.CssClass('cell-selection')
			.Width(300)
			.CannotTriggerInsert(true)
			.Resizable(true)
			.Unselectable(true)
			.Sortable(true)
			.build()
		);

		headers.push(new SlickGridHeader()
			.Id('column6')
			.Name('Column6')
			.Field('column6')
			.Behavior('select')
			.CssClass('cell-selection')
			.Width(300)
			.CannotTriggerInsert(true)
			.Resizable(true)
			.Unselectable(true)
			.Sortable(true)
			.build()
		);

		headers.push(new SlickGridHeader()
			.Id('column7')
			.Name('Column7')
			.Field('column7')
			.Behavior('select')
			.CssClass('cell-selection')
			.Width(300)
			.CannotTriggerInsert(true)
			.Resizable(true)
			.Unselectable(true)
			.Sortable(true)
			.build()
		);

		this.rows = [];
		for (let index = 0; index < 1000; index++) {
			const row = (this.rows[ index ] = {});
			row[ 'name' ] = 'name_';
			row[ 'age' ] = 'age_';
			row[ 'column1' ] = 'column1';
			row[ 'column2' ] = 'column2';
			row[ 'column3' ] = 'column3';
			row[ 'column3' ] = 'column4';
			row[ 'column3' ] = 'column5';
			row[ 'column3' ] = 'column6';
			row[ 'column3' ] = 'column7';
		}

		this.grid.create(headers, this.rows, new GridOption()
			.SyncColumnCellResize(true)
			.MultiColumnSort(true)
			.RowHeight(32)
			.FrozenColumn(2)
			.build()
		);
	}

	public tab1(): void {
		this.tabIndex = 1;
		setTimeout(() => {
			this.editor1.setText('<div grid-component #grid></div>');
		}, 100);
	}

	public tab2(): void {
		this.tabIndex = 2;
		setTimeout(() => {
			this.editor2.setText('const headers: header[] = [];\n' +
				'    headers.push(new SlickGridHeader()\n' +
				'      .Id(\'id\')\n' +
				'      .Name(\'id\')\n' +
				'      .Field(\'id\')\n' +
				'      .Behavior(\'select\')\n' +
				'      .CssClass(\'cell-selection\')\n' +
				'      .Width(100)\n' +
				'      .CannotTriggerInsert(true)\n' +
				'      .Resizable(true)\n' +
				'      .Unselectable(true)\n' +
				'      .Sortable(true)\n' +
				'      .GroupName(\'test1\')\n' +
				'      .build()\n' +
				'    );\n' +
				'\n' +
				'    headers.push(new SlickGridHeader()\n' +
				'      .Id(\'name\')\n' +
				'      .Name(\'Name\')\n' +
				'      .Field(\'name\')\n' +
				'      .Behavior(\'select\')\n' +
				'      .CssClass(\'cell-selection\')\n' +
				'      .Width(150)\n' +
				'      .CannotTriggerInsert(true)\n' +
				'      .Resizable(true)\n' +
				'      .Unselectable(true)\n' +
				'      .Sortable(true)\n' +
				'      .GroupName(\'TEST1\')\n' +
				'      .build()\n' +
				'    );\n' +
				'\n' +
				'    headers.push(new SlickGridHeader()\n' +
				'      .Id(\'age\')\n' +
				'      .Name(\'Age\')\n' +
				'      .Field(\'age\')\n' +
				'      .Behavior(\'select\')\n' +
				'      .CssClass(\'cell-selection\')\n' +
				'      .Width(150)\n' +
				'      .CannotTriggerInsert(true)\n' +
				'      .Resizable(true)\n' +
				'      .Unselectable(true)\n' +
				'      .Sortable(true)\n' +
				'      .GroupName(\'TEST1\')\n' +
				'      .build()\n' +
				'    );\n' +
				'\n' +
				'    headers.push(new SlickGridHeader()\n' +
				'      .Id(\'column1\')\n' +
				'      .Name(\'Column1\')\n' +
				'      .Field(\'column1\')\n' +
				'      .Behavior(\'select\')\n' +
				'      .CssClass(\'cell-selection\')\n' +
				'      .Width(200)\n' +
				'      .CannotTriggerInsert(true)\n' +
				'      .Resizable(true)\n' +
				'      .Unselectable(true)\n' +
				'      .Sortable(true)\n' +
				'      .GroupName(\'TEST2\')\n' +
				'      .build()\n' +
				'    );\n' +
				'\n' +
				'    headers.push(new SlickGridHeader()\n' +
				'      .Id(\'column2\')\n' +
				'      .Name(\'Column2\')\n' +
				'      .Field(\'column2\')\n' +
				'      .Behavior(\'select\')\n' +
				'      .CssClass(\'cell-selection\')\n' +
				'      .Width(400)\n' +
				'      .CannotTriggerInsert(true)\n' +
				'      .Resizable(true)\n' +
				'      .Unselectable(true)\n' +
				'      .Sortable(true)\n' +
				'      .GroupName(\'TEST2\')\n' +
				'      .build()\n' +
				'    );\n' +
				'\n' +
				'    headers.push(new SlickGridHeader()\n' +
				'      .Id(\'column3\')\n' +
				'      .Name(\'Column3\')\n' +
				'      .Field(\'column3\')\n' +
				'      .Behavior(\'select\')\n' +
				'      .CssClass(\'cell-selection\')\n' +
				'      .Width(300)\n' +
				'      .CannotTriggerInsert(true)\n' +
				'      .Resizable(true)\n' +
				'      .Unselectable(true)\n' +
				'      .Sortable(true)\n' +
				'      .GroupName(\'TEST2\')\n' +
				'      .build()\n' +
				'    );\n' +
				'\n' +
				'    this.rows = [];\n' +
				'    for (let index = 0; index < 1000; index++) {\n' +
				'      const row = (this.rows[index] = {});\n' +
				'      row[\'name\'] = \'name_\';\n' +
				'      row[\'age\'] = \'age_\';\n' +
				'      row[\'column1\'] = \'column1\';\n' +
				'      row[\'column2\'] = \'column2\';\n' +
				'      row[\'column3\'] = \'column3\';\n' +
				'    }\n' +
				'\n' +
				'    this.grid.create(headers, this.rows, new GridOption()\n' +
				'      .SyncColumnCellResize(true)\n' +
				'      .MultiColumnSort(true)\n' +
				'      .RowHeight(32)\n' +
				'      .ColumnGroup(true)\n' +
				'      .build()\n' +
				'    );');
		}, 100);

	}

}
