package app.metatron.portal.common.user.domain;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.media.domain.MediaGroupEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/*
 * Class Name : UserEntity
 * 
 * Class Description: UserEntity Class
 *
 * Created by nogah on 2018-01-26.
 *
 * Version : v1.0
 *
 */
@Entity
@Table(name = "mp_cm_user")
public class UserEntity extends AbstractEntity {

    @Id
    @Column(length = 20 ,nullable = false )
    private String userId;

    @Column
    private String userNm;

    @JsonIgnore
    @Column
    private String password;

    // 사용 여부
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean useYn = true;

    @JsonIgnore
    @Column
    private String emailAddr;

    @JsonIgnore
    @Column
    private String celpTlno;

    @Column
    private String picUrl;

    @JsonIgnore
    @Column
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
    private LocalDateTime lastLoginDate;

    @JsonIgnore
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<RoleGroupUserRelEntity> userRel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "media_grp_id")
    private MediaGroupEntity mediaGroup;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserNm() {
        return userNm;
    }

    public void setUserNm(String userNm) {
        this.userNm = userNm;
    }

    public boolean getUseYn() {
        return useYn;
    }

    public void setUseYn(boolean useYn) {
        this.useYn = useYn;
    }

    public void setUseYn(Boolean useYn) {
        this.useYn = useYn;
    }

    public List<RoleGroupUserRelEntity> getUserRel() {
        return userRel;
    }

    public void setUserRel(List<RoleGroupUserRelEntity> userRel) {
        this.userRel = userRel;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public MediaGroupEntity getMediaGroup() {
        return mediaGroup;
    }

    public void setMediaGroup(MediaGroupEntity mediaGroup) {
        this.mediaGroup = mediaGroup;
    }

    public String getEmailAddr() {
        return emailAddr;
    }

    public void setEmailAddr(String emailAddr) {
        this.emailAddr = emailAddr;
    }

    public String getCelpTlno() {
        return celpTlno;
    }

    public void setCelpTlno(String celpTlno) {
        this.celpTlno = celpTlno;
    }

    public LocalDateTime getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(LocalDateTime lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public String getPicUrl() {
        return picUrl;
    }

    public void setPicUrl(String picUrl) {
        this.picUrl = picUrl;
    }

    @JsonIgnore
    public List<RoleGroupEntity> getGroupList() {
        List<RoleGroupEntity> groups = new ArrayList<>();
        if( this.userRel != null && this.userRel.size() > 0 ) {
            this.userRel.forEach(rel -> {
                if( rel.getRoleGroup().getType() == RoleGroupType.GENERAL ) {
                    groups.add(rel.getRoleGroup());
                }
            });
        }
        return groups;
    }

    @JsonIgnore
    public List<RoleGroupEntity> getRoleList() {
        List<RoleGroupEntity> roles = new ArrayList<>();
        if( this.userRel != null && this.userRel.size() > 0 ) {
            this.userRel.forEach(rel -> {
                if( rel.getRoleGroup().getType() == RoleGroupType.SYSTEM ) {
                    roles.add(rel.getRoleGroup());
                }
            });
        }
        return roles;
    }

    @JsonIgnore
    public boolean isAdmin() {
        if( this.userRel != null && this.userRel.size() > 0 ) {
            for( RoleGroupUserRelEntity rel : this.userRel ) {
                if( rel.getRoleGroup().getType() == RoleGroupType.SYSTEM
                        && Const.RoleGroup.SYSTEM_ADMIN.equals(rel.getRoleGroup().getId()) ) {
                    return true;
                }
            }
        }
        return false;
    }

    public RoleGroupEntity getOrg() {
        if( this.userRel != null && this.userRel.size() > 0 ) {
            for( RoleGroupUserRelEntity rel : this.userRel ) {
                if( rel.getRoleGroup().getType() == RoleGroupType.ORGANIZATION ) {
                    return rel.getRoleGroup();
                }
            }
        }
        return null;
    }

    public String getOrgNm() {
        return this.getOrg() == null? "": this.getOrg().getName();
    }
}
