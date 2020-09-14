package app.metatron.portal.portal.communication.repository;

import app.metatron.portal.portal.communication.domain.CommRoleGroupRelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by linus on 2018. 11. 23..
 */
public interface CommRoleGroupRelRepository extends JpaRepository<CommRoleGroupRelEntity, String> {

    /**
     * 포스트로 관련 권한자 전제 삭제
     * @param id
     * @return
     */
    int deleteByPost_Id(String id);
}
