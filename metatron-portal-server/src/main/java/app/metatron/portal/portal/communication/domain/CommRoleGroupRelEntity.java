package app.metatron.portal.portal.communication.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 앱 권한 관계
 */
@Entity
@Table(name = "mp_co_role_group_rel")
public class CommRoleGroupRelEntity extends AbstractEntity {

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

    /**
     * post
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id")
    private CommPostEntity post;

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

    public CommPostEntity getPost() {
        return post;
    }

    public void setPost(CommPostEntity post) {
        this.post = post;
    }
}
