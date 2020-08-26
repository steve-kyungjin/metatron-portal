package app.metatron.portal.common.user.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 그룹과 IA 릴레이션
 */
@Entity
@Table(name = "mp_cm_role_group_ia_rel")
public class RoleGroupIARelEntity extends AbstractEntity {

    /**
     * 아이디
     */
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    /**
     * 퍼미션  : RO, RW, Admin
     */
    @Enumerated(EnumType.STRING)
    @Column
    private PermissionType permission;

    /**
     * 그룹
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_group_id")
    private RoleGroupEntity roleGroup;

    /**
     * IA
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ia_id")
    private IAEntity ia;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public PermissionType getPermission() {
        return permission;
    }

    public void setPermission(PermissionType permission) {
        this.permission = permission;
    }

    public RoleGroupEntity getRoleGroup() {
        return roleGroup;
    }

    public void setRoleGroup(RoleGroupEntity roleGroup) {
        this.roleGroup = roleGroup;
    }

    public IAEntity getIa() {
        return ia;
    }

    public void setIa(IAEntity ia) {
        this.ia = ia;
    }
}
