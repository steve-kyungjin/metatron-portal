package app.metatron.portal.portal.metadata.repository;

import app.metatron.portal.portal.metadata.domain.MetaDatabaseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MetaDatabaseRepository extends JpaRepository<MetaDatabaseEntity, String> {


    /**
     * 인스턴스 연관 데이터베이스 목록
     * @param instanceId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select db from MetaDatabaseEntity db " +
            "where (:instanceId is null or db.instance.id = :instanceId) " +
            "and (:layerId is null or db.layer.id = :layerId) " +
            "and db.delYn = false " +
            "and (:keyword is null or ( db.physicalNm like concat('%',:keyword,'%') or db.logicalNm like concat('%',:keyword,'%') )) " +
            "order by db.logicalNm, db.physicalNm asc ")
    Page<MetaDatabaseEntity> getDatabaseListByInstance(@Param("instanceId") String instanceId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 인스턴스 연관 데이터베이스 목록 (물리명 검색)
     * @param instanceId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select db from MetaDatabaseEntity db " +
            "where (:instanceId is null or db.instance.id = :instanceId) " +
            "and (:layerId is null or db.layer.id = :layerId) " +
            "and db.delYn = false " +
            "and (:keyword is null or db.physicalNm like concat('%',:keyword,'%') ) " +
            "order by db.logicalNm, db.physicalNm asc ")
    Page<MetaDatabaseEntity> getDatabaseListByInstanceAndPhysical(@Param("instanceId") String instanceId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 인스턴스 연관 데이터베이스 목록 (논리명 검색)
     * @param instanceId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select db from MetaDatabaseEntity db " +
            "where (:instanceId is null or db.instance.id = :instanceId) " +
            "and (:layerId is null or db.layer.id = :layerId) " +
            "and db.delYn = false " +
            "and (:keyword is null or db.logicalNm like concat('%',:keyword,'%') ) " +
            "order by db.logicalNm, db.physicalNm asc ")
    Page<MetaDatabaseEntity> getDatabaseListByInstanceAndLogical(@Param("instanceId") String instanceId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);

}
