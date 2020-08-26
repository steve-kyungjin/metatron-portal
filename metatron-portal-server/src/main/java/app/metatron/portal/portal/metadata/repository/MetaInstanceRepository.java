package app.metatron.portal.portal.metadata.repository;

import app.metatron.portal.portal.metadata.domain.MetaInstanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetaInstanceRepository extends JpaRepository<MetaInstanceEntity, String> {

    /**
     * 인스턴스 논리명 정렬 목록
     * @return
     */
    List<MetaInstanceEntity> findByDelYnOrderByLogicalNmAscPhysicalNmAsc(boolean delYn);
}
