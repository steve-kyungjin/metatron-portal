package app.metatron.portal.common.user.domain;

import java.io.Serializable;

/**
 * 사용자 이메일 정보
 * 현재 사용하고 있지 않음
 */
public class UserEmailVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String userNm;

    private String orgNm;

    private String email;

    public String getUserNm() {
        return userNm;
    }

    public void setUserNm(String userNm) {
        this.userNm = userNm;
    }

    public String getOrgNm() {
        return orgNm;
    }

    public void setOrgNm(String orgNm) {
        this.orgNm = orgNm;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
