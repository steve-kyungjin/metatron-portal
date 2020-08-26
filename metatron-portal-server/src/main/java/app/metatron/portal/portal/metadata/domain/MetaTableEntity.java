package app.metatron.portal.portal.metadata.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 메타 테이블
 */
@Entity
@Table(name = "mp_md_table", indexes = {
        @Index(name = "idx_mp_md_table_physical_nm",  columnList="physicalNm", unique = false)
})
public class MetaTableEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    // DB 테이블 물리명
    @Column
    private String physicalNm;

    // DB 테이블 논리명
    @Column
    private String logicalNm;

    // 설명
    @Column(length = 3000)
    private String description;

    // DB 테이블 FQN
    @Column
    private String fqn;

    // DB 테이블 관리 상태
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private CodeEntity status;

    // 데이터 생성 특성 분류
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "feature_id")
    private CodeEntity feature;

    // 데이터 관리 계층(LAYER)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "layer_id")
    private CodeEntity layer;

    // 최초 생성 시스템/모듈 명
    @Column
    private String firstCreated;

    // 데이터 처리(변경) 주기
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cycle_id")
    private CodeEntity cycle;

    // 데이터 이력 관리 유형
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "history_id")
    private CodeEntity history;

    // 데이터 보관 기간
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "retention_id")
    private CodeEntity retention;

    // 보안 통제 등급
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "security_id")
    private CodeEntity security;

    // 개인정보 식별가능 수준
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "privacy_id")
    private CodeEntity privacy;

    // 표준 데이터 엔터티 ID
    @Column
    private String stdEntityId;

    // 데이터베이스
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "database_id")
    private MetaDatabaseEntity database;

    // DB 테이블 관리 담당자
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id")
    private UserEntity worker;

    @JsonIgnore
    @OneToMany(mappedBy = "table", fetch = FetchType.LAZY)
    @OrderBy("subject.id asc")
    private List<MetaSubjectTableRelEntity> subjectRels;

    @JsonIgnore
    @OneToMany(mappedBy = "table", fetch = FetchType.LAZY)
    private List<MetaColumnEntity> columns;

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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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


    public String getFirstCreated() {
        return firstCreated;
    }

    public void setFirstCreated(String firstCreated) {
        this.firstCreated = firstCreated;
    }

    public CodeEntity getStatus() {
        return status;
    }

    public void setStatus(CodeEntity status) {
        this.status = status;
    }

    public CodeEntity getFeature() {
        return feature;
    }

    public void setFeature(CodeEntity feature) {
        this.feature = feature;
    }

    public CodeEntity getLayer() {
        return layer;
    }

    public void setLayer(CodeEntity layer) {
        this.layer = layer;
    }

    public CodeEntity getCycle() {
        return cycle;
    }

    public void setCycle(CodeEntity cycle) {
        this.cycle = cycle;
    }

    public CodeEntity getHistory() {
        return history;
    }

    public void setHistory(CodeEntity history) {
        this.history = history;
    }

    public CodeEntity getRetention() {
        return retention;
    }

    public void setRetention(CodeEntity retention) {
        this.retention = retention;
    }

    public CodeEntity getSecurity() {
        return security;
    }

    public void setSecurity(CodeEntity security) {
        this.security = security;
    }

    public CodeEntity getPrivacy() {
        return privacy;
    }

    public void setPrivacy(CodeEntity privacy) {
        this.privacy = privacy;
    }

    public String getStdEntityId() {
        return stdEntityId;
    }

    public void setStdEntityId(String stdEntityId) {
        this.stdEntityId = stdEntityId;
    }

    public List<MetaSubjectTableRelEntity> getSubjectRels() {
        return subjectRels;
    }

    public void setSubjectRels(List<MetaSubjectTableRelEntity> subjectRels) {
        this.subjectRels = subjectRels;
    }

    /**
     * 주제영역 fqn
     * @return
     */
    public List<String> getSubjectFqnList() {
        List<String> subjects = new ArrayList<>();
        if( this.subjectRels != null ) {
            this.subjectRels.forEach(rel -> {
                subjects.add(rel.getSubject().getFqn());
            });
        }
        return subjects;
    }

    /**
     * 주제영역 fqn
     * @return
     */
    public String getSubjectFqnStr() {
        return StringUtils.collectionToCommaDelimitedString(this.getSubjectFqnList());
    }

    public int getColumnCnt() {
        if( this.columns != null ) {
            return this.columns.size();
        }
        return 0;
    }

    public Integer getPrivacyCnt() {
        if( this.columns != null && this.columns.size() > 0 ) {
            int cnt = 0;
            for( MetaColumnEntity column : this.columns ) {
                if( column.isPrivacyType() ) {
                    cnt++;
                }
            }
            return cnt;
        }
        return 0;
    }

    public MetaDatabaseEntity getDatabase() {
        return database;
    }

    public void setDatabase(MetaDatabaseEntity database) {
        this.database = database;
    }

    public UserEntity getWorker() {
        return worker;
    }

    public void setWorker(UserEntity worker) {
        this.worker = worker;
    }

    public List<MetaColumnEntity> getColumns() {
        return columns;
    }

    public void setColumns(List<MetaColumnEntity> columns) {
        this.columns = columns;
    }

    public String getFqn() {
        return fqn;
    }

    public void setFqn(String fqn) {
        this.fqn = fqn;
    }

    // Additional fields

    public String getDatabasePhysicalNm() {
        if(this.database != null) {
            return this.database.getPhysicalNm();
        }
        return "";
    }

    public String getDatabaseLogicalNm() {
        if(this.database != null) {
            return this.database.getLogicalNm();
        }
        return "";
    }

    public String getDatabaseId() {
        if(this.database != null) {
            return this.database.getId();
        }
        return "";
    }


}
