package app.metatron.portal.portal.report.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.domain.INavigable;
import app.metatron.portal.common.util.HtmlUtil;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * URL 헤더
 */
@Entity
@Table(name = "mp_rp_app_url_header")
public class ReportAppUrlHeaderEntity extends AbstractEntity implements INavigable {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * URL
     */
    @Column(length = 1024)
    private String url;

    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "app_id")
    private ReportAppEntity app;

    public ReportAppEntity getApp() {
        return app;
    }

    public void setApp(ReportAppEntity app) {
        this.app = app;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public String getNavigation() {
        return HtmlUtil.prefixUrl(this.getUrl());
    }

}
