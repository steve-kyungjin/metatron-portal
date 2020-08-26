package app.metatron.portal.portal.analysis.repository;

import app.metatron.portal.portal.analysis.domain.AnalysisAppUserRelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalysisAppUserRelRepository extends JpaRepository<AnalysisAppUserRelEntity, String> {

    /**
     * 특정 앱과 특정 사용자에 대한 마이앱 등록 건수
     * @param appId
     * @param userId
     * @return
     */
    int countByApp_IdAndUser_UserId(String appId, String userId);

    /**
     * 특정 앱과 특정 사용자에 대한 마이앱 등록 건 조회
     * @param appId
     * @param userId
     * @return
     */
    AnalysisAppUserRelEntity findByApp_IdAndUser_UserId(String appId, String userId);

}
