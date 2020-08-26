export class Indicator {

	public title: string = '';
	public description: string = '';
	public navigations: string[] = [];

	constructor(title: string, description: string, navigations: string[]) {
		this.title = title;
		this.description = description;
		this.navigations = navigations;
	}
}
