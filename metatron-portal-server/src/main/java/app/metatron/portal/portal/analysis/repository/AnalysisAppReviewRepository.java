package app.metatron.portal.portal.analysis.repository;

import app.metatron.portal.portal.analysis.domain.AnalysisAppReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalysisAppReviewRepository extends JpaRepository<AnalysisAppReviewEntity, String> {

    /**
     * 특정 앱에 대한 리뷰 (답글제외)
     * @param appId
     * @param pageable
     * @return
     */
    Page<AnalysisAppReviewEntity> findByApp_IdAndParent_IdIsNull(String appId, Pageable pageable);
}
