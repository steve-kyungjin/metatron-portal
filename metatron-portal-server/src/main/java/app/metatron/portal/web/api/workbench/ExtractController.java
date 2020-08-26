package app.metatron.portal.web.api.workbench;

import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.value.ResultVO;
import app.metatron.portal.common.value.workbench.ExtractAppSql;
import app.metatron.portal.common.value.workbench.QueryResult;
import app.metatron.portal.portal.extract.domain.CustomVariableDto;
import app.metatron.portal.portal.extract.domain.CustomVariableEntity;
import app.metatron.portal.portal.extract.service.ExtractService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ExtractController extends AbstractController {

    @Autowired
    private ExtractService extractService;

    /**
     * 추출앱 쿼리 변수 분석
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "추출앱 쿼리 변수 분석",
            notes = "추출앱 쿼리 변수 분석"
    )
    @RequestMapping(value = Path.EXTRACT_APP_PARSE, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> parseExtractSql(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="{ " +
                            "\"original\" : \"select h.* from human h where h.name=${text:humanName('테스터')|'사람이름'} and h.gender=${select:humanGender('Male','Female')|'사람성별'}\"" +
                            " }",
                    value ="sql"
            )
            @RequestBody ExtractAppSql sql
    ){
        ExtractAppSql extractAppSql = extractService.parseExtractAppSql(sql.getOriginal());

        Map<String, Object> data = new HashMap<>();
        data.put("extractSql", extractAppSql);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 추출앱 쿼리 변수 처리
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "추출앱 쿼리 변수 처리",
            notes = "추출앱 쿼리 변수 처리"
    )
    @RequestMapping(value = Path.EXTRACT_APP_PROCESS, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> processExtractSql(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "{ \"original\": \"select h.* from human h where h.name=${text:humanName('테스터')|'사람이름'} and h.gender=${select:humanGender('Male','Female')|'사람성별'}\"," +
                            "      \"processed\": \"select h.* from human h where h.name=##1524558459968_0## and h.gender=##1524558459968_1##\"," +
                            "      \"modules\": [" +
                            "        {" +
                            "          \"id\": \"##1524558459968_0##\"," +
                            "          \"namespace\": \"TEXT\"," +
                            "          \"name\": \"humanName\"," +
                            "          \"description\": \"사람이름\"," +
                            "          \"args\": [" +
                            "            \"테스터\"" +
                            "          ]," +
                            "          \"input\": \"홍길동\"" +
                            "        }," +
                            "        {" +
                            "          \"id\": \"##1524558459968_1##\"," +
                            "          \"namespace\": \"SELECT\"," +
                            "          \"name\": \"humanGender\"," +
                            "          \"description\": \"사람성별\"," +
                            "          \"args\": [" +
                            "            \"Male\"," +
                            "            \"Female\"" +
                            "          ]," +
                            "          \"input\": \"Male\"" +
                            "        }" +
                            "      ]}",
                    value = "sql"
            )
            @RequestBody ExtractAppSql sql
    ){
        String processed = extractService.processExtractAppSql(sql);

        if( processed == null ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("processed", processed);

            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
            return ResponseEntity.ok(resultVO);
        }
    }


    /**
     * custom var list
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "custom var list",
            notes = "custom var list"
    )
    @RequestMapping(value = Path.EXTRACT_CUSTOM_VAR, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCustomVars(
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

        Page<CustomVariableEntity> varList = extractService.getCustomVariableList(keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("varList", varList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * custom var add
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "custom var add",
            notes = "custom var add"
    )
    @RequestMapping(value = Path.EXTRACT_CUSTOM_VAR, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> editCustomVar(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid @RequestBody CustomVariableDto.CREATE varDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        CustomVariableEntity var = extractService.addCustomVariable(varDto);

        if( var == null ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("var", var);

            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
            return ResponseEntity.ok(resultVO);
        }
    }


    /**
     * custom var detail
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "custom var detail",
            notes = "custom var detail"
    )
    @RequestMapping(value = Path.EXTRACT_CUSTOM_VAR_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCustomVar(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "id"
            )
            @PathVariable(name = "id") String id
    ) {

        CustomVariableEntity var = extractService.getCustomVariable(id);

        Map<String, Object> data = new HashMap<>();
        data.put("var", var);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * custom var edit
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "custom var edit",
            notes = "custom var edit"
    )
    @RequestMapping(value = Path.EXTRACT_CUSTOM_VAR_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> editCustomVar(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "id"
            )
            @PathVariable(name = "id") String id,
            @Valid @RequestBody CustomVariableDto.EDIT varDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        CustomVariableEntity var = extractService.editCustomVariable(varDto);

        if( var == null ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("var", var);

            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
            return ResponseEntity.ok(resultVO);
        }
    }

    /**
     * custom var delete
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "custom var delete",
            notes = "custom var delete"
    )
    @RequestMapping(value = Path.EXTRACT_CUSTOM_VAR_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> removeCustomVar(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "id"
            )
            @PathVariable(name = "id") String id
    ) {

        boolean result = extractService.removeCustomVariable(id);

        if( result ) {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
            return ResponseEntity.ok(resultVO);
        } else {
            ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
            return ResponseEntity.ok(resultVO);
        }
    }

    /**
     * custom var name duplicate check
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "custom var name duplicate check",
            notes = "custom var name duplicate check"
    )
    @RequestMapping(value = Path.EXTRACT_CUSTOM_VAR_CHECK, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> checkDuplicateName(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "name"
            )
            @RequestParam(name = "name") String name
    ) {

        boolean exists = extractService.existsCustomVariable(name);

        Map<String, Object> data = new HashMap<>();
        data.put("exists", exists);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * custom var execution
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "custom var execution",
            notes = "custom var execution"
    )
    @RequestMapping(value = Path.EXTRACT_CUSTOM_VAR_EXEC, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> execCustomVar(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "name"
            )
            @PathVariable(name = "name") String name,
            @ApiParam(
                    defaultValue = "",
                    value = "argument"
            )
            @RequestParam(name = "arg", required = false) String arg
    ) {

        QueryResult result = extractService.execCustomVariable(name, arg);

        ResultVO resultVO = null;
        if( result == null ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("result", result);
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        }
        return ResponseEntity.ok(resultVO);
    }

}
