package app.metatron.portal.portal.analysis.domain;

import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 분석앱 카테고리 관계
 */
@Entity
@Table(name = "mp_an_app_category_rel")
public class AnalysisAppCategoryRelEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 분석앱
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "app_id")
    private AnalysisAppEntity app;

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

    public AnalysisAppEntity getApp() {
        return app;
    }

    public void setApp(AnalysisAppEntity app) {
        this.app = app;
    }

    public CodeEntity getCategory() {
        return category;
    }

    public void setCategory(CodeEntity category) {
        this.category = category;
    }
}
