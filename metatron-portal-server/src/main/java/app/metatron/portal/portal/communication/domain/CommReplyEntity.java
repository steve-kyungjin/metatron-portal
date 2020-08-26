package app.metatron.portal.portal.communication.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.file.domain.FileGroupEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.GenericGenerator;
import org.joda.time.LocalDateTime;

import javax.persistence.*;

/**
 * 포스트 댓글
 */
@Entity
@Table(name = "mp_co_reply")
public class CommReplyEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 댓글 내용
     */
    @Lob
    @Column
    private String content;

    /**
     * 댓글 등록시점의 상태
     */
    @Enumerated(EnumType.STRING)
    @Column
    private PostStatus status;

    @Column
    private String completeType;

    /**
     * 포스트 본문
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id")
    private CommPostEntity post;

    /**
     * 댓글 첨부
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "file_group_id")
    private FileGroupEntity fileGroup;

    public String getCompleteType() {
        return completeType;
    }

    public void setCompleteType(String completeType) {
        this.completeType = completeType;
    }

    public PostStatus getStatus() {
        return status;
    }

    public void setStatus(PostStatus status) {
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public CommPostEntity getPost() {
        return post;
    }

    public void setPost(CommPostEntity post) {
        this.post = post;
    }

    public FileGroupEntity getFileGroup() {
        return fileGroup;
    }

    public void setFileGroup(FileGroupEntity fileGroup) {
        this.fileGroup = fileGroup;
    }

    public String getPostId() {
        return this.post.getId();
    }

    public String getSlug() {
        return this.post.getMaster().getSlug();
    }

    public String getPrePath() {
        return this.post.getMaster().getPrePath();
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
