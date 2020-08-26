package app.metatron.portal.common.user.repository;

import app.metatron.portal.common.user.domain.IAEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IARepository extends JpaRepository<IAEntity, String> {

    /**
     * 루트 조회
     * @return
     */
    List<IAEntity> findByParentIsNullOrderByIaOrder();

    /**
     * 특정 메뉴 하위 커뮤니케이션의 기간내 등록건수
     * @param parentId
     * @param startDate
     * @param endDate
     * @return
     */
    @Query("select count(post) from CommPostEntity post, IAEntity ia " +
            "where post.master.slug = substring_index(ia.path, '/', -1) " +
            "and post.master.useYn = true " +
            "and post.draft = false " +
            "and ia.linkYn = true " +
            "and ia.displayYn = true " +
            "and ia.parent.id = :parentId " +
            "and date_format(post.createdDate, '%Y-%m-%d') <= :startDate " +
            "and date_format(post.createdDate, '%Y-%m-%d') > :endDate ")
    int getPostLast2DayCountByIa(@Param("parentId") String parentId, @Param("startDate") String startDate, @Param("endDate") String endDate);
}
