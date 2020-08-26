package app.metatron.portal.portal.metadata.repository;

import app.metatron.portal.portal.metadata.domain.MetaDictionaryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MetaDictionaryRepository extends JpaRepository<MetaDictionaryEntity, String> {


    /**
     * 용어사전 목록
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select dic from MetaDictionaryEntity dic " +
            "where ( :keyword is null or ( dic.nmKr like concat('%',:keyword,'%') or dic.nmEn like concat('%',:keyword,'%') or dic.abbr like concat('%',:keyword,'%') ) ) " +
            "order by dic.nmKr asc ")
    Page<MetaDictionaryEntity> getDictionaryList(@Param("keyword") String keyword, Pageable pageable);
}
