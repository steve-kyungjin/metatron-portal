package app.metatron.portal.common.user.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 사용자 시작페이지 설정
 */
@Entity
@Table(name = "mp_cm_user_start_page")
public class UserStartPageEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 시작페이지 경로
     */
    @Column
    private String startPage;

    /**
     * 사용자
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStartPage() {
        return startPage;
    }

    public void setStartPage(String startPage) {
        this.startPage = startPage;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
