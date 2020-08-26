package app.metatron.portal.common.util;

import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.portal.analysis.domain.AnalysisAppCategoryRelEntity;
import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.analysis.domain.AnalysisAppRoleGroupRelEntity;
import app.metatron.portal.portal.report.domain.ReportAppCategoryRelEntity;
import app.metatron.portal.portal.report.domain.ReportAppEntity;
import app.metatron.portal.portal.report.domain.ReportAppRoleGroupRelEntity;
import com.google.common.collect.ImmutableMap;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.StringPath;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.bulk.BulkResponse;
import org.springframework.data.domain.Pageable;

import java.util.*;

/**
 * 공통 유틸
 */
@Slf4j
public class CommonUtil {

    /**
     * Elastic Search empty data set
     * @param listKey
     * @param pageable
     * @return
     */
    public static Map<String, Object> getEsEmptyData(String listKey, Pageable pageable){
        return ImmutableMap.<String, Object>builder()
                .put("total", 0)
                .put(listKey, new ArrayList<>())
                .put("pageable", pageable)
                .build();
    }

    /**
     * Get Elasticsearch ActionListner
     * @return
     */
    public static ActionListener<BulkResponse> getEsActionListner(){
        ActionListener<BulkResponse> responseHandler = new ActionListener<BulkResponse>() {
            public void onResponse(BulkResponse response) {
                if (response.hasFailures()) {
                    log.warn("Indexing objects in bulk might have failed - status {}. Reason: {}",
                            "", response.buildFailureMessage());
                }
            }
            public void onFailure(Exception e) {
                log.error("Bulk indexing failure: {}", e);
            }
        };
        return responseHandler;
    }

    public static ReportAppCategoryRelEntity getReportAppCategoryEntity(CodeEntity codeEntity, ReportAppEntity reportAppEntity){
        ReportAppCategoryRelEntity reportAppCategoryRelEntity = new ReportAppCategoryRelEntity();
        reportAppCategoryRelEntity.setCategory(codeEntity);
        reportAppCategoryRelEntity.setApp(reportAppEntity);
        return reportAppCategoryRelEntity;
    }

    public static ReportAppRoleGroupRelEntity getReportAppRoleGroupEntity(RoleGroupEntity rg, ReportAppEntity reportAppEntity){
        ReportAppRoleGroupRelEntity reportAppRoleRelEntity = new ReportAppRoleGroupRelEntity();
        reportAppRoleRelEntity.setRoleGroup(rg);
        reportAppRoleRelEntity.setApp(reportAppEntity);
        return reportAppRoleRelEntity;
    }

    public static AnalysisAppCategoryRelEntity getAnalysisAppCategoryEntity(CodeEntity codeEntity, AnalysisAppEntity analysisAppEntity){
        AnalysisAppCategoryRelEntity analysisAppCategoryRelEntity = new AnalysisAppCategoryRelEntity();
        analysisAppCategoryRelEntity.setCategory(codeEntity);
        analysisAppCategoryRelEntity.setApp(analysisAppEntity);
        return analysisAppCategoryRelEntity;
    }

    public static AnalysisAppRoleGroupRelEntity getAnalysisAppRoleGroupEntity(RoleGroupEntity rg, AnalysisAppEntity analysisAppEntity){
        AnalysisAppRoleGroupRelEntity analysisAppRoleRelEntity = new AnalysisAppRoleGroupRelEntity();
        analysisAppRoleRelEntity.setRoleGroup(rg);
        analysisAppRoleRelEntity.setApp(analysisAppEntity);
        return analysisAppRoleRelEntity;
    }


    public static BooleanBuilder getAndBuilder(Set<String> categories, StringPath categoryId){
        BooleanBuilder andBuilder = new BooleanBuilder();
        if( categories != null && categories.size() > 0) {
            if( categories.size() == 1 ) {
                for(String id : categories) {
                    andBuilder.and(categoryId.eq(id));
                }
            }else {
                andBuilder.and(categoryId.in(categories));
            }
        }
        return andBuilder;
    }
}
