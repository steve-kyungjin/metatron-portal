package app.metatron.portal.common.user.domain;

import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.report.domain.ReportAppEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;
import org.joda.time.LocalDateTime;

import javax.persistence.*;

/**
 * 권한(그룹) 신청 엔터티
 */
@Entity
@Table(name = "mp_cm_role_request")
public class RoleRequestEntity extends AbstractEntity {

    /**
     * 신청 상태
     */
    public enum Status {
        REQUEST, DENY, ACCEPT
    }

    /**
     * 앱 분류
     */
    public enum AppType {
        ANALYSIS_APP, REPORT_APP
    }

    /**
     * 아이디
     */
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    /**
     * 신청 상태
     */
    @Enumerated(EnumType.STRING)
    @Column
    private Status status;

    /**
     * 앱 분류
     */
    @Enumerated(EnumType.STRING)
    @Column
    private AppType appType;

    /**
     * 신청자
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    /**
     * 분석앱
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "analysis_app_id")
    private AnalysisAppEntity analysisApp;

    /**
     * 리포트 앱
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "report_app_id")
    private ReportAppEntity reportApp;

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

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

    public AppType getAppType() {
        return appType;
    }

    public void setAppType(AppType appType) {
        this.appType = appType;
    }

    public AnalysisAppEntity getAnalysisApp() {
        return analysisApp;
    }

    public void setAnalysisApp(AnalysisAppEntity analysisApp) {
        this.analysisApp = analysisApp;
    }

    public ReportAppEntity getReportApp() {
        return reportApp;
    }

    public void setReportApp(ReportAppEntity reportApp) {
        this.reportApp = reportApp;
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
