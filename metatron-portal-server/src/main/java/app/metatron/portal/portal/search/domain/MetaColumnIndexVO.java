package app.metatron.portal.portal.search.domain;

import app.metatron.portal.common.value.index.IndexVO;

import java.io.Serializable;

/**
 * 메타데이터 컬럼 색인 VO
 */
public class MetaColumnIndexVO extends IndexVO implements Serializable {

    private static final long serialVersionUID = 1L;

    // target
    private String fqn;

    // target
    private String physicalNm;

    // target
    private String logicalNm;

    // target
    private String description;

    // target
    private String refTable;

    // target
    private String refSql;

    // target
    private String dataType;

    private String dataSize;

    private boolean primaryKey;

    private boolean nullable;

    private String privacy;

    // target
    private String privacyProc;

    // target
    private String stdFieldId;

    private int tableCnt = 0;

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

    public boolean isPrimaryKey() {
        return primaryKey;
    }

    public void setPrimaryKey(boolean primaryKey) {
        this.primaryKey = primaryKey;
    }

    public boolean isNullable() {
        return nullable;
    }

    public void setNullable(boolean nullable) {
        this.nullable = nullable;
    }

    public String getPrivacy() {
        return privacy;
    }

    public void setPrivacy(String privacy) {
        this.privacy = privacy;
    }

    public String getPrivacyProc() {
        return privacyProc;
    }

    public void setPrivacyProc(String privacyProc) {
        this.privacyProc = privacyProc;
    }

    public String getStdFieldId() {
        return stdFieldId;
    }

    public void setStdFieldId(String stdFieldId) {
        this.stdFieldId = stdFieldId;
    }

    public int getTableCnt() {
        return tableCnt;
    }

    public void setTableCnt(int tableCnt) {
        this.tableCnt = tableCnt;
    }
}
