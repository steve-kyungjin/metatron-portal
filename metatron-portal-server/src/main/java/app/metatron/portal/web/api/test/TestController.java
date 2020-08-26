package app.metatron.portal.web.api.test;

import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.common.util.ExtractAppUtil;
import app.metatron.portal.portal.metatron.service.MetatronRelayService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@Api(tags = "Test") // 공통 태그
public class TestController {
    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    @Autowired
    private JdbcTemplate jdbcTemplateMeta;

    @Autowired
    private MetatronRelayService metatronRelayService;

    @Value("${app.sso.metatron-basic-token}")
    private String metatronBasicToken;

    @Value("${app.sso.metatron-admin-id}")
    private String metatronAdminId;

    @Value("${app.sso.metatron-admin-pw}")
    private String metatronAdminPw;
    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /**
     * 임시 Tango 통합 SSO
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/tango-common-sso/sso/login")
    public Object tangoSSO(
            @RequestBody Map<String, Object> body
    ) throws Exception{
        JSONObject json = new JSONObject();
        json.put("celpTlno", "010-1111-3303");
        json.put("emailAddr", "test@test.sk.com");
        json.put("lastPwdChgDate", "2018-01-23 10:58:47");
        json.put("loginUserStatus", 200);
        json.put("orgId", "1000196808");
        json.put("orgNm", "E2E분석팀");
        json.put("tokenId", "Vy3zFyADOIQQDqDkEIQO5123yDQuDD");
        json.put("uprOrgId", "1000062748");
        json.put("uprOrgNm", "Infra운용그룹");
        json.put("userId", "dt-admin");
        json.put("userNm", "홍길동");

        return json;
    }

    /**
     * 임시 Tango 통합 SSO verify
     * @return
     * @throws Exception
     */
    @RequestMapping("/tango-common-sso/sso/token/verify")
    public Object tangoSSOVerify(
            @RequestBody Map<String, Object> body
    ) throws Exception{
        JSONObject json = new JSONObject();
        json.put("celpTlno", "010-1111-3303");
        json.put("emailAddr", "test@test.sk.com");
        json.put("lastPwdChgDate", "2018-01-23 10:58:47");
        json.put("loginUserStatus", 200);
        json.put("orgId", "1000196808");
        json.put("orgNm", "E2E분석팀");
        json.put("tokenId", "Vy3zFyADOIQQDqDkEIQO5123yDQuDD");
        json.put("uprOrgId", "1000062748");
        json.put("uprOrgNm", "Infra운용그룹");
        json.put("userId", "admin");
        json.put("userNm", "홍길동");

        return json;
    }

    @Autowired
    private ExtractAppUtil extractAppUtil;

    @ApiOperation(
            value = "extractTest",
            notes = "extractTest"
    )
    @RequestMapping(value = "/api/extract/test", method = RequestMethod.POST)
    public Object extractTest(
            @RequestParam(name = "sql") String sql
    ) {
        return extractAppUtil.parse(sql);
    }


    @ApiOperation(
            value = "metatronbatchTest",
            notes = "metatronbatchTest"
    )
    @GetMapping(value = "/api/metatronbatch/test")
    public void batchTest() {
        JSONObject metatronTokenObj = (JSONObject) metatronRelayService.getMetatronToken(metatronAdminId, metatronAdminPw);
        String metatronToken = metatronTokenObj.get("access_token").toString();
        metatronRelayService.getMetatronUserByApi(metatronToken);
    }


    @ApiOperation(
            value = "metatronbatchTestDB",
            notes = "metatronbatchTestDB"
    )
    @GetMapping(value = "/api/metatronbatch/testdb")
    public void batchTestDB() {
        List<Map<String,Object>> userist = jdbcTemplateMeta.queryForList(
                "select user_name, user_email, user_full_name, user_password, user_image_Url from users");
        metatronRelayService.getMetatronUser(userist);
    }
}
