package app.metatron.portal.common.user.repository;

import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.common.user.domain.RoleGroupType;
import app.metatron.portal.common.user.domain.RoleGroupUserRelEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoleGroupUserRelRepository extends JpaRepository<RoleGroupUserRelEntity, String> {

    /**
     * 그룹내 동일 사용자 수
     * @param roleGroup
     * @param userId
     * @return
     */
    int countByRoleGroupAndUser_UserId(RoleGroupEntity roleGroup, String userId);

    /**
     * 특정 그룹내 멤버 조회
     * @param groupId
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select distinct rel.user from RoleGroupUserRelEntity rel " +
            "where rel.roleGroup.id = :groupId " +
            "and ( :keyword is null or (rel.user.userId like concat('%',:keyword,'%') or rel.user.userNm like concat('%',:keyword,'%') ) ) " +
            "and rel.user.useYn = true " +
            "order by rel.user.userNm asc ")
    Page<UserEntity> getRoleGroupMembers(@Param("groupId") String groupId, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 특정 그룹내 멤버 조회 (전체)
     * @param groupId
     * @return
     */
    @Query("select distinct rel.user from RoleGroupUserRelEntity rel " +
            "where rel.roleGroup.id = :groupId " +
            "and rel.user.useYn = true " +
            "order by rel.user.userNm asc ")
    List<UserEntity> getRoleGroupMembers(@Param("groupId") String groupId);

    /**
     * 특정그룹에 대한 모든 사용자 관계 삭제
     * @param id
     * @return
     */
    int deleteByRoleGroup_Id(String id);

    /**
     * 특정그룹에 대한 모든 사용자 관계 삭제
     * @param roleGroup
     * @return
     */
    int deleteByRoleGroup(RoleGroupEntity roleGroup);

    /**
     * 특정그룹과 특정 사용자에 대한 관계 삭제
     * @param user
     * @param roleGroup
     * @return
     */
    int deleteByUserAndRoleGroup(UserEntity user, RoleGroupEntity roleGroup);

    /**
     * 특정 사용자와 권한그룹으로 삭제
     * @return
     */
    int deleteByRoleGroup_TypeAndUser_UserId(RoleGroupType type, String userId);

}

