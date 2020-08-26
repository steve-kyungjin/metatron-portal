package app.metatron.portal.portal.metadata.repository;

import app.metatron.portal.portal.metadata.domain.MetaSystemEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MetaSystemRepository extends JpaRepository<MetaSystemEntity, String> {

    /**
     * 연계 시스템 목록
     * @param operTypeId
     * @param directionId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select sys from MetaSystemEntity sys " +
            "where (:operTypeId is null or sys.operType.id = :operTypeId) " +
            "and (:directionId is null or sys.direction.id = :directionId) " +
            "and sys.delYn = false " +
            "and (:keyword is null or ( sys.stdNm like concat('%',:keyword,'%') or sys.fullNm like concat('%',:keyword,'%') )) " +
            "order by sys.stdNm asc ")
    Page<MetaSystemEntity> getSystemList(@Param("operTypeId") String operTypeId, @Param("directionId") String directionId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 연계 시스템 목록
     * @param operTypeId
     * @param directionId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select sys from MetaSystemEntity sys " +
            "where (:operTypeId is null or sys.operType.id = :operTypeId) " +
            "and (:directionId is null or sys.direction.id = :directionId) " +
            "and sys.delYn = false " +
            "and (:keyword is null or ( sys.stdNm like concat('%',:keyword,'%') )) " +
            "order by sys.stdNm asc ")
    Page<MetaSystemEntity> getSystemListByStdNm(@Param("operTypeId") String operTypeId, @Param("directionId") String directionId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 연계 시스템 목록
     * @param operTypeId
     * @param directionId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select sys from MetaSystemEntity sys " +
            "where (:operTypeId is null or sys.operType.id = :operTypeId) " +
            "and (:directionId is null or sys.direction.id = :directionId) " +
            "and sys.delYn = false " +
            "and (:keyword is null or ( sys.fullNm like concat('%',:keyword,'%') )) " +
            "order by sys.stdNm asc ")
    Page<MetaSystemEntity> getSystemListByFullNm(@Param("operTypeId") String operTypeId, @Param("directionId") String directionId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 연계 시스템 루트 목록
     * @return
     */
    @Query("select sys from MetaSystemEntity sys " +
            "where sys.parent is null " +
            "and sys.delYn = false " +
            "order by sys.id asc ")
    List<MetaSystemEntity> getSystemRootList();

}
