package app.metatron.portal.portal.report.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.domain.INavigable;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 메타트론 헤더
 */
@Entity
@Table(name = "mp_rp_app_metatron_header")
public class ReportAppMetatronHeaderEntity extends AbstractEntity implements INavigable {

    /**
     * 메타트론 유형
     */
    public enum Type {
        WORKBOOK, DASHBOARD
    }

    /**
     * 워크북 기본 경로
     */
    @Transient
    private String workbookSharePath;

    /**
     * 대시보드 기본 경로
     */
    @Transient
    private String dashboardSharePath;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 타입
     */
    @Enumerated(EnumType.STRING)
    @Column
    private ReportAppMetatronHeaderEntity.Type type;

    /**
     * 컨텐츠 아이디
     */
    @Column
    private String contentsId;

    /**
     * 컨텐츠 명
     */
    @Column
    private String contentsNm;

    /**
     * 컨텐츠 위치 아이디
     */
    @Column
    private String locationId;

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

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getContentsId() {
        return contentsId;
    }

    public void setContentsId(String contentsId) {
        this.contentsId = contentsId;
    }

    public void setWorkbookSharePath(String workbookSharePath) {
        this.workbookSharePath = workbookSharePath;
    }

    public void setDashboardSharePath(String dashboardSharePath) {
        this.dashboardSharePath = dashboardSharePath;
    }

    public String getContentsNm() {
        return contentsNm;
    }

    public void setContentsNm(String contentsNm) {
        this.contentsNm = contentsNm;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public String getUrl() {
        if(this.type == ReportAppMetatronHeaderEntity.Type.WORKBOOK) {
            return this.workbookSharePath + this.contentsId;
        } else if(this.type == ReportAppMetatronHeaderEntity.Type.DASHBOARD) {
            return this.dashboardSharePath + this.contentsId;
        } else {
            return "";
        }
    }

    @Override
    public String getNavigation() {
        return this.getUrl();
    }
}
