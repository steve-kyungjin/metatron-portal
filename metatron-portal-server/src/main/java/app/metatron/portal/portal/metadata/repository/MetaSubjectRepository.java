package app.metatron.portal.portal.metadata.repository;

import app.metatron.portal.portal.metadata.domain.MetaSubjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MetaSubjectRepository extends JpaRepository<MetaSubjectEntity, String> {

    /**
     * 분류 기준으로 루트 주제영역 조회
     * @param criteriaId
     * @return
     */
    List<MetaSubjectEntity> findByDelYnAndCriteria_IdAndParentIsNullOrderByIdAsc(boolean delYn, String criteriaId);

    /**
     * 루트 주제영역 조회
     * @return
     */
    List<MetaSubjectEntity> findByDelYnAndParentIsNullOrderByIdAsc(boolean delYn);

    /**
     * 주제영역 목록
     * @param criteriaId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select sbj from MetaSubjectEntity sbj " +
            "where (:criteriaId is null or sbj.criteria.id = :criteriaId) " +
            "and sbj.delYn = false " +
            "and (:keyword is null or ( sbj.nmKr like concat('%',:keyword,'%') or sbj.nmEn like concat('%',:keyword,'%') ) ) " +
            "order by sbj.id asc ")
    Page<MetaSubjectEntity> getSubjectListByCriteria(@Param("criteriaId") String criteriaId, @Param("keyword") String keyword, Pageable pageable);

    
}
