import {CommonResult} from '../../common/value/result-value';
import {User} from '../../common/value/user';
import {Code} from '../../common/value/code';
import {ExtractSql} from '../../management/shared/extract/value/extract-app-process';

export namespace Meta {

	export class Subject {
		// 아이디
		id: string;
		// 주제영역 fqn
		fqn: string;
		// 주제영역 분류 기준
		criteria: Code.Entity;
		// 영역 명 (영문)
		nmEn: string;
		// 영역 명 (한글)
		nmKr: string;
		// 설명
		description: string;
		// 레벨구분
		level: string;
		// children
		children: (Subject)[];
		// 상위 주제영역명
		parentNm: string;
		// 상위 주제영역 아이디
		parentId: string;

		////////////////////////////////////////////////////
		// View
		////////////////////////////////////////////////////

		// 선택여부
		isSelected: boolean;
		// 최상위 서브젝트 인지
		isRootSubject: boolean;

		// 생성 화면에서 유효성 검사에 사용
		isCriteriaIdValidation: boolean;
		isNmKrValidation: boolean;
		isNmEnValidation: boolean;

		////////////////////////////////////////////////////////////////
		// Params
		////////////////////////////////////////////////////////////////

		criteriaId: string;
	}

	export class Table {
		// 아이디
		id: string;
		// DB 테이블 물리명
		physicalNm: string;
		// DB 테이블 논리명
		logicalNm: string;
		// 설명
		description: string;
		// DB 테이블 FQN
		fqn: string;
		// 관리 상태
		status: Code.Entity;
		// 데이터 생성 특성 분류
		feature: Code.Entity;
		// 데이터 관리 계층(LAYER)
		layer: Code.Entity;
		// 최초 생성 시스템/모듈 명
		firstCreated: string;
		// 데이터 처리(변경) 주기
		cycle: Code.Entity;
		// 데이터 이력 관리 유형
		history: Code.Entity;
		// 데이터 보관 기간
		retention: Code.Entity;
		// 보안 통제 등급
		security: Code.Entity;
		// 개인정보 식별가능 수준
		privacy: Code.Entity;
		// 표준 데이터 엔터티 ID
		stdEntityId: string;
		// DB 테이블 관리 담당자
		worker: User.Entity;
		// 컬럼 카운트
		columnCnt: number;
		// 개인정보 식별가능 수준 카운트
		privacyCnt: number;
		// 데이터베이스 물리 명
		databasePhysicalNm: string;
		// 데이터베이스 논리 명
		databaseLogicalNm: string;
		// 데이터베이스 아이디
		databaseId: string;
		//
		subjectFqnStr: string;

		////////////////////////////////////////////////////////////////
		// Params
		////////////////////////////////////////////////////////////////

		// DB 테이블 관리 상태
		statusId: string;
		// 데이터 생성 특성 분류
		featureId: string;
		// 데이터 관리 계층(LAYER)
		layerId: string;
		// 데이터 처리(변경) 주기
		cycleId: string;
		// 데이터 이력 관리 유형
		historyId: string;
		// 데이터 보관 기간
		retentionId: string;
		// 보안 통제 등급
		securityId: string;
		// 개인정보 식별가능 수준
		privacyId: string;
		// DB 테이블 관리 담당자
		workerId: string;
		// subject relations
		subjectIds: string[];

		/////////////////////////////////////////////
		// View
		/////////////////////////////////////////////

		statusNm: string;
		layerNm: string;
		cycleNm: string;
		retentionNm: string;
		securityNm: string;

		isPhysicalNmValidation: boolean;
		isSubjectListValidation: boolean;

	}

	export class Column {
		// 아이디
		id: string;
		// DB 컬럼 FQN
		fqn: string;
		// DB 컬럼 물리명
		physicalNm: string;
		// DB 컬럼 논리명
		logicalNm: string;
		// 설명
		description: string;
		// 물리 데이터 유형
		dataType: string;
		// 물리 데이터 사이즈
		dataSize: number;
		// Primary Key 여부
		primaryKey: boolean;
		// NULL 허용 여부
		nullable: boolean;
		// Hadoop 파티션 KEY No
		hadoopPartitionKey: string;
		// Druid 컬럼 유형
		druidColumn: Code.Entity;
		// 참조 기준 정보 테이블
		refTable: string;
		// 참조 기준 정보 추출 SQL
		refSql: string;
		// 개인정보 항목
		privacy: Code.Entity;
		// 개인정보 처리 유형
		privacyProc: Code.Entity;
		// 표준 데이터 속성 ID
		stdFieldId: string;
		//
		tableId: string;
		//
		tablePhysicalNm: string;
		//
		tableLogicalNm: string;
		//
		databasePhysicalNm: string;
		//
		databaseLogicalNm: string;
		// 포함 테이블 수
		relTableCnt: number;

		////////////////////////////////////////////////////////////////
		// Params
		////////////////////////////////////////////////////////////////

		// Druid 컬럼 유형
		druidColumnId: string;
		// 개인정보 항목
		privacyId: string;
		// 개인정보 처리 유형
		privacyProcId: string;

		/////////////////////////////////////////////
		// View
		/////////////////////////////////////////////

		nullableDelimiter: string;
		primaryKeyDelimiter: string;
		isPhysicalNmValidation: boolean;
	}

	export class Instance {
		// 아이디
		id: string;
		// DB 인스턴스 물리명
		physicalNm: string;
		// DB 인스턴스 논리명
		logicalNm: string;
		// 설명
		description: string;
		// DB 접속 정보
		connectionInfo: string;
		// 접속 프로토콜
		connectionProtocol: string;
		// DBMS 제품명
		productNm: string;
		// DBMS 제품 버전
		productVersion: string;
		// DBMS 공급업체명
		providerNm: string;
	}

	export class Database {
		// 아이디
		id: string;
		// 물리명
		physicalNm: string;
		// 논리명
		logicalNm: string;
		// 설명
		description: string;
		// 레이어
		layer: Code.Entity;
		// 데이터베이스 관리 목적
		purpose: Code.Entity;
		// 테이블 카운트
		tableCnt: number;
		// 인스턴스 아이디
		instanceId: string;
		// 인스턴스 물리명
		instancePhysicalNm: string;
		// 인스턴스 논리명
		instanceLogicalNm: string;
	}

	export class System {
		// 아아디
		id: string;
		// 시스템 표준명
		stdNm: string;
		// 시스템 전체 명
		fullNm: string;
		// 설명
		description: string;
		// 레벨구분
		level: Code.Entity;
		// 운영계/정보계 분류
		operType: Code.Entity;
		// DW 기준 연동 방향
		direction: Code.Entity;
		// 연계 목적 설명
		relPurpose: string;
		// 수집 IF 기술
		inMethod: string;
		// 최소 수집 주기
		inFrequency: string;
		// 수집 엔터티 수
		inEntityCnt: number;
		// 수집 용량/일
		inSize: number;
		// 수집 용량 단위
		inSizeUnit: string;
		// 제공 IF 기술
		outMethod: string;
		// 최소 제공 주기
		outFrequency: string;
		// 제공 용량 단위
		outSizeUnit: string;
		// 제공 엔터티 수
		outEntityCnt: number;
		// 제공 용량/일
		outSize: number;
		// 연계 시스템 관리 담당자
		worker: User.Entity;
		// 연계 시스템 관리 담당자(지원)
		coworker: User.Entity;
		// 상위 시스템 표준명
		parentStdNm: string;
		// 상위 시스템 전체 명
		parentFullNm: string;
		// 상위 시스템 아이디
		parentId: string;
		// 하위 시스템 카운트
		childrenCnt: number;

		/////////////////////////////////////////////
		// Params
		/////////////////////////////////////////////

		workerId: string;
		coworkerId: string;
		operTypeId: string;
		directionId: string;
		levelId: string;

		/////////////////////////////////////////////
		// View
		/////////////////////////////////////////////

		isStdNmValidation: boolean;
		isFullNmValidation: boolean;
	}

	export class Dictionary {
		id: string;
		// 단어(한글 기준)
		nmKr: string;
		// 단어(영문 명)
		nmEn: string;
		// 단어(영문 약어)
		abbr: string;
		// 단어 정의
		description: string;
		// 분류어 여부
		classifiYn: boolean;
		// 동음이의어 여부
		homonymYn: boolean;
		// 복합어 여부
		compoundYn: boolean;
		// 컬럼 생성 활용
		useColYn: boolean;
		// 비즈니스 용어 활용
		useBizYn: boolean;
		// 비즈니스 용어 카테고리
		category: Code.Entity;
	}

	// export class CustomVariable {
	// 	// 아이디
	// 	id: string;
	// 	// 이름
	// 	name: string;
	// 	// 설명
	// 	description: string;
	// 	// 쿼리
	// 	sqlTxt: string;
	// 	// 검색키
	// 	searchKey: string;
	//
	// 	/////////////////////////////////////////////
	// 	// Params
	// 	/////////////////////////////////////////////
	//
	// 	dataSourceId: string;
	// }

	export namespace Result {

		export namespace Subject {

			export class RootList extends CommonResult {
				data: {
					subjectRootList: (Meta.Subject)[];
				}
			}

			export class ListById extends CommonResult {
				data: {
					subject: Meta.Subject;
				}
			}

			export class TableList extends CommonResult {
				data: {
					tableList: {
						content: (Meta.Table)[];
						last: boolean;
						totalPages: number;
						totalElements: number;
						size: number;
						number: number;
						first: boolean;
						numberOfElements: number;
					};
				}
			}

			export class List extends CommonResult {
				data: {
					subjectList: {
						content: (Meta.Subject)[];
						last: boolean;
						totalPages: number;
						totalElements: number;
						size: number;
						number: number;
						first: boolean;
						numberOfElements: number;
					}
				}
			}

			export class entity extends CommonResult {
				data: {
					subject: Meta.Subject;
				}
			}

		}

		export class Table extends CommonResult {
			data: {
				table: Meta.Table;
				subjectList: Meta.Subject[];
				columnList: (Meta.Column)[];
			}
		}

		export class Column extends CommonResult {
			data: {
				column: Meta.Column;
				tableList: {
					content: (Meta.Table)[];
					last: boolean;
					totalPages: number;
					totalElements: number;
					size: number;
					number: number;
					first: boolean;
					numberOfElements: number;
				}
			}
		}

		export class InstanceList extends CommonResult {
			data: {
				instanceList: (Meta.Instance)[];
			}
		}

		export namespace Database {

			export class Detail extends CommonResult {
				data: {
					database: Meta.Database;
				}
			}

			export class List extends CommonResult {
				data: {
					databaseList: {
						content: (Meta.Database)[];
						last: boolean;
						totalPages: number;
						totalElements: number;
						size: number;
						number: number;
						first: boolean;
						numberOfElements: number;
					};
				}
			}

			export class TableList extends Meta.Result.Subject.TableList {

			}

		}

		export class System extends CommonResult {
			data: {
				system: Meta.System;
			}
		}

		export class SystemList extends CommonResult {
			data: {
				systemList: {
					content: (Meta.System)[];
					last: boolean;
					totalPages: number;
					totalElements: number;
					size: number;
					number: number;
					first: boolean;
					numberOfElements: number;
				}
			}
		}

		export class ResultQuery extends CommonResult {
			data: {
				queryResult: {
					headList?: (string)[] | null;
					resultList?: (any)[] | null;
				}
			};
		}

		export namespace Dictionary {

			export class List extends CommonResult {
				data: {
					dictionaryList: {
						content: (Meta.Dictionary)[];
						last: boolean;
						totalPages: number;
						totalElements: number;
						size: number;
						number: number;
						first: boolean;
						numberOfElements: number;
					}
				}
			}

			export class Entity extends CommonResult {
				data: {
					dictionary: Meta.Dictionary;
				}
			}

		}

	}

	////////////////////////////////////////////////////
	// View
	////////////////////////////////////////////////////

	export enum Target {
		// 전체
		ALL = <any>'ALL',
		// 물리
		PHYSICAL = <any>'PHYSICAL',
		// 논리
		LOGICAL = <any>'LOGICAL'
	}

	export enum SystemTarget {
		// 전체
		ALL = <any>'ALL',
		// 시스템 표준명
		STD = <any>'STD',
		// 시스템 전체명
		FULL = <any>'FULL'
	}

}
