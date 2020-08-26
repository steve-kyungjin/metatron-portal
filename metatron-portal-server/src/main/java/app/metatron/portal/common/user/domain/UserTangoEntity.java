package app.metatron.portal.common.user.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;

/*
 * Class Name : UserBasEntity
 * 
 * Class Description: UserBasEntity Class
 *
 * Created by nogah on 2018-01-26.
 *
 * Version : v1.0
 *
 */
@Entity
@Table(name = "cco_user_rqs_inf")
public class UserTangoEntity extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    // ID
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    // 사용자신청인련번호
    private String userRqsSrno;
    // 협력업체 ID
    private String bpId;
    // 조직ID
    private String orgId;
    // 사용자명
    private String userNm;
    // 예정사용자ID
    private String schdUserId;
    // 조직 그룹코드
    private String orgGrpCd;
    // 사원번호
    private String empNo;
    // 사용자직위코드
    private String userPstnCd;
    // 조직직위코드
    private String orgPstnCd;
    // 사용자계정유형코드
    private String userAcntgTypCd;
    // 사용자신청일자D
    private String userRqsDate;
    // 사용자신청상태구분코드
    private String userRqsStatDivCd;
    // 사용자신청비고
    @Column(length = 2000)
    private String userRqsRmk;
    // 임시계정만료일자
    private String tmpAcntgExprnDt;
    // 담당업무코드
    private String chrgTaskCd;
    // 담당자조직ID
    private String chrrOrgId;
    // 담당자사용자ID
    private String chrrUserId;
    // 담당자승인사유
    private String chrrAprvRsn;
    // 담당자승인일자D
    private String chrrAprvDate;
    // 담당자반려사유
    private String chrrRjctRsn;
    // 승인자ID
    private String aprvrId;
    // 승인자승인사유
    private String aprvrAprvRsn;
    // 승인일자D
    private String aprv_date;
    // 승인자반려사유
    private String aprvrRjctRsn;
    // 사용자역할코드
    private String userRoleCd;
    // 사용자역할코드목록
    private String userRoleCdLst;
    // 사진URL
    private String picUrl;
    // 부서장여부
    private String dptmYn;
    // 레거시사용자ID
    private String lgcyUserId;
    // 레거시시스템코드
    private String lgcySystmCd;
    // 레거시사용자명
    private String lgcyUserNm;
    // 최초등록일자D
    private String frstRegDate;
    // 최초등록사용자ID
    private String frstRegUserId;
    // 최종변경일자D
    private String lastChgDate;
    // 최종변경사용ID
    private String lastChgUserId;
    // ETL_DT
    private String etlDt;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getUserRqsSrno() {
        return userRqsSrno;
    }

    public void setUserRqsSrno(String userRqsSrno) {
        this.userRqsSrno = userRqsSrno;
    }

    public String getBpId() {
        return bpId;
    }

    public void setBpId(String bpId) {
        this.bpId = bpId;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getUserNm() {
        return userNm;
    }

    public void setUserNm(String userNm) {
        this.userNm = userNm;
    }

    public String getSchdUserId() {
        return schdUserId;
    }

    public void setSchdUserId(String schdUserId) {
        this.schdUserId = schdUserId;
    }

    public String getOrgGrpCd() {
        return orgGrpCd;
    }

    public void setOrgGrpCd(String orgGrpCd) {
        this.orgGrpCd = orgGrpCd;
    }

    public String getEmpNo() {
        return empNo;
    }

    public void setEmpNo(String empNo) {
        this.empNo = empNo;
    }

    public String getUserPstnCd() {
        return userPstnCd;
    }

    public void setUserPstnCd(String userPstnCd) {
        this.userPstnCd = userPstnCd;
    }

    public String getOrgPstnCd() {
        return orgPstnCd;
    }

    public void setOrgPstnCd(String orgPstnCd) {
        this.orgPstnCd = orgPstnCd;
    }

    public String getUserAcntgTypCd() {
        return userAcntgTypCd;
    }

    public void setUserAcntgTypCd(String userAcntgTypCd) {
        this.userAcntgTypCd = userAcntgTypCd;
    }

    public String getUserRqsDate() {
        return userRqsDate;
    }

    public void setUserRqsDate(String userRqsDate) {
        this.userRqsDate = userRqsDate;
    }

    public String getUserRqsStatDivCd() {
        return userRqsStatDivCd;
    }

    public void setUserRqsStatDivCd(String userRqsStatDivCd) {
        this.userRqsStatDivCd = userRqsStatDivCd;
    }

    public String getUserRqsRmk() {
        return userRqsRmk;
    }

    public void setUserRqsRmk(String userRqsRmk) {
        this.userRqsRmk = userRqsRmk;
    }

    public String getTmpAcntgExprnDt() {
        return tmpAcntgExprnDt;
    }

    public void setTmpAcntgExprnDt(String tmpAcntgExprnDt) {
        this.tmpAcntgExprnDt = tmpAcntgExprnDt;
    }

    public String getChrgTaskCd() {
        return chrgTaskCd;
    }

    public void setChrgTaskCd(String chrgTaskCd) {
        this.chrgTaskCd = chrgTaskCd;
    }

    public String getChrrOrgId() {
        return chrrOrgId;
    }

    public void setChrrOrgId(String chrrOrgId) {
        this.chrrOrgId = chrrOrgId;
    }

    public String getChrrUserId() {
        return chrrUserId;
    }

    public void setChrrUserId(String chrrUserId) {
        this.chrrUserId = chrrUserId;
    }

    public String getChrrAprvRsn() {
        return chrrAprvRsn;
    }

    public void setChrrAprvRsn(String chrrAprvRsn) {
        this.chrrAprvRsn = chrrAprvRsn;
    }

    public String getChrrAprvDate() {
        return chrrAprvDate;
    }

    public void setChrrAprvDate(String chrrAprvDate) {
        this.chrrAprvDate = chrrAprvDate;
    }

    public String getChrrRjctRsn() {
        return chrrRjctRsn;
    }

    public void setChrrRjctRsn(String chrrRjctRsn) {
        this.chrrRjctRsn = chrrRjctRsn;
    }

    public String getAprvrId() {
        return aprvrId;
    }

    public void setAprvrId(String aprvrId) {
        this.aprvrId = aprvrId;
    }

    public String getAprvrAprvRsn() {
        return aprvrAprvRsn;
    }

    public void setAprvrAprvRsn(String aprvrAprvRsn) {
        this.aprvrAprvRsn = aprvrAprvRsn;
    }

    public String getAprv_date() {
        return aprv_date;
    }

    public void setAprv_date(String aprv_date) {
        this.aprv_date = aprv_date;
    }

    public String getAprvrRjctRsn() {
        return aprvrRjctRsn;
    }

    public void setAprvrRjctRsn(String aprvrRjctRsn) {
        this.aprvrRjctRsn = aprvrRjctRsn;
    }

    public String getUserRoleCd() {
        return userRoleCd;
    }

    public void setUserRoleCd(String userRoleCd) {
        this.userRoleCd = userRoleCd;
    }

    public String getUserRoleCdLst() {
        return userRoleCdLst;
    }

    public void setUserRoleCdLst(String userRoleCdLst) {
        this.userRoleCdLst = userRoleCdLst;
    }

    public String getPicUrl() {
        return picUrl;
    }

    public void setPicUrl(String picUrl) {
        this.picUrl = picUrl;
    }

    public String getDptmYn() {
        return dptmYn;
    }

    public void setDptmYn(String dptmYn) {
        this.dptmYn = dptmYn;
    }

    public String getLgcyUserId() {
        return lgcyUserId;
    }

    public void setLgcyUserId(String lgcyUserId) {
        this.lgcyUserId = lgcyUserId;
    }

    public String getLgcySystmCd() {
        return lgcySystmCd;
    }

    public void setLgcySystmCd(String lgcySystmCd) {
        this.lgcySystmCd = lgcySystmCd;
    }

    public String getLgcyUserNm() {
        return lgcyUserNm;
    }

    public void setLgcyUserNm(String lgcyUserNm) {
        this.lgcyUserNm = lgcyUserNm;
    }

    public String getFrstRegDate() {
        return frstRegDate;
    }

    public void setFrstRegDate(String frstRegDate) {
        this.frstRegDate = frstRegDate;
    }

    public String getFrstRegUserId() {
        return frstRegUserId;
    }

    public void setFrstRegUserId(String frstRegUserId) {
        this.frstRegUserId = frstRegUserId;
    }

    public String getLastChgDate() {
        return lastChgDate;
    }

    public void setLastChgDate(String lastChgDate) {
        this.lastChgDate = lastChgDate;
    }

    public String getLastChgUserId() {
        return lastChgUserId;
    }

    public void setLastChgUserId(String lastChgUserId) {
        this.lastChgUserId = lastChgUserId;
    }

    public String getEtlDt() {
        return etlDt;
    }

    public void setEtlDt(String etlDt) {
        this.etlDt = etlDt;
    }
}
