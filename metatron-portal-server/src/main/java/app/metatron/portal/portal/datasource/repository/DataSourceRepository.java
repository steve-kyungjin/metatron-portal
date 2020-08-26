package app.metatron.portal.portal.datasource.repository;

import app.metatron.portal.portal.datasource.domain.DataSourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DataSourceRepository extends JpaRepository<DataSourceEntity, String> {

    /**
     * 데이터 소스 목록
     * @return
     */
    List<DataSourceEntity> findByOrderByCreatedDateDesc();

    /**
     * 분석 추출앱 특정 데이터소스 사용 카운트
     * @param datasourceId
     * @return
     */
    @Query("select count(app) from AnalysisAppEntity app " +
            "where app.extractHeader is not null " +
            "and app.extractHeader.dataSource.id = :dsId ")
    int getCountUsageAnalysisApp(@Param("dsId") String datasourceId);

    /**
     * 리포트 추출앱 특정 데이터소스 사용 카운트
     * @param datasourceId
     * @return
     */
    @Query("select count(app) from ReportAppEntity app " +
            "where app.extractHeader is not null " +
            "and app.extractHeader.dataSource.id = :dsId ")
    int getCountUsageReportApp(@Param("dsId") String datasourceId);

    /**
     * 사용자정의변수 특정 데이터소스 사용 카운트
     * @param datasourceId
     * @return
     */
    @Query("select count(cvar) from CustomVariableEntity cvar " +
            "where cvar.dataSource.id = :dsId ")
    int getCountUsageCustomVariable(@Param("dsId") String datasourceId);
}
