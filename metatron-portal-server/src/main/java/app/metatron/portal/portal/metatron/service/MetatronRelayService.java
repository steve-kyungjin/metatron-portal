package app.metatron.portal.portal.metatron.service;

import app.metatron.portal.common.exception.ResourceNotFoundException;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.common.user.service.RoleGroupService;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.common.user.domain.RoleGroupType;
import app.metatron.portal.common.user.service.UserService;
import app.metatron.portal.common.util.RestApiUtil;
import app.metatron.portal.common.util.RestTemplateUtil;
import app.metatron.portal.common.value.ResultVO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 메타트론 연계 서비스
 */
@Service
public class MetatronRelayService {

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/


    ////////////////////////////////////////////////////////////
    // metatron 연계 관련 서비스
    ////////////////////////////////////////////////////////////

    /**
     * 메타트론 기본 토큰
     */
    @Value("${app.sso.metatron-basic-token}")
    private String metatronBasicToken;

    /**
     * 메타트론 경로
     */
    @Value("${app.sso.metatron-url}")
    private String metatronUrl;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleGroupService roleGroupService;

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
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /**
     * 메타트론 디비 조회후 유저 등록
     * @param userList
     */
    public void getMetatronUser(List<Map<String, Object>> userList){
        try{
            /* user_name, user_email, user_full_name, user_password, user_image_Url */
            for(Map<String, Object> userData : userList){
                UserEntity user = new UserEntity();
                String userId = userData.get("user_name") == null ? null : userData.get("user_name").toString();
                String email = userData.get("user_email") == null ? null : userData.get("user_email").toString();
                String userNm = userData.get("user_full_name") == null ? null : userData.get("user_full_name").toString();
                String password = userData.get("user_password") == null ? null : userData.get("user_password").toString();
                String picUrl = userData.get("user_image_Url") == null ? null : metatronUrl + "/api/images/load/url?url=" + userData.get("user_image_Url").toString();
                if(userId != null){
                    user.setUseYn(true);
                    user.setUserId(userId);
                    if(email != null)   user.setEmailAddr(email);
                    if(userNm != null)  user.setUserNm(userNm);
                    if(password != null)    user.setPassword(password);
                    if(picUrl != null)  user.setPicUrl(picUrl);
                    userService.addUserFromMetatron(user);
                }
            }
        } catch (Exception e) {}
    }

    /**
     * API로 메타트론 유저 정보 조회후 등록
     * @param metatronToken
     */
    public void getMetatronUserByApi(String metatronToken){
        RestTemplateUtil<String> restTemplate = null;
        JSONObject resultObj = null;
        int size = 20;
        int totalPage = 0;
        int page = 0;
        try {
            List<UserEntity> userList = new ArrayList<>();
            // 메타트론 전체 유저 목록
            while((page == 0 && totalPage == 0 ) || (page < totalPage)){
                resultObj = (JSONObject) getMetatronUserList(size, page, metatronToken);
                if (resultObj != null) {
                    JSONObject pageData = (JSONObject)resultObj.get("page");
                    if(pageData != null && pageData.get("totalPages") != null) {
                        totalPage = Integer.parseInt(pageData.get("totalPages").toString());
                        JSONObject userDataObj = (JSONObject)resultObj.get("_embedded");
                        if(userDataObj != null){
                            JSONArray userDataArray = (JSONArray)userDataObj.get("users");
                            if(userDataArray != null){
                                for(int i=0;i<userDataArray.size();i++){
                                    JSONObject userObj = (JSONObject)userDataArray.get(i);
                                    UserEntity user = new UserEntity();
                                    String userId = userObj.get("id") != null ? userObj.get("id").toString() : null;
                                    String userNm = userObj.get("fullName") != null ? userObj.get("fullName").toString() : null;
                                    String email = userObj.get("email") != null ? userObj.get("email").toString() : null;
                                    if(userId != null){
                                        user.setUserId(userId);
                                        user.setUseYn(true);
                                        if(userNm != null)  user.setUserNm(userNm);
                                        if(email != null)   user.setEmailAddr(email);
                                        userList.add(user);
                                    }
                                }
                            }
                        }
                    }
                }
                page++;
            }

            for(UserEntity metatronUser : userList){
                String userId = metatronUser.getUserId();
                String tumbnailUrl = metatronUrl + "/api/images/load/url?url=metatron://images/user/" + userId;
                URL url = new URL(tumbnailUrl);
                URLConnection con = url.openConnection();
                HttpURLConnection exitCode = (HttpURLConnection)con;
                if(exitCode.getResponseCode() == 200){
                    metatronUser.setPicUrl(tumbnailUrl);
                }
                userService.addUserFromMetatron(metatronUser);
            }
        } catch (Exception e) {}
    }

    public Object getMetatronUserList(int size, int page, String token){
        return this.doHTTP(token, metatronUrl + "/api/users?size=" + size + "&page=" + page + "&sort=createdTime%2asc&active=true&projection=forListView", null, HttpMethod.GET);
    }


    /**
     * Get Metatron Token
     *
     * @param userId
     * @param password
     * @return
     */
    public Object getMetatronToken(String userId, String password) {
        if (password == null) {
            password = userId;
        }
        RestTemplateUtil<String> restTemplate = null;
        JSONObject resultObj = null;

        try {
            restTemplate = new RestTemplateUtil<String>(String.class, metatronUrl + "/oauth/token?grant_type=password&scope=write&username=" + userId + "&password=" + password, HttpMethod.POST, true);
            restTemplate.setContentType(MediaType.APPLICATION_JSON);
            restTemplate.setHeader("X-Requested-With", "XMLHttpRequest");
            restTemplate.setHeader("Authorization", "Basic " + metatronBasicToken);
            restTemplate.setHeader("Access-Control-Allow-Origin", "*");

            String result = restTemplate.finish();
            if (result != null) {
                JSONParser jsonParser = new JSONParser();
                resultObj = (JSONObject) jsonParser.parse(result);
            }
            return resultObj;
        } catch (Exception e) {
            String error = e.getMessage();
            return null;
        }
    }

    /**
     * 유저 조회
     *
     * @param token
     * @param username
     * @return
     */
    public Object getUser(String token, String username) {
        return this.doHTTP(token, metatronUrl + "/api/users/" + username, null, HttpMethod.GET);
    }

    /**
     * 유저 생성
     *
     * @param token
     * @param username
     * @param fullName
     * @param email
     * @param tel
     * @return
     */
    public Object createUser(String token, String username, String fullName, String email, String tel) {
        List<RoleGroupEntity> orgs = roleGroupService.getRoleGroupByTypeAndUser(RoleGroupType.ORGANIZATION, username);

        JSONObject body = new JSONObject();
        body.put("username", username);
        body.put("password", username);
        body.put("fullName", fullName);
        body.put("email", email);
        body.put("tel", tel);
        body.put("passMailer", true);
        JSONArray groups = new JSONArray();
        groups.add("General-User");
        if( orgs != null && orgs.size() > 0 ) {
            orgs.forEach(org -> {
                groups.add(org.getName());
            });
        }
        body.put("groupNames", groups);

        return this.doHTTP(token, metatronUrl + "/api/users/manual", body, HttpMethod.POST);
    }

    /**
     * 메타트론 GET API 호출
     * - 메타트론 API에서 예외 발생시 Fail 코드 반환
     *
     * @param token
     * @param apiUrl
     * @return
     */
    public ResultVO getMtApi(final String token,
                             final String apiUrl) {

        ResultVO resultVO;

        try {

            JSONObject tokenObj = (JSONObject) this.doHTTP(token, metatronUrl + apiUrl, null, HttpMethod.GET);

            if (tokenObj != null) {
                resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "");
                resultVO.setData(tokenObj);
            } else {
                resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "");
            }
        } catch (Exception e) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "");
        }

        return resultVO;
    }

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /**
     * Call HTTP request
     *
     * @param token
     * @param url
     * @param method
     * @return
     */
    private Object doHTTP(final String token,
                          final String url,
                          final JSONObject body,
                          final HttpMethod method) {

        RestTemplateUtil<String> restTemplate = null;
        JSONObject resultObj = null;

        try {
            restTemplate = new RestTemplateUtil<String>(String.class, url, method, true);
            restTemplate.setContentType(MediaType.APPLICATION_JSON);
            restTemplate.setHeader("Authorization", "Bearer " + token);

            String result = null;
            if (body != null) {
                result = restTemplate.finish(body.toJSONString());
            } else {
                result = restTemplate.finish();
            }

            if (result != null) {
                JSONParser jsonParser = new JSONParser();
                resultObj = (JSONObject) jsonParser.parse(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultObj;
    }

}