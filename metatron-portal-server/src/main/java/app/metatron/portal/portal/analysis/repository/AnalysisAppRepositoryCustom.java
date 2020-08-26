package app.metatron.portal.portal.analysis.repository;

import app.metatron.portal.portal.analysis.domain.AnalysisAppDto;
import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AnalysisAppRepositoryCustom {

    /**
     * 앱 검색
     * @param param
     * @param pageable
     * @return
     */
    public Page<AnalysisAppEntity> findQueryDslBySearchValuesWithPage(AnalysisAppDto.PARAM param, Pageable pageable);
}
