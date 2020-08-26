package app.metatron.portal.common.user.repository;

import app.metatron.portal.common.user.domain.UserStartPageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface UserStartPageRepository extends JpaRepository<UserStartPageEntity, String> {

    /**
     * 특정 사용자의 시작페이지 조회
     * @param userId
     * @return
     */
    UserStartPageEntity findByUser_UserId(@Param("userId") String userId);

}
