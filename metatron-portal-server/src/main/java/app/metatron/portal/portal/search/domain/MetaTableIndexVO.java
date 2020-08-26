package app.metatron.portal.portal.search.domain;

import app.metatron.portal.common.value.index.IndexVO;

import java.io.Serializable;

/**
 * 메타데이터 테이블 색인 VO
 */
public class MetaTableIndexVO extends IndexVO implements Serializable {

    private static final long serialVersionUID = 1L;

    // target
    private String physicalNm;

    // target
    private String logicalNm;

    // target
    private String description;

    // target
    private String layer;

    // target
    private String databaseNm;

    // target
    private String subject;

    // target
    private String firstCreated;

    // target
    private String cycle;

    // target
    private String history;

    // target
    private String retention;

    // target
    private String security;

    // target
    private String privacy;

    private int columnCnt;

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

    public String getLayer() {
        return layer;
    }

    public void setLayer(String layer) {
        this.layer = layer;
    }

    public String getDatabaseNm() {
        return databaseNm;
    }

    public void setDatabaseNm(String databaseNm) {
        this.databaseNm = databaseNm;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getFirstCreated() {
        return firstCreated;
    }

    public void setFirstCreated(String firstCreated) {
        this.firstCreated = firstCreated;
    }

    public String getCycle() {
        return cycle;
    }

    public void setCycle(String cycle) {
        this.cycle = cycle;
    }

    public String getHistory() {
        return history;
    }

    public void setHistory(String history) {
        this.history = history;
    }

    public String getRetention() {
        return retention;
    }

    public void setRetention(String retention) {
        this.retention = retention;
    }

    public String getSecurity() {
        return security;
    }

    public void setSecurity(String security) {
        this.security = security;
    }

    public String getPrivacy() {
        return privacy;
    }

    public void setPrivacy(String privacy) {
        this.privacy = privacy;
    }

    public int getColumnCnt() {
        return columnCnt;
    }

    public void setColumnCnt(int columnCnt) {
        this.columnCnt = columnCnt;
    }
}
