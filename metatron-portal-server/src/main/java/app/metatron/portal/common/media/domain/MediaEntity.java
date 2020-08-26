package app.metatron.portal.common.media.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 미디어
 */
@Entity
@Table(name = "mp_cm_media")
public class MediaEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 이름
     */
    @Column
    private String name;

    /**
     * 확장자
     */
    @Column
    private String extension;

    /**
     * 마임타입
     */
    @Column
    private String contentType;

    /**
     * 실 컨텐츠
     */
    @JsonIgnore
    @Lob
    @Column
    private byte[] contents;

    /**
     * 썸네일
     */
    @JsonIgnore
    @Lob
    @Column
    private byte[] thumbnail;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "group_id")
    private MediaGroupEntity group;

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

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public byte[] getContents() {
        return contents;
    }

    public void setContents(byte[] contents) {
        this.contents = contents;
    }

    public MediaGroupEntity getGroup() {
        return group;
    }

    public void setGroup(MediaGroupEntity group) {
        this.group = group;
    }

    public byte[] getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
    }
}
