package app.metatron.portal.common.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import app.metatron.portal.common.user.domain.UserEntity;
import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 모든 Entity 입력자 수정자 입력날짜 수정날짜 필요
 * 
 * @author nogah
 */
@MappedSuperclass
public abstract class AbstractEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "created_by")
	protected UserEntity createdBy;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "updated_by")
	protected UserEntity updatedBy;
	
	/** 생성일자 */
	@JsonIgnore
	@Column(name = "created_date")
	@Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
	protected LocalDateTime createdDate;

	/** 수정일자 */
	@JsonIgnore
	@Column(name = "updated_date")
	@Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
	protected LocalDateTime updatedDate;

	public AbstractEntity() {
		// empty constructor
	}
	
	public AbstractEntity(UserEntity createdBy) {
		this.createdBy = createdBy;
	}
	
	public AbstractEntity(UserEntity createdBy, UserEntity updatedBy) {
		this.createdBy = createdBy;
		this.updatedBy	= updatedBy; 
	}

	
	@PrePersist
	public void prePersist() {
		if( this.createdDate == null ) {
			this.createdDate = LocalDateTime.now();
		}
		this.updatedDate = LocalDateTime.now();
	}

	@PreUpdate
	public void preUpdate() {
		updatedDate = LocalDateTime.now();
	}

	public UserEntity getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(UserEntity createdBy) {
		this.createdBy = createdBy;
	}

	public UserEntity getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(UserEntity updatedBy) {
		this.updatedBy = updatedBy;
	}

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}

	public LocalDateTime getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(LocalDateTime updatedDate) {
		this.updatedDate = updatedDate;
	}

}
