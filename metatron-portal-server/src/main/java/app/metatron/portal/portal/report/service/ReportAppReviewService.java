package app.metatron.portal.portal.report.service;

import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.portal.report.domain.ReportAppReviewEntity;
import app.metatron.portal.portal.report.repository.ReportAppReviewRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 리포트앱 리뷰 서비스
 */
@Service
@Transactional
public class ReportAppReviewService extends AbstractGenericService<ReportAppReviewEntity, String> {

    @Autowired
    private ReportAppReviewRepository reportAppReviewRepository;

    @Autowired
    protected ModelMapper modelMapper;

    @Override
    protected JpaRepository<ReportAppReviewEntity, String> getRepository() {
        return reportAppReviewRepository;
    }

    /**
     * 특정앱 리뷰 조회
     * @param appId
     * @param pageable
     * @return
     */
    public Page<ReportAppReviewEntity> listByAppId(String appId, Pageable pageable){
        return reportAppReviewRepository.findByApp_IdAndParent_IdIsNull( appId , pageable);
    }
    //
}
