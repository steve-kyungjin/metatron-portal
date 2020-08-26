package app.metatron.portal.portal.metadata.repository;

import app.metatron.portal.portal.metadata.domain.MetaSubjectEntity;
import app.metatron.portal.portal.metadata.domain.MetaSubjectTableRelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MetaSubjectTableRelRepository extends JpaRepository<MetaSubjectTableRelEntity, String> {

    @Query("select distinct rel.subject from MetaSubjectTableRelEntity rel " +
            "where rel.table.id = :tableId " +
            "and rel.subject.delYn = false " +
            "order by rel.subject.id asc ")
    List<MetaSubjectEntity> getSubjectListByTable(@Param("tableId") String tableId);

    int deleteByTable_Id(String tableId);
}
