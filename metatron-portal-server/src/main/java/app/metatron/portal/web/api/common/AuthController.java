package app.metatron.portal.web.api.common;

import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.user.service.RoleGroupService;
import app.metatron.portal.common.util.RestApiUtil;
import app.metatron.portal.portal.log.domain.SysLogEntity;
import app.metatron.portal.portal.metatron.service.MetatronRelayService;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.exception.ResourceNotFoundException;
import app.metatron.portal.common.user.domain.UserDto;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.common.user.service.UserService;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.LocalDateTime;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;

@RestController
@Slf4j
public class AuthController extends AbstractController {

    private static final String GRANT_TYPE = "password";
    private static final String SCOPE = "read";

    @Value("${config.token.url}")
    private String tokenUrl;

    @Value("${config.token.basic-token}")
    private String basicToken;

//    @Value("${app.sso.tango-url}")
//    private String tangoUrl;

    @Value("${app.sso.metatron-admin-id}")
    private String metatronAdminId;

    @Value("${app.sso.metatron-admin-pw}")
    private String metatronAdminPw;

    @Autowired
    private RestApiUtil restApiUtil;

    @Autowired
    private MetatronRelayService metatronRelayService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleGroupService roleGroupService;

    @ApiOperation(
            value = "Authorization token",
            notes = "로그인 인증"
    )
    @RequestMapping(value = Path.AUTH, method = RequestMethod.POST)
    public ResultVO auth(
            @ApiParam(
                    value = "",
                    required = true
            )
            @RequestBody UserDto.CREATE userParam
            ) throws Exception {

        ResultVO resultVO = null;
        UserEntity user = null;
        String userId = userParam.getUserId();
        String password = userParam.getPassword();

        try{
            // 메타트론 토큰 발급
            JSONObject metatronTokenObj = (JSONObject) metatronRelayService.getMetatronToken(userId, password);
            if(metatronTokenObj.get("access_token") != null){
                // 토큰 있는 경우 메타트론 유저 정보 조회
                String metatronToken = metatronTokenObj.get("access_token").toString();
                JSONObject metatronUser = (JSONObject) metatronRelayService.getUser(metatronToken, userId);
                try {
                    user = userService.get(userId);
                    user.setPassword(password);
                    user.setLastLoginDate(LocalDateTime.now());
                    userService.save(user);
                    log.debug("[DT User Result : {} {}", userId, user.getUserNm());
                } catch (ResourceNotFoundException e) {
                    // 없는 유저 생성
                    String userNm = (String)metatronUser.get("fullName");
                    String email = (String)metatronUser.get("email");
                    userParam.setUserNm(userNm);
                    userParam.setEmailAddr(email);
                    user = userService.addUser(userParam);
                    log.debug("[DT User Insert : {}", userId);
                }
            }
            if (user != null) {
                String params = "?grant_type="+GRANT_TYPE+"&scope="+SCOPE+"&username="+userId+"&password="+password;
                LinkedHashMap result = (LinkedHashMap)restApiUtil.excute(tokenUrl+params, HttpMethod.POST, null, Object.class, RestApiUtil.MEDIA_TYPE_JSON, "Basic " + basicToken);
                for (Object key : result.keySet()) {
                    Object value = result.get(key);
                    log.debug("[MP Token Result : {} {}", key, value);
                }
                if (result.containsKey("access_token")) {
                    result.put("metatron", metatronTokenObj);
                    log.debug("[Metatron Token Result : {}", metatronTokenObj.toString());
                    resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "");
                    resultVO.setData(result);
                    this.writeSysLog(SysLogEntity.ActionType.LOGIN, SysLogEntity.Endpoint.METATRON, user.getUserId(), user.getUserNm());
                } else {
                    resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "");
                }
            } else {
                resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "");
            }
        }catch(Exception e){
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "");
        }

        return resultVO;
    }


    /**
     * 테스트 용
     * @param authorization
     * @param grantType
     * @param scope
     * @param username
     * @param password
     * @return
     * @throws Exception
     */
    @ApiOperation(
            value = "Dummy Authorization token",
            notes = "임시 토큰 발급"
    )
    @RequestMapping(value = "/api/auth/dummy", method = RequestMethod.GET)
    public ResponseEntity<Object> getDummyToken(
            @ApiParam(
                    defaultValue = "Basic ZHQtcG9ydGFsOmR0LXBvcnRhbC1zZWNyZXQ=",
                    value = "",
                    required = true) @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "password",
                    value = "grant type",
                    required = true
            ) @RequestParam(name = "grant_type") String grantType,
            @ApiParam(
                    defaultValue = "read",
                    value = "scope",
                    required = true
            ) @RequestParam(name = "scope") String scope,
            @ApiParam(
                    defaultValue = "admin",
                    value = "username",
                    required = true
            ) @RequestParam(name = "username") String username,
            @ApiParam(
                    defaultValue = "admin@2018",
                    value = "password",
                    required = true
            ) @RequestParam(name = "password") String password ) throws Exception {
        String params = "?grant_type="+grantType+"&scope="+scope+"&username="+username+"&password="+password;
        Object result = restApiUtil.excute(tokenUrl+params, HttpMethod.POST, null, Object.class, RestApiUtil.MEDIA_TYPE_JSON, authorization);

        return ResponseEntity.ok(result);
    }
}