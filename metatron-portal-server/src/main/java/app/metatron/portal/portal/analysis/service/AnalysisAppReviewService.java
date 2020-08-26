package app.metatron.portal.portal.analysis.service;

import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.portal.analysis.domain.AnalysisAppReviewEntity;
import app.metatron.portal.portal.analysis.repository.AnalysisAppReviewRepository;
//import app.metatron.portal.common.user.service.RoleService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 앱 리뷰 서비스
 */
@Service
@Transactional
public class AnalysisAppReviewService extends AbstractGenericService<AnalysisAppReviewEntity, String> {

    @Autowired
    private AnalysisAppReviewRepository analysisAppReviewRepository;

    @Autowired
    protected ModelMapper modelMapper;

    @Override
    protected JpaRepository<AnalysisAppReviewEntity, String> getRepository() {
        return analysisAppReviewRepository;
    }

    /**
     * 특정 앱에 대한 리뷰 조회
     * @param appId
     * @param pageable
     * @return
     */
    public Page<AnalysisAppReviewEntity> listByAppId(String appId,Pageable pageable){
        return analysisAppReviewRepository.findByApp_IdAndParent_IdIsNull( appId , pageable);
    }

}
