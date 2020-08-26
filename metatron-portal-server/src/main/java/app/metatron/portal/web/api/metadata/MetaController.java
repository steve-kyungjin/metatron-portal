package app.metatron.portal.web.api.metadata;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.util.ExcelUtil;
import app.metatron.portal.common.value.workbench.QueryResult;
import app.metatron.portal.portal.metadata.domain.*;
import app.metatron.portal.portal.metadata.service.MetaService;
import app.metatron.portal.portal.search.domain.MetaColumnIndexVO;
import app.metatron.portal.portal.search.domain.MetaTableIndexVO;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.exception.ResourceNotFoundException;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class MetaController extends AbstractController {

    @Autowired
    private MetaService metaService;

    /**
     * metadata subject list
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata subject list",
            notes = "metadata subject list"
    )
    @RequestMapping(value = Path.METADATA_SUBJECT, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSubjectList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "CD0011001",
                    value = "criteria id"
            )
            @RequestParam(name = "criteriaId", required = false) String criteriaId,
            @ApiParam(
                    defaultValue = "",
                    value = "keyword"
            )
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ) {

        Page<MetaSubjectEntity> subjectList = metaService.getSubjectListByCriteria(criteriaId, keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("subjectList", subjectList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * metadata subject root
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata subject root",
            notes = "metadata subject root"
    )
    @RequestMapping(value = Path.METADATA_SUBJECT_ROOT, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSubjectRoot(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "CD0011001",
                    value = "criteria id"
            )
            @RequestParam(name = "criteriaId", required = false) String criteriaId
    ) {

        List<MetaSubjectEntity> subjectRootList = metaService.getSubjectRootList(criteriaId);

        Map<String, Object> data = new HashMap<>();
        data.put("subjectRootList", subjectRootList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * metadata subject detail
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata subject detail",
            notes = "metadata subject detail"
    )
    @RequestMapping(value = Path.METADATA_SUBJECT_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSubjectDetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "DSA-BZP-4300",
                    value = "subject id"
            )
            @PathVariable(name = "id") String id
    ) {

        MetaSubjectEntity subject = metaService.getSubject(id);

        Map<String, Object> data = new HashMap<>();
        data.put("subject", subject);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * metadata subject add
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "metadata subject add",
            notes = "metadata subject add"
    )
    @RequestMapping(value = Path.METADATA_SUBJECT, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> getSubjectList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid
            @RequestBody MetaDto.Subject subjectDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        MetaSubjectEntity subject = metaService.addMetaSubject(subjectDto);

        if( subject == null ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("subject", subject);

            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
            return ResponseEntity.ok(resultVO);
        }
    }

    /**
     * metadata subject edit
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "metadata subject edit",
            notes = "metadata subject edit"
    )
    @RequestMapping(value = Path.METADATA_SUBJECT_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> getSubjectList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="",
                    value ="subject id"
            )
            @PathVariable(name = "id") String id,
            @Valid
            @RequestBody MetaDto.Subject subjectDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        MetaSubjectEntity subject = metaService.editMetaSubject(subjectDto);

        if( subject == null ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("subject", subject);

            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
            return ResponseEntity.ok(resultVO);
        }
    }

    /**
     * metadata subject delete
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "metadata subject delete",
            notes = "metadata subject delete"
    )
    @RequestMapping(value = Path.METADATA_SUBJECT_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> getSubjectList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="",
                    value ="subject id"
            )
            @PathVariable(name = "id") String id
    ) {

        boolean result = metaService.removeMetaSubject(id);

        if( result ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
            return ResponseEntity.ok(resultVO);
        } else {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        }
    }

    /**
     * metadata subject table
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata subject table",
            notes = "metadata subject table"
    )
    @RequestMapping(value = Path.METADATA_SUBJECT_TABLE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSubjectTableList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "DSA-BZP-4300",
                    value = "subject id"
            )
            @PathVariable(name = "id") String id,
            @ApiParam(
                    defaultValue = "CD0011001",
                    value = "criteria id"
            )
            @RequestParam(name = "criteriaId", required = false) String criteriaId,
            @ApiParam(
                    defaultValue = "ALL",
                    value = "target : ALL, PHYSICAL, LOGICAL"
            )
            @RequestParam(name = "target") String target,
            @ApiParam(
                    defaultValue = "",
                    value = "layer id"
            )
            @RequestParam(name = "layerId", required = false) String layerId,
            @ApiParam(
                    defaultValue = "",
                    value = "keyword"
            )
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ) {
        if( "all".equals(id) ) {
            id = null;
        }
        Page<MetaTableEntity> tableList = metaService.getTableListBySubject(id, criteriaId, MetaService.Target.valueOf(target.toUpperCase()), layerId, keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("tableList", tableList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * metadata database table
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata database table",
            notes = "metadata database table"
    )
    @RequestMapping(value = Path.METADATA_DATABASE_TABLE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getDatabaseTableList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "database id"
            )
            @PathVariable(name = "id") String id,
            @ApiParam(
                    defaultValue = "ALL",
                    value = "target : ALL, PHYSICAL, LOGICAL"
            )
            @RequestParam(name = "target") String target,
            @ApiParam(
                    defaultValue = "",
                    value = "layer id"
            )
            @RequestParam(name = "layerId", required = false) String layerId,
            @ApiParam(
                    defaultValue = "",
                    value = "keyword"
            )
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ) {
        if( "all".equals(id) ) {
            id = null;
        }

        Page<MetaTableEntity> tableList = metaService.getTableListByDatabase(id, MetaService.Target.valueOf(target.toUpperCase()), layerId, keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("tableList", tableList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * metadata instance table
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata instance table",
            notes = "metadata instance table"
    )
    @RequestMapping(value = Path.METADATA_INSTANCE_TABLE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getInstanceTableList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "instance id"
            )
            @PathVariable(name = "id") String id,
            @ApiParam(
                    defaultValue = "ALL",
                    value = "target : ALL, PHYSICAL, LOGICAL"
            )
            @RequestParam(name = "target") String target,
            @ApiParam(
                    defaultValue = "",
                    value = "layer id"
            )
            @RequestParam(name = "layerId", required = false) String layerId,
            @ApiParam(
                    defaultValue = "",
                    value = "keyword"
            )
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ) {
        if( "all".equals(id) ) {
            id = null;
        }

        Page<MetaTableEntity> tableList = metaService.getTableListByInstance(id, MetaService.Target.valueOf(target.toUpperCase()), layerId, keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("tableList", tableList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata table detail",
            notes = "metadata table detail"
    )
    @RequestMapping(value = Path.METADATA_TABLE_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getTableDetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "103105",
                    value = "table id"
            )
            @PathVariable(name = "id") String id
    ) {
        MetaTableEntity table = metaService.getTable(id);
        List<MetaColumnEntity> columnList = metaService.getColumnListByTable(table.getId());
        List<MetaSubjectEntity> subjectList = metaService.getSubjectListByTable(id);

        Map<String, Object> data = new HashMap<>();
        data.put("table", table);
        data.put("columnList", columnList);
        data.put("subjectList", subjectList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata table edit",
            notes = "metadata table edit"
    )
    @RequestMapping(value = Path.METADATA_TABLE_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> editTable(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "103105",
                    value = "table id"
            )
            @PathVariable(name = "id") String id,
            @Valid @RequestBody MetaDto.Table tableDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        tableDto.setId(id);
        MetaTableEntity table = metaService.editMetaTable(tableDto);

        ResultVO resultVO = null;
        if( table == null ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("table", table);

            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        }
        return ResponseEntity.ok(resultVO);
    }

    @ApiOperation(
            value = "metadata table sample data download",
            notes = "metadata table sample data download"
    )
    @RequestMapping(value = Path.METADATA_TABLE_SAMPLE, method = RequestMethod.GET)
    public ModelAndView getTableSampleData(
            HttpServletResponse response,
            @ApiParam(
                    defaultValue = "103105",
                    value = "table id"
            )
            @PathVariable(name = "id") String id
    ) throws Exception {

        MetaTableEntity table = metaService.getTable(id);
        if( table == null ) {
            throw new ResourceNotFoundException(id);
        }

        QueryResult queryResult = metaService.getTableSampleDataList(id);
        String fileName = table.getDatabasePhysicalNm() + "." + table.getPhysicalNm() + ".csv";

        Map<String, Object> excelModel = ExcelUtil.convertQueryResultToExcelData(fileName, queryResult);

        return new ModelAndView("excelXlsxView", excelModel);
    }

    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata table sample data list",
            notes = "metadata table sample data list"
    )
    @RequestMapping(value = Path.METADATA_TABLE_SAMPLE_LIST, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getTableSampleDataList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "103105",
                    value = "table id"
            )
            @PathVariable(name = "id") String id
    ) {
        QueryResult queryResult = metaService.getTableSampleDataList(id);

        Map<String, Object> data = new HashMap<>();
        data.put("queryResult", queryResult);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata column detail",
            notes = "metadata column detail"
    )
    @RequestMapping(value = Path.METADATA_COLUMN_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getColumnDetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "1031050001",
                    value = "column id"
            )
            @PathVariable(name = "id") String id,
            Pageable pageable
    ) {
        MetaColumnEntity column = metaService.getColumn(id);
        Page<MetaTableEntity> tableList = metaService.getRelationTableByColumn(column, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("column", column);
        data.put("tableList", tableList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata column edit",
            notes = "metadata column edit"
    )
    @RequestMapping(value = Path.METADATA_COLUMN_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> editColumn(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "1031050001",
                    value = "column id"
            )
            @PathVariable(name = "id") String id,
            @Valid @RequestBody MetaDto.Column colDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        colDto.setId(id);
        MetaColumnEntity column = metaService.editMetaColumn(colDto);

        ResultVO resultVO = null;
        if( column == null ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("column", column);

            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * metadata system
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata system",
            notes = "metadata system"
    )
    @RequestMapping(value = Path.METADATA_SYSTEM, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSystemList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "operTypeId"
            )
            @RequestParam(name = "operTypeId", required = false) String operTypeId,
            @ApiParam(
                    defaultValue = "",
                    value = "directionId"
            )
            @RequestParam(name = "directionId", required = false) String directionId,
            @ApiParam(
                    defaultValue = "",
                    value = "target : ALL, STD, FULL"
            )
            @RequestParam(name = "target") String target,
            @ApiParam(
                    defaultValue = "",
                    value = "keyword"
            )
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ) {
        Page<MetaSystemEntity> systemList = metaService.getSystemList(operTypeId, directionId, MetaService.SystemTarget.valueOf(target), keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("systemList", systemList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * metadata system root
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata system root",
            notes = "metadata system root"
    )
    @RequestMapping(value = Path.METADATA_SYSTEM_ROOT, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSystemRootList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        List<MetaSystemEntity> systemList = metaService.getSystemRootList();

        Map<String, Object> data = new HashMap<>();
        data.put("systemList", systemList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * metadata system add
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "metadata system add",
            notes = "metadata system add"
    )
    @RequestMapping(value = Path.METADATA_SYSTEM, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addSystem(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid
            @RequestBody MetaDto.System metaDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        MetaSystemEntity system = metaService.addMetaSystem(metaDto);

        if( system == null ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("system", system);

            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
            return ResponseEntity.ok(resultVO);
        }
    }

    /**
     * meta system detail
     * @return
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata system detail",
            notes = "metadata system detail"
    )
    @RequestMapping(value = Path.METADATA_SYSTEM_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSystemDetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "system id"
            )
            @PathVariable(name = "id") String id
    ) {
        MetaSystemEntity system = metaService.getSystem(id);

        Map<String, Object> data = new HashMap<>();
        data.put("system", system);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * metadata system children
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata system children",
            notes = "metadata system children"
    )
    @RequestMapping(value = Path.METADATA_SYSTEM_CHILDREN, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSystemChildren(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "system id"
            )
            @PathVariable(name = "id") String id
    ) {
        List<MetaSystemEntity> systemList = metaService.getSystemChildren(id);

        Map<String, Object> data = new HashMap<>();
        data.put("systemList", systemList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * metadata system edit
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "metadata system edit",
            notes = "metadata system edit"
    )
    @RequestMapping(value = Path.METADATA_SYSTEM_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> editSystem(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "system id"
            )
            @PathVariable(name = "id") String id,
            @Valid
            @RequestBody MetaDto.System metaDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        MetaSystemEntity system = metaService.editMetaSystem(metaDto);

        if( system == null ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("system", system);

            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
            return ResponseEntity.ok(resultVO);
        }
    }

    /**
     * metadata system delete
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "metadata system delete",
            notes = "metadata system delete"
    )
    @RequestMapping(value = Path.METADATA_SYSTEM_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> removeSystem(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "system id"
            )
            @PathVariable(name = "id") String id
    ) {

        boolean result = metaService.removeMetaSystem(id);

        if( result ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
            return ResponseEntity.ok(resultVO);
        } else {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        }
    }

    /**
     * metadata instance
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata instance",
            notes = "metadata instance"
    )
    @RequestMapping(value = Path.METADATA_INSTANCE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getInstanceList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        List<MetaInstanceEntity> instanceList = metaService.getInstanceList();

        Map<String, Object> data = new HashMap<>();
        data.put("instanceList", instanceList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * meta instance detail
     * @return
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata instance detail",
            notes = "metadata instance detail"
    )
    @RequestMapping(value = Path.METADATA_INSTANCE_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getInstanceDetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "instance id"
            )
            @PathVariable(name = "id") String id
    ) {
        MetaInstanceEntity instance = metaService.getInstance(id);

        Map<String, Object> data = new HashMap<>();
        data.put("instance", instance);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * metadata instance database
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata instance database",
            notes = "metadata instance database"
    )
    @RequestMapping(value = Path.METADATA_INSTANCE_DATABASE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getInstanceDatabaseList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "instance id"
            )
            @PathVariable(name = "id") String id,
            @ApiParam(
                    defaultValue = "",
                    value = "data layer"
            )
            @RequestParam(name = "layerId", required = false) String layerId,
            @ApiParam(
                    defaultValue = "ALL",
                    value = "target : ALL, PHYSICAL, LOGICAL"
            )
            @RequestParam(name = "target") String target,
            @ApiParam(
                    defaultValue = "",
                    value = "keyword"
            )
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ) {
        if( "all".equals(id) ) {
            id = null;
        }
        Page<MetaDatabaseEntity> databaseList = metaService.getDatabaseList(id, layerId, MetaService.Target.valueOf(target.toUpperCase()), keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("databaseList", databaseList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * meta database detail
     * @return
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata database detail",
            notes = "metadata database detail"
    )
    @RequestMapping(value = Path.METADATA_DATABASE_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getDatabaseDetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "database id"
            )
            @PathVariable(name = "id") String id
    ) {
        MetaDatabaseEntity database = metaService.getDatabase(id);

        Map<String, Object> data = new HashMap<>();
        data.put("database", database);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * metadata dictionary list
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata dictionary list",
            notes = "metadata dictionary list"
    )
    @RequestMapping(value = Path.METADATA_DICTIONARY, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getDictionaryList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "keyword"
            )
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ) {

        Page<MetaDictionaryEntity> dictionaryList = metaService.getDictionaryList(keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("dictionaryList", dictionaryList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * metadata dictionary detail
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "metadata dictionary detail",
            notes = "metadata dictionary detail"
    )
    @RequestMapping(value = Path.METADATA_DICTIONARY_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getDictionary(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "100",
                    value = "dictionary id"
            )
            @PathVariable(name = "id") String dicId
    ) {

        MetaDictionaryEntity dictionary = metaService.getDictionary(dicId);

        Map<String, Object> data = new HashMap<>();
        data.put("dictionary", dictionary);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    ///////////////////////////////////////////////////////////////
    //
    // for indexing
    //
    ///////////////////////////////////////////////////////////////

    //    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "메타 테이블 색인용 데이터 조회",
            notes = "메타 테이블 색인용 데이터 조회"
    )
    @RequestMapping(value = Path.METADATA_TABLE_INDICES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getTableIndices(
//            @ApiParam(
//                    defaultValue="bearer ",
//                    value ="토큰"
//            )
//            @RequestHeader(name = "Authorization") String authorization,
            Pageable pageable
    ) throws Exception {

        Page<MetaTableIndexVO> indices = metaService.getTableIndices(pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("indices", indices);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    //    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "메타 컬럼 색인용 데이터 조회",
            notes = "메타 컬럼 색인용 데이터 조회"
    )
    @RequestMapping(value = Path.METADATA_COLUMN_INDICES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getColumnIndices(
//            @ApiParam(
//                    defaultValue="bearer ",
//                    value ="토큰"
//            )
//            @RequestHeader(name = "Authorization") String authorization,
            Pageable pageable
    ) throws Exception {

        Page<MetaColumnIndexVO> indices = metaService.getColumnIndices(pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("indices", indices);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

}
