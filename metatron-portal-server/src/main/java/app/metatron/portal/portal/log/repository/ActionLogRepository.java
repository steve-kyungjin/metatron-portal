package app.metatron.portal.portal.log.repository;


import app.metatron.portal.portal.log.domain.ActionLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActionLogRepository extends JpaRepository<ActionLogEntity, String> {


}
