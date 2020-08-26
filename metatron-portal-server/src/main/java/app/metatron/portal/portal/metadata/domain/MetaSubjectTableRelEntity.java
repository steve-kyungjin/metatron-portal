package app.metatron.portal.portal.metadata.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 주제영역과 테이블 관계
 */
@Entity
@Table(name = "mp_md_subject_table_rel")
public class MetaSubjectTableRelEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 주제영역
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id")
    private MetaSubjectEntity subject;

    /**
     * 테이블
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "table_id")
    private MetaTableEntity table;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public MetaSubjectEntity getSubject() {
        return subject;
    }

    public void setSubject(MetaSubjectEntity subject) {
        this.subject = subject;
    }

    public MetaTableEntity getTable() {
        return table;
    }

    public void setTable(MetaTableEntity table) {
        this.table = table;
    }
}

