package app.metatron.portal.web.api.common;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.user.domain.IADto;
import app.metatron.portal.common.user.domain.IAEntity;
import app.metatron.portal.common.user.domain.MenuVO;
import app.metatron.portal.common.user.service.IAService;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
public class IAController extends AbstractController {

    @Autowired
    private IAService iaService;


    /**
     * ia 정보 중 메뉴 정보 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
        value = "IA information",
        notes = "Menu List 조회"
    )
    @RequestMapping(value = Path.MENU, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getMenuList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ){

        String userId = this.getCurrentUserId();

        List<MenuVO> menuList = iaService.getMenuList(userId);

        Map<String, Object> data = new HashMap<>();
        data.put("menu", menuList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * ia 정보 중 1depth 메뉴 정보 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "1 depth menu list",
            notes = "1 depth menu list"
    )
    @RequestMapping(value = Path.MENU_1DEPTH, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getMenuListFor1Depth(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ){

        String userId = this.getCurrentUserId();

        List<MenuVO> menuList = iaService.getMenuListFor1Depth(userId);

        Map<String, Object> data = new HashMap<>();
        data.put("menu", menuList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 특정 ia 권한 보유 여부
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "특정 ia 권한 보유 여부 ",
            notes = "특정 ia 권한 보유 여부 "
    )
    @RequestMapping(value = Path.MENU_HAS_ROLE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getMenuHasRole(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="IA006",
                    value ="IA"
            )
            @PathVariable(name = "id") String id
    ){

        String userId = this.getCurrentUserId();

        boolean hasRole = iaService.hasRoleForIA(userId, id);

        Map<String, Object> data = new HashMap<>();
        data.put("hasRole", hasRole);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * ia root list
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "ia root list",
            notes = "ia root list"
    )
    @RequestMapping(value = Path.IA_ROOT_LIST, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getIARootList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ){

        List<IAEntity> iaList = iaService.getIARootList();

        Map<String, Object> data = new HashMap<>();
        data.put("iaList", iaList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * ia children list
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "ia children list",
            notes = "ia children list"
    )
    @RequestMapping(value = Path.IA_CHILDREN_LIST, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getIAChildrenList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "B612240000",
                    value = "IA id"
            )
            @PathVariable(name = "id") String id
    ){

        List<IAEntity> iaList = iaService.getIAChildrenList(id);

        Map<String, Object> data = new HashMap<>();
        data.put("iaList", iaList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * ia detail
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "ia detail",
            notes = "ia detail"
    )
    @RequestMapping(value = Path.IA_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getIADetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "1000196808",
                    value = "IA id"
            )
            @PathVariable(name = "id") String id
    ){

        IAEntity ia = iaService.get(id);

        Map<String, Object> data = new HashMap<>();
        data.put("ia", ia);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * ia add
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "ia add",
            notes = "ia add"
    )
    @RequestMapping(value = Path.IA, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addIA(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid @RequestBody IADto.CREATE iaDto,
            BindingResult bindingResult
    ){
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        IAEntity ia = iaService.addIA(iaDto);

        Map<String, Object> data = new HashMap<>();
        data.put("ia", ia);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * ia edit
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "ia edit",
            notes = "ia edit"
    )
    @RequestMapping(value = Path.IA_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> editIA(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "1000196808",
                    value = "IA id"
            )
            @PathVariable(name = "id") String id,
            @Valid @RequestBody IADto.EDIT iaDto,
            BindingResult bindingResult
    ){
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        IAEntity ia = iaService.editIA(iaDto);

        Map<String, Object> data = new HashMap<>();
        data.put("ia", ia);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * ia delete
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "ia delete",
            notes = "ia delete"
    )
    @RequestMapping(value = Path.IA_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteIA(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "1000196808",
                    value = "IA id"
            )
            @PathVariable(name = "id") String id
    ){
        boolean result = iaService.removeIA(id);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

}
