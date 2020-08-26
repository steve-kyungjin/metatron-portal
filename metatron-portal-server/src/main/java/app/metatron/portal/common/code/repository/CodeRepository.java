package app.metatron.portal.common.code.repository;

import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.code.domain.GroupCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CodeRepository extends JpaRepository<CodeEntity, String> {
	
	/**
	 * 그룹코드를 기준으로 코드 단건 조회
	 * @return
	 */
	CodeEntity findByGroupCd(GroupCodeEntity groupCode);
	
	/**
	 * 그룹코드를 기준으로 코드 리스트 조회
	 * @return
	 */
	List<CodeEntity> findByGroupCdOrderByCdOrderAsc(GroupCodeEntity groupCode);
	
}
