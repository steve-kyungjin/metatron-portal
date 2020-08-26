package app.metatron.portal.portal.report.repository;

import app.metatron.portal.portal.report.domain.ReportAppEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportAppRepository extends JpaRepository<ReportAppEntity, String>, ReportAppRepositoryCustom {

    /**
     * 리포트앱 목록
     * @param useYn
     * @param delYn
     * @return
     */
    List<ReportAppEntity> findByUseYnAndDelYnOrderByCreatedDateDesc(Boolean useYn, Boolean delYn);

    /**
     * 특정 앱 제외 앱 목록
     * @param id
     * @param useYn
     * @param delYn
     * @return
     */
    List<ReportAppEntity> findByIdNotInAndUseYnAndDelYnOrderByCreatedDateDesc(List<String> id, Boolean useYn, Boolean delYn);

    /**
     * 마이앱 목록
     * @param userId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select rel.app from ReportAppUserRelEntity rel " +
            "where rel.user.userId = :userId " +
            "and rel.app.appNm like CONCAT('%',:keyword ,'%') " +
            "and rel.app.useYn = true " +
            "and rel.app.delYn = false " +
            "order by rel.app.appNm asc ")
    Page<ReportAppEntity> getMyAppList(@Param("userId") String userId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 마이앱 목록 전체
     * @param userId
     * @return
     */
    @Query("select rel.app from ReportAppUserRelEntity rel " +
            "where rel.user.userId = :userId " +
            "and rel.app.useYn = true " +
            "and rel.app.delYn = false " +
            "order by rel.app.appNm asc ")
    List<ReportAppEntity> getMyAppListAll(@Param("userId") String userId);

    /**
     * 카테고리별 앱 카운트
     * @param categoryId
     * @return
     */
    @Query("select distinct count(rel.app) from ReportAppCategoryRelEntity rel " +
            "where rel.category.id = :categoryId ")
    int getCountByCategory(@Param("categoryId") String categoryId);
}
