package app.metatron.portal.common.user.repository;

import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.common.user.domain.RoleGroupType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoleGroupRepository extends JpaRepository<RoleGroupEntity, String> {

    /**
     * 타입에 따른 그룹 조회
     * @param type
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select rgroup from RoleGroupEntity rgroup " +
            "where rgroup.type = :type " +
            "and ( :keyword is null or rgroup.name like concat('%',:keyword,'%') ) " +
            "order by rgroup.name asc ")
    Page<RoleGroupEntity> getRoleGroupList(@Param("type") RoleGroupType type, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 사용자와 연관된 그룹 조회
     * @param userId
     * @return
     */
    @Query("select distinct rel.roleGroup from RoleGroupUserRelEntity rel " +
            "where rel.user.userId = :userId ")
    List<RoleGroupEntity> getRoleGroupListByUser(@Param("userId") String userId);

    /**
     * 사용자 기준 특정 그룹 타입의 그룹 리스트
     * @param type
     * @param userId
     * @return
     */
    @Query("select distinct rel.roleGroup from RoleGroupUserRelEntity rel " +
            "where rel.roleGroup.type = :type " +
            "and rel.user.userId = :userId ")
    List<RoleGroupEntity> getRoleGroupByTypeAndUser(@Param("type") RoleGroupType type, @Param("userId") String userId);

    /**
     * 타입에 따른 1레벨 그룹 조회 (트리)
     * @param type
     * @return
     */
    List<RoleGroupEntity> findByTypeAndParentIsNullOrderByNameAsc(RoleGroupType type);

    /**
     * 타입과 이름이 같은 그룹 카운트
     * @param type
     * @param groupNm
     * @return
     */
    int countByTypeAndName(RoleGroupType type, String groupNm);

    /**
     * 타입에 따른 그룹 카운트
     * @param type
     * @return
     */
    int countByType(RoleGroupType type);

}
