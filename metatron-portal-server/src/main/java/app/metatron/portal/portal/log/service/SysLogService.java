package app.metatron.portal.portal.log.service;

import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.portal.log.domain.SysLogEntity;
import app.metatron.portal.portal.log.repository.SysLogRepository;
import app.metatron.portal.common.user.domain.UserEntity;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * 접속 시스템 로그
 */
@Service
public class SysLogService extends AbstractGenericService<SysLogEntity, String> {

    @Autowired
    private SysLogRepository sysLogRepository;

    @Override
    protected JpaRepository<SysLogEntity, String> getRepository() {
        return sysLogRepository;
    }

    public String currentUserId(){
        return this.getCurrentUserId();
    }

    /**
     * 로그 목록
     * @param endpoint
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<SysLogEntity> getSystemLogList(SysLogEntity.Endpoint endpoint, String keyword, Pageable pageable) {
        return sysLogRepository.getSysLogList(endpoint, keyword, pageable);
    }

    /**
     * 로그 저장
     */
    public void write(SysLogEntity.ActionType type, SysLogEntity.Endpoint endpoint) {
        UserEntity user = this.getCurrentUser();
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String accessIp = request.getHeader("X-Forwarded-For");
        if (accessIp == null || accessIp.length() == 0 || "unknown".equalsIgnoreCase(accessIp)) {
            accessIp = request.getHeader("Proxy-Client-IP");
        }
        if (accessIp == null || accessIp.length() == 0 || "unknown".equalsIgnoreCase(accessIp)) {
            accessIp = request.getHeader("WL-Proxy-Client-IP");
        }
        if (accessIp == null || accessIp.length() == 0 || "unknown".equalsIgnoreCase(accessIp)) {
            accessIp = request.getHeader("HTTP_CLIENT_IP");
        }
        if (accessIp == null || accessIp.length() == 0 || "unknown".equalsIgnoreCase(accessIp)) {
            accessIp = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (accessIp == null || accessIp.length() == 0 || "unknown".equalsIgnoreCase(accessIp)) {
            accessIp = request.getRemoteAddr();
        }

        SysLogEntity sysLog = new SysLogEntity();
        sysLog.setType(type);
        sysLog.setAccessIp(accessIp);
        sysLog.setAccessUserId(user.getUserId());
        sysLog.setAccessUserNm(user.getUserNm());
        sysLog.setAccessTime(LocalDateTime.now());
        sysLog.setEndpoint(endpoint);

        sysLogRepository.save(sysLog);
    }

    /**
     * 로그 저장
     * @param type
     * @param endpoint
     * @param userId
     * @param userNm
     */
    public void write(SysLogEntity.ActionType type, SysLogEntity.Endpoint endpoint, String userId, String userNm) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String accessIp = request.getRemoteAddr();

        SysLogEntity sysLog = new SysLogEntity();
        sysLog.setType(type);
        sysLog.setAccessIp(accessIp);
        sysLog.setAccessUserId(userId);
        sysLog.setAccessUserNm(userNm);
        sysLog.setAccessTime(LocalDateTime.now());
        sysLog.setEndpoint(endpoint);

        sysLogRepository.save(sysLog);
    }
}
