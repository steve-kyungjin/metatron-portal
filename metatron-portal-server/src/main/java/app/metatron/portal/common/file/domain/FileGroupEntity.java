package app.metatron.portal.common.file.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;

/**
 * 파일 그룹 Entity
 *
 * @author nogah
 */
@Entity
@Table(name = "mp_cm_file_group")
public class FileGroupEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    /**
     * 파일 리스트
     */
    @OneToMany(mappedBy = "fileGroup", fetch = FetchType.EAGER)
    @OrderBy(value = "dispOrder ASC")
    private List<FileEntity> files;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<FileEntity> getFiles() {
        return files;
    }

    public void setFiles(List<FileEntity> files) {
        this.files = files;
    }
}
