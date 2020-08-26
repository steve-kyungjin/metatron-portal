package app.metatron.portal.common.code.domain;

import app.metatron.portal.common.domain.AbstractEntity;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;

/**
 * 코드 그룹
 */
@Getter
@Setter
@Entity
@Table(name = "mp_cm_group_code")
public class GroupCodeEntity extends AbstractEntity {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
	private String id;

	@Column(length = 50)
	private String groupCd;

	// 그룹코드명 = 한글
	@Column(length = 50)
	private String groupNmKr;
	
	// 그룹코드명 - 영어
	@Column(length = 50)
	private String groupNmEn;
	
	// 그룹코드 설명
	@Column
	private String groupDesc;

	@OneToMany(mappedBy = "groupCd", fetch = FetchType.LAZY)
	@OrderBy(value = "cdOrder ASC")
	private List<CodeEntity> code;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getGroupCd() {
		return groupCd;
	}

	public void setGroupCd(String groupCd) {
		this.groupCd = groupCd;
	}

	public String getGroupNmKr() {
		return groupNmKr;
	}

	public void setGroupNmKr(String groupNmKr) {
		this.groupNmKr = groupNmKr;
	}

	public String getGroupNmEn() {
		return groupNmEn;
	}

	public void setGroupNmEn(String groupNmEn) {
		this.groupNmEn = groupNmEn;
	}

	public String getGroupDesc() {
		return groupDesc;
	}

	public void setGroupDesc(String groupDesc) {
		this.groupDesc = groupDesc;
	}

	public List<CodeEntity> getCode() {
		return code;
	}

	public void setCode(List<CodeEntity> code) {
		this.code = code;
	}
}
