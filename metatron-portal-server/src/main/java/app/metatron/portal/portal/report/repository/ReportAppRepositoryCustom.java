package app.metatron.portal.portal.report.repository;

import app.metatron.portal.portal.report.domain.ReportAppDto;
import app.metatron.portal.portal.report.domain.ReportAppEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * dsl 인터페이스
 */
public interface ReportAppRepositoryCustom {

    /**
     * 리포트앱 검색
     * @param param
     * @param pageable
     * @return
     */
    public Page<ReportAppEntity> findQueryDslBySearchValuesWithPage(ReportAppDto.PARAM param, Pageable pageable);
}
