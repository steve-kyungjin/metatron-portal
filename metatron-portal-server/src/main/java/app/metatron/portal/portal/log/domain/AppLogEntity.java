package app.metatron.portal.portal.log.domain;

import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.report.domain.ReportAppEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.GenericGenerator;
import org.joda.time.LocalDateTime;

import javax.persistence.*;

/**
 * 마이앱 로그 (마이앱 등록, 실행 , 삭제)
 */
@Entity
@Table(name = "mp_log_app",indexes = {
        @Index(name = "idx_mp_log_app_action",  columnList="action", unique = false),
        @Index(name = "idx_mp_log_app_type",  columnList="type", unique = false),
        @Index(name = "idx_mp_log_app_type_action",  columnList="type, action", unique = false)
})
public class AppLogEntity extends AbstractEntity {

    /**
     * 앱 타입
     */
    public enum Type {
        ANALYSIS, REPORT
    }

    /**
     * 액션
     */
    public enum Action {
        ADD, DELETE, EXEC
    }

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
     * 앱 타입
     */
    @Enumerated(EnumType.STRING)
    @Column
    private Type type;

    /**
     * 액션
     */
    @Enumerated(EnumType.STRING)
    @Column
    private Action action;

    /**
     * 분석앱
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "analysis_app_id")
    private AnalysisAppEntity analysisApp;

    /**
     * 리포트
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "report_app_id")
    private ReportAppEntity reportApp;

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

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
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
