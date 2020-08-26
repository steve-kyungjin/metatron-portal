package app.metatron.portal.portal.communication.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 본문 템플릿
 */
@Entity
@Table(name = "mp_co_template")
public class CommTemplateEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 템플릿 이름
     */
    @Column
    private String name;

    /**
     * 본문 템플릿
     */
    @Lob
    @Column
    private String template;

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

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }
}
