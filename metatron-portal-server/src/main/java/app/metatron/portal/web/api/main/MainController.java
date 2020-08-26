package app.metatron.portal.web.api.main;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.portal.communication.domain.CommDto;
import app.metatron.portal.portal.main.domain.ContentsVO;
import app.metatron.portal.portal.main.domain.MainVO;
import app.metatron.portal.portal.main.service.MainService;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class MainController extends AbstractController {

    @Autowired
    private MainService mainService;


    /**
     * main all
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "main all",
            notes = "main all"
    )
    @RequestMapping(value = Path.MAIN, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAll(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {

        MainVO main = mainService.getAll();

        Map<String, Object> data = new HashMap<>();
        data.put("main", main);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * main communication
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "main communication",
            notes = "main communication"
    )
    @RequestMapping(value = Path.MAIN_COMMUNICATIONS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommunications(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {

        List<ContentsVO> communications = mainService.getCommunications();

        Map<String, Object> data = new HashMap<>();
        data.put("communications", communications);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * main analysis app
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "main analysis app",
            notes = "main analysis app"
    )
    @RequestMapping(value = Path.MAIN_ANALYSIS_APPS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAnalysisApps(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {

        List<ContentsVO> analysisApps = mainService.getAnalysisApps();

        Map<String, Object> data = new HashMap<>();
        data.put("analysisApps", analysisApps);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * main report app
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "main report app",
            notes = "main report app"
    )
    @RequestMapping(value = Path.MAIN_REPORT_APPS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getReportApps(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {

        List<ContentsVO> reportApps = mainService.getReportApps();

        Map<String, Object> data = new HashMap<>();
        data.put("reportApps", reportApps);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication notices
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication notices",
            notes = "communication notices"
    )
    @RequestMapping(value = Path.MAIN_NOTICES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getNotices(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        List<CommDto.SimplePost> noticeList = mainService.getNotices();

        Map<String, Object> data = new HashMap<>();
        data.put("noticeList", noticeList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication notices check for new
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication notices check for new",
            notes = "communication notices check for new"
    )
    @RequestMapping(value = Path.MAIN_NOTICES_CHECK, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getNotices(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "last notice id"
            )
            @RequestParam(name = "id") String id
    ) {
        boolean result = mainService.checkNoticesForNew(id);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", result);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * my requested not process
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "my requested not process",
            notes = "my requested not process"
    )
    @RequestMapping(value = Path.MAIN_REQUESTED_NOT_PROCESS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getMyRequestedNotProcessList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        List<CommDto.SimplePost> notProcessList = mainService.getMyRequestedNotProcessList();

        Map<String, Object> data = new HashMap<>();
        data.put("notProcessList", notProcessList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * my requested process
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "my requested process",
            notes = "my requested process"
    )
    @RequestMapping(value = Path.MAIN_REQUESTED_PROCESS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getMyRequestedProcessList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        List<CommDto.SimplePost> processList = mainService.getMyRequestedProcessList();

        Map<String, Object> data = new HashMap<>();
        data.put("processList", processList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * my requested completed
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "my requested completed",
            notes = "my requested completed"
    )
    @RequestMapping(value = Path.MAIN_REQUESTED_COMPLETED, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getMyRequestedCompletedList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        List<CommDto.SimplePost> completedList = mainService.getMyRequestedCompletedList();

        Map<String, Object> data = new HashMap<>();
        data.put("completedList", completedList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * alarm badge count
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "alarm badge count",
            notes = "alarm badge count"
    )
    @RequestMapping(value = Path.MAIN_ALARM_BADGE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAlarmBadge(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        Map<String, Integer> badge = mainService.getAlarmBadge();

        Map<String, Object> data = new HashMap<>();
        data.put("badge", badge);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

}
