package app.metatron.portal.portal.log.service;

import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.portal.log.domain.AppLogEntity;
import app.metatron.portal.portal.log.repository.AppLogRepository;
import app.metatron.portal.portal.analysis.service.AnalysisAppService;
import app.metatron.portal.portal.report.service.ReportAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 마이앱 로그 서비스
 */
@Service
@Transactional
public class AppLogService extends AbstractGenericService<AppLogEntity, String> {

    @Autowired
    private AppLogRepository appLogRepository;

    @Autowired
    private AnalysisAppService analysisAppService;

    @Autowired
    private ReportAppService reportAppService;

    @Override
    protected JpaRepository<AppLogEntity, String> getRepository() {
        return appLogRepository;
    }

    /**
     * 마이앱 로그 목록
     * @param type
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<AppLogEntity> getAppLogList(AppLogEntity.Type type, String keyword, Pageable pageable) {
        return appLogRepository.getAppLogList(type, keyword, pageable);
    }

    /**
     * 로그 쓰기
     * @param type
     * @param action
     * @param appId
     */
    public void write(AppLogEntity.Type type, AppLogEntity.Action action, String appId) {
        AppLogEntity appLog = new AppLogEntity();
        appLog.setType(type);
        appLog.setAction(action);
        appLog.setUser(this.getCurrentUser());

        if( AppLogEntity.Type.ANALYSIS == type ) {
            appLog.setAnalysisApp(analysisAppService.get(appId));
        } else if( AppLogEntity.Type.REPORT == type ) {
            appLog.setReportApp(reportAppService.get(appId));
        }

        this.setCreateUserInfo(appLog);
        this.save(appLog);
    }

}
