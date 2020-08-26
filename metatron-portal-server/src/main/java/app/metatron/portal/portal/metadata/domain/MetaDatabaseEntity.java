package app.metatron.portal.portal.metadata.domain;

import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.domain.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.List;

/**
 * 메타 데이터베이스
 */
@Entity
@Table(name = "mp_md_database")
public class MetaDatabaseEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    // DB 데이터베이스 물리명
    @Column
    private String physicalNm;

    // DB 데이터베이스 논리명
    @Column
    private String logicalNm;

    // DB 데이터베이스 설명
    @Column(length = 3000)
    private String description;

    // 데이터 LAYER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "layer_id")
    private CodeEntity layer;

    // 데이터베이스 관리 목적
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "purpose_id")
    private CodeEntity purpose;

    // DB 인스턴스
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instance_id")
    private MetaInstanceEntity instance;

    @JsonIgnore
    @OneToMany(mappedBy = "database", fetch = FetchType.LAZY)
    private List<MetaTableEntity> tables;

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

    public MetaInstanceEntity getInstance() {
        return instance;
    }

    public void setInstance(MetaInstanceEntity instance) {
        this.instance = instance;
    }

    public CodeEntity getLayer() {
        return layer;
    }

    public void setLayer(CodeEntity layer) {
        this.layer = layer;
    }

    public CodeEntity getPurpose() {
        return purpose;
    }

    public void setPurpose(CodeEntity purpose) {
        this.purpose = purpose;
    }

    public List<MetaTableEntity> getTables() {
        return tables;
    }

    public void setTables(List<MetaTableEntity> tables) {
        this.tables = tables;
    }

    public int getTableCnt() {
        if(this.tables != null) {
            return this.tables.size();
        }
        return 0;
    }

    public String getInstanceId() {
        if( this.instance != null ) {
            return this.instance.getId();
        }
        return null;
    }

    public String getInstancePhysicalNm() {
        if( this.instance != null ) {
            return this.instance.getPhysicalNm();
        }
        return null;
    }

    public String getInstanceLogicalNm() {
        if( this.instance != null ) {
            return this.instance.getLogicalNm();
        }
        return null;
    }
}
