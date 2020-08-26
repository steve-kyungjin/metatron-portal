package app.metatron.portal.common.user.repository;

import app.metatron.portal.common.user.domain.OrgTangoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrgTangoRepository extends JpaRepository<OrgTangoEntity, String> {
    
	
}
