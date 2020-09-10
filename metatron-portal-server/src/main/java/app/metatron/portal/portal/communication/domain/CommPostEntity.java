package app.metatron.portal.portal.communication.domain;

import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.portal.analysis.domain.AnalysisAppRoleGroupRelEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.file.domain.FileGroupEntity;
import app.metatron.portal.common.media.domain.MediaGroupEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 포스트
 */
@Entity
@Table(name = "mp_co_post")
public class CommPostEntity extends AbstractEntity {

    /**
     * 본문 타입
     * 현재는 HTML 만 사용 중
     */
    public enum ContentType {
        HTML, TEXT
    }

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 타이틀
     */
    @Column
    private String title;

    /**
     * 본문 타입
     */
    @Enumerated(EnumType.STRING)
    @Column
    private ContentType contentType;

    /**
     * 본문(HTML)
     */
    @Lob
    @Column
    private String content;

    /**
     * 검색용 본문
     * 태그 제거
     */
    @Lob
    @Column
    private String strippedContent;

    /**
     * 상태 (요청형)
     */
    @Enumerated(EnumType.STRING)
    @Column
    private PostStatus status;

    /**
     * 뷰 카운트
     */
    @Column
    private Integer viewCnt;

    /**
     * 공지 알림 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean bannerYn;

    /**
     * 공지 알림 시작날짜
     */
    @Column
    private String dispStartDate;

    /**
     * 공지 알림 끝 날짜
     */
    @Column
    private String dispEndDate;

    /**
     * 임시저장 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean draft;

    /**
     * 게시판 마스터
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "master_id")
    private CommMasterEntity master;

    @JsonIgnore
    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    @OrderBy(value = "createdDate ASC")
    private List<CommReplyEntity> replies;

    /**
     * 대표 이미지
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "media_group_id")
    private MediaGroupEntity mediaGroup;

    /**
     * 첨부 파일
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "file_group_id")
    private FileGroupEntity fileGroup;

    /**
     * 본문 삽입 이미지
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "attach_group_id")
    private FileGroupEntity attachGroup;

    /**
     * 담당자
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id")
    private UserEntity worker;

    /**
     * 처리자
     */
    @JsonIgnore
    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    @OrderBy("dispOrder asc")
    private List<CommPostUserRelEntity> userRels;

    /**
     * 권한 관계
     */
    @JsonIgnore
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<CommRoleGroupRelEntity> roleRel;

    public List<CommPostUserRelEntity> getUserRels() {
        return userRels;
    }

    public void setUserRels(List<CommPostUserRelEntity> userRels) {
        this.userRels = userRels;
    }

    public void setWorker(UserEntity worker) {
        this.worker = worker;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public PostStatus getStatus() {
        return status;
    }

    public void setStatus(PostStatus status) {
        this.status = status;
    }

    public Integer getViewCnt() {
        return viewCnt;
    }

    public void setViewCnt(Integer viewCnt) {
        this.viewCnt = viewCnt;
    }

    public List<CommReplyEntity> getReplies() {
        return replies;
    }

    public void setReplies(List<CommReplyEntity> replies) {
        this.replies = replies;
    }

    public CommMasterEntity getMaster() {
        return master;
    }

    public void setMaster(CommMasterEntity master) {
        this.master = master;
    }

    public MediaGroupEntity getMediaGroup() {
        return mediaGroup;
    }

    public void setMediaGroup(MediaGroupEntity mediaGroup) {
        this.mediaGroup = mediaGroup;
    }

    public Boolean getBannerYn() {
        return bannerYn;
    }

    public void setBannerYn(Boolean bannerYn) {
        this.bannerYn = bannerYn;
    }

    public String getDispStartDate() {
        return dispStartDate;
    }

    public void setDispStartDate(String dispStartDate) {
        this.dispStartDate = dispStartDate;
    }

    public String getDispEndDate() {
        return dispEndDate;
    }

    public void setDispEndDate(String dispEndDate) {
        this.dispEndDate = dispEndDate;
    }

    public FileGroupEntity getFileGroup() {
        return fileGroup;
    }

    public void setFileGroup(FileGroupEntity fileGroup) {
        this.fileGroup = fileGroup;
    }

    public Boolean getDraft() {
        return draft;
    }

    public void setDraft(Boolean draft) {
        this.draft = draft;
    }

    public FileGroupEntity getAttachGroup() {
        return attachGroup;
    }

    public void setAttachGroup(FileGroupEntity attachGroup) {
        this.attachGroup = attachGroup;
    }

    public int getReplyCnt() {
        if( this.replies != null && this.replies.size() > 0 ) {
            return this.replies.size();
        }
        return 0;
    }

    public List<CommRoleGroupRelEntity> getRoleRel() {
        return roleRel;
    }

    public void setRoleRel(List<CommRoleGroupRelEntity> roleRel) {
        this.roleRel = roleRel;
    }

    public List<RoleGroupEntity> getRoles() {
        if(CollectionUtils.isEmpty(this.roleRel)) {
            return null;
        }
        List<RoleGroupEntity> roleList = new ArrayList<>();
        this.roleRel.forEach(rel -> {
            roleList.add(rel.getRoleGroup());
        });
        return roleList;
    }

    /**
     * 담당자 (요청형)
     * @return
     */
//    public UserEntity getWorker() {
//        if( this.master != null && this.master.getPostType() == CommMasterEntity.PostType.WORKFLOW ) {
//            if( this.replies != null && this.replies.size() > 0 ) {
//                // 댓글의 정렬을 뒤집어서
//                // 최근 등록건 부터 작성자가 본 포스트 작성자가 아닌 경우를 처리자로 처리
//                Collections.reverse(this.replies);
//                for( CommReplyEntity reply : this.replies ) {
//                    if( !reply.getCreatedBy().getUserId().equals(this.createdBy.getUserId()) ) {
//                        return reply.getCreatedBy();
//                    }
//                }
//            }
//        }
//        return null;
//    }
    public UserEntity getWorker() {
        return worker;
    }

    /**
     * 처리자
     * @return
     */
    public List<UserEntity> getCoworkers() {
        List<UserEntity> coworkers = new ArrayList<>();
        if( this.userRels != null && this.userRels.size() > 0 ) {
            this.userRels.forEach(rel -> {
                coworkers.add(rel.getUser());
            });
        }
        return coworkers;
    }

    @PrePersist
    public void prePersist() {
        super.prePersist();

        if( this.viewCnt == null ) {
            this.viewCnt = 0;
        }
        if( this.bannerYn == null ) {
            this.bannerYn = false;
        }
        if( this.draft == null ) {
            this.draft = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        super.preUpdate();

        if( this.viewCnt == null ) {
            this.viewCnt = 0;
        }
        if( this.bannerYn == null ) {
            this.bannerYn = false;
        }
        if( this.draft == null ) {
            this.draft = false;
        }
    }

    public void setStrippedContent(String strippedContent) {
        this.strippedContent = strippedContent;
    }

    public String getStrippedContent() {
        if( !StringUtils.isEmpty(this.strippedContent)) {
            String sc = this.strippedContent;
            if( this.strippedContent.length() > 500 ) {
                sc = sc.substring(0, 450);
            }
            return sc;
        }
        return "";
    }

    public String getCompleteType() {
        if( PostStatus.COMPLETED == this.status
                && this.replies != null && this.replies.size() > 0 ) {
            String completeType = null;
            for( CommReplyEntity reply : this.replies ) {
                if( PostStatus.COMPLETED == reply.getStatus() ) {
                    completeType = reply.getCompleteType();
                    break;
                }
            }
            return completeType;
        }
        return null;
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
