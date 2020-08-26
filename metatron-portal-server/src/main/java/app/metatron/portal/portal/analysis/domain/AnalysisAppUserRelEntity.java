package app.metatron.portal.portal.analysis.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 사용자 앱 관계 (마이앱)
 */
@Entity
@Table(name = "mp_an_app_user_rel")
public class AnalysisAppUserRelEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 사용자
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    /**
     * 앱
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "app_id")
    private AnalysisAppEntity app;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public AnalysisAppEntity getApp() {
        return app;
    }

    public void setApp(AnalysisAppEntity app) {
        this.app = app;
    }
}
