export class HeaderMenu {
	public menu: Menu;
}

export class Menu {
	public items: Items[];
}

export class Items {
	public iconCssClass: string;
	public title: string;
	public command: string;
	public alias: string;
}
