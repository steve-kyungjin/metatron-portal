package app.metatron.portal.common.media.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;

/**
 * 미디어 그룹
 */
@Entity
@Table(name = "mp_cm_media_group")
public class MediaGroupEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

//    @JsonIgnore
    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    @OrderBy(value = "createdDate ASC")
    private List<MediaEntity> medias;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<MediaEntity> getMedias() {
        return medias;
    }

    public void setMedias(List<MediaEntity> medias) {
        this.medias = medias;
    }
}
