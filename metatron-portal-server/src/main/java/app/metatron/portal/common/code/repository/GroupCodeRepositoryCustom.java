package app.metatron.portal.common.code.repository;

import app.metatron.portal.common.code.domain.GroupCodeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GroupCodeRepositoryCustom {
    public Page<GroupCodeEntity> findQueryDslBySearchValuesWithPage(String type, String keyword, String column, Pageable pageable);
}
