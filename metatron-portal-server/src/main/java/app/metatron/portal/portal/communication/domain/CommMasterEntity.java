package app.metatron.portal.portal.communication.domain;

import app.metatron.portal.portal.analysis.domain.AnalysisAppRoleGroupRelEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 게시판 마스터
 */
@Entity
@Table(name = "mp_co_master")
public class CommMasterEntity extends AbstractEntity {

    /**
     * 게시판 유형
     * GENERAL : 일반형, WORKFLOW : 요청형, NOTICE : 공지형
     */
    public enum PostType {
        GENERAL, WORKFLOW, NOTICE
    }

    /**
     * 목록 뷰 타입
     * BOTH 현재 사용안함
     */
    public enum ListType {
        BOTH, LIST, CARD
    }

    /**
     * 메인 컨텐츠 선정 기준
     */
    public enum Section {
        A, B, ETC
    }

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 게시판 이름
     */
    @Column
    private String name;

    /**
     * 슬러그 (게시판 대표 약어)
     */
    @Column
    private String slug;

    /**
     * 컨텍스트 정보
     */
    @Column
    private String prePath;

    /**
     * 포스트 타입
     */
    @Enumerated(EnumType.STRING)
    @Column
    private PostType postType;

    /**
     * 포스트 세부 유형
     */
    @Column
    private String secondaryType;

    /**
     * 목록 뷰 타입
     */
    @Enumerated(EnumType.STRING)
    @Column
    private ListType listType;

    /**
     * 댓글 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean replyYn;

    /**
     * 사용 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean useYn;

    /**
     * 메인 컨텐츠 구역
     */
    @Enumerated(EnumType.STRING)
    @Column
    private Section section;

    /**
     * 노출 순서
     */
    @Column
    private Integer dispOrder;

    @JsonIgnore
    @OneToMany(mappedBy = "master", fetch = FetchType.LAZY)
    private List<CommPostEntity> posts;

    @JsonIgnore
    @OneToMany(mappedBy = "master", fetch = FetchType.LAZY)
    private List<CommMasterTemplateRelEntity> templateRels;

    /**
     * 권한 관계
     */
    @JsonIgnore
    @OneToMany(mappedBy = "app", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<AnalysisAppRoleGroupRelEntity> roleRel;

    public String getSecondaryType() {
        return secondaryType;
    }

    public void setSecondaryType(String secondaryType) {
        this.secondaryType = secondaryType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PostType getPostType() {
        return postType;
    }

    public void setPostType(PostType postType) {
        this.postType = postType;
    }

    public ListType getListType() {
        return listType;
    }

    public void setListType(ListType listType) {
        this.listType = listType;
    }

    public Boolean getReplyYn() {
        return replyYn;
    }

    public void setReplyYn(Boolean replyYn) {
        this.replyYn = replyYn;
    }

    public List<CommPostEntity> getPosts() {
        return posts;
    }

    public void setPosts(List<CommPostEntity> posts) {
        this.posts = posts;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Boolean getUseYn() {
        return useYn;
    }

    public void setUseYn(Boolean useYn) {
        this.useYn = useYn;
    }

    public Section getSection() {
        return section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public Integer getDispOrder() {
        return dispOrder;
    }

    public void setDispOrder(Integer dispOrder) {
        this.dispOrder = dispOrder;
    }

    public String getPrePath() {
        return prePath;
    }

    public void setPrePath(String prePath) {
        this.prePath = prePath;
    }

    public int getPostCnt() {
        if( this.posts != null && this.posts.size() > 0 ) {
            return this.posts.size();
        }
        return 0;
    }

    public List<CommMasterTemplateRelEntity> getTemplateRels() {
        return templateRels;
    }

    public void setTemplateRels(List<CommMasterTemplateRelEntity> templateRels) {
        this.templateRels = templateRels;
    }

    public List<CommTemplateEntity> getTemplates() {
        List<CommTemplateEntity> templates = new ArrayList<>();
        if( this.templateRels != null && this.templateRels.size() > 0 ) {
            this.templateRels.forEach(rel -> {
                templates.add(rel.getTemplate());
            });
        }
        return templates;
    }

    @PrePersist
    public void prePersist() {
        super.prePersist();

        if( this.useYn == null ) {
            this.useYn = true;
        }
        if( this.replyYn == null ) {
            this.replyYn = true;
        }
        if( this.dispOrder == null ) {
            this.dispOrder = 99;
        }
    }

    @PreUpdate
    public void preUpdate() {
        super.preUpdate();

        if( this.useYn == null ) {
            this.useYn = true;
        }
        if( this.replyYn == null ) {
            this.replyYn = true;
        }
        if( this.dispOrder == null ) {
            this.dispOrder = 99;
        }
    }
}
