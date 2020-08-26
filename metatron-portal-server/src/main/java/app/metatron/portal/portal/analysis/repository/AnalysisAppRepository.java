package app.metatron.portal.portal.analysis.repository;

import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnalysisAppRepository extends JpaRepository<AnalysisAppEntity, String> ,AnalysisAppRepositoryCustom{

    /**
     * 사용여부 삭제 여부로 앱 조회
     * @param useYn
     * @param delYn
     * @return
     */
    List<AnalysisAppEntity> findByUseYnAndDelYnOrderByCreatedDateDesc(Boolean useYn, Boolean delYn);

    /**
     * 특정앱들을 제외한 앱 조회
     * @param id
     * @param useYn
     * @param delYn
     * @return
     */
    List<AnalysisAppEntity> findByIdNotInAndUseYnAndDelYnOrderByCreatedDateDesc(List<String> id, Boolean useYn, Boolean delYn);

    /**
     * 특정 사용자에 대한 마이앱 검색 조회
     * @param userId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select rel.app from AnalysisAppUserRelEntity rel " +
            "where rel.user.userId = :userId " +
            "and rel.app.appNm like CONCAT('%',:keyword ,'%') " +
            "and rel.app.useYn = true " +
            "and rel.app.delYn = false " +
            "order by rel.app.appNm asc ")
    Page<AnalysisAppEntity> getMyAppList(@Param("userId") String userId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 특정 사용자에 대한 마이앱 전체 목록
     * @param userId
     * @return
     */
    @Query("select rel.app from AnalysisAppUserRelEntity rel " +
            "where rel.user.userId = :userId " +
            "and rel.app.useYn = true " +
            "and rel.app.delYn = false " +
            "order by rel.app.appNm asc ")
    List<AnalysisAppEntity> getMyAppListAll(@Param("userId") String userId);

    /**
     * 특정 카테고리 별 관련 앱 카운트
     * @param categoryId
     * @return
     */
    @Query("select distinct count(rel.app) from AnalysisAppCategoryRelEntity rel " +
            "where rel.category.id = :categoryId ")
    int getCountByCategory(@Param("categoryId") String categoryId);

}
