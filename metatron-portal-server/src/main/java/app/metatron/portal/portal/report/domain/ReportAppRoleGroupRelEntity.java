package app.metatron.portal.portal.report.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.user.domain.RoleGroupEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 리포트앱 권한그룹 관계
 */
@Entity
@Table(name = "mp_rp_role_group_rel")
public class ReportAppRoleGroupRelEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 권한 그룹
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_group_id")
    private RoleGroupEntity roleGroup;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "app_id")
    private ReportAppEntity app;

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

    public ReportAppEntity getApp() {
        return app;
    }

    public void setApp(ReportAppEntity app) {
        this.app = app;
    }
}
