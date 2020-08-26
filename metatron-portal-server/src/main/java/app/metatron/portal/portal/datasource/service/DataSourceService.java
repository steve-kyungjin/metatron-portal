package app.metatron.portal.portal.datasource.service;

import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.portal.datasource.domain.DataSourceDto;
import app.metatron.portal.portal.datasource.domain.DataSourceEntity;
import app.metatron.portal.portal.datasource.domain.DatabaseType;
import app.metatron.portal.portal.datasource.repository.DataSourceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 데이터소스 관리 서비스
 */
@Service
@Transactional
public class DataSourceService extends AbstractGenericService<DataSourceEntity, String> {

    @Autowired
    private DataSourceRepository dataSourceRepository;

    @Autowired
    protected ModelMapper modelMapper;

    @Override
    protected JpaRepository<DataSourceEntity, String> getRepository() {
        return dataSourceRepository;
    }

    /**
     * 데이터소스 목록
     * @return
     */
    public List<DataSourceEntity> getOrderedDataSourceList() {
        return dataSourceRepository.findByOrderByCreatedDateDesc();
    }

    /**
     * 데이터 소스 추가
     * @param dataSourceDto
     * @return
     */
    public DataSourceEntity addDataSource(DataSourceDto.CREATE dataSourceDto) {
//        DataSourceEntity dataSource = modelMapper.map(dataSourceDto, DataSourceEntity.class);
        DataSourceEntity dataSource = new DataSourceEntity();
        dataSource.setName(dataSourceDto.getName());
        dataSource.setHost(dataSourceDto.getHost());
        dataSource.setPort(dataSourceDto.getPort());
        dataSource.setDatabaseNm(dataSourceDto.getDatabaseNm());
        dataSource.setDatabaseType(DatabaseType.valueOf(dataSourceDto.getDatabaseType().toUpperCase()));
        dataSource.setDatabaseUser(dataSourceDto.getDatabaseUser());
        dataSource.setDatabasePassword(dataSourceDto.getDatabasePassword());

        this.setCreateUserInfo(dataSource);

        return dataSourceRepository.save(dataSource);
    }

    /**
     * 데이터 소스 수정
     * @param dataSourceDto
     * @return
     */
    public DataSourceEntity updateDataSource(DataSourceDto.EDIT dataSourceDto) {
//        DataSourceEntity dataSource = modelMapper.map(dataSourceDto, DataSourceEntity.class);
        DataSourceEntity dataSource = dataSourceRepository.findOne(dataSourceDto.getId());

        dataSource.setName(dataSourceDto.getName());
        dataSource.setHost(dataSourceDto.getHost());
        dataSource.setPort(dataSourceDto.getPort());
        dataSource.setDatabaseNm(dataSourceDto.getDatabaseNm());
        dataSource.setDatabaseType(DatabaseType.valueOf(dataSourceDto.getDatabaseType().toUpperCase()));
        dataSource.setDatabaseUser(dataSourceDto.getDatabaseUser());
        dataSource.setDatabasePassword(dataSourceDto.getDatabasePassword());

        this.setUpdateUserInfo(dataSource);

        return dataSourceRepository.save(dataSource);
    }

    /**
     * 데이터 소스 삭제
     * @param dataSourceId
     * @return
     */
    public boolean removeDataSource(String dataSourceId) {
        int cnt = dataSourceRepository.getCountUsageAnalysisApp(dataSourceId);
        cnt += dataSourceRepository.getCountUsageReportApp(dataSourceId);
        cnt += dataSourceRepository.getCountUsageCustomVariable(dataSourceId);

        if( cnt > 0 ) {
            return false;
        } else {
            dataSourceRepository.delete(dataSourceId);
            return true;
        }
    }
}

