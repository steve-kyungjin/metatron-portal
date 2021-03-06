package app.metatron.portal.portal.report.repository;

import app.metatron.portal.common.util.CommonUtil;
import app.metatron.portal.portal.report.domain.QReportAppCategoryRelEntity;
import app.metatron.portal.portal.report.domain.ReportAppEntity;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPQLQuery;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.portal.report.domain.QReportAppEntity;
import app.metatron.portal.portal.report.domain.ReportAppDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QueryDslRepositorySupport;

/**
 * dsl 구현체
 */
public class ReportAppRepositoryImpl extends QueryDslRepositorySupport implements ReportAppRepositoryCustom {

    public ReportAppRepositoryImpl() {
        super(ReportAppEntity.class);
    }

    /**
     * 리포트앱 검색
     * @param param
     * @param pageable
     * @return
     */
    @Override
    public Page<ReportAppEntity> findQueryDslBySearchValuesWithPage(ReportAppDto.PARAM param , Pageable pageable){
        QReportAppEntity reportAppEntity = QReportAppEntity.reportAppEntity;
        QReportAppCategoryRelEntity appCategoryRelEntity =  QReportAppCategoryRelEntity.reportAppCategoryRelEntity;

        JPQLQuery<ReportAppEntity> query = from(reportAppEntity);

        Predicate predicate = getSearchPredicate(param);
        if( predicate != null) {
            query.innerJoin(reportAppEntity.categoryRel,appCategoryRelEntity);
            query.where(predicate);
        }

        if(!Const.Common.VALUE_ALL.equals(param.getUse().toUpperCase())) {
            query.where(reportAppEntity.useYn.eq(Const.Common.VALUE_Y.equals(param.getUse().toUpperCase())));
        }
        if(!Const.Common.VALUE_ALL.equals(param.getDel().toUpperCase())) {
            query.where(reportAppEntity.delYn.eq(Const.Common.VALUE_Y.equals(param.getDel().toUpperCase())));
        }

        query = query.distinct();
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<ReportAppEntity> result = query.fetchResults();

        return new PageImpl<>(result.getResults(), pageable, result.getTotal());
    }

    /**
     * 빌드를 돌려준다.
     * @return
     */
    private Predicate getSearchPredicate(ReportAppDto.PARAM param) {

        QReportAppCategoryRelEntity appCategoryRelEntity =  QReportAppCategoryRelEntity.reportAppCategoryRelEntity;
        QReportAppEntity reportAppEntity = appCategoryRelEntity.app;

        BooleanBuilder andBuilder = CommonUtil.getAndBuilder(param.getCategories(), appCategoryRelEntity.category.id);
        BooleanBuilder keywordBuild = new BooleanBuilder();
        if( param.getKeyword() != null ) {

            keywordBuild.and(reportAppEntity.appNm.like('%'+param.getKeyword()+'%'));

        }

        if( keywordBuild.hasValue()) {
            andBuilder.and(keywordBuild);
        }

        if(andBuilder.hasValue()) {
            return andBuilder;
        }else {
            return null;
        }

    }
}
