package app.metatron.portal.web.api.project;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.value.ResultVO;
import app.metatron.portal.portal.project.domain.ProjectDto;
import app.metatron.portal.portal.project.domain.ProjectEntity;
import app.metatron.portal.portal.project.service.ProjectService;
import app.metatron.portal.portal.search.domain.ProjectIndexVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
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
import java.util.Map;

@RestController
public class ProjectController extends AbstractController {

    @Autowired
    private ProjectService projectService;

    /**
     * project list
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "project list",
            notes = "project list"
    )
    @RequestMapping(value = Path.PROJECTS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getProjectList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "2018",
                    value = "year"
            )
            @RequestParam(name = "year", required = false) String year,
            Pageable pageable
    ) {
        Page<ProjectEntity> projectList = null;

        if( StringUtils.isEmpty(year) ) {
            // 연도 조건 없을때
            projectList = projectService.listAllWithPage(pageable);
        } else {
            // 연도 조건 있을때에 대한 기준 startDate
            projectList = projectService.getProjectListByYear(year, pageable);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("projectList", projectList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * project detail
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "project detail",
            notes = "project detail"
    )
    @RequestMapping(value = Path.PROJECTS_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getProjectDetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "P0000002",
                    value = "project id"
            )
            @PathVariable(name = "id") String id
    ) {
        ProjectEntity project = projectService.get(id);

        Map<String, Object> data = new HashMap<>();
        data.put("project", project);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * project create
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "project create",
            notes = "project create"
    )
    @RequestMapping(value = Path.PROJECTS, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addProject(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid @RequestBody ProjectDto.CREATE projectDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        boolean result = projectService.addProject(projectDto);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * project update
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "project update",
            notes = "project update"
    )
    @RequestMapping(value = Path.PROJECTS_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> updateProject(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "P0000002",
                    value = "project id"
            )
            @PathVariable(name = "id") String id,
            @Valid @RequestBody ProjectDto.EDIT projectDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        // force
        projectDto.setId(id);

        boolean result = projectService.editProject(projectDto);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * project delete
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "project delete",
            notes = "project delete"
    )
    @RequestMapping(value = Path.PROJECTS_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteProject(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "P0000002",
                    value = "project id"
            )
            @PathVariable(name = "id") String id
    ) {
        projectService.removeProject(id);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }

    ///////////////////////////////////////////////////////////////
    //
    // for indexing
    //
    ///////////////////////////////////////////////////////////////

    //    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "과제 색인용 데이터 조회",
            notes = "과제 색인용 데이터 조회"
    )
    @RequestMapping(value = Path.PROJECTS_INDICES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getIndices(
//            @ApiParam(
//                    defaultValue="bearer ",
//                    value ="토큰"
//            )
//            @RequestHeader(name = "Authorization") String authorization,
            Pageable pageable
    ) throws Exception {

        Page<ProjectIndexVO> indices = projectService.getIndices(pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("indices", indices);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

}
