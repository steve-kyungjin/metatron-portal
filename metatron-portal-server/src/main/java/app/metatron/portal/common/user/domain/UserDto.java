package app.metatron.portal.common.user.domain;

import app.metatron.portal.common.media.domain.MediaGroupEntity;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;
import org.joda.time.LocalDateTime;

import java.util.List;

/*
 * Class Name : UserDto
 * 
 * Class Description: UserDto Class
 *
 * Created by nogah on 2018-01-26.
 *
 * Version : v1.0
 *
 */
public class UserDto{
    @Getter
    @Setter
    @ApiModel("UserDto.CREATE")
    public static class CREATE{

        private String userId;
        private String userNm;
        private String orgId;
        private String orgNm;
        private String emailAddr;
        private String celpTlno;
        private String password;
    }

    @Getter
    @Setter
    @ApiModel("UserDto.PARAM")
    public static class PARAM{
        private String userId;
        private String userNm;
        private String orgId;
        private String useYn;
    }
    @Getter
    @Setter
    @ApiModel("UserDto.RESULT")
    public static class RESULT{
        private String userId;
        private String userNm;
        private String orgId;
        private String useYn;
    }
    @Getter
    @Setter
    @ApiModel("UserDto.SESSION")
    public static class SESSION{
        private String userId;
        private String userNm;
        private String orgId;
        private String useYn;
    }

    @Getter
    @Setter
    @ApiModel("UserDto.SKTEMPLOYEE")
    public static class SKTEMPLOYEE{
        private String stxCd;
        private String dtatTypCd;
        private String tableClCd;
        private String userId;
        private String ctzSerNum;
        private String entCoDt;
        private String retirDt;
        private String aplyStaDt;
        private String aplyEndDt;
        private String bizNum;
        private String loginId;
        private String postOrgId;
        private String postSaleOrgId;
        private String tmpPostOrgId;
        private String prosPtnId;
        private String hanNm;
        private String engNm;
        private String empNum;
        private String sktRempPosCd;
        private String sexCd;
        private String opTypCd;
        private String opLvlCd;
        private String psnTypCd;
        private String userIdActStCd;
        private String pwd;
        private String cntrctStaDt;
        private String rgstDt;
        private String expirObjYn;
        private String emailAddr;
        private String offcPhonNum;
        private String mblPhonNum;
        private String sktEmpJobGrpCd;
        private String auditDtm;
        private String ctzNumPinf;
        private String coClCd;
        private String refUserId;
        private String encPwd;
        private String encPwdUseYn;
    }

    public interface User {
        String getUserId();
        String getUserNm();
        String getPicUrl();
        String getEmailAddr();
        String getCelpTlno();
        LocalDateTime getLastLoginDate();
        MediaGroupEntity getMediaGroup();
        List<RoleGroupEntity> getGroupList();
        boolean isAdmin();
        RoleGroupEntity getOrg();
        String getOrgNm();
    }
}
