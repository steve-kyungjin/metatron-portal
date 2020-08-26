package app.metatron.portal.portal.metadata.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "mp_md_system_instance_rel")
public class MetaSystemInstanceRelEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "system_id")
    private MetaSystemEntity system;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instance_id")
    private MetaInstanceEntity instance;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public MetaSystemEntity getSystem() {
        return system;
    }

    public void setSystem(MetaSystemEntity system) {
        this.system = system;
    }

    public MetaInstanceEntity getInstance() {
        return instance;
    }

    public void setInstance(MetaInstanceEntity instance) {
        this.instance = instance;
    }
}
