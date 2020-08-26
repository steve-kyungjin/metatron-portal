package app.metatron.portal.common.controller;

import app.metatron.portal.common.service.BaseService;
import app.metatron.portal.common.user.service.IAService;
import app.metatron.portal.portal.log.domain.SysLogEntity;
import app.metatron.portal.portal.log.service.SysLogService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

/**
 * 기본 상위 컨트롤러
 */
public abstract class AbstractController {
    @Autowired
    protected ModelMapper modelMapper;

    @Autowired
    private SysLogService sysLogService;

    @Autowired
    private IAService iaService;


    /**
     * 현재 접속한 사용자 아이디
     * @return
     */
    protected String getCurrentUserId() {
        return sysLogService.currentUserId();
    }

    /**
     * 접속 로그 남기기
     * @param type
     * @param endpoint
     */
    protected void writeSysLog(SysLogEntity.ActionType type, SysLogEntity.Endpoint endpoint) {
        sysLogService.write(type, endpoint);
    }

    /**
     * 접속 로그 남기기
     * @param type
     * @param endpoint
     * @param userId
     * @param userNm
     */
    protected void writeSysLog(SysLogEntity.ActionType type, SysLogEntity.Endpoint endpoint, String userId, String userNm) {
        sysLogService.write(type, endpoint, userId, userNm);
    }

    /**
     * 특정 IA에 대한 권한 보유 여부 확인
     * @param ia
     * @return
     */
    protected boolean isAuth(String ia){
        return iaService.hasRoleForIA(this.getCurrentUserId(), ia);
    }
}
