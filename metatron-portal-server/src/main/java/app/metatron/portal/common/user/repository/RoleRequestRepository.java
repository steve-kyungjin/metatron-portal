package app.metatron.portal.common.user.repository;

import app.metatron.portal.common.user.domain.RoleRequestEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.report.domain.ReportAppEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RoleRequestRepository extends JpaRepository<RoleRequestEntity, String> {

    /**
     * 권한 요청 조회
     * @param keyword
     * @param status
     * @param pageable
     * @return
     */
    @Query("select rr from RoleRequestEntity  rr " +
            "where (:status is null or rr.status = :status) " +
            "and (:keyword is null or (rr.user.userNm like concat('%',:keyword,'%') or rr.user.userId like concat('%',:keyword,'%') " +
//            "or (rr.analysisApp is not null and rr.analysisApp.appNm like concat('%',:keyword,'%')) or (rr.reportApp is not null and rr.reportApp.appNm like concat('%',:keyword,'%')) " +
            ")) " +
            "order by rr.createdDate desc")
    Page<RoleRequestEntity> getListByKeywordAndStatus(@Param("keyword") String keyword, @Param("status") RoleRequestEntity.Status status, Pageable pageable );

    /**
     * 타입에 따른 권한요청건 카운트
     * @param keyword
     * @param status
     * @return
     */
    @Query("select count(rr) from RoleRequestEntity  rr " +
            "where (:status is null or rr.status = :status) " +
            "and (:keyword is null or (rr.user.userNm like concat('%',:keyword,'%') or rr.user.userId like concat('%',:keyword,'%') " +
//            "or (rr.analysisApp is not null and rr.analysisApp.appNm like concat('%',:keyword,'%')) or (rr.reportApp is not null and rr.reportApp.appNm like concat('%',:keyword,'%')) " +
            ")) ")
    int getCountByKeywordAndStatus(@Param("keyword") String keyword, @Param("status") RoleRequestEntity.Status status );

    /**
     * 특정 분석앱에 대한 사용자 권한 요청 확인
     * @param user
     * @param app
     * @return
     */
    @Query("select count(rr) from RoleRequestEntity rr " +
            "where rr.appType = 'ANALYSIS_APP' " +
            "and rr.status = 'REQUEST' " +
            "and rr.analysisApp = :app " +
            "and rr.user = :user ")
    int checkDuplicateRequestByAnalysisApp(@Param("user") UserEntity user, @Param("app") AnalysisAppEntity app);

    /**
     * 특정 리포트에 대한 사용자 권한 요청 확인
     * @param user
     * @param app
     * @return
     */
    @Query("select count(rr) from RoleRequestEntity rr " +
            "where rr.appType = 'REPORT_APP' " +
            "and rr.status = 'REQUEST' " +
            "and rr.reportApp = :app " +
            "and rr.user = :user ")
    int checkDuplicateRequestByReportApp(@Param("user") UserEntity user, @Param("app") ReportAppEntity app);

}
