package app.metatron.portal.common.user.repository;

import app.metatron.portal.common.user.domain.UserDto;
import app.metatron.portal.common.user.domain.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<UserEntity, String> {

    /**
     * 사용자 목록 조회
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select user from UserEntity user " +
            "where ( :keyword is null or user.userNm like concat('%',:keyword,'%') or user.userId like concat('%',:keyword,'%') ) " +
            "and user.useYn = true ")
    Page<UserDto.User> getUserListSearchByKeyword(@Param("keyword") String keyword, Pageable pageable);


    /**
     * 사용자 조회 (이메일 용도)
     * @param keyword
     * @return
     */
    @Query("select user from UserEntity  user " +
            "where user.emailAddr is not null " +
            "and user.useYn = true " +
            "and (:keyword is null or user.userNm like concat ('%',:keyword,'%') or user.userId like concat('%',:keyword,'%') ) " +
            "order by user.userNm asc ")
    List<UserEntity> getUserSearchEmail(@Param("keyword") String keyword);

    /**
     * 사용자 ID 포함 사용자 조회
     * @param userid
     * @return
     */
    List<UserEntity> findByUseYnAndUserIdLike(boolean useYn, String userid);

    /**
     * 사용자 많은 정보 용도
     * @param userId
     * @return
     */
    UserDto.User findByUserId(String userId);

}
