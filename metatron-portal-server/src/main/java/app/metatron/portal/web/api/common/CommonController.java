package app.metatron.portal.web.api.common;

import app.metatron.portal.portal.search.service.ElasticSearchRelayService;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.util.CmdUtil;
import app.metatron.portal.common.value.ResultVO;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/*
 * Class Name : CommonController
 * 
 * Class Description: CommonController Class
 *
 * Created by nogah on 2018-03-05.
 *
 * Version : v1.0
 *
 */
@Slf4j
@RestController
public class CommonController extends AbstractController {

    @Autowired
    private ElasticSearchRelayService elasticSearchRelayService;

    private int roleId= 300000;

    @RequestMapping(value = "/sys/info", method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSystemInfo() {
        JSONObject info = new JSONObject();
        info.put("hostname", CmdUtil.exec("hostname"));

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("info", info);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    @RequestMapping("/es/index/batch")
    public ResponseEntity<ResultVO> esBatchIndex() {
//        elasticSearchRelayService.deleteIndex();
        elasticSearchRelayService.analysisAppIndexAll();
        elasticSearchRelayService.reportAppIndexAll();
        elasticSearchRelayService.projectAppIndexAll();
        elasticSearchRelayService.communicationIndexAll();
        elasticSearchRelayService.metaColumnIndexAll();
        elasticSearchRelayService.metaTableIndexAll();

//        elasticSearchRelayService.deleteIndex();

        Map<String, Object> data = new HashMap<>();

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);

    }


}
