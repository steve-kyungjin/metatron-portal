package app.metatron.portal.portal.metadata.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.List;

/**
 * 메타 인스턴스
 */
@Entity
@Table(name = "mp_md_instance")
public class MetaInstanceEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    // DB 인스턴스 물리명
    @Column
    private String physicalNm;

    // DB 인스턴스 논리명
    @Column
    private String logicalNm;

    // 설명
    @Column(length = 3000)
    private String description;

    // DB 접속 정보
    @Column
    private String connectionInfo;

    // 접속 프로토콜
    @Column
    private String connectionProtocol;

    // DBMS 제품명
    @Column
    private String productNm;

    // DBMS 제품 버전
    @Column
    private String productVersion;

    // DBMS 공급업체명
    @Column
    private String providerNm;

    // 관리 담당자
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "manager_id")
    private UserEntity manager;

    // DB 관리자
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id")
    private UserEntity worker;

    @JsonIgnore
    @OneToMany(mappedBy = "instance", fetch = FetchType.LAZY)
    private List<MetaDatabaseEntity> databases;

    /**
     * 삭제 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean delYn;

    @JsonIgnore
    @OneToMany(mappedBy = "instance", fetch = FetchType.LAZY)
    List<MetaSystemInstanceRelEntity> systemRels;

    public List<MetaSystemInstanceRelEntity> getSystemRels() {
        return systemRels;
    }

    public void setSystemRels(List<MetaSystemInstanceRelEntity> systemRels) {
        this.systemRels = systemRels;
    }

    public Boolean getDelYn() {
        return delYn;
    }

    public void setDelYn(Boolean delYn) {
        this.delYn = delYn;
    }

    public UserEntity getManager() {
        return manager;
    }

    public void setManager(UserEntity manager) {
        this.manager = manager;
    }

    public UserEntity getWorker() {
        return worker;
    }

    public void setWorker(UserEntity worker) {
        this.worker = worker;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPhysicalNm() {
        return physicalNm;
    }

    public void setPhysicalNm(String physicalNm) {
        this.physicalNm = physicalNm;
    }

    public String getLogicalNm() {
        return logicalNm;
    }

    public void setLogicalNm(String logicalNm) {
        this.logicalNm = logicalNm;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getConnectionInfo() {
        return connectionInfo;
    }

    public void setConnectionInfo(String connectionInfo) {
        this.connectionInfo = connectionInfo;
    }

    public String getConnectionProtocol() {
        return connectionProtocol;
    }

    public void setConnectionProtocol(String connectionProtocol) {
        this.connectionProtocol = connectionProtocol;
    }

    public String getProductNm() {
        return productNm;
    }

    public void setProductNm(String productNm) {
        this.productNm = productNm;
    }

    public String getProductVersion() {
        return productVersion;
    }

    public void setProductVersion(String productVersion) {
        this.productVersion = productVersion;
    }

    public String getProviderNm() {
        return providerNm;
    }

    public void setProviderNm(String providerNm) {
        this.providerNm = providerNm;
    }

    public List<MetaDatabaseEntity> getDatabases() {
        return databases;
    }

    public void setDatabases(List<MetaDatabaseEntity> databases) {
        this.databases = databases;
    }
}
