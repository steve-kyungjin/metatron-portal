package app.metatron.portal.portal.analysis.service;

import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.log.domain.AppLogEntity;
import app.metatron.portal.common.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

/**
 * 앱 추천
 */
@Service
public class AnalysisAppRecommendService extends BaseService {

    @Autowired
    private EntityManager entityManager;

    /**
     * 카테고리별 최근 등록 앱 목록
     * @param categoryIds
     * @param limit
     * @return
     */
    public List<AnalysisAppEntity> getLatestRegisteredAppList(List<String> categoryIds, int limit) {
        String queryString = "select distinct app " +
                "from AnalysisAppEntity app, AnalysisAppCategoryRelEntity cate " +
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
        return (List<AnalysisAppEntity>) query.getResultList();
    }

    /**
     * 카테고리별 상황별 인기 앱 목록
     * @param action
     * @param categoryIds
     * @param limit
     * @return
     */
    public List<AnalysisAppEntity> getPopularAppList(AppLogEntity.Action action, List<String> categoryIds, int limit) {
        String queryString = "select distinct count(log.analysisApp) as cnt, log.analysisApp as app " +
                "from AppLogEntity log, AnalysisAppCategoryRelEntity cate " +
                "where log.analysisApp = cate.app " +
                "and log.action = :action " +
                "and log.analysisApp.useYn = true " +
                "and log.analysisApp.delYn = false ";
        if(categoryIds != null && categoryIds.size() > 0) {
            queryString += "and cate.category.id in :categories ";
        }
        queryString += "group by log.analysisApp " +
                "order by cnt desc";
        Query query = entityManager.createQuery(queryString);
        query.setParameter("action", action);
        if(categoryIds != null && categoryIds.size() > 0) {
            query.setParameter("categories", categoryIds);
        }
        query.setMaxResults(limit);
        List origin = query.getResultList();
        List<AnalysisAppEntity> appList = new ArrayList<>();
        origin.forEach(item -> {
            Object[] records = (Object[]) item;
            appList.add((AnalysisAppEntity) records[1]);
        });
        return appList;
    }

    /**
     * 상황별 인기 앱 목록 (특정앱 제외)
     * @param action
     * @param except
     * @param limit
     * @return
     */
    public List<AnalysisAppEntity> getPopularAppListExceptApps(AppLogEntity.Action action, List<AnalysisAppEntity> except, int limit) {
        String queryString = "select distinct count(log.analysisApp) as cnt, log.analysisApp as app " +
                "from AppLogEntity log, AnalysisAppCategoryRelEntity cate " +
                "where log.analysisApp = cate.app " +
                "and log.action = :action " +
                "and log.analysisApp.useYn = true " +
                "and log.analysisApp.delYn = false ";
        if(except != null && except.size() > 0) {
            queryString += "and log.analysisApp not in :except ";
        }
        queryString += "group by log.analysisApp " +
                "order by cnt desc";
        Query query = entityManager.createQuery(queryString);
        query.setParameter("action", action);
        if(except != null && except.size() > 0) {
            query.setParameter("except", except);
        }
        query.setMaxResults(limit);
        List origin = query.getResultList();
        List<AnalysisAppEntity> appList = new ArrayList<>();
        origin.forEach(item -> {
            Object[] records = (Object[]) item;
            appList.add((AnalysisAppEntity) records[1]);
        });
        return appList;
    }

    /**
     * 상황별 마이앱 목록
     * @param action
     * @param limit
     * @return
     */
    public List<AnalysisAppEntity> getMyAppList(AppLogEntity.Action action, List<AnalysisAppEntity> except, int limit) {
        String queryString = "select distinct rel.app " +
                "from AppLogEntity log, AnalysisAppUserRelEntity rel " +
                "where  log.analysisApp = rel.app " +
                "and log.type = 'ANALYSIS' " +
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

        List<AnalysisAppEntity> appList = (List<AnalysisAppEntity>) query.getResultList();
        return appList;
    }
}
