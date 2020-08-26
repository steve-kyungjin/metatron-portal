package app.metatron.portal.portal.report.service;

import app.metatron.portal.portal.report.domain.ReportAppEntity;
import app.metatron.portal.common.service.BaseService;
import app.metatron.portal.portal.log.domain.AppLogEntity;
import app.metatron.portal.portal.log.service.AppLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

/**
 * 리포트앱 추천
 */
@Service
public class ReportAppRecommendService extends BaseService {

    @Autowired
    private ReportAppService reportAppService;

    @Autowired
    private AppLogService appLogService;

    @Autowired
    private EntityManager entityManager;

    /**
     * 최신 앱
     * @param categoryIds
     * @param limit
     * @return
     */
    public List<ReportAppEntity> getLatestRegisteredAppList(List<String> categoryIds, int limit) {
        String queryString = "select distinct app " +
                "from ReportAppEntity app, ReportAppCategoryRelEntity cate " +
                "where app = cate.app " +
                "and app.useYn = true " +
                "and app.delYn = false ";
        if(categoryIds != null && categoryIds.size() > 0) {
            queryString += "and cate.category.id in :categories ";
        }
        queryString += "order by app.createdDate desc";
        Query query = entityManager.createQuery(queryString);
        if(categoryIds != null && categoryIds.size() > 0) {
            query.setParameter("categories", categoryIds);
        }
        query.setMaxResults(limit);
        return (List<ReportAppEntity>) query.getResultList();
    }

    /**
     * 인기앱
     * @param action
     * @param categoryIds
     * @param limit
     * @return
     */
    public List<ReportAppEntity> getPopularAppList(AppLogEntity.Action action, List<String> categoryIds, int limit) {
        String queryString = "select distinct count(log.reportApp) as cnt, log.reportApp as app " +
                "from AppLogEntity log, ReportAppCategoryRelEntity cate " +
                "where log.reportApp = cate.app " +
                "and log.action = :action " +
                "and log.reportApp.useYn = true " +
                "and log.reportApp.delYn = false ";
        if(categoryIds != null && categoryIds.size() > 0) {
            queryString += "and cate.category.id in :categories ";
        }
        queryString += "group by log.reportApp " +
                "order by cnt desc";
        Query query = entityManager.createQuery(queryString);
        query.setParameter("action", action);
        if(categoryIds != null && categoryIds.size() > 0) {
            query.setParameter("categories", categoryIds);
        }
        query.setMaxResults(limit);
        List origin = query.getResultList();
        List<ReportAppEntity> appList = new ArrayList<>();
        origin.forEach(item -> {
            Object[] records = (Object[]) item;
            appList.add((ReportAppEntity) records[1]);
        });
        return appList;
    }

    /**
     * 인기앱 특정앱 제외
     * @param action
     * @param except
     * @param limit
     * @return
     */
    public List<ReportAppEntity> getPopularAppListExceptApps(AppLogEntity.Action action, List<ReportAppEntity> except, int limit) {
        String queryString = "select distinct count(log.reportApp) as cnt, log.reportApp as app " +
                "from AppLogEntity log, ReportAppCategoryRelEntity cate " +
                "where log.reportApp = cate.app " +
                "and log.action = :action " +
                "and log.reportApp.useYn = true " +
                "and log.reportApp.delYn = false ";
        if(except != null && except.size() > 0) {
            queryString += "and log.reportApp not in :except ";
        }
        queryString += "group by log.reportApp " +
                "order by cnt desc";
        Query query = entityManager.createQuery(queryString);
        query.setParameter("action", action);
        if(except != null && except.size() > 0) {
            query.setParameter("except", except);
        }
        query.setMaxResults(limit);
        List origin = query.getResultList();
        List<ReportAppEntity> appList = new ArrayList<>();
        origin.forEach(item -> {
            Object[] records = (Object[]) item;
            appList.add((ReportAppEntity) records[1]);
        });
        return appList;
    }

    /**
     * 상황별 마이앱 목록
     * @param action
     * @param limit
     * @return
     */
    public List<ReportAppEntity> getMyAppList(AppLogEntity.Action action, List<ReportAppEntity> except, int limit) {
        String queryString = "select distinct rel.app " +
                "from AppLogEntity log, ReportAppUserRelEntity rel " +
                "where  log.reportApp = rel.app " +
                "and log.type = 'REPORT' " +
                "and log.action = :action " +
                "and rel.user.userId = :userId " +
                "and rel.app.useYn = true " +
                "and rel.app.delYn = false ";
        if( except != null && except.size() > 0 ) {
            queryString += "and rel.app not in :except ";
        }
        queryString += "order by rel.app.createdDate desc ";
        Query query = entityManager.createQuery(queryString);
        query.setParameter("action", action);
        query.setParameter("userId", this.getCurrentUserId());
        if( except != null && except.size() > 0 ) {
            query.setParameter("except", except);
        }
        query.setMaxResults(limit);

        List<ReportAppEntity> appList = (List<ReportAppEntity>) query.getResultList();
        return appList;
    }
}
