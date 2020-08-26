package app.metatron.portal.portal.project.repository;

import app.metatron.portal.portal.project.domain.ProjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<ProjectEntity, String> {

    /**
     * 연도로 과제 목록
     * @param year
     * @param pageable
     * @return
     */
    Page<ProjectEntity> findByStartDateStartingWith(String year, Pageable pageable);

    /**
     * 과제 목록
     * @param pageable
     * @return
     */
    Page<ProjectEntity> findByOrderByCreatedDateDesc(Pageable pageable);
}
