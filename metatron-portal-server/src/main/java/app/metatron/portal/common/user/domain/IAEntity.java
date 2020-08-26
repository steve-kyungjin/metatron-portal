package app.metatron.portal.common.user.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.List;

/**
 * IA Entity
 */
@Entity
@Table(name = "mp_cm_ia")
public class IAEntity extends AbstractEntity{

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /** IA 명 - 한글 */
    @Column(length = 100 ,nullable = false)
    private String iaNm;

    /** IA 설명 - 한글 */
    @Column(length = 255)
    private String iaDesc;

    /** depth */
    @Column(length = 100 ,nullable = false)
    private Integer depth;

    /** 외부 경로 여부 */
    @Type(type = "yes_no")
    @Column(length = 1)
    private Boolean externalYn;

    @Type(type = "yes_no")
    @Column(length = 1)
    private Boolean displayYn;

    @Type(type = "yes_no")
    @Column(length = 1)
    private Boolean linkYn;

    @Type(type = "yes_no")
    @Column(length = 1)
    private Boolean editYn = true;

    /** 경로 정보 - 현재 제약없음 */
    @Column(length = 200)
    private String path;

    /** 순서 */
    @Column(length = 50)
    private Integer iaOrder;

    /** parent */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parentCode")
    private IAEntity parent;

    /** Children */
    @JsonIgnore
    @OneToMany(mappedBy = "parent",fetch = FetchType.LAZY)
    @OrderBy("iaOrder asc")
    private List<IAEntity> children;

    /** RoleGroup Relation */
    @JsonIgnore
    @OneToMany(mappedBy = "ia", fetch = FetchType.LAZY)
    private List<RoleGroupIARelEntity> roleRels;

    public Boolean getEditYn() {
        return editYn;
    }

    public void setEditYn(Boolean editYn) {
        this.editYn = editYn;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIaNm() {
        return iaNm;
    }

    public void setIaNm(String iaNm) {
        this.iaNm = iaNm;
    }

    public Integer getDepth() {
        return depth;
    }

    public void setDepth(Integer depth) {
        this.depth = depth;
    }

    public Boolean getExternalYn() {
        return externalYn;
    }

    public void setExternalYn(Boolean externalYn) {
        this.externalYn = externalYn;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public IAEntity getParent() {
        return parent;
    }

    public void setParent(IAEntity parent) {
        this.parent = parent;
    }

    public List<IAEntity> getChildren() {
        return children;
    }

    public void setChildren(List<IAEntity> children) {
        this.children = children;
    }

    public Integer getIaOrder() {
        return iaOrder;
    }

    public void setIaOrder(Integer iaOrder) {
        this.iaOrder = iaOrder;
    }

    public Boolean getDisplayYn() {
        return displayYn;
    }

    public void setDisplayYn(Boolean displayYn) {
        this.displayYn = displayYn;
    }

    public Boolean getLinkYn() {
        return linkYn;
    }

    public void setLinkYn(Boolean linkYn) {
        this.linkYn = linkYn;
    }

    public String getIaDesc() {
        return iaDesc;
    }

    public void setIaDesc(String iaDesc) {
        this.iaDesc = iaDesc;
    }

    public List<RoleGroupIARelEntity> getRoleRels() {
        return roleRels;
    }

    public void setRoleRels(List<RoleGroupIARelEntity> roleRels) {
        this.roleRels = roleRels;
    }

    public int getChildrenCnt() {
        if( this.children != null ) {
            return this.children.size();
        }
        return 0;
    }
}
