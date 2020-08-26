package app.metatron.portal.portal.log.domain;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 사용자 화면 액션 로그
 */
@Entity
@Table(name = "mp_log_action", indexes = {
        @Index(name = "idx_mp_log_action_time", columnList = "time", unique = false),
        @Index(name = "idx_mp_log_module_id", columnList = "moduleId", unique = false),
        @Index(name = "idx_mp_log_type", columnList = "type", unique = false),
        @Index(name = "idx_mp_log_action", columnList = "action", unique = false),
        @Index(name = "idx_mp_log_var", columnList = "var", unique = false),
        @Index(name = "idx_mp_log_user_id", columnList = "userId", unique = false)
})
public class ActionLogEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 시스템 구분
     */
    @Column
    private String system;

    /**
     * 서버 호스트명
     */
    @Column
    private String host;

    /**
     * 모듈 아이디 (IA)
     */
    @Column
    private String moduleId;

    /**
     * 모듈 명
     */
    @Column
    private String moduleNm;

    /**
     * 화면 타입
     */
    @Column
    private String type;

    /**
     * 액션 : 버튼 다운로드 리스트아이템
     */
    @Column
    private String action;

    /**
     * 변수
     */
    @Column
    private String var;

    /**
     * 수행자 아이디
     */
    @Column
    private String userId;

    /**
     * 수행자 이름
     */
    @Column
    private String userNm;

    /**
     * 소속 부서 아이디
     */
    @Column
    private String orgId;

    /**
     * 소속 부서 이름
     */
    @Column
    private String orgNm;

    /**
     * 수행일
     */
    @Column
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
    private LocalDateTime time;

    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleNm() {
        return moduleNm;
    }

    public void setModuleNm(String moduleNm) {
        this.moduleNm = moduleNm;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getVar() {
        return var;
    }

    public void setVar(String var) {
        this.var = var;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserNm() {
        return userNm;
    }

    public void setUserNm(String userNm) {
        this.userNm = userNm;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getOrgNm() {
        return orgNm;
    }

    public void setOrgNm(String orgNm) {
        this.orgNm = orgNm;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }
}
