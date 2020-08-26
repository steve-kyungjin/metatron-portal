package app.metatron.portal.web.api.log;

import app.metatron.portal.common.constant.Path;
import app.metatron.portal.portal.log.domain.SysLogEntity;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.value.ResultVO;
import app.metatron.portal.portal.log.domain.AppLogEntity;
import app.metatron.portal.portal.log.service.AppLogService;
import app.metatron.portal.portal.log.service.SysLogService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LogController extends AbstractController {

    @Autowired
    private AppLogService appLogService;

    @Autowired
    private SysLogService sysLogService;

    /**
     * system connect log
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "system connect log",
            notes = "system connect log"
    )
    @RequestMapping(value = Path.LOG_SYS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSystemConnectLogList(
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

        Page<SysLogEntity> logList = sysLogService.getSystemLogList(null, keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("logList", logList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * app log
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "app log",
            notes = "app log"
    )
    @RequestMapping(value = Path.LOG_APP, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAppLogList(
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

        Page<AppLogEntity> logList = appLogService.getAppLogList(null, keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("logList", logList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }
}
