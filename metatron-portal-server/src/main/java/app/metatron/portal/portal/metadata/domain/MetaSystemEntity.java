package app.metatron.portal.portal.metadata.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.List;

/**
 * DW 연계 시스템
 */
@Entity
@Table(name = "mp_md_system")
public class MetaSystemEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    // 시스템 표준명
    @Column
    private String stdNm;

    // 시스템 전체 명
    @Column
    private String fullNm;

    // 설명
    @Column(length = 3000)
    private String description;

    // 레벨구분
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "level_id")
    private CodeEntity level;

    // 운영계/정보계 분류
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "oper_type_id")
    private CodeEntity operType;

    // DW 기준 연동 방향
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "direction_id")
    private CodeEntity direction;

    // 연계 목적 설명
    @Column
    private String relPurpose;

    // INBOUND

    // 수집 IF 기술
    @Column
    private String inMethod;

    // 최소 수집 주기
    @Column
    private String inFrequency;

    // 수집 엔터티 수
    @Column
    private Integer inEntityCnt;

    // 수집 용량/일
    @Column
    private Double inSize;

    // 수집 용량 단위
    @Column
    private String inSizeUnit;

    // OUTBOUND

    // 제공 IF 기술
    @Column
    private String outMethod;

    // 최소 제공 주기
    @Column
    private String outFrequency;

    // 제공 엔터티 수
    @Column
    private Integer outEntityCnt;

    // 제공 용량/일
    @Column
    private Double outSize;

    // 제공 용량 단위
    @Column
    private String outSizeUnit;

    // 연계 시스템 관리 담당자
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id")
    private UserEntity worker;

    // 연계 시스템 관리 담당자(지원)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coworker_id")
    private UserEntity coworker;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    private MetaSystemEntity parent;

    @JsonIgnore
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("id asc")
    private List<MetaSystemEntity> children;

    /**
     * 삭제 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean delYn;

    @JsonIgnore
    @OneToMany(mappedBy = "system", fetch = FetchType.LAZY)
    private List<MetaSystemInstanceRelEntity> instanceRels;

    public List<MetaSystemInstanceRelEntity> getInstanceRels() {
        return instanceRels;
    }

    public void setInstanceRels(List<MetaSystemInstanceRelEntity> instanceRels) {
        this.instanceRels = instanceRels;
    }

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

    public String getStdNm() {
        return stdNm;
    }

    public void setStdNm(String stdNm) {
        this.stdNm = stdNm;
    }

    public String getFullNm() {
        return fullNm;
    }

    public void setFullNm(String fullNm) {
        this.fullNm = fullNm;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CodeEntity getLevel() {
        return level;
    }

    public void setLevel(CodeEntity level) {
        this.level = level;
    }

    public CodeEntity getOperType() {
        return operType;
    }

    public void setOperType(CodeEntity operType) {
        this.operType = operType;
    }

    public CodeEntity getDirection() {
        return direction;
    }

    public void setDirection(CodeEntity direction) {
        this.direction = direction;
    }

    public String getRelPurpose() {
        return relPurpose;
    }

    public void setRelPurpose(String relPurpose) {
        this.relPurpose = relPurpose;
    }

    public String getInMethod() {
        return inMethod;
    }

    public void setInMethod(String inMethod) {
        this.inMethod = inMethod;
    }

    public String getInFrequency() {
        return inFrequency;
    }

    public void setInFrequency(String inFrequency) {
        this.inFrequency = inFrequency;
    }

    public Integer getInEntityCnt() {
        return inEntityCnt;
    }

    public void setInEntityCnt(Integer inEntityCnt) {
        this.inEntityCnt = inEntityCnt;
    }

    public Double getInSize() {
        return inSize;
    }

    public void setInSize(Double inSize) {
        this.inSize = inSize;
    }

    public String getInSizeUnit() {
        return inSizeUnit;
    }

    public void setInSizeUnit(String inSizeUnit) {
        this.inSizeUnit = inSizeUnit;
    }

    public String getOutMethod() {
        return outMethod;
    }

    public void setOutMethod(String outMethod) {
        this.outMethod = outMethod;
    }

    public String getOutFrequency() {
        return outFrequency;
    }

    public void setOutFrequency(String outFrequency) {
        this.outFrequency = outFrequency;
    }

    public Integer getOutEntityCnt() {
        return outEntityCnt;
    }

    public void setOutEntityCnt(Integer outEntityCnt) {
        this.outEntityCnt = outEntityCnt;
    }

    public Double getOutSize() {
        return outSize;
    }

    public void setOutSize(Double outSize) {
        this.outSize = outSize;
    }

    public String getOutSizeUnit() {
        return outSizeUnit;
    }

    public void setOutSizeUnit(String outSizeUnit) {
        this.outSizeUnit = outSizeUnit;
    }

    public UserEntity getWorker() {
        return worker;
    }

    public void setWorker(UserEntity worker) {
        this.worker = worker;
    }

    public UserEntity getCoworker() {
        return coworker;
    }

    public void setCoworker(UserEntity coworker) {
        this.coworker = coworker;
    }

    public MetaSystemEntity getParent() {
        return parent;
    }

    public void setParent(MetaSystemEntity parent) {
        this.parent = parent;
    }

    public List<MetaSystemEntity> getChildren() {
        return children;
    }

    public void setChildren(List<MetaSystemEntity> children) {
        this.children = children;
    }

    public String getParentId() {
        if( this.parent != null ) {
            return this.parent.getId();
        }
        return "";
    }

    public String getParentStdNm() {
        if( this.parent != null ) {
            return this.parent.getStdNm();
        }
        return "";
    }

    public String getParentFullNm() {
        if( this.parent != null ) {
            return this.parent.getFullNm();
        }
        return "";
    }

    public int getChildrenCnt() {
        if( this.children != null && this.children.size() > 0 ) {
            return this.children.size();
        }
        return 0;
    }
}
