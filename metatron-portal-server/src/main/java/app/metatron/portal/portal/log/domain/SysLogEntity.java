package app.metatron.portal.portal.log.domain;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 사용자 접근 시스템 로그
 */
@Entity
@Table(name = "mp_log_sys", indexes = {
        @Index(name = "idx_mp_log_sys_type",  columnList="type", unique = false),
        @Index(name = "idx_mp_log_sys_access_ip",  columnList="accessIp", unique = false),
        @Index(name = "idx_mp_log_sys_access_user_id",  columnList="accessUserId", unique = false),
        @Index(name = "idx_mp_log_sys_access_user_nm",  columnList="accessUserNm", unique = false),
        @Index(name = "idx_mp_log_sys_access_time",  columnList="accessTime", unique = false)
})
public class SysLogEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 액션
     */
    public enum ActionType {
        LOGIN, LOGOUT
    }

    /**
     * 접근 경로
     */
    public enum Endpoint {
        TNET, TANGO, METATRON
    }

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 액션 타입
     */
    @Enumerated(EnumType.STRING)
    @Column
    private ActionType type;

    /**
     * 접근 경로
     */
    @Enumerated(EnumType.STRING)
    @Column
    private Endpoint endpoint;

    /**
     * 접속자 IP
     */
    @Column
    private String accessIp;

    /**
     * 접속자 아이디
     */
    @Column
    private String accessUserId;

    /**
     * 접속자 이름
     */
    @Column
    private String accessUserNm;

    /**
     * 발생 시간
     */
    @Column
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
    private LocalDateTime accessTime;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ActionType getType() {
        return type;
    }

    public void setType(ActionType type) {
        this.type = type;
    }

    public String getAccessIp() {
        return accessIp;
    }

    public void setAccessIp(String accessIp) {
        this.accessIp = accessIp;
    }

    public String getAccessUserId() {
        return accessUserId;
    }

    public void setAccessUserId(String accessUserId) {
        this.accessUserId = accessUserId;
    }

    public String getAccessUserNm() {
        return accessUserNm;
    }

    public void setAccessUserNm(String accessUserNm) {
        this.accessUserNm = accessUserNm;
    }

    public LocalDateTime getAccessTime() {
        return accessTime;
    }

    public void setAccessTime(LocalDateTime accessTime) {
        this.accessTime = accessTime;
    }

    public Endpoint getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(Endpoint endpoint) {
        this.endpoint = endpoint;
    }

    @Override
    public String toString() {
        return "[SysLog] "
                + "access time: "+this.accessTime.toString("yyyy-MM-dd HH:mm:ss.sss")
                + " || access ip: "+this.accessIp
                + " || type: "+this.type.toString()
                + " || entrypoint: "+this.endpoint
                + " || access user id: "+this.accessUserId
                + " || access user name: "+this.accessUserNm;
    }
}
