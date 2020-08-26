package app.metatron.portal.common.user.domain;

import app.metatron.portal.common.domain.AbstractEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/*
 * Class Name : OrgEntity
 * 
 * Class Description: OrgEntity Class
 *
 * Created by nogah on 2018-02-06.
 *
 * Version : v1.0
 *
 */
@Entity
@Table(name = "cco_org_bas")
public class OrgTangoEntity extends AbstractEntity {
    @Id
    @Column(length = 13 ,nullable = false )
    private String orgId;
    private String orgNm;
    private String orgTypCd;
    private String orgGrpCd;
    private String delDate;
    private String useYn;
    private String uprOrgId;
    private String vldStaDt;
    private String vldEndDt;
    private String orgDivCd;
    private String taskGrpDivCd;
    private String orgSortNo;
    private String orgRmk;
    private String orgTaskFrmCd;
    private String workRvAprvDept_Yn;
    private String eqpJrdtOrgYn;
    private String eqpOpOrgYn;
    private String frstRegDate;
    private String frstRegUserId;
    private String lastChgDate;
    private String lastChgUserId;
    private String etlDt;

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getOrgNm() {
        return orgNm;
    }

    public void setOrgNm(String orgNm) {
        this.orgNm = orgNm;
    }

    public String getOrgTypCd() {
        return orgTypCd;
    }

    public void setOrgTypCd(String orgTypCd) {
        this.orgTypCd = orgTypCd;
    }

    public String getOrgGrpCd() {
        return orgGrpCd;
    }

    public void setOrgGrpCd(String orgGrpCd) {
        this.orgGrpCd = orgGrpCd;
    }

    public String getDelDate() {
        return delDate;
    }

    public void setDelDate(String delDate) {
        this.delDate = delDate;
    }

    public String getUseYn() {
        return useYn;
    }

    public void setUseYn(String useYn) {
        this.useYn = useYn;
    }

    public String getUprOrgId() {
        return uprOrgId;
    }

    public void setUprOrgId(String uprOrgId) {
        this.uprOrgId = uprOrgId;
    }

    public String getVldStaDt() {
        return vldStaDt;
    }

    public void setVldStaDt(String vldStaDt) {
        this.vldStaDt = vldStaDt;
    }

    public String getVldEndDt() {
        return vldEndDt;
    }

    public void setVldEndDt(String vldEndDt) {
        this.vldEndDt = vldEndDt;
    }

    public String getOrgDivCd() {
        return orgDivCd;
    }

    public void setOrgDivCd(String orgDivCd) {
        this.orgDivCd = orgDivCd;
    }

    public String getTaskGrpDivCd() {
        return taskGrpDivCd;
    }

    public void setTaskGrpDivCd(String taskGrpDivCd) {
        this.taskGrpDivCd = taskGrpDivCd;
    }

    public String getOrgSortNo() {
        return orgSortNo;
    }

    public void setOrgSortNo(String orgSortNo) {
        this.orgSortNo = orgSortNo;
    }

    public String getOrgRmk() {
        return orgRmk;
    }

    public void setOrgRmk(String orgRmk) {
        this.orgRmk = orgRmk;
    }

    public String getOrgTaskFrmCd() {
        return orgTaskFrmCd;
    }

    public void setOrgTaskFrmCd(String orgTaskFrmCd) {
        this.orgTaskFrmCd = orgTaskFrmCd;
    }

    public String getWorkRvAprvDept_Yn() {
        return workRvAprvDept_Yn;
    }

    public void setWorkRvAprvDept_Yn(String workRvAprvDept_Yn) {
        this.workRvAprvDept_Yn = workRvAprvDept_Yn;
    }

    public String getEqpJrdtOrgYn() {
        return eqpJrdtOrgYn;
    }

    public void setEqpJrdtOrgYn(String eqpJrdtOrgYn) {
        this.eqpJrdtOrgYn = eqpJrdtOrgYn;
    }

    public String getEqpOpOrgYn() {
        return eqpOpOrgYn;
    }

    public void setEqpOpOrgYn(String eqpOpOrgYn) {
        this.eqpOpOrgYn = eqpOpOrgYn;
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
