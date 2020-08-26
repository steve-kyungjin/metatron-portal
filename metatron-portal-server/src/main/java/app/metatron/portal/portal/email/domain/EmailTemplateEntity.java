package app.metatron.portal.portal.email.domain;

import app.metatron.portal.common.domain.AbstractEntity;

import javax.persistence.*;

@Entity
@Table(name = "mp_em_template")
public class EmailTemplateEntity extends AbstractEntity {

    @Id
    private String id;

    @Column
    private String subject;

    @Lob
    @Column
    private String template;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }
}
