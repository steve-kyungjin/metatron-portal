package app.metatron.portal.web.api.sso;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.user.service.UserService;
import app.metatron.portal.portal.metatron.service.MetatronRelayService;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
 * Class Name : SiteController
 * 
 * Class Description: SiteController Class
 *
 * Created by boozer on 2018-02-21.
 *
 * Version : v1.0
 *
 */
@RestController
@Slf4j
public class SSOController {

    @Autowired
    private UserService userService;

    @Autowired
    private MetatronRelayService metatronRelayService;

    /**
     * Redirect From T-net
     * @return
     * @throws Exception
     */
    @RequestMapping(value = Path.SSO_FROM_TNET, method = RequestMethod.POST)
    public void redirectFromTnet(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestParam(value = "authinform", required = false) String smServerSession,
            @RequestHeader(value = "SM_SERVERSESSIONID", required = false) String eamsServerSession,
            @CookieValue(value = "SM_USER", required = false) String empNo
    ) throws Exception{

        String redirectURL = Path.SSO_TNET_VIEW;

        log.debug("==============================================================================");
        log.debug("TNET smServerSession : " + smServerSession);
        log.debug("TNET SM_SERVERSESSIONID : " + eamsServerSession);
        log.debug("TNET SM_USER : " + empNo);

        try {
            if (empNo != null) {

                UserEntity userEntity = userService.get("SKT" + empNo);
                if (userEntity != null) {
                    String userId = userEntity.getUserId();

                    log.debug("TNET UserEntity : " + userId);
                    redirectURL += "?userId=" + userId;
                }
            }
        } catch (Exception e) {
            log.debug("TNET Exception : " + e.getMessage());
        }

        log.debug("TNET URL : " + redirectURL);
        log.debug("==============================================================================");

        response.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
        response.setHeader("Location", redirectURL);
        response.sendRedirect(redirectURL);
    }

    /**
     * Login(Metatron)
     * @return
     * @throws Exception
     */
    @RequestMapping(value = Path.SSO_METATRON, method = RequestMethod.POST)
    @ApiOperation(
            value = "metatron login",
            notes = "Metatron Login"
    )
    public Object metatronLogin(
            @RequestParam(value = "userId") String userId
    ) throws Exception{
        ResultVO resultVO = null;

        UserEntity userEntity = userService.get(userId);
        JSONObject tokenObj = (JSONObject) metatronRelayService.getMetatronToken(userId, userEntity.getPassword());

        if (tokenObj != null) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS,"");
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL,"");
        }
        resultVO.setData(tokenObj);

        return resultVO;
    }


    @RequestMapping(value = "/view/sso/loading/tango", method = {RequestMethod.POST,RequestMethod.GET})
    public ModelAndView tangoLoading(
            @RequestParam(value = "tokenId") String tokenId,
            @RequestParam(value = "returnUrl", required = false) String returnUrl
    ) throws Exception{
        String url = "/view/sso/loading/tango2?tokenId=" + tokenId + "&returnUrl=" + returnUrl;

        ModelAndView mv = new ModelAndView();
        mv.setViewName("redirect:"+url);
        return mv;
    }
}
