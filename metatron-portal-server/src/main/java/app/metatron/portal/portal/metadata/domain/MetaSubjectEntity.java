package app.metatron.portal.portal.metadata.domain;

import app.metatron.portal.common.code.domain.CodeEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 데이터 주제영역
 */
@Entity
@Table(name = "mp_md_subject")
public class MetaSubjectEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    // 주제영역 fqn
    @Column
    private String fqn;

    // 주제영역 분류기준
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "criteria_id")
    private CodeEntity criteria;

    // 영역 명 (영문)
    @Column
    private String nmEn;

    // 영역 명 (한글)
    @Column
    private String nmKr;

    // 설명
    @Column(length = 3000)
    private String description;

    // 레벨구분
    @Column
    private String level;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    private MetaSubjectEntity parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("id asc")
    private List<MetaSubjectEntity> children;

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

    public String getFqn() {
        return fqn;
    }

    public void setFqn(String fqn) {
        this.fqn = fqn;
    }


    public CodeEntity getCriteria() {
        return criteria;
    }

    public void setCriteria(CodeEntity criteria) {
        this.criteria = criteria;
    }

    public String getNmEn() {
        return nmEn;
    }

    public void setNmEn(String nmEn) {
        this.nmEn = nmEn;
    }

    public String getNmKr() {
        return nmKr;
    }

    public void setNmKr(String nmKr) {
        this.nmKr = nmKr;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public MetaSubjectEntity getParent() {
        return parent;
    }

    public void setParent(MetaSubjectEntity parent) {
        this.parent = parent;
    }

    public List<MetaSubjectEntity> getChildren() {
        if( this.children == null ) {
            return new ArrayList<>();
        }
        return children;
    }

    public void setChildren(List<MetaSubjectEntity> children) {
        this.children = children;
    }

    public String getParentNm() {
        if( this.parent != null ) {
            return this.parent.getNmKr();
        }
        return "";
    }

    public String getParentId() {
        if( this.parent != null ) {
            return this.parent.getId();
        }
        return "";
    }

}
