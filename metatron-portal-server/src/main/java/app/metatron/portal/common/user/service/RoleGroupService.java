package app.metatron.portal.common.user.service;

import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.common.user.domain.*;
import app.metatron.portal.portal.report.domain.ReportAppEntity;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.user.repository.RoleGroupIARelRepository;
import app.metatron.portal.common.user.repository.RoleGroupRepository;
import app.metatron.portal.common.user.repository.RoleGroupUserRelRepository;
import app.metatron.portal.common.user.repository.RoleRequestRepository;
import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.analysis.service.AnalysisAppService;
import app.metatron.portal.portal.report.service.ReportAppService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;
import java.util.*;

/**
 * 권한 그룹 서비스(그룹 조직 등)
 */
@Transactional
@Service
public class RoleGroupService extends AbstractGenericService<RoleGroupEntity, String> {

    @Autowired
    private RoleGroupRepository roleGroupRepository;

    @Autowired
    private RoleGroupUserRelRepository roleGroupUserRelRepository;

    @Autowired
    private RoleGroupIARelRepository roleGroupIARelRepository;

    @Autowired
    private RoleRequestRepository roleRequestRepository;

    @Autowired
    private AnalysisAppService analysisAppService;

    @Autowired
    private ReportAppService reportAppService;

    @Autowired
    private UserService userService;

    @Autowired
    private IAService iaService;

    @Autowired
    protected ModelMapper modelMapper;

    @Override
    protected JpaRepository<RoleGroupEntity, String> getRepository() {
        return this.roleGroupRepository;
    }

    /**
     * 그룹 타입별 카운트
     * @return
     */
    public Map<String, Integer> getRoleGroupTypeCount() {
        Map<String, Integer> counts = new HashMap<>();

        counts.put(RoleGroupType.GENERAL.toString(), roleGroupRepository.countByType(RoleGroupType.GENERAL));
        counts.put(RoleGroupType.ORGANIZATION.toString(), roleGroupRepository.countByType(RoleGroupType.ORGANIZATION));

        return counts;
    }

    /**
     * 권한 그룹 목록
     * @param type
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<RoleGroupEntity> getRoleGroupList(RoleGroupType type, String keyword, Pageable pageable) {
        return roleGroupRepository.getRoleGroupList(type, keyword, pageable);
    }

    /**
     * 권한 그룹 루트
     * @param type
     * @return
     */
    public List<RoleGroupEntity> getRoleGroupRootList(RoleGroupType type) {
        return roleGroupRepository.findByTypeAndParentIsNullOrderByNameAsc(type);
    }

    /**
     * 그룹 중 조직 루트
     * SK텔레콤 한정 예외처리
     * @return
     */
    public List<RoleGroupEntity> getOrganizationRootList() {
        List<RoleGroupEntity> groupList = new ArrayList<>();
        groupList.add(roleGroupRepository.findOne(Const.RoleGroup.ORG_SKT));
        return groupList;
    }

    /**
     * 그룹 하위 노드
     * @param id
     * @return
     */
    public List<RoleGroupEntity> getRoleGroupChildren(String id) {
        RoleGroupEntity roleGroup = roleGroupRepository.findOne(id);
        if( roleGroup != null ) {
            return roleGroup.getChildren();
        }
        return new ArrayList<>();
    }

    /**
     * 특정 사용자에 대한 그룹
     * @param userId
     * @return
     */
    public List<RoleGroupEntity> getRoleGroupListByUser(String userId) {
        return roleGroupRepository.getRoleGroupListByUser(userId);
    }

    /**
     * 특정 그룹의 상위 노드
     * @param id
     * @return
     */
    public RoleGroupEntity getRoleGroupParent(String id) {
        RoleGroupEntity roleGroup = roleGroupRepository.findOne(id);
        if( roleGroup != null ) {
            return roleGroup.getParent();
        }
        return null;
    }

    /**
     * 특정 그룹 멤버
     * @param groupId
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<UserEntity> getRoleGroupMembers(String groupId, String keyword, Pageable pageable) {
        return roleGroupUserRelRepository.getRoleGroupMembers(groupId, keyword, pageable);
    }

    /**
     * 특정 그룹 멤버
     * @param groupId
     * @return
     */
    public List<UserEntity> getRoleGroupMembers(String groupId) {
        return roleGroupUserRelRepository.getRoleGroupMembers(groupId);
    }

    /**
     * 그룹 조회
     * @param groupId
     * @return
     */
    public RoleGroupEntity getRoleGroup(String groupId) {
        RoleGroupEntity group = roleGroupRepository.findOne(groupId);
        return group;
    }

    /**
     * 그룹 타입과 특정 사용자로 그룹 조회
     * @param type
     * @param userId
     * @return
     */
    public List<RoleGroupEntity> getRoleGroupByTypeAndUser(RoleGroupType type, String userId) {
        return roleGroupRepository.getRoleGroupByTypeAndUser(type, userId);
    }

    /**
     * 그룹 추가
     */
    public boolean addRoleGroup(RoleGroupDto.CREATE roleGroupDto) {
        int duplicate = roleGroupRepository.countByTypeAndName(RoleGroupType.valueOf(roleGroupDto.getType().toUpperCase()), roleGroupDto.getName());
        if( duplicate > 0 ) {
            return false;
        }
        RoleGroupEntity roleGroup = modelMapper.map(roleGroupDto, RoleGroupEntity.class);
        if( !StringUtils.isEmpty(roleGroupDto.getParentId())) {
            RoleGroupEntity parent = roleGroupRepository.findOne(roleGroupDto.getParentId());
            roleGroup.setParent(parent);
        }
        this.setCreateUserInfo(roleGroup);
        UUID uuid = UUID.randomUUID();
        roleGroup.setId(uuid.toString());
        return roleGroupRepository.save(roleGroup) != null;
    }

    /**
     * 그룹 수정
     */
    public boolean editRoleGroup(RoleGroupDto.EDIT roleGroupDto) {
        RoleGroupEntity roleGroup = roleGroupRepository.findOne(roleGroupDto.getId());
        if( roleGroup == null ) {
            return false;
        }
        roleGroup.setName(roleGroupDto.getName());
        // deny changing type
        roleGroup.setDescription(roleGroupDto.getDescription());
        if( !StringUtils.isEmpty(roleGroupDto.getParentId())) {
            RoleGroupEntity parent = roleGroupRepository.findOne(roleGroupDto.getParentId());
            roleGroup.setParent(parent);
        }
        this.setUpdateUserInfo(roleGroup);
        return roleGroupRepository.save(roleGroup) != null;
    }

    /**
     * 그룹 삭제
     * @param id
     */
    public void removeRoleGroup(String id) {
        RoleGroupEntity roleGroup = roleGroupRepository.findOne(id);
        this.removeRoleGroupUserRels(roleGroup);
        this.removeRoleGroupIARels(roleGroup);

        analysisAppService.removeRoleGroupRels(roleGroup);
        reportAppService.removeRoleGroupRels(roleGroup);

        roleGroupRepository.delete(id);
    }

    /**
     * 그룹에 멤버 추가
     */
    public boolean addRoleGroupMembers(RoleGroupDto.AddMember addMember) {
        boolean exist = false;
        RoleGroupEntity roleGroup = roleGroupRepository.findOne(addMember.getGroupId());
        if( roleGroup.getType() == RoleGroupType.GENERAL ) {
            if( roleGroup.getUserRels() != null && roleGroup.getUserRels().size() > 0 ) {
                roleGroupUserRelRepository.delete(roleGroup.getUserRels());
            }
            if( addMember.getUsers() != null && addMember.getUsers().size() > 0 ) {
                for( String userId : addMember.getUsers() ) {
                    int duplicate = roleGroupUserRelRepository.countByRoleGroupAndUser_UserId(roleGroup, userId);
                    if( duplicate > 0 ) {
                        exist = true;
                    } else {
                        UserEntity user = userService.get(userId);
                        RoleGroupUserRelEntity userRel = new RoleGroupUserRelEntity();
                        userRel.setRoleGroup(roleGroup);
                        userRel.setUser(user);
                        this.setCreateUserInfo(userRel);
                        roleGroupUserRelRepository.save(userRel);
                    }
                }
            }
        }
        return exist;
    }

    /**
     * 사용자와 그룹 관계 저장
     * @param userId
     * @param roleGroupId
     * @return
     */
    public RoleGroupUserRelEntity saveRelation(String userId, String roleGroupId) {
        UserEntity user = userService.get(userId);
        RoleGroupEntity roleGroup = roleGroupRepository.findOne(roleGroupId);
        return this.saveRelation(user, roleGroup);
    }

    /**
     * 사용자와 그룹 관계 저장
     * @param user
     * @param roleGroup
     * @return
     */
    public RoleGroupUserRelEntity saveRelation(UserEntity user, RoleGroupEntity roleGroup) {
        if( user != null && roleGroup != null ) {
            roleGroupUserRelRepository.deleteByUserAndRoleGroup(user, roleGroup);

            RoleGroupUserRelEntity rel = new RoleGroupUserRelEntity();
            rel.setUser(user);
            rel.setRoleGroup(roleGroup);
            return roleGroupUserRelRepository.save(rel);
        }
        return null;
    }

    /**
     * 특정 사용자의 IA와 퍼미션
     * @param userId
     * @return
     */
    public List<MenuVO.IAAndPermission> getIAAndPermissionListByUserId(String userId) {
        return roleGroupIARelRepository.getIAAndPermissionListByUserId(userId);
    }

    /**
     * 특정 그룹의 IA와 퍼미션
     * @param groupId
     * @return
     */
    public List<MenuVO.IAAndPermission> getIAAndPermissionListByGroupId(String groupId) {
        return roleGroupIARelRepository.getIAAndPermissionListByGroupId(groupId);
    }

    /**
     * 권한 요청 목록
     * @param keyword
     * @param status
     * @param pageable
     * @return
     */
    public Page<RoleRequestEntity> getRoleRequestList( String keyword, RoleRequestEntity.Status status, Pageable pageable ) {
        return roleRequestRepository.getListByKeywordAndStatus(keyword, status, pageable);
    }

    /**
     * 권한 요청 카운트
     * @param keyword
     * @return
     */
    public Map<String, Object> getRoleRequestCount(String keyword) {
        Map<String, Object> counts = new HashMap<>();
        int request = roleRequestRepository.getCountByKeywordAndStatus(keyword, RoleRequestEntity.Status.REQUEST);
        int accept = roleRequestRepository.getCountByKeywordAndStatus(keyword, RoleRequestEntity.Status.ACCEPT);
        counts.put("ALL", (request + accept));
        counts.put("REQUEST", request);
        counts.put("ACCEPT", accept);
        return counts;
    }

    /**
     * 권한 요청
     * @param appType
     * @param appId
     * @return
     */
    public RoleRequestEntity requestRole(RoleRequestEntity.AppType appType, String appId) {
        UserEntity user = this.getCurrentUser();

        RoleRequestEntity request = new RoleRequestEntity();
        request.setUser(user);
        request.setStatus(RoleRequestEntity.Status.REQUEST);
        request.setAppType(appType);
        switch( appType ) {
            case ANALYSIS_APP:
                AnalysisAppEntity analysisApp = analysisAppService.get(appId);
                request.setAnalysisApp(analysisApp);

                if( roleRequestRepository.checkDuplicateRequestByAnalysisApp(user, analysisApp) > 0 ) {
                    return null;
                }
                break;
            case REPORT_APP:
                ReportAppEntity reportApp = reportAppService.get(appId);
                request.setReportApp(reportApp);

                if( roleRequestRepository.checkDuplicateRequestByReportApp(user, reportApp) > 0 ) {
                    return null;
                }
                break;
        }
        this.setCreateUserInfo(request);
        return roleRequestRepository.save(request);
    }

    /**
     * 권한 승인
     * @param requestId
     * @return
     */
    public RoleRequestEntity acceptRoleRequest(String requestId) {
        RoleRequestEntity request = roleRequestRepository.findOne(requestId);
        if( request == null ) {
            return null;
        }

        boolean result = false;
        // user id == private role group id
        RoleGroupEntity roleGroup = roleGroupRepository.findOne(request.getUser().getUserId());
        switch( request.getAppType() ) {
            case ANALYSIS_APP:
                result = analysisAppService.saveRoleGroupRelation(roleGroup, request.getAnalysisApp());
                break;
            case REPORT_APP:
                result = reportAppService.saveRoleGroupRelation(roleGroup, request.getReportApp());
                break;
        }

        if( !result ) {
            return null;
        }

        request.setStatus(RoleRequestEntity.Status.ACCEPT);
        this.setUpdateUserInfo(request);

        return roleRequestRepository.save(request);
    }

    /**
     * 권한 요청 승인 거부
     * @param requestId
     * @return
     */
    public RoleRequestEntity denyRoleRequest(String requestId) {
        RoleRequestEntity request = roleRequestRepository.findOne(requestId);
        if( request == null ) {
            return null;
        }
        request.setStatus(RoleRequestEntity.Status.DENY);
        this.setUpdateUserInfo(request);

        return roleRequestRepository.save(request);
    }

    /**
     * 권한 요청건 삭제
     * @param requestId
     */
    public void removeRoleRequest(String requestId) {
        roleRequestRepository.delete(requestId);
    }

    /**
     * 특정 권한 그룹의 IA 관계 제거
     * @param roleGroup
     */
    public void removeRoleGroupIARels( RoleGroupEntity roleGroup ) {
        roleGroupIARelRepository.deleteByRoleGroup(roleGroup);
    }

    /**
     * 특정 권한 그룹의 사용자 관계 제거
     * @param roleGroup
     */
    public void removeRoleGroupUserRels( RoleGroupEntity roleGroup ) {
        roleGroupUserRelRepository.deleteByRoleGroup(roleGroup);
    }

    /**
     * 특정 사용자와 권한그룹으로 삭제
     * @param type
     * @param userId
     */
    public void removeRoleGroupUserRels( RoleGroupType type, String userId ) {
        roleGroupUserRelRepository.deleteByRoleGroup_TypeAndUser_UserId(type, userId);
    }

    /**
     * IA별 권한 설정
     * @param roleGroupId
     * @param iaAndPermissions
     * @return
     */
    public boolean setupIAPermission(String roleGroupId, List<RoleGroupDto.IA> iaAndPermissions) {
        List<RoleGroupIARelEntity> iaRels = new ArrayList<>();
        RoleGroupEntity roleGroup = roleGroupRepository.findOne(roleGroupId);
        this.removeRoleGroupIARels(roleGroup);
        if( iaAndPermissions != null && iaAndPermissions.size() > 0 ) {
            for( RoleGroupDto.IA ip : iaAndPermissions ) {
                if( !StringUtils.isEmpty(ip.getPermission()) ) {
                    RoleGroupIARelEntity rel = new RoleGroupIARelEntity();
                    IAEntity ia = iaService.get(ip.getIaId());
                    rel.setRoleGroup(roleGroup);
                    rel.setIa(ia);
                    rel.setPermission(PermissionType.valueOf(ip.getPermission().toUpperCase()));
                    this.setCreateUserInfo(rel);
                    iaRels.add(rel);
                }
            }
            iaRels = roleGroupIARelRepository.save(iaRels);
            return iaRels != null && iaRels.size() > 0;
        } else {
            // 초기화라고 간주
            return true;
        }
    }

    /**
     * IA별 권한 추가
     * @param roleGroupId
     * @param iaAndPermissions
     * @return
     */
    public boolean addIAPermission(String roleGroupId, List<RoleGroupDto.IA> iaAndPermissions) {
        List<RoleGroupIARelEntity> iaRels = new ArrayList<>();
        RoleGroupEntity roleGroup = roleGroupRepository.findOne(roleGroupId);
        if( iaAndPermissions != null && iaAndPermissions.size() > 0 ) {
            for( RoleGroupDto.IA ip : iaAndPermissions ) {
                if( !StringUtils.isEmpty(ip.getPermission()) ) {
                    RoleGroupIARelEntity rel = new RoleGroupIARelEntity();
                    IAEntity ia = iaService.get(ip.getIaId());
                    rel.setRoleGroup(roleGroup);
                    rel.setIa(ia);
                    rel.setPermission(PermissionType.valueOf(ip.getPermission().toUpperCase()));
                    this.setCreateUserInfo(rel);
                    iaRels.add(rel);
                }
            }
            iaRels = roleGroupIARelRepository.save(iaRels);
            return iaRels != null && iaRels.size() > 0;
        } else {
            return true;
        }
    }


    /**
     * 시스템 어드민 권한(특수) 부여
     * @param userId
     * @return
     */
    public boolean addSystemAdmin(String userId) {
        RoleGroupEntity adminGroup = roleGroupRepository.findOne(Const.RoleGroup.SYSTEM_ADMIN);
        if( roleGroupUserRelRepository.countByRoleGroupAndUser_UserId(adminGroup, userId) > 0 ) {
            return false;
        }
        UserEntity user = userService.get(userId);
        RoleGroupUserRelEntity rel = new RoleGroupUserRelEntity();
        rel.setRoleGroup(adminGroup);
        rel.setUser(user);
        this.setCreateUserInfo(rel);

        return roleGroupUserRelRepository.save(rel) != null;
    }

    /**
     * 시스템 어드민 권한(특수) 제거
     * @param userId
     * @return
     */
    public boolean removeSystemAdmin(String userId) {
        RoleGroupEntity adminGroup = roleGroupRepository.findOne(Const.RoleGroup.SYSTEM_ADMIN);
        if( roleGroupUserRelRepository.countByRoleGroupAndUser_UserId(adminGroup, userId) == 0 ) {
            return false;
        }
        UserEntity user = userService.get(userId);
        return roleGroupUserRelRepository.deleteByUserAndRoleGroup(user, adminGroup) > 0;
    }

}
