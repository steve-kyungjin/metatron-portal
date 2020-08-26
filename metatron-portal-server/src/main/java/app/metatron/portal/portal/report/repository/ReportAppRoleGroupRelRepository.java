package app.metatron.portal.portal.report.repository;

import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.portal.report.domain.ReportAppRoleGroupRelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ReportAppRoleGroupRelRepository extends JpaRepository<ReportAppRoleGroupRelEntity, String> {

    /**
     * 특정 앱 권한그룹 목록
     * @param id
     * @return
     */
    @Query("select distinct rel.roleGroup " +
            "from ReportAppRoleGroupRelEntity rel " +
            "where rel.app.id = :appId ")
    List<RoleGroupEntity> getAppRoleList(@Param("appId") String id);

    /**
     * 특정 권한 그룹 삭제
     * @param roleGroup
     * @return
     */
    int deleteByRoleGroup(RoleGroupEntity roleGroup);
}
