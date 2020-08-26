package app.metatron.portal.portal.project.domain;

import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.file.domain.FileGroupEntity;
import app.metatron.portal.common.user.domain.RoleGroupEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.GenericGenerator;
import org.joda.time.LocalDateTime;

import javax.persistence.*;

/**
 * 과제
 */
@Entity
@Table(name = "mp_prj")
public class ProjectEntity extends AbstractEntity {

    /**
     * 기획/분석, 설계, 구현, 테스트, 상용화
     */
    public enum Progress {
        PLANNING, DESIGN, DEVELOP, TEST, PRODUCT
    }

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 과제
     */
    @Column
    private String name;

    /**
     * 요약
     */
    @Column(length = 3000)
    private String summary;

    /**
     * 기대
     */
    @Column(length = 3000)
    private String benefit;

    /**
     * 시작일
     */
    @Column
    private String startDate;

    /**
     * 종료일
     */
    @Column
    private String endDate;

    /**
     * 진행상황
     */
    @Enumerated(EnumType.STRING)
    @Column
    private Progress progress;

    /**
     * 내용
     */
    @Column(length = 3000)
    private String description;

    /**
     * 분류(유형)
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_cd")
    private CodeEntity type;

    /**
     * 담당 그룹
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "work_org_id")
    private RoleGroupEntity workOrg;

    /**
     * 담당자
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id")
    private UserEntity worker;

    /**
     * 협업 담당자
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cowork_org_id")
    private RoleGroupEntity coworkOrg;

    /**
     * 첨부 파일
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "file_group_id")
    private FileGroupEntity fileGroup;


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

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getBenefit() {
        return benefit;
    }

    public void setBenefit(String benefit) {
        this.benefit = benefit;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Progress getProgress() {
        return progress;
    }

    public void setProgress(Progress progress) {
        this.progress = progress;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CodeEntity getType() {
        return type;
    }

    public void setType(CodeEntity type) {
        this.type = type;
    }

    public UserEntity getWorker() {
        return worker;
    }

    public void setWorker(UserEntity worker) {
        this.worker = worker;
    }

    public FileGroupEntity getFileGroup() {
        return fileGroup;
    }

    public void setFileGroup(FileGroupEntity fileGroup) {
        this.fileGroup = fileGroup;
    }

    public RoleGroupEntity getWorkOrg() {
        return workOrg;
    }

    public void setWorkOrg(RoleGroupEntity workOrg) {
        this.workOrg = workOrg;
    }

    public RoleGroupEntity getCoworkOrg() {
        return coworkOrg;
    }

    public void setCoworkOrg(RoleGroupEntity coworkOrg) {
        this.coworkOrg = coworkOrg;
    }

    @JsonProperty
    @Override
    public UserEntity getCreatedBy() {
        return super.getCreatedBy();
    }

    @JsonProperty
    @Override
    public UserEntity getUpdatedBy() {
        return super.getUpdatedBy();
    }

    @JsonProperty
    @Override
    public LocalDateTime getCreatedDate() {
        return super.getCreatedDate();
    }

    @JsonProperty
    @Override
    public LocalDateTime getUpdatedDate() {
        return super.getUpdatedDate();
    }
}

