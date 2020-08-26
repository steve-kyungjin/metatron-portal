package app.metatron.portal.common.user.service;

import app.metatron.portal.portal.metatron.service.MetatronRelayService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

/**
 * 사용자 배치 서비스
 */
@Slf4j
@Service
@Transactional
public class UserBatchService {

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

    /**
     * 유저 배치
     * @param
     * @return
     */
    public boolean setBatchMetatronUser() {
        // DB로 유저 조회
        List<Map<String,Object>> userist = jdbcTemplateMeta.queryForList(
                "select user_name, user_email, user_full_name, user_password, user_image_Url from users where user_status='ACTIVATED'");
        metatronRelayService.getMetatronUser(userist);
        /*
        // API로 유저 조회
        JSONObject metatronTokenObj = (JSONObject) metatronRelayService.getMetatronToken(metatronAdminId, metatronAdminPw);
        String metatronToken = metatronTokenObj.get("access_token").toString();
        metatronRelayService.getMetatronUserByApi(metatronToken);
        */
        return  true;
    }

}
