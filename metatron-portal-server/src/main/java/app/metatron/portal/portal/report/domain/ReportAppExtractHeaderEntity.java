package app.metatron.portal.portal.report.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.domain.INavigable;
import app.metatron.portal.portal.datasource.domain.DataSourceEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 추출앱 헤더
 */
@Entity
@Table(name = "mp_rp_app_extract_header")
public class ReportAppExtractHeaderEntity extends AbstractEntity implements INavigable {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 실행 쿼리
     */
    @Lob
    @Column
    private String sqlTxt;

    /**
     * 데이터소스
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "datasource_id")
    private DataSourceEntity dataSource;

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

    public String getSqlTxt() {
        return sqlTxt;
    }

    public void setSqlTxt(String sqlTxt) {
        this.sqlTxt = sqlTxt;
    }

    public DataSourceEntity getDataSource() {
        return dataSource;
    }

    public void setDataSource(DataSourceEntity dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public String getNavigation() {
        return this.app.getId();
    }
}
