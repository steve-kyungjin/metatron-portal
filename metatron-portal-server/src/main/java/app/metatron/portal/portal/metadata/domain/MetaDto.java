package app.metatron.portal.portal.metadata.domain;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * 메타 데이터 DTO
 */
public class MetaDto {

    @Setter
    @Getter
    @ApiModel("MetaDto.Subject")
    public static class Subject {
        private String id;

//        private String fqn;

        // 주제영역 분류기준
        private String criteriaId;

        // 영역 명 (영문)
        private String nmEn;

        // 영역 명 (한글)
        private String nmKr;

        // 설명
        @Size(min = 0, max = 3000)
        private String description;

        // 레벨구분
        private String level;

        private String parentId;

        private boolean delYn;
    }

    @Setter
    @Getter
    @ApiModel("MetaDto.System")
    public static class System {
        private String id;

        // 시스템 표준명
        private String stdNm;

        // 시스템 전체 명
        private String fullNm;

        // 설명
        private String description;

        // 레벨구분
        private String levelId;

        // 운영계/정보계 분류
        private String operTypeId;

        // DW 기준 연동 방향
        private String directionId;

        // 연계 목적 설명
        private String relPurpose;

        // 수집 IF 기술
        private String inMethod;

        // 최소 수집 주기
        private String inFrequency;

        // 수집 엔터티 수
        private Integer inEntityCnt;

        // 수집 용량/일
        private Double inSize;

        // 수집 용량 단위
        private String inSizeUnit;

        // 제공 IF 기술
        private String outMethod;

        // 최소 제공 주기
        private String outFrequency;

        // 제공 엔터티 수
        private Integer outEntityCnt;

        // 제공 용량/일
        private Double outSize;

        // 제공 용량 단위
        private String outSizeUnit;

        // 연계 시스템 관리 담당자
        private String workerId;

        // 연계 시스템 관리 담당자(지원)
        private String coworkerId;

        private String parentId;
    }

    @Setter
    @Getter
    @ApiModel("MetaDto.Table")
    public static class Table {

        private String id;

        // DB 테이블 물리명
        @NotNull
        private String physicalNm;

        // DB 테이블 논리명
        private String logicalNm;

        // 설명
        @Size(min=0, max=3000)
        private String description;

        // DB 테이블 관리 상태
        private String statusId;

        // 데이터 생성 특성 분류
        private String featureId;

        // 데이터 관리 계층(LAYER)
        private String layerId;

        // 최초 생성 시스템/모듈 명
        private String firstCreated;

        // 데이터 처리(변경) 주기
        private String cycleId;

        // 데이터 이력 관리 유형
        private String historyId;

        // 데이터 보관 기간
        private String retentionId;

        // fqn
        // physical db + physical table

        // 보안 통제 등급
        private String securityId;

        // 개인정보 식별가능 수준
        private String privacyId;

        // 표준 데이터 엔터티 ID
        private String stdEntityId;

        // 데이터베이스
//        @NotNull
//        private String databaseId;

        // DB 테이블 관리 담당자
        private String workerId;

        // subject relations
        private List<String> subjectIds;
    }

    @Setter
    @Getter
    @ApiModel("MetaDto.Column")
    public static class Column {

        private String id;

        // DB 컬럼 FQN
        // physical db + physical table + physical col

        // DB 컬럼 물리명
        @NotNull
        private String physicalNm;

        // DB 컬럼 논리명
        @Size(min = 0, max = 1000)
        private String logicalNm;

        // 설명
        @Size(min = 0, max = 3000)
        private String description;

        // 물리 데이터 유형
        private String dataType;

        // 물리 데이터 사이즈
        private String dataSize;

        // Primary Key 여부
        private Boolean primaryKey;

        // NULL 허용 여부
        private Boolean nullable;

        // Hadoop 파티션 KEY No
        private String hadoopPartitionKey;

        // Druid 컬럼 유형
        private String druidColumnId;

        // 참조 기준 정보 테이블
        private String refTable;

        // 참조 기준 정보 추출 SQL
        @Size(min = 0, max = 3000)
        private String refSql;

        // 개인정보 항목
        private String privacyId;

        // 개인정보 처리 유형
        private String privacyProcId;

        // 표준 데이터 속성 ID
        private String stdFieldId;

        // DB 테이블
//        @NotNull
//        private String tableId;
    }
}
