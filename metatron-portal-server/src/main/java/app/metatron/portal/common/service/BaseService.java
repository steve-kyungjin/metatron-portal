package app.metatron.portal.common.service;

import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.user.service.UserService;
import app.metatron.portal.common.user.domain.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * 최상위 기본 서비스
 * 사용자 정보 조회
 */
public class BaseService {

    @Autowired
    private UserService userService;

    /**
     * 생성자 정보 설정
     * @param entity
     */
    protected void setCreateUserInfo(AbstractEntity entity) {
        UserEntity userEntity = this.getCurrentUser();

        entity.setCreatedBy(userEntity);
        entity.setUpdatedBy(userEntity);
    }

    /**
     * 갱신자 정보 설정
     * @param entity
     */
    protected void setUpdateUserInfo(AbstractEntity entity) {
        UserEntity userEntity = this.getCurrentUser();
        entity.setUpdatedBy(userEntity);
    }

    /**
     * 현재 접속한 사용자의 아이디
     * @return
     */
    protected String getCurrentUserId() {
        // 세션에서 로그인정보 가져옴
        Object principal    = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user           = principal instanceof User ? (User) principal : null;
        String anonymous    = principal instanceof String ? (String) principal : null;
        String username     = user != null ? user.getUsername() : anonymous;

        return username;
    }

    /**
     * 현재 접속한 사용자 정보
     * @return
     */
    protected UserEntity getCurrentUser() {
        return userService.get(this.getCurrentUserId());
    }

    /**
     * 기본 접근 경로
     * @return
     */
    protected String getBasePath() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        return request.getScheme() + "://" +
                request.getServerName() +
                ":" + request.getServerPort() ;
    }

}
