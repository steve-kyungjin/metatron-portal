package app.metatron.portal.portal.report.repository;

import app.metatron.portal.portal.report.domain.ReportAppUserRelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportAppUserRelRepository extends JpaRepository<ReportAppUserRelEntity, String> {

    /**
     * 특정 사용자의 특정 앱 카운트
     * @param appId
     * @param userId
     * @return
     */
    int countByApp_IdAndUser_UserId(String appId, String userId);

    /**
     * 특정 사용자의 특정 앱 조회
     * @param appId
     * @param userId
     * @return
     */
    ReportAppUserRelEntity findByApp_IdAndUser_UserId(String appId, String userId);
}
