package app.metatron.portal.portal.metadata.domain;

import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.domain.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;

/**
 * 용어사전
 */
@Entity
@Table(name = "mp_md_dictionary")
public class MetaDictionaryEntity extends AbstractEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 단어(한글 기준)
     */
    @Column
    private String nmKr;

    /**
     * 단어(영문 명)
     */
    @Column
    private String nmEn;

    /**
     * 단어(영문 약어)
     */
    @Column
    private String abbr;

    /**
     * 단어 정의
     */
    @Lob
    @Column
    private String description;

    /**
     * 분류어 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean classifiYn;

    /**
     * 동음이의어 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean homonymYn;

    /**
     * 복합어 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean compoundYn;

    /**
     * 컬럼 생성 활용
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean useColYn;

    /**
     * 비즈니스 용어 활용
     */
    @Type(type = "yes_no")
    @Column(length = 1 )
    private Boolean useBizYn;

    /**
     * 비즈니스 용어 카테고리
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private CodeEntity category;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNmKr() {
        return nmKr;
    }

    public void setNmKr(String nmKr) {
        this.nmKr = nmKr;
    }

    public String getNmEn() {
        return nmEn;
    }

    public void setNmEn(String nmEn) {
        this.nmEn = nmEn;
    }

    public String getAbbr() {
        return abbr;
    }

    public void setAbbr(String abbr) {
        this.abbr = abbr;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getClassifiYn() {
        return classifiYn;
    }

    public void setClassifiYn(Boolean classifiYn) {
        this.classifiYn = classifiYn;
    }

    public Boolean getHomonymYn() {
        return homonymYn;
    }

    public void setHomonymYn(Boolean homonymYn) {
        this.homonymYn = homonymYn;
    }

    public Boolean getCompoundYn() {
        return compoundYn;
    }

    public void setCompoundYn(Boolean compoundYn) {
        this.compoundYn = compoundYn;
    }

    public Boolean getUseColYn() {
        return useColYn;
    }

    public void setUseColYn(Boolean useColYn) {
        this.useColYn = useColYn;
    }

    public Boolean getUseBizYn() {
        return useBizYn;
    }

    public void setUseBizYn(Boolean useBizYn) {
        this.useBizYn = useBizYn;
    }

    public CodeEntity getCategory() {
        return category;
    }

    public void setCategory(CodeEntity category) {
        this.category = category;
    }
}
