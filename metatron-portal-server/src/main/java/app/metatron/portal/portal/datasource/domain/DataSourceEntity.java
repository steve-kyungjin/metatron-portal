package app.metatron.portal.portal.datasource.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 데이터소스
 */
@Entity
@Table(name = "mp_ds_datasource")
public class DataSourceEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 이름
     */
    @Column
    private String name;

    /**
     * 호스트
     */
    @Column
    private String host;

    /**
     * 포트
     */
    @Column
    private String port;

    /**
     * 데이터소스 타입
     */
    @Enumerated(EnumType.STRING)
    @Column
    private DatabaseType databaseType;

    /**
     * 데이터베이스 이름
     */
    @Column
    private String databaseNm;

    /**
     * 계정 아이디
     */
    @Column
    private String databaseUser;

    /**
     * 계정 비밀번호
     */
    @Column
    private String databasePassword;

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

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public DatabaseType getDatabaseType() {
        return databaseType;
    }

    public void setDatabaseType(DatabaseType databaseType) {
        this.databaseType = databaseType;
    }

    public String getDatabaseNm() {
        return databaseNm;
    }

    public void setDatabaseNm(String databaseNm) {
        this.databaseNm = databaseNm;
    }

    public String getDatabaseUser() {
        return databaseUser;
    }

    public void setDatabaseUser(String databaseUser) {
        this.databaseUser = databaseUser;
    }

    public String getDatabasePassword() {
        return databasePassword;
    }

    public void setDatabasePassword(String databasePassword) {
        this.databasePassword = databasePassword;
    }
}
