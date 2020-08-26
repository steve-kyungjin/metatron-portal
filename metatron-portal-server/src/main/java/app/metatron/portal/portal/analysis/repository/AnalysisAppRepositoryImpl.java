package app.metatron.portal.portal.analysis.repository;

import app.metatron.portal.common.util.CommonUtil;
import app.metatron.portal.portal.analysis.domain.AnalysisAppDto;
import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.analysis.domain.QAnalysisAppCategoryRelEntity;
import app.metatron.portal.portal.analysis.domain.QAnalysisAppEntity;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPQLQuery;
import app.metatron.portal.common.constant.Const;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QueryDslRepositorySupport;

/**
 * 앱 Query DSL
 */
public class AnalysisAppRepositoryImpl extends QueryDslRepositorySupport implements AnalysisAppRepositoryCustom{
    public AnalysisAppRepositoryImpl() {
        super(AnalysisAppEntity.class);
    }

    /**
     * 앱 에 대한 페이징 포함 검색
     * @param param
     * @param pageable
     * @return
     */
    @Override
    public Page<AnalysisAppEntity> findQueryDslBySearchValuesWithPage(AnalysisAppDto.PARAM param , Pageable pageable){
        QAnalysisAppEntity analysisAppEntity = QAnalysisAppEntity.analysisAppEntity;
        QAnalysisAppCategoryRelEntity appCategoryRelEntity =  QAnalysisAppCategoryRelEntity.analysisAppCategoryRelEntity;

        JPQLQuery<AnalysisAppEntity> query = from(analysisAppEntity);

        Predicate predicate = getSearchPredicate(param);
        if( predicate != null) {
            query.innerJoin(analysisAppEntity.categoryRel,appCategoryRelEntity);
            query.where(predicate);
        }

        if(!Const.Common.VALUE_ALL.equals(param.getUse().toUpperCase())) {
            query.where(analysisAppEntity.useYn.eq(Const.Common.VALUE_Y.equals(param.getUse().toUpperCase())));
        }
        if(!Const.Common.VALUE_ALL.equals(param.getDel().toUpperCase())) {
            query.where(analysisAppEntity.delYn.eq(Const.Common.VALUE_Y.equals(param.getDel().toUpperCase())));
        }

        query = query.distinct();
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<AnalysisAppEntity> result = query.fetchResults();

        return new PageImpl<>(result.getResults(), pageable, result.getTotal());
    }

    /**
     * 빌드를 돌려준다.
     * @return
     */
    private Predicate getSearchPredicate(AnalysisAppDto.PARAM param) {

        QAnalysisAppCategoryRelEntity appCategoryRelEntity =  QAnalysisAppCategoryRelEntity.analysisAppCategoryRelEntity;
        QAnalysisAppEntity analysisAppEntity = appCategoryRelEntity.app;

        BooleanBuilder andBuilder = CommonUtil.getAndBuilder(param.getCategories(), appCategoryRelEntity.category.id);

        BooleanBuilder keywordBuild = new BooleanBuilder();
        if( param.getKeyword() != null ) {

            keywordBuild.and(analysisAppEntity.appNm.like('%'+param.getKeyword()+'%'));

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
