package app.metatron.portal.web.api.user;

import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.user.domain.*;
import app.metatron.portal.common.user.service.RoleGroupService;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.value.ResultVO;
import app.metatron.portal.portal.analysis.service.AnalysisAppService;
import app.metatron.portal.portal.report.service.ReportAppService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class RoleGroupController extends AbstractController {

    @Autowired
    private RoleGroupService roleGroupService;

    @Autowired
    private AnalysisAppService analysisAppService;

    @Autowired
    private ReportAppService reportAppService;

    @Autowired
    protected ModelMapper modelMapper;

    /**
     * 그룹 리스트
     * @param authorization
     * @param pageable
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "사용자 그룹 리스트 조회",
            notes = "사용자 그룹 리스트 조회"
    )
    @RequestMapping(value = Path.GROUP, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getRoleGroupList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "type") String type,
            Pageable pageable
    ){
        Page<RoleGroupEntity> groupList = roleGroupService.getRoleGroupList(RoleGroupType.valueOf(type.toUpperCase()), keyword, pageable);
        Map<String, Integer> counts = roleGroupService.getRoleGroupTypeCount();

        Map<String, Object> data = new HashMap<>();
        data.put("groupList", groupList);
        data.put("counts", counts);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹 root 리스트
     * @param authorization
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "사용자 그룹 root 리스트 조회",
            notes = "사용자 그룹 root 리스트 조회"
    )
    @RequestMapping(value = Path.GROUP_ROOT_LIST, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getRoleGroupRootList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam(name = "type") String type
    ){
        List<RoleGroupEntity> groupList = null;
        RoleGroupType groupType = RoleGroupType.valueOf(type.toUpperCase());
        if( RoleGroupType.ORGANIZATION == groupType ) {
            groupList = roleGroupService.getOrganizationRootList();
        } else {
            groupList = roleGroupService.getRoleGroupRootList(groupType);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("groupList", groupList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹 상세
     * @param authorization
     * @param id
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "사용자 그룹 상세 조회",
            notes = "사용자 그룹 상세 조회"
    )
    @RequestMapping(value = Path.GROUP_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getGroupDetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "g00000001",
                    value = "user's group id"
            )
            @PathVariable("id") String id
    ){
        RoleGroupEntity group = roleGroupService.getRoleGroup(id);
        List<MenuVO.IAAndPermission> iaAndPermissionList = roleGroupService.getIAAndPermissionListByGroupId(id);

        Map<String, Object> data = new HashMap<>();
        data.put("group", group);
        data.put("iaAndPermissionList", iaAndPermissionList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹 상세 children
     * @param authorization
     * @param id
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "사용자 그룹 상세 children 조회",
            notes = "사용자 그룹 상세 children 조회"
    )
    @RequestMapping(value = Path.GROUP_CHILDREN, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getRoleGroupChildren(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "g00000001",
                    value = "user's group id"
            )
            @PathVariable("id") String id
    ){
        List<RoleGroupEntity> groupList = roleGroupService.getRoleGroupChildren(id);

        Map<String, Object> data = new HashMap<>();
        data.put("groupList", groupList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹 상세 parent
     * @param authorization
     * @param id
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "사용자 그룹 상세 parent 조회",
            notes = "사용자 그룹 상세 parent 조회"
    )
    @RequestMapping(value = Path.GROUP_PARENT, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getRoleGroupParent(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "g00000001",
                    value = "user's group id"
            )
            @PathVariable("id") String id
    ){
        RoleGroupEntity group = roleGroupService.getRoleGroupParent(id);

        Map<String, Object> data = new HashMap<>();
        data.put("group", group);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹 생성
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "사용자 그룹 추가",
            notes = "사용자 그룹 추가"
    )
    @RequestMapping(value = Path.GROUP, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addRoleGroup(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid @RequestBody RoleGroupDto.CREATE roleGroupDto,
            BindingResult bindingResult
    ){
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        boolean result = roleGroupService.addRoleGroup(roleGroupDto);

        ResultVO resultVO = null;
        if(result) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹 수정
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "사용자 그룹 수정",
            notes = "사용자 그룹 수정"
    )
    @RequestMapping(value = Path.GROUP_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> editRoleGroup(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "g00000001",
                    value = "user's group id"
            )
            @PathVariable("id") String id,
            @Valid @RequestBody RoleGroupDto.EDIT roleGroupDto,
            BindingResult bindingResult
    ){
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        roleGroupDto.setId(id);
        boolean result = roleGroupService.editRoleGroup(roleGroupDto);

        ResultVO resultVO = null;
        if(result) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹 삭제
     * @param authorization
     * @param id
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "사용자 그룹 삭제",
            notes = "사용자 그룹 삭제"
    )
    @RequestMapping(value = Path.GROUP_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteRoleGroup(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "g00000002",
                    value = "user's group id"
            )
            @PathVariable("id") String id
    ){

        roleGroupService.removeRoleGroup(id);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹 멤버 추가
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "사용자 그룹 멤버추가",
            notes = "사용자 그룹 멤버추가"
    )
    @RequestMapping(value = Path.GROUP_ADD_MEMBER, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> addRoleGroupMembers(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "g00000001",
                    value = "user's group id"
            )
            @PathVariable("id") String id,
            @Valid @RequestBody RoleGroupDto.AddMember addMember,
            BindingResult bindingResult
    ){
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        addMember.setGroupId(id);
        boolean result = roleGroupService.addRoleGroupMembers(addMember);

        Map<String, Object> data = new HashMap<>();
        data.put("exist", result);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹 member list
     * @param authorization
     * @param id
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "사용자 그룹 member list",
            notes = "사용자 그룹 member list"
    )
    @RequestMapping(value = Path.GROUP_MEMBERS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getRoleGroupMembers(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "g00000001",
                    value = "user's group id"
            )
            @PathVariable("id") String id,
            @ApiParam(
                    defaultValue = "",
                    value = "keyword"
            )
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ){
        Page<UserEntity> memberList = roleGroupService.getRoleGroupMembers(id, keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("memberList", memberList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * App 기준 목록 조회 (분석앱)
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "App 기준 RoleGroup 조회(분석앱)",
            notes = "App 기준 RoleGroup 조회(분석앱)"
    )
    @RequestMapping(value = Path.GROUP_ANALYSIS_APP, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAnalysisAppRoleGroupList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable(name = "id") String appId
    ){

        List<RoleGroupEntity> appRoleList = analysisAppService.getAppRoleList(appId);

        Map<String, Object> data = new HashMap<>();
        data.put("appRoleList", appRoleList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * App 기준 목록 조회 (Report앱)
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "App 기준 RoleGroup 조회(분석앱)",
            notes = "App 기준 RoleGroup 조회(분석앱)"
    )
    @RequestMapping(value = Path.GROUP_REPORT_APP, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getReportAppRoleGroupList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable(name = "id") String appId
    ){

        List<RoleGroupEntity> appRoleList = reportAppService.getAppRoleList(appId);

        Map<String, Object> data = new HashMap<>();
        data.put("appRoleList", appRoleList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * RoleGroup 신청 목록
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "Role 신청 목록",
            notes = "Role 신청 목록"
    )
    @RequestMapping(value = Path.GROUP_REQUEST_LIST, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getRequestRoleList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ){
        RoleRequestEntity.Status roleStatus = StringUtils.isEmpty(status)? null: RoleRequestEntity.Status.valueOf(status);
        Page<RoleRequestEntity> requestRoleList = roleGroupService.getRoleRequestList(keyword, roleStatus, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("requestRoleList", requestRoleList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * RoleGroup 신청 목록 카운트
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "Role 신청 목록 카운트",
            notes = "Role 신청 목록 카운트"
    )
    @RequestMapping(value = Path.GROUP_REQUEST_COUNT, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getRequestRoleCount(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam(name = "keyword", required = false) String keyword
    ){

        Map<String, Object> count = roleGroupService.getRoleRequestCount(keyword);

        Map<String, Object> data = new HashMap<>();
        data.put("count", count);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * RoleGroup 신청
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "Role 신청",
            notes = "Role 신청"
    )
    @RequestMapping(value = Path.GROUP_REQUEST, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> requestRole(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam(name = "appType") String appType,
            @RequestParam(name = "appId") String appId
    ){

        RoleRequestEntity request = roleGroupService.requestRole(RoleRequestEntity.AppType.valueOf(appType.toUpperCase()), appId);

        if( request == null ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("request", request);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * RoleGroup 신청 삭제
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "Role 신청 삭제",
            notes = "Role 신청 삭제"
    )
    @RequestMapping(value = Path.GROUP_REQUEST, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteRequestRole(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam(name = "requestId") String requestId
    ){

        roleGroupService.removeRoleRequest(requestId);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * RoleGroup 거부
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "Role 거부",
            notes = "Role 거부"
    )
    @RequestMapping(value = Path.GROUP_DENY, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> denyMyRole(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable(name = "id") String requestId
    ){

        RoleRequestEntity request = roleGroupService.denyRoleRequest(requestId);

        Map<String, Object> data = new HashMap<>();
        data.put("request", request);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * RoleGroup 수락
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "Role 수락",
            notes = "Role 수락"
    )
    @RequestMapping(value = Path.GROUP_ACCEPT, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> acceptMyRole(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable(name = "id") String requestId
    ){

        RoleRequestEntity request = roleGroupService.acceptRoleRequest(requestId);

        if( request == null ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("request", request);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * IA and Permission setup
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "IA and Permission setup",
            notes = "IA and Permission setup"
    )
    @RequestMapping(value = Path.GROUP_IA_PERMISSION_SETUP, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> setupIAAndPermissions(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable(name = "id") String groupId,
            @Valid @RequestBody List<RoleGroupDto.IA> iaAndPermissions,
            BindingResult bindingResult
    ){
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        boolean result = roleGroupService.setupIAPermission(groupId, iaAndPermissions);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * ADD SYSTEM ADMIN TO USER
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "ADD SYSTEM ADMIN TO USER",
            notes = "ADD SYSTEM ADMIN TO USER"
    )
    @RequestMapping(value = Path.GROUP_SYSTEM_ADMIN, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> addSystemAdminToUser(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="dt-admin",
                    value ="user id"
            )
            @PathVariable(name = "userId") String userId
    ){
        boolean result = roleGroupService.addSystemAdmin(userId);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * DELETE SYSTEM ADMIN TO USER
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "DELETE SYSTEM ADMIN TO USER",
            notes = "DELETE SYSTEM ADMIN TO USER"
    )
    @RequestMapping(value = Path.GROUP_SYSTEM_ADMIN, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteSystemAdminToUser(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="dt-admin",
                    value ="user id"
            )
            @PathVariable(name = "userId") String userId
    ){
        boolean result = roleGroupService.removeSystemAdmin(userId);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }
}
