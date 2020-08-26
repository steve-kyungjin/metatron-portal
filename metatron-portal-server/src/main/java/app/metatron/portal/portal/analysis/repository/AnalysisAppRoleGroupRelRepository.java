package app.metatron.portal.portal.analysis.repository;

import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.portal.analysis.domain.AnalysisAppRoleGroupRelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface AnalysisAppRoleGroupRelRepository extends JpaRepository<AnalysisAppRoleGroupRelEntity, String> {

    /**
     * 특정 앱에 대한 권한 부여 목록
     * @param id
     * @return
     */
    @Query("select distinct rel.roleGroup " +
            "from AnalysisAppRoleGroupRelEntity rel " +
            "where rel.app.id = :appId ")
    List<RoleGroupEntity> getAppRoleList(@Param("appId") String id);

    /**
     * 권한 그룹 으로 관계 삭제
     * @param roleGroup
     * @return
     */
    int deleteByRoleGroup(RoleGroupEntity roleGroup);
}
