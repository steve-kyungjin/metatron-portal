package app.metatron.portal.web.api.common;

import app.metatron.portal.common.code.service.GroupCodeService;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.code.domain.CodeDto;
import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.code.domain.GroupCodeDto;
import app.metatron.portal.common.code.domain.GroupCodeEntity;
import app.metatron.portal.common.code.service.CodeService;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * Class Name : CodeController
 * 
 * Class Description: CodeController Class
 *
 * Created by nogah on 2018-03-05.
 *
 * Version : v1.0
 *
 */
@RestController
public class CodeController{

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private CodeService codeService;
    @Autowired
    private GroupCodeService groupCodeService;

    /**
     * 그룹코드 리스트 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "Metatron Portal",
            notes = "group-code List 조회"
    )
    @RequestMapping(value= Path.GROUP_CODE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getGroupCodeList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            Pageable pageable
    ){
        Page<GroupCodeEntity> groupCodeList = groupCodeService.listAllWithPage(pageable);
        Map<String, Object> data = new HashMap<>();
        data.put("groupCodeList", groupCodeList);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹코드 목록으로 코드 목록 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "code list by group codes",
            notes = "code list by group codes"
    )
    @RequestMapping(value= Path.CODE_BY_GROUP_CODES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCodeListByGroupCodes(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam("group-codes") String[] groupCodes
    ){

        Map data = codeService.getCodeGroupMapWithDto(groupCodes);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }


    /**
     * 그룹코드 조회
     * @param id
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "getGroupCode",
            notes = "그룹코드 조회"
    )
    @RequestMapping(value=Path.GROUP_CODE_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getGroupCode(
            @ApiParam(
                    name = "id",
                    defaultValue = "aaa",
                    value = "그룹 코드 ID",
                    required = true
            )
            @PathVariable String id) {

        GroupCodeEntity groupCode = groupCodeService.get(id);

        Map<String, Object> data = new HashMap<>();
        data.put("groupCode", groupCode);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹코드 등록
     * @param groupCodeDto
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(value = "addGroupCode", notes = "그룹코드 등록")
    @RequestMapping(value=Path.GROUP_CODE, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addGroupCode(
            @ApiParam(
                    name = "groupCode",
                    defaultValue = "{\"grpCdNm\" : \"SwagTest\",\"grpCdDesc\" : \"SwagTest입니다.\"}",
                    value = "등록될 그룹 코드",
                    required = true
            )
            @Valid
            @RequestBody GroupCodeDto.CREATE groupCodeDto, BindingResult bindingResult){
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }
        GroupCodeEntity groupCodeEntity = modelMapper.map(groupCodeDto, GroupCodeEntity.class);
        groupCodeService.save(groupCodeEntity);

        Map<String, Object> data = new HashMap<>();
        data.put("groupCode", groupCodeEntity);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 그룹코드 수정
     * @param groupCodeDto
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(value = "updateUser", notes = "그룹코드 수정")
    @RequestMapping(value=Path.GROUP_CODE_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> updateGroupCode(
            @PathVariable String id,
            @Validated @RequestBody GroupCodeDto.UPDATE groupCodeDto
    ) {
        groupCodeDto.setId(id);

        GroupCodeEntity groupCodeEntity = modelMapper.map(groupCodeDto, GroupCodeEntity.class);
        GroupCodeEntity updatedGroupCode = groupCodeService.save(groupCodeEntity);

        Map<String, Object> data = new HashMap<>();
        data.put("groupCode", updatedGroupCode);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 코드 리스트 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(value = "getCodeList", notes = "코드 리스트 조회")
    @RequestMapping(value=Path.CODE_BY_GROUP_CODE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCodeList(
            @ApiParam(
                    name = "id",
                    defaultValue = "abcdefg",
                    value = "그룹 코드 키",
                    required = true
            )
            @PathVariable String id) {

        List<CodeEntity> codeList = codeService.listByGrpCdKey(id);

        Map<String, Object> data = new HashMap<>();
        data.put("codeList", codeList);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 코드 상세 조회
     * @param id
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(value = "getCode", notes = "코드 상세 조회")
    @RequestMapping(value=Path.CODE_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCode(
            @ApiParam(
                    name = "id",
                    defaultValue = "1",
                    value = "코드 키",
                    required = true
            )
            @PathVariable String id) {

        CodeEntity code = codeService.get(id);

        Map<String, Object> data = new HashMap<>();
        data.put("code", code);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 코드 등록
     * @param code
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(value = "addCode", notes = "코드 등록")
    @RequestMapping(value=Path.CODE, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addCode(
            @Validated @RequestBody CodeDto.Code code
    ) {
        code.setId(null);
        CodeEntity codeEntity = modelMapper.map(code, CodeEntity.class);
        GroupCodeEntity groupCodeEntity = groupCodeService.get(code.getGroupCd());
        codeEntity.setGroupCd(groupCodeEntity);
        codeService.save(codeEntity);

        Map<String, Object> data = new HashMap<>();
        data.put("code", codeEntity);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }


    /**
     * 코드 일괄 수정
     * @param codes
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(value = "edit codes", notes = "코드 일괄 수정")
    @RequestMapping(value=Path.CODE, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> updateCodes(
            @RequestBody List<CodeDto.Code> codes
    ) {
        codeService.editCodes(codes);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);

        return ResponseEntity.ok(resultVO);
    }


    /**
     * 코드 수정
     * @param code
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(value = "updateCode", notes = "코드 수정")
    @RequestMapping(value=Path.CODE_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> updateCode(
            @PathVariable String id,
            @Validated @RequestBody CodeDto.Code code
    ) {

        code.setId(id);

        CodeEntity codeEntity = modelMapper.map(code, CodeEntity.class);
        GroupCodeEntity groupCodeEntity = groupCodeService.get(code.getGroupCd());
        codeEntity.setGroupCd(groupCodeEntity);
        codeService.save(codeEntity);

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("code", codeEntity);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 코드 삭제
     * @param id
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(value = "deleteCode", notes = "코드 삭제")
    @RequestMapping(value=Path.CODE_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteCode(
            @ApiParam(
            name = "id",
            defaultValue = "1",
            value = "코드 키",
            required = true
    ) @PathVariable String id) {

        codeService.remove(id);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);

        return ResponseEntity.ok(resultVO);

    }

}
