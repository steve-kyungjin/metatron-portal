export namespace Help {

	export class Entity {

		public title: string = '';
		public description: string = '';
		public files: string[];

		public selected: boolean;

		constructor(title: string, description: string, files: string[] = [], selected: boolean = false) {
			this.title = title;
			this.description = description;
			this.files = files;
			this.selected = selected;
		}
	}
}

