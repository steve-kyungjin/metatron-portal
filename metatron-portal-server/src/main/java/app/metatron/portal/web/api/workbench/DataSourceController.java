package app.metatron.portal.web.api.workbench;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.util.ExcelUtil;
import app.metatron.portal.common.util.excel.ExcelGenHelper;
import app.metatron.portal.common.value.workbench.QueryResult;
import app.metatron.portal.portal.datasource.domain.DataSourceDto;
import app.metatron.portal.portal.datasource.service.DataSourceService;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.value.ResultVO;
import app.metatron.portal.portal.datasource.domain.DataSourceEntity;
import app.metatron.portal.portal.datasource.service.JdbcConnectionService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.joda.time.LocalDateTime;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DataSourceController extends AbstractController {

    @Autowired
    private DataSourceService dataSourceService;

    @Autowired
    private JdbcConnectionService jdbcConnectionService;

    /**
     * data source list
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "data source list",
            notes = "data source list"
    )
    @RequestMapping(value = Path.DATASOURCE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getDataSourceList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {

        List<DataSourceEntity> dataSourceList = dataSourceService.getOrderedDataSourceList();

        Map<String, Object> data = new HashMap<>();
        data.put("dataSourceList", dataSourceList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * data source detail
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "data source detail",
            notes = "data source detail"
    )
    @RequestMapping(value = Path.DATASOURCE_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getDataSource(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="ds0000001",
                    value ="데이터소스 ID"
            )
            @PathVariable(value = "id") String id
    ) {
        DataSourceEntity dataSource = dataSourceService.get(id);

        Map<String, Object> data = new HashMap<>();
        data.put("dataSource", dataSource);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * data source 수정
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "data source 수정",
            notes = "data source 수정"
    )
    @RequestMapping(value = Path.DATASOURCE_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> updateDataSource(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid
            @RequestBody DataSourceDto.EDIT dataSourceDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        boolean result = jdbcConnectionService.connectionTest(dataSourceDto.getId());
        ResultVO resultVO = null;
        if( result ) {
            DataSourceEntity dataSource = dataSourceService.updateDataSource(dataSourceDto);

            Map<String, Object> data = new HashMap<>();
            data.put("dataSource", dataSource);

            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * data source 등록
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "data source 등록",
            notes = "data source 등록"
    )
    @RequestMapping(value = Path.DATASOURCE, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addDataSource(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid
            @RequestBody DataSourceDto.CREATE dataSourceDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        DataSourceEntity dataSource = dataSourceService.addDataSource(dataSourceDto);

        Map<String, Object> data = new HashMap<>();
        data.put("dataSource", dataSource);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * data source 삭제
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "data source 삭제",
            notes = "data source 삭제"
    )
    @RequestMapping(value = Path.DATASOURCE_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteDataSource(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="ds0000001",
                    value ="데이터소스 ID"
            )
            @PathVariable(value = "id") String id
    ) {
        boolean result = dataSourceService.removeDataSource(id);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * data source test
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "data source test",
            notes = "data source test"
    )
    @RequestMapping(value = Path.DATASOURCE_TEST, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> testDataSource(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="ds0000001",
                    value ="데이터소스 ID"
            )
            @PathVariable(value = "id") String id,
            @RequestBody(required = false) DataSourceDto.ONCE dataSourceDto,
            BindingResult bindingResult
    ){
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        boolean result = false;
        if( dataSourceDto != null ) {
            result = jdbcConnectionService.connectionTest(dataSourceDto);
        } else {
            result = jdbcConnectionService.connectionTest(id);
        }

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * data source select query
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "data source select query",
            notes = "data source select query"
    )
    @RequestMapping(value = Path.DATASOURCE_SELECT, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> selectQueryWithDataSource(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="ds0000001",
                    value ="데이터소스 ID"
            )
            @PathVariable(value = "id") String id,
            @ApiParam(
                    defaultValue="1000",
                    value ="fetch size"
            )
            @RequestParam(value = "fetch", required = false, defaultValue = "1000") int fetchSize,
            @ApiParam(
                    defaultValue="1000",
                    value ="max rows"
            )
            @RequestParam(value = "max", required = false, defaultValue = "1000") int maxRows,
            @ApiParam(
                    defaultValue="{ " +
                            "\"sql\" : \"select * from mp_an_app \" " +
                            " }",
                    value ="sql"
            )
            @RequestBody JSONObject json
            ){

        QueryResult queryResult = jdbcConnectionService.queryForList(id, json.getOrDefault("sql", "").toString(), maxRows, fetchSize);
        ResultVO resultVO = null;

        if( queryResult == null ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("queryResult", queryResult);
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * data source execute query
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "data source execute query",
            notes = "data source execute query"
    )
    @RequestMapping(value = Path.DATASOURCE_EXEC, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> executeQueryWithDataSource(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="ds0000001",
                    value ="데이터소스 ID"
            )
            @PathVariable(value = "id") String id,
            @ApiParam(
                    defaultValue="{ " +
                            "\"sql\" : \"select * from mp_an_app \" " +
                            " }",
                    value ="sql"
            )
            @RequestBody JSONObject json
    ){

        boolean result = jdbcConnectionService.execute(id, json.getOrDefault("sql", "").toString());

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * data source validation
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "data source validation",
            notes = "data source validation"
    )
    @RequestMapping(value = Path.DATASOURCE_VALID, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> validDataSource(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="ds0000001",
                    value ="데이터소스 ID"
            )
            @PathVariable(value = "id") String id
    ){

        boolean result = dataSourceService.exists(id);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    //////////////////////////////////////////////////////////////////
    //
    // Excel Download
    //
    //////////////////////////////////////////////////////////////////

    private static final int STD_ROW_COUNT = 1000;
    private static final int MAX_EXCEL_ROW_COUNT = 1000000;

    /**
     * excel export
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "excel export",
            notes = "excel export"
    )
    @RequestMapping(value = Path.DATASOURCE_EXPORT, method = RequestMethod.POST)
    public ModelAndView exportExcel(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="ds0000001",
                    value ="데이터소스 ID"
            )
            @PathVariable(value = "id") String id,
            @ApiParam(
                    defaultValue="1000",
                    value ="fetch size"
            )
            @RequestParam(value = "fetch", required = false, defaultValue = "1000") int fetchSize,
            @ApiParam(
                    defaultValue="1000",
                    value ="max rows"
            )
            @RequestParam(value = "max", required = false) int maxRows,
            @ApiParam(
                    defaultValue="test app",
                    value ="App name"
            )
            @RequestParam(value = "appNm", required = false) String appNm,
            @ApiParam(
                    defaultValue="{ " +
                            "\"sql\" : \"select * from mp_an_app \" " +
                            " }",
                    value ="sql"
            )
            @RequestBody JSONObject json
    ){
        // 엑셀 다운로드는 최대 백만까지로 제한
        if(maxRows != MAX_EXCEL_ROW_COUNT) {
            maxRows = MAX_EXCEL_ROW_COUNT;
        }

        QueryResult queryResult = jdbcConnectionService.queryForList(id, json.getOrDefault("sql", "").toString(), maxRows, fetchSize);

        // excel file name
        appNm = appNm == null? "untitled": appNm;
        appNm = appNm.replace(" ", "+");
        Map<String, Object> excelModel = ExcelUtil.convertQueryResultToExcelData(appNm + "-" + LocalDateTime.now().toString("yyyyMMddHHmm"), queryResult);

        List datas = (List) excelModel.get(ExcelGenHelper.DATA);

        // 출력 데이터 길이에 따라 분리 처리
        if( datas.size() > STD_ROW_COUNT ) {
            return new ModelAndView("excelXlsxStreamingView", excelModel);
        } else {
            return new ModelAndView("excelXlsxView", excelModel);
        }
    }
}
