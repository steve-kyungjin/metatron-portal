package app.metatron.portal.portal.extract.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.domain.AbstractEntity;
import app.metatron.portal.portal.datasource.domain.DataSourceEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 사용자 정의 변수
 */
@Entity
@Table(name = "mp_ex_variable")
public class CustomVariableEntity extends AbstractEntity {

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
     * 설명
     */
    @Column
    private String description;

    /**
     * 쿼리
     */
    @Lob
    @Column
    private String sqlTxt;

    /**
     * 검색키
     */
    @Column
    private String searchKey;

    /**
     * 데이터소스
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "datasource_id")
    private DataSourceEntity dataSource;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSqlTxt() {
        return sqlTxt;
    }

    public void setSqlTxt(String sqlTxt) {
        this.sqlTxt = sqlTxt;
    }

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public DataSourceEntity getDataSource() {
        return dataSource;
    }

    public void setDataSource(DataSourceEntity dataSource) {
        this.dataSource = dataSource;
    }

    public String getDataSourceId() {
        if( this.dataSource != null ) {
            return this.dataSource.getId();
        }
        return null;
    }
}
