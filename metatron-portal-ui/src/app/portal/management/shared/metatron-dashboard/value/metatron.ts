export namespace Metatron {

	// 선택된 대시보드 반환시
	export class SelectedDashboard {

		id: string;
		type: string;
		name: string;
		workbookId: string;

		constructor(id: string, type: string, name: string, workbookId: string) {
			this.id = id;
			this.type = type;
			this.name = name;
			this.workbookId = workbookId;
		}
	}

}
