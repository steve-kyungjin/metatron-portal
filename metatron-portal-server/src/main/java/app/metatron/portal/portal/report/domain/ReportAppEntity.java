package app.metatron.portal.portal.report.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.media.domain.MediaGroupEntity;
import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;
import org.springframework.util.CollectionUtils;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * 리포트앱
 */
@Entity
@Table(name = "mp_rp_app")
public class ReportAppEntity extends AbstractEntity {

    /**
     * 헤더 타입
     */
    public enum HeaderType {
        URL, METATRON, EXTRACT
    }

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 헤더타입
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private HeaderType headerType;

    /**
     * URL 헤더
     */
    @OneToOne(mappedBy = "app", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private ReportAppUrlHeaderEntity urlHeader;

    /**
     * 메타트론 헤더
     */
    @OneToOne(mappedBy = "app", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private ReportAppMetatronHeaderEntity metatronHeader;

    /**
     * 추출앱 헤더
     */
    @OneToOne(mappedBy = "app", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private ReportAppExtractHeaderEntity extractHeader;

    /**
     * 리뷰
     */
    @JsonIgnore
    @OneToMany(mappedBy = "app", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReportAppReviewEntity> reviews;

    /**
     * 카테고리 관계
     */
    @JsonIgnore
    @OneToMany(mappedBy = "app", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReportAppCategoryRelEntity> categoryRel;

    /**
     * 마이앱 사용자 관계
     */
    @JsonIgnore
    @OneToMany(mappedBy = "app", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<ReportAppUserRelEntity> userRel;

    /**
     * 권한그룹 관계
     */
    @JsonIgnore
    @OneToMany(mappedBy = "app", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<ReportAppRoleGroupRelEntity> roleRel;

    // App 명
    @Column(nullable = false)
    private String appNm;
    // App 요약
    @Column(nullable = false)
    private String summary;

    // App 소개
    @Column(length = 3000, nullable = false)
    private String contents;

    // App 버전
    @Column(length = 10, nullable = false)
    private String ver;

    // App 버전
    @Column(length = 3000)
    private String verInfo;

    // 사용 여부
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean useYn;

    // 삭제 여부
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean delYn = false;

    // 새창여부
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean externalYn = false;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "media_grp_id")
    private MediaGroupEntity mediaGroup;

    @Transient
    private boolean my;

    public Boolean getExternalYn() {
        return externalYn;
    }

    public void setExternalYn(Boolean externalYn) {
        this.externalYn = externalYn;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public HeaderType getHeaderType() {
        return headerType;
    }

    public void setHeaderType(HeaderType headerType) {
        this.headerType = headerType;
    }

    public ReportAppUrlHeaderEntity getUrlHeader() {
        return urlHeader;
    }

    public void setUrlHeader(ReportAppUrlHeaderEntity urlHeader) {
        this.urlHeader = urlHeader;
    }

    public ReportAppMetatronHeaderEntity getMetatronHeader() {
        return metatronHeader;
    }

    public void setMetatronHeader(ReportAppMetatronHeaderEntity metatronHeader) {
        this.metatronHeader = metatronHeader;
    }

    public ReportAppExtractHeaderEntity getExtractHeader() {
        return extractHeader;
    }

    public void setExtractHeader(ReportAppExtractHeaderEntity extractHeader) {
        this.extractHeader = extractHeader;
    }

    public List<ReportAppReviewEntity> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReportAppReviewEntity> reviews) {
        this.reviews = reviews;
    }

    public List<ReportAppCategoryRelEntity> getCategoryRel() {
        return categoryRel;
    }

    public void setCategoryRel(List<ReportAppCategoryRelEntity> categoryRel) {
        this.categoryRel = categoryRel;
    }

    public List<ReportAppUserRelEntity> getUserRel() {
        return userRel;
    }

    public void setUserRel(List<ReportAppUserRelEntity> userRel) {
        this.userRel = userRel;
    }

    public List<ReportAppRoleGroupRelEntity> getRoleRel() {
        return roleRel;
    }

    public void setRoleRel(List<ReportAppRoleGroupRelEntity> roleRel) {
        this.roleRel = roleRel;
    }

    public String getAppNm() {
        return appNm;
    }

    public void setAppNm(String appNm) {
        this.appNm = appNm;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public String getVer() {
        return ver;
    }

    public void setVer(String ver) {
        this.ver = ver;
    }

    public String getVerInfo() {
        return verInfo;
    }

    public void setVerInfo(String verInfo) {
        this.verInfo = verInfo;
    }

    public Boolean getUseYn() {
        return useYn;
    }

    public void setUseYn(Boolean useYn) {
        this.useYn = useYn;
    }

    public Boolean getDelYn() {
        return delYn;
    }

    public void setDelYn(Boolean delYn) {
        this.delYn = delYn;
    }

    public MediaGroupEntity getMediaGroup() {
        return mediaGroup;
    }

    public void setMediaGroup(MediaGroupEntity mediaGroup) {
        this.mediaGroup = mediaGroup;
    }

    public List<CodeEntity> getCategories(){
        if(CollectionUtils.isEmpty(categoryRel)) {
            return null;
        }
        List<CodeEntity> codeList = new ArrayList<>();
        categoryRel.forEach(code -> {
            codeList.add(code.getCategory());
        });
        Collections.sort(codeList, new Comparator<CodeEntity>() {
            @Override
            public int compare(CodeEntity o1, CodeEntity o2) {
                return o1.getCdOrder() > o2.getCdOrder()? 1: o1.getCdOrder() < o2.getCdOrder()? -1: 0;
            }
        });
        return codeList;
    }

    public int getUsage() {
        if( this.getUserRel() != null ) {
            return this.getUserRel().size();
        }
        return 0;
    }

    public List<RoleGroupEntity> getRoles() {
        if(CollectionUtils.isEmpty(this.roleRel)) {
            return null;
        }
        List<RoleGroupEntity> roleGroupList = new ArrayList<>();
        this.roleRel.forEach(rel -> {
            roleGroupList.add(rel.getRoleGroup());
        });
        return roleGroupList;
    }

    public boolean isMy() {
        return my;
    }

    public void setMy(boolean my) {
        this.my = my;
    }

    @JsonProperty
    @Override
    public UserEntity getCreatedBy() {
        return super.getCreatedBy();
    }

    @JsonProperty
    @Override
    public UserEntity getUpdatedBy() {
        return super.getUpdatedBy();
    }

    @JsonProperty
    @Override
    public LocalDateTime getCreatedDate() {
        return super.getCreatedDate();
    }

    @JsonProperty
    @Override
    public LocalDateTime getUpdatedDate() {
        return super.getUpdatedDate();
    }
}
