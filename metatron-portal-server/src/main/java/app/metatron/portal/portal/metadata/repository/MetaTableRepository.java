package app.metatron.portal.portal.metadata.repository;

import app.metatron.portal.portal.metadata.domain.MetaTableEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MetaTableRepository extends JpaRepository<MetaTableEntity, String> {

    /**
     * 전체 목록
     */
    Page<MetaTableEntity> findByDelYn(boolean delYn, Pageable pageable);

    /**
     * 주제영역으로 테이블 목록
     * @param subjects
     * @param criteriaId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select distinct tbl from MetaTableEntity tbl, MetaSubjectTableRelEntity rel " +
            "where tbl = rel.table " +
            "and rel.subject.id in :subjects " +
            "and tbl.delYn = false " +
            "and (:criteriaId is null or rel.subject.criteria.id = :criteriaId) " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or ( tbl.physicalNm like concat('%',:keyword,'%') or tbl.logicalNm like concat('%',:keyword,'%') )) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListBySubject(@Param("subjects") List<String> subjects, @Param("criteriaId") String criteriaId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 주제영역으로 테이블 목록\
     * @param criteriaId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select distinct tbl from MetaTableEntity tbl, MetaSubjectTableRelEntity rel " +
            "where tbl = rel.table " +
            "and (:criteriaId is null or rel.subject.criteria.id = :criteriaId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or ( tbl.physicalNm like concat('%',:keyword,'%') or tbl.logicalNm like concat('%',:keyword,'%') )) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListBySubject(@Param("criteriaId") String criteriaId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);


    /**
     * 주제영역으로 테이블 목록
     * @param subjects
     * @param criteriaId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select distinct tbl from MetaTableEntity tbl, MetaSubjectTableRelEntity rel " +
            "where tbl = rel.table " +
            "and rel.subject.id in :subjects " +
            "and (:criteriaId is null or rel.subject.criteria.id = :criteriaId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or tbl.physicalNm like concat('%',:keyword,'%') ) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListBySubjectAndPhysical(@Param("subjects") List<String> subjects, @Param("criteriaId") String criteriaId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 주제영역으로 테이블 목록
     * @param criteriaId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select distinct tbl from MetaTableEntity tbl, MetaSubjectTableRelEntity rel " +
            "where tbl = rel.table " +
            "and (:criteriaId is null or rel.subject.criteria.id = :criteriaId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or tbl.physicalNm like concat('%',:keyword,'%') ) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListBySubjectAndPhysical(@Param("criteriaId") String criteriaId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);


    /**
     * 주제영역으로 테이블 목록
     * @param subjects
     * @param criteriaId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select distinct tbl from MetaTableEntity tbl, MetaSubjectTableRelEntity rel " +
            "where tbl = rel.table " +
            "and rel.subject.id in :subjects " +
            "and (:criteriaId is null or rel.subject.criteria.id = :criteriaId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or tbl.logicalNm like concat('%',:keyword,'%') ) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListBySubjectAndLogical(@Param("subjects") List<String> subjects, @Param("criteriaId") String criteriaId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 주제영역으로 테이블 목록
     * @param criteriaId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select distinct tbl from MetaTableEntity tbl, MetaSubjectTableRelEntity rel " +
            "where tbl = rel.table " +
            "and (:criteriaId is null or rel.subject.criteria.id = :criteriaId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or tbl.logicalNm like concat('%',:keyword,'%') ) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListBySubjectAndLogical(@Param("criteriaId") String criteriaId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);


    /**
     * 데이터베이스로 테이블 목록
     * @param databaseId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select tbl from MetaTableEntity tbl " +
            "where (:databaseId is null or tbl.database.id = :databaseId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or ( tbl.physicalNm like concat('%',:keyword,'%') or tbl.logicalNm like concat('%',:keyword,'%') )) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListByDatabase(@Param("databaseId") String databaseId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 데이터베이스로 테이블 목록
     * @param databaseId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select tbl from MetaTableEntity tbl " +
            "where (:databaseId is null or tbl.database.id = :databaseId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or tbl.physicalNm like concat('%',:keyword,'%') ) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListByDatabaseAndPhysical(@Param("databaseId") String databaseId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 데이터베이스로 테이블 목록
     * @param databaseId
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select tbl from MetaTableEntity tbl " +
            "where (:databaseId is null or tbl.database.id = :databaseId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or tbl.logicalNm like concat('%',:keyword,'%') ) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListByDatabaseAndLogical(@Param("databaseId") String databaseId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);


    /**
     * 인스턴스로 테이블 목록
     * @return
     */
    @Query("select tbl from MetaTableEntity tbl " +
            "where (:instanceId is null or tbl.database.instance.id = :instanceId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or ( tbl.physicalNm like concat('%',:keyword,'%') or tbl.logicalNm like concat('%',:keyword,'%') )) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListByInstance(@Param("instanceId") String instanceId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 인스턴스로 테이블 목록
     * @return
     */
    @Query("select tbl from MetaTableEntity tbl " +
            "where (:instanceId is null or tbl.database.instance.id = :instanceId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or tbl.physicalNm like concat('%',:keyword,'%') ) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListByInstanceAndPhysical(@Param("instanceId") String instanceId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 인스턴스로 테이블 목록
     * @return
     */
    @Query("select tbl from MetaTableEntity tbl " +
            "where (:instanceId is null or tbl.database.instance.id = :instanceId) " +
            "and tbl.delYn = false " +
            "and (:layerId is null or tbl.layer.id = :layerId ) " +
            "and (:keyword is null or tbl.logicalNm like concat('%',:keyword,'%') ) " +
            "order by tbl.logicalNm, tbl.physicalNm asc ")
    Page<MetaTableEntity> getTableListByInstanceAndLogical(@Param("instanceId") String instanceId, @Param("layerId") String layerId, @Param("keyword") String keyword, Pageable pageable);


    /**
     * 동일 물리명의 컬럼을 참조하고 있는 테이블 수
     * @param physicalNm
     * @return
     */
    @Query("select distinct count(col.table.id) from MetaColumnEntity col " +
            "where col.physicalNm = :pNm " +
            "and col.table.delYn = false ")
    int getRelationTableCountByColumn(@Param("pNm") String physicalNm);

    /**
     * 동일 물리명의 컬럼을 참조하고 있는 테이블 목록
     * @param physicalNm
     * @param pageable
     * @return
     */
    @Query("select distinct col.table from MetaColumnEntity col " +
            "where col.physicalNm = :pNm " +
            "and col.table.delYn = false " +
            "group by col.table " +
            "order by col.table.physicalNm asc ")
    Page<MetaTableEntity> getRelationTableByColumn(@Param("pNm") String physicalNm, Pageable pageable);
}
