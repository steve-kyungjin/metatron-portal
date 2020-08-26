package app.metatron.portal.portal.log.repository;

import app.metatron.portal.portal.log.domain.AppLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppLogRepository extends JpaRepository<AppLogEntity, String> {

    /**
     * 마이앱 로그 목록
     * @param type
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select log from AppLogEntity log " +
            "where (:keyword is null or (log.user.userNm = :keyword or log.user.userId = :keyword )) " +
            "and (:type is null or log.type = :type) " +
            "order by log.createdDate desc ")
    Page<AppLogEntity> getAppLogList(@Param("type") AppLogEntity.Type type, @Param("keyword") String keyword, Pageable pageable);

}
