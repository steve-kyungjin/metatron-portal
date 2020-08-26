package app.metatron.portal.portal.analysis.domain;

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
@Table(name = "mp_an_app_extract_header")
public class AnalysisAppExtractHeaderEntity extends AbstractEntity implements INavigable {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 쿼리
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
    private AnalysisAppEntity app;

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

    public AnalysisAppEntity getApp() {
        return app;
    }

    public void setApp(AnalysisAppEntity app) {
        this.app = app;
    }

    @Override
    public String getNavigation() {
        return this.app.getId();
    }
}
