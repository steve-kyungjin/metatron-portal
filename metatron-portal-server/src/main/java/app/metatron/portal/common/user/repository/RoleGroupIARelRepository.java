package app.metatron.portal.common.user.repository;

import app.metatron.portal.common.user.domain.MenuVO;
import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.common.user.domain.RoleGroupIARelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoleGroupIARelRepository extends JpaRepository<RoleGroupIARelEntity, String> {

    /**
     * 사용자에게 부여된 IA 와 퍼미션
     * @param userId
     * @return
     */
    @Query("select ir.ia as ia, max(ir.permission) as permission " +
            "from RoleGroupEntity rg, RoleGroupUserRelEntity ur, RoleGroupIARelEntity ir " +
            "where rg = ur.roleGroup " +
            "and rg = ir.roleGroup " +
            "and ur.user.userId = :userId " +
            "group by ir.ia " +
            "order by ir.ia.iaOrder asc ")
    List<MenuVO.IAAndPermission> getIAAndPermissionListByUserId(@Param("userId") String userId);

    /**
     * 그룹에 부여된 IA 와 퍼미션
     * @param groupId
     * @return
     */
    @Query("select ir.ia as ia, max(ir.permission) as permission " +
            "from RoleGroupEntity rg, RoleGroupIARelEntity ir " +
            "where rg = ir.roleGroup " +
            "and rg.id = :groupId " +
            "group by ir.ia " +
            "order by ir.ia.iaOrder asc ")
    List<MenuVO.IAAndPermission> getIAAndPermissionListByGroupId(@Param("groupId") String groupId);

    /**
     * 그룹으로 관련 IA 릴레이션 삭제
     * @param roleGroup
     * @return
     */
    int deleteByRoleGroup(RoleGroupEntity roleGroup);
}
