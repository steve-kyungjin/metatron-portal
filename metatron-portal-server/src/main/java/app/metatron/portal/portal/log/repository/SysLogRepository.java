package app.metatron.portal.portal.log.repository;

import app.metatron.portal.portal.log.domain.SysLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SysLogRepository extends JpaRepository<SysLogEntity, String> {

    /**
     * 사용자 접속 시스템 로그 목록
     * @param endpoint
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select log from SysLogEntity log " +
            "where (:keyword is null or (log.accessUserNm = :keyword or log.accessUserId = :keyword or log.accessIp = :keyword)) " +
            "and (:endpoint is null or log.endpoint = :endpoint) " +
            "order by log.accessTime desc ")
    Page<SysLogEntity> getSysLogList(@Param("endpoint") SysLogEntity.Endpoint endpoint, @Param("keyword") String keyword, Pageable pageable);
}
