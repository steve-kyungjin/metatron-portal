package app.metatron.portal.common.code.repository;

import app.metatron.portal.common.code.domain.GroupCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupCodeRepository extends JpaRepository<GroupCodeEntity, String> ,GroupCodeRepositoryCustom{

	
}
