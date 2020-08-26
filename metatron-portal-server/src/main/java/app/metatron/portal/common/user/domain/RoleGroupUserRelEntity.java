package app.metatron.portal.common.user.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 그룹과 사용자 릴레이션
 */
@Entity
@Table(name = "mp_cm_role_group_user_rel")
public class RoleGroupUserRelEntity extends AbstractEntity {

    /**
     * 아이디
     */
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    /**
     * 그룹
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_group_id")
    private RoleGroupEntity roleGroup;

    /**
     * 사용자
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public RoleGroupEntity getRoleGroup() {
        return roleGroup;
    }

    public void setRoleGroup(RoleGroupEntity roleGroup) {
        this.roleGroup = roleGroup;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
