package app.metatron.portal.portal.metadata.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;

/**
 * 메타 컬럼
 */
@Entity
@Table(name = "mp_md_column", indexes = {
        @Index(name = "idx_mp_md_column_physical_nm",  columnList="physicalNm", unique = false),
        @Index(name = "idx_mp_md_column_physical_nm_table_id",  columnList="physicalNm, table_id", unique = false)
})
public class MetaColumnEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    // DB 컬럼 FQN
    @Column
    private String fqn;

    // DB 컬럼 물리명
    @Column
    private String physicalNm;

    // DB 컬럼 논리명
    @Column(length = 1000)
    private String logicalNm;

    // 설명
    @Column(length = 3000)
    private String description;

    // 물리 데이터 유형
    @Column
    private String dataType;

    // 물리 데이터 사이즈
    @Column
    private String dataSize;

    // Primary Key 여부
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean primaryKey;

    // NULL 허용 여부
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean nullable;

    // Hadoop 파티션 KEY No
    @Column
    private String hadoopPartitionKey;

    // Druid 컬럼 유형
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "druid_col_type_id")
    private CodeEntity druidColumn;

    // 참조 기준 정보 테이블
    @Column
    private String refTable;

    // 참조 기준 정보 추출 SQL
    @Column(length = 3000)
    private String refSql;

    // 개인정보 항목
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "privacy_id")
    private CodeEntity privacy;

    // 개인정보 처리 유형
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "privacy_proc_id")
    private CodeEntity privacyProc;

    // 표준 데이터 속성 ID
    @Column
    private String stdFieldId;

    // DB 테이블
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "table_id")
    private MetaTableEntity table;

    /**
     * 삭제 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean delYn;

    public Boolean getDelYn() {
        return delYn;
    }

    public void setDelYn(Boolean delYn) {
        this.delYn = delYn;
    }

    /**
     * 동일 물리명을 가지는 컬럼 참조 테이블 수
     */
    @Transient
    private int relTableCnt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFqn() {
        return fqn;
    }

    public void setFqn(String fqn) {
        this.fqn = fqn;
    }

    public String getPhysicalNm() {
        return physicalNm;
    }

    public void setPhysicalNm(String physicalNm) {
        this.physicalNm = physicalNm;
    }

    public String getLogicalNm() {
        return logicalNm;
    }

    public void setLogicalNm(String logicalNm) {
        this.logicalNm = logicalNm;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getDataSize() {
        return dataSize;
    }

    public void setDataSize(String dataSize) {
        this.dataSize = dataSize;
    }

    public Boolean getPrimaryKey() {
        return primaryKey;
    }

    public void setPrimaryKey(Boolean primaryKey) {
        this.primaryKey = primaryKey;
    }

    public Boolean getNullable() {
        return nullable;
    }

    public void setNullable(Boolean nullable) {
        this.nullable = nullable;
    }

    public String getHadoopPartitionKey() {
        return hadoopPartitionKey;
    }

    public void setHadoopPartitionKey(String hadoopPartitionKey) {
        this.hadoopPartitionKey = hadoopPartitionKey;
    }

    public String getRefTable() {
        return refTable;
    }

    public void setRefTable(String refTable) {
        this.refTable = refTable;
    }

    public String getRefSql() {
        return refSql;
    }

    public void setRefSql(String refSql) {
        this.refSql = refSql;
    }

    public CodeEntity getPrivacy() {
        return privacy;
    }

    public MetaTableEntity getTable() {
        return table;
    }

    public void setTable(MetaTableEntity table) {
        this.table = table;
    }

    public CodeEntity getDruidColumn() {
        return druidColumn;
    }

    public void setDruidColumn(CodeEntity druidColumn) {
        this.druidColumn = druidColumn;
    }

    public void setPrivacy(CodeEntity privacy) {
        this.privacy = privacy;
    }

    public CodeEntity getPrivacyProc() {
        return privacyProc;
    }

    public void setPrivacyProc(CodeEntity privacyProc) {
        this.privacyProc = privacyProc;
    }

    public String getStdFieldId() {
        return stdFieldId;
    }

    public void setStdFieldId(String stdFieldId) {
        this.stdFieldId = stdFieldId;
    }

    public boolean isPrivacyType() {
        return this.privacy != null;
    }

    public int getRelTableCnt() {
        return relTableCnt;
    }

    public void setRelTableCnt(int relTableCnt) {
        this.relTableCnt = relTableCnt;
    }

    public String getTableId() {
        if( this.table != null ) {
            return this.table.getId();
        }
        return null;
    }


    public String getTablePhysicalNm() {
        if( this.table != null ) {
            return this.table.getPhysicalNm();
        }
        return null;
    }

    public String getTableLogicalNm() {
        if( this.table != null ) {
            return this.table.getLogicalNm();
        }
        return null;
    }

    public String getDatabasePhysicalNm() {
        if( this.table != null ) {
            return this.table.getDatabasePhysicalNm();
        }
        return null;
    }

    public String getDatabaseLogicalNm() {
        if( this.table != null ) {
            return this.table.getDatabaseLogicalNm();
        }
        return null;
    }
}
