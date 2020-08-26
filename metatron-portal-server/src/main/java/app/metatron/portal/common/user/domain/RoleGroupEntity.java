package app.metatron.portal.common.user.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;

import javax.persistence.*;
import java.util.List;

/**
 * RoleGroup Entity
 */
@Entity
@Table(name = "mp_cm_role_group")
public class RoleGroupEntity extends AbstractEntity {

    /**
     * ID
     */
    @Id
    private String id;

    /**
     * 그룹 타입 : 일반, 조직, 시스템, 개인
     */
    @Enumerated(EnumType.STRING)
    @Column
    private RoleGroupType type;

    /**
     * 이름
     */
    @Column
    private String name;

    /**
     * 설명
     */
    @Column(length = 3000)
    private String description;

    /**
     * 상위
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    private RoleGroupEntity parent;

    /**
     * 하위
     */
    @JsonIgnore
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("name asc")
    private List<RoleGroupEntity> children;

    /**
     * 사용자 릴레이션
     */
    @JsonIgnore
    @OneToMany(mappedBy = "roleGroup", fetch = FetchType.LAZY)
    private List<RoleGroupUserRelEntity> userRels;

    /**
     * IA 와 릴레이션
     */
    @JsonIgnore
    @OneToMany(mappedBy = "roleGroup", fetch = FetchType.LAZY)
    private List<RoleGroupIARelEntity> iaRels;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public RoleGroupType getType() {
        return type;
    }

    public void setType(RoleGroupType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RoleGroupEntity getParent() {
        return parent;
    }

    public void setParent(RoleGroupEntity parent) {
        this.parent = parent;
    }

    public List<RoleGroupEntity> getChildren() {
        return children;
    }

    public void setChildren(List<RoleGroupEntity> children) {
        this.children = children;
    }

    public List<RoleGroupUserRelEntity> getUserRels() {
        return userRels;
    }

    public void setUserRels(List<RoleGroupUserRelEntity> userRels) {
        this.userRels = userRels;
    }

    public List<RoleGroupIARelEntity> getIaRels() {
        return iaRels;
    }

    public void setIaRels(List<RoleGroupIARelEntity> iaRels) {
        this.iaRels = iaRels;
    }

    public int getChildrenCnt() {
        if( this.children != null ) {
            return this.children.size();
        }
        return 0;
    }

    public int getMemberCnt() {
        if( this.userRels != null ) {
            return this.userRels.size();
        }
        return 0;
    }
}
