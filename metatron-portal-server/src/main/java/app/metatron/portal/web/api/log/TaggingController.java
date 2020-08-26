package app.metatron.portal.web.api.log;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.portal.log.domain.LogDto;
import app.metatron.portal.portal.log.service.ActionLogService;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
public class TaggingController extends AbstractController {

    @Autowired
    private ActionLogService actionLogService;

    /**
     * UI tagging
     * @return
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "UI tagging",
            notes = "UI tagging"
    )
    @RequestMapping(value = Path.TAGGING, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> tagging(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid @RequestBody LogDto.Action logDto,
            BindingResult bindingResult
    ){
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        actionLogService.write(logDto);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }
}
