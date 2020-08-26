package app.metatron.portal.portal.analysis.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.GenericGenerator;
import org.joda.time.LocalDateTime;

import javax.persistence.*;
import java.util.List;

/**
 * 앱 리뷰
 */
@Entity
@Table(name = "mp_an_app_review")
public class AnalysisAppReviewEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 리뷰 내용
     */
    @Column(length = 2000)
    private String contents;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "app_id")
    private AnalysisAppEntity app;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    private AnalysisAppReviewEntity parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AnalysisAppReviewEntity> children;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public AnalysisAppEntity getApp() {
        return app;
    }

    public void setApp(AnalysisAppEntity app) {
        this.app = app;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public AnalysisAppReviewEntity getParent() {
        return parent;
    }

    public void setParent(AnalysisAppReviewEntity parent) {
        this.parent = parent;
    }

    public List<AnalysisAppReviewEntity> getChildren() {
        return children;
    }

    public void setChildren(List<AnalysisAppReviewEntity> children) {
        this.children = children;
    }

    @JsonProperty
    @Override
    public UserEntity getCreatedBy() {
        return super.getCreatedBy();
    }

    @JsonProperty
    @Override
    public UserEntity getUpdatedBy() {
        return super.getUpdatedBy();
    }

    @JsonProperty
    @Override
    public LocalDateTime getCreatedDate() {
        return super.getCreatedDate();
    }

    @JsonProperty
    @Override
    public LocalDateTime getUpdatedDate() {
        return super.getUpdatedDate();
    }
}
