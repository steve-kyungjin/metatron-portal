package app.metatron.portal.common.user.repository;

import app.metatron.portal.common.user.domain.UserTangoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTangoRepository extends JpaRepository<UserTangoEntity, String> {
    
	
}
