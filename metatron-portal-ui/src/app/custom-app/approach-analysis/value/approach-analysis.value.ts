import {CommonResult} from '../../../portal/common/value/result-value';

export namespace ApproachAnalysis {
	export class Entity {

		// 날짜
		public eventTime: string;
		// 건물코드
		public blcCd: string;
		// 건물이름
		public bldNm: string;
		// 세대수
		public gdskHousCnt: number;
		// 가용유무
		public shspdAvailYn: string;
		// 인터넷회선수, 가입자수
		public shspdInetLnCnt: number;
		// 침투율
		public infiltrationRate: number;
		// 유무선 결합율
		public summationRate: number;
		// 초고속중 유무선 결합건
		public shspdWirwlCombCnt: number;
		// 비가용
		public nonAvailability: number;
		// 가용
		public availability: number;

		// 가용세대수
		public shspdAvailCnt: number;
		// 가용률
		public shspdInetLnRate: number;
		// 인구수
		public populationCnt: number;
		// 계산식에 사용하는 세대수
		public maxGenCnt: number;
		// 공통주택 가용세대수
		public multihouseShspdAvailCnt: number;
		// 공동주택 가용율
		public multihouseValue: number;
		// 일반주택 가용세대수
		public generalhouseShspdAvailCnt: number;
		// 일반주택 가용율
		public generalhouseValue: number;

		// T판매 초고속인터넷 세대수
		public tshspdInetLnCnt: number;
		// B판매 초고속인터넷 세대수
		public bshspdInetLnCnt: number;
		// T판매 유/무선 결합건
		public tshspdWrwlCombCnt: number;
		// B판매 유/무선 결합건
		public bshspdWrwlCombCnt: number;

		// 공동주택 초고속 인터넷 세대수
		public multihouseShspdInetLnCnt: number;
		// 공동주택 T판매 초고속인터넷 세대수
		public multihouseTShspdInetLnCnt: number;
		// 공동주택 B판매 초고속인터넷 세대수
		public multihouseBShspdInetLnCnt: number;
		// 공동주택 T판매 유/무선 결합건
		public multihouseTShspdWrwlCombCnt: number;
		// 공동주택 B판매 유/무선 결합건
		public multihouseBShspdWrwlCombCnt: number;

		// 공동주택 침투율
		public multihouseInfiltrationRate: number;
		// 공동주택 B 침투율
		public multihouseBInfiltrationRate: number;
		// 공동주택 T 침투율
		public multihouseTInfiltrationRate: number;

		// 일반주택 초고속 인터넷 세대수
		public generalhouseShspdInetLnCnt: number;
		// 일반주택 T판매 초고속인터넷 세대수
		public generalhouseTShspdInetLnCnt: number;
		// 일반주택 B판매 초고속인터넷 세대수
		public generalhouseBShspdInetLnCnt: number;
		// 일반주택 T판매 유/무선 결합건
		public generalhouseTShspdWrwlCombCnt: number;
		// 일반주택 B판매 유/무선 결합건
		public generalhouseBShspdWrwlCombCnt: number;

		// 일반주택 침투율
		public generalhouseInfiltrationRate: number;
		// 일반주택 B 침투율
		public generalhouseBInfiltrationRate: number;
		// 일반주택 T 침투율
		public generalhouseTInfiltrationRate: number;

		// 공동주택 결합율
		public multihouseSummationRate: number;
		// 공동주택 B 결합율
		public multihouseBSummationRate: number;
		// 공동주택 T 결합율
		public multihouseTSummationRate: number;
		// 일반주택 결합율
		public generalhouseSummationRate: number;
		// 일반주택 B 결합율
		public generalhouseBSummationRate: number;
		// 일반주택 T 침투율
		public generalhouseTSummationRate: number;

		// 공동주택 세대수
		public multihouseMaxGenCnt: number;
		// 일반주택 세대수
		public generalhouseMaxGenCnt: number;

		public label: string;
		public value: number;
	}

	export class Building {
		// zip
		public zip: string;
		// 건물코드
		public blcCd: string;
		// 건물명
		public bldNm: string;
		// 건물유형
		public plotClNm: string;
		// 세대수
		public genCnt: number;
		// 평균세대수
		public gdskHousCnt: number;
		// 건축물대장세대수
		public bldRegiHousCnt: number;
		// 인구수
		public populationCnt: number;
		// 초고속가용여부
		public shspdAvailYn: string;
		// 초고속회선수
		public shspdInetLnCnt: number;
		// 초고속중 유/무선결합건
		public shspdWirwlCombCnt: number;
		// 침투율
		public infiltrationRate: number;
		// 유무선 결합률
		public summationRate: number;
		//비가용로그 조회수
		public navailBrwsCnt: number;
		// 도로명주소
		public stNmDtlAddr: string;
		// 지번주소
		public stNmLotnAddr: string;
		// 계산식에 사용하는 세대수
		public maxGenCnt: number;
		//  주택유형
		public housTypNm: string;
		// 동
		public ldongNm: string;
		// 군 구
		public ctGunGuNm: string;
		// 시 도
		public ctPvcNm: string;
		// 번지유형코드
		public houseNumTypCd: string;
		// 메인번지내용
		public mainHouseNumCtt: string;
		// 서브번지내용
		public subHouseNumCtt: string;
		// 가용건물구분코드명
		public availBldUsgCdNm: string;
		// 가용건물구분코드
		public availBldUsgCd: string;
		// 가용연도
		public aplyStrdYr: string;
		// B2B 고객수
		public b2bCustCnt: number;

		// B판매 초고속인터넷 세대수
		public bshspdInetLnCnt: number;
		// T판매 초고속인터넷 세대수
		public tshspdInetLnCnt: number;
		// B판매 유/무선 결합건
		public bshspdWrwlCombCnt: number;
		// T판매 유/무선 결합건
		public tshspdWrwlCombCnt: number;

		// B 판매 침투율
		public binfiltrationRate: number;
		// T 판매 침투율
		public tinfiltrationRate: number;

		// B판매 결합률
		public bsummationRate: number;
		// T판매 결합률
		public tsummationRate: number;
	}

	export class Coverage {
		// 라벨 -- 사업명
		public label: string;
		// 계산식에 사용하는 세대수
		public maxGenCnt: number;
		// 침투율
		public infiltrationRate: number;
		// B판매 침투율
		public binfiltrationRate: number;
		// T판매 침투율
		public tinfiltrationRate: number;
		// 초고속 인터넷 세대수
		public shspdInetLnCnt: number;
		// T판매 초고속인터넷 세대수
		public tshspdInetLnCnt: number;
		// B판매 초고속인터넷 세대수
		public bshspdInetLnCnt: number;

		public isTotal: boolean;
	}

	export class List {
		// Total 추이
		public totalList: ApproachAnalysis.Entity[];
		// 가용률
		public shspdInetLnRateList: ApproachAnalysis.Entity[];
		// 침투율
		public infiltrationRateList: ApproachAnalysis.Entity[];
		// 결합율
		public summationRateList: ApproachAnalysis.Entity[];
		// 비가용조회
		public nonAvailabilityList: ApproachAnalysis.Entity[];
		// 인구증가추이
		public bldUnitRlSvcList: ApproachAnalysis.Entity[];
		// 커버리지
		public coverage: ApproachAnalysis.Coverage[];
	}

	export class ListResult extends CommonResult {
		public data: ApproachAnalysis.List;
	}

	export class BuildingList {
		// 건물 목록
		public buildingList: ApproachAnalysis.Building[];
	}

	export class BuildingListResult extends CommonResult {
		public data: ApproachAnalysis.BuildingList;
	}
}

