package app.metatron.portal.portal.report.domain;

import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 리포트앱 카테고리 관계
 */
@Entity
@Table(name = "mp_rp_app_category_rel")
public class ReportAppCategoryRelEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 앱
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "app_id")
    private ReportAppEntity app;

    /**
     * 카테고리
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private CodeEntity category;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ReportAppEntity getApp() {
        return app;
    }

    public void setApp(ReportAppEntity app) {
        this.app = app;
    }

    public CodeEntity getCategory() {
        return category;
    }

    public void setCategory(CodeEntity category) {
        this.category = category;
    }
}
