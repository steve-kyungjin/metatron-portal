package app.metatron.portal.portal.communication.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 요청건 처리자
 */
@Entity
@Table(name = "mp_co_post_user_rel")
public class CommPostUserRelEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id")
    private CommPostEntity post;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column
    private int dispOrder;

    public int getDispOrder() {
        return dispOrder;
    }

    public void setDispOrder(int dispOrder) {
        this.dispOrder = dispOrder;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public CommPostEntity getPost() {
        return post;
    }

    public void setPost(CommPostEntity post) {
        this.post = post;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
