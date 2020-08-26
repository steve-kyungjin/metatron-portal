package app.metatron.portal.portal.report.repository;

import app.metatron.portal.portal.report.domain.ReportAppReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportAppReviewRepository extends JpaRepository<ReportAppReviewEntity, String> {
    /**
     * 앱 리뷰 조회 (답제외)
     * @param appId
     * @param pageable
     * @return
     */
    Page<ReportAppReviewEntity> findByApp_IdAndParent_IdIsNull(String appId, Pageable pageable);
}
