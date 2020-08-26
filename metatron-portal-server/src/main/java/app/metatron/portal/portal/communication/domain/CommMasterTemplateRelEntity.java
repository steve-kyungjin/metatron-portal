package app.metatron.portal.portal.communication.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 마스터와 템플릿 연관
 */
@Entity
@Table(name = "mp_co_master_template_rel")
public class CommMasterTemplateRelEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 마스토
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "master_id")
    private CommMasterEntity master;

    /**
     * 템플릿
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "template_id")
    private CommTemplateEntity template;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public CommMasterEntity getMaster() {
        return master;
    }

    public void setMaster(CommMasterEntity master) {
        this.master = master;
    }

    public CommTemplateEntity getTemplate() {
        return template;
    }

    public void setTemplate(CommTemplateEntity template) {
        this.template = template;
    }
}
