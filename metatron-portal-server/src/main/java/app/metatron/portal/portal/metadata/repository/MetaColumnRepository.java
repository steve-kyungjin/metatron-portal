package app.metatron.portal.portal.metadata.repository;

import app.metatron.portal.portal.metadata.domain.MetaColumnEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetaColumnRepository extends JpaRepository<MetaColumnEntity, String> {

    /**
     * 특정 테이블의 컬럼 목록
     * @param tableId
     * @return
     */
    List<MetaColumnEntity> findByDelYnAndTable_IdOrderByLogicalNmAsc(boolean delYn, String tableId);

    /**
     * 전체 목록
     */
    Page<MetaColumnEntity> findByDelYn(boolean delYn, Pageable pageable);
}
