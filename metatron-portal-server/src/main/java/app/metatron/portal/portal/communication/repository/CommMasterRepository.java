package app.metatron.portal.portal.communication.repository;


import app.metatron.portal.portal.communication.domain.CommMasterEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommMasterRepository extends JpaRepository<CommMasterEntity, String> {

    /**
     * 게시판 마스터 목록
     * @param useYn
     * @param pageable
     * @return
     */
    Page<CommMasterEntity> findByUseYnOrderByCreatedDateDesc(boolean useYn, Pageable pageable);

    /**
     * 유형에 따른 게시판 마스터 목록
     * @param postType
     * @return
     */
    @Query("select master from CommMasterEntity master " +
            "where (:postType is null or master.postType = :postType) " +
            "and master.useYn = 'Y' " +
            "order by master.dispOrder asc ")
    List<CommMasterEntity> getMasterListByPostType(@Param("postType") CommMasterEntity.PostType postType);

    /**
     * 슬러그로 마스터 조회
     * @param slug
     * @return
     */
    CommMasterEntity findBySlug(String slug);

    /**
     * 슬러그로 삭제
     * 사용하고 있지 않음
     * @param slug
     * @return
     */
    int deleteBySlug(String slug);
}
