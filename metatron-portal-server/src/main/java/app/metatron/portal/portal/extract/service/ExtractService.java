package app.metatron.portal.portal.extract.service;

import app.metatron.portal.common.util.ExtractAppUtil;
import app.metatron.portal.portal.datasource.service.DataSourceService;
import app.metatron.portal.portal.extract.domain.CustomVariableEntity;
import app.metatron.portal.common.service.BaseService;
import app.metatron.portal.common.value.workbench.ExtractAppSql;
import app.metatron.portal.common.value.workbench.QueryResult;
import app.metatron.portal.portal.datasource.domain.DataSourceEntity;
import app.metatron.portal.portal.datasource.service.JdbcConnectionService;
import app.metatron.portal.portal.extract.domain.CustomVariableDto;
import app.metatron.portal.portal.extract.repository.CustomVariableRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 추출앱 관련 서비스
 */
@Service
public class ExtractService extends BaseService {

    @Autowired
    private ExtractAppUtil extractAppUtil;

    @Autowired
    private CustomVariableRepository variableRepository;

    @Autowired
    private DataSourceService dataSourceService;

    @Autowired
    private JdbcConnectionService connectionService;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * 추출앱 sql parse
     * @param sql
     * @return
     */
    public ExtractAppSql parseExtractAppSql(String sql) {
        return extractAppUtil.parse(sql);
    }

    /**
     * 추출앱 sql 조합
     * @param extractAppSql
     * @return
     */
    public String processExtractAppSql(ExtractAppSql extractAppSql) {
        return extractAppUtil.process(extractAppSql);
    }

    /**
     * 사용자정의 변수 목록
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<CustomVariableEntity> getCustomVariableList(String keyword, Pageable pageable) {
        return variableRepository.getCustomVariableList(keyword, pageable);
    }

    /**
     * 사용자정의 변수 상세
     * @param varId
     * @return
     */
    public CustomVariableEntity getCustomVariable(String varId) {
        return variableRepository.findOne(varId);
    }

    /**
     * 사용자정의 변수 추가
     * @param varDto
     * @return
     */
    public CustomVariableEntity addCustomVariable(CustomVariableDto.CREATE varDto) {
        if( this.existsCustomVariable(varDto.getName()) ) {
            return null;
        }

        CustomVariableEntity var = modelMapper.map(varDto, CustomVariableEntity.class);

        if( !StringUtils.isEmpty(varDto.getDataSourceId())) {
            DataSourceEntity dataSource = dataSourceService.get(varDto.getDataSourceId());
            var.setDataSource(dataSource);
        }

        this.setCreateUserInfo(var);
        return variableRepository.save(var);
    }

    /**
     * 사용자정의 변수 수정
     * @param varDto
     * @return
     */
    public CustomVariableEntity editCustomVariable(CustomVariableDto.EDIT varDto) {
        if( StringUtils.isEmpty(varDto.getId()) ) {
            return null;
        }
        CustomVariableEntity var = variableRepository.findOne(varDto.getId());
        if( var == null ) {
            return null;
        }
        if( !var.getName().equals(varDto.getName()) && this.existsCustomVariable(varDto.getName()) ) {
            return null;
        }
        var.setName(varDto.getName());
        var.setDescription(varDto.getDescription());
        var.setSqlTxt(varDto.getSqlTxt());
        var.setSearchKey(varDto.getSearchKey());

        if( !StringUtils.isEmpty(varDto.getDataSourceId())) {
            DataSourceEntity dataSource = dataSourceService.get(varDto.getDataSourceId());
            var.setDataSource(dataSource);
        }

        this.setUpdateUserInfo(var);
        return variableRepository.save(var);
    }

    /**
     * 사용자정의 변수 삭제
     * @param varId
     */
    public boolean removeCustomVariable(String varId) {
        CustomVariableEntity var = variableRepository.findOne(varId);
        if( var == null ) {
            return false;
        }
        variableRepository.delete(var);
        return true;
    }


    /*
    사용자정의 변수에 대한 조합과 파싱 처리 필요
     */

    /**
     * 사용자정의 변수 존재 유무
     * @param name
     * @return
     */
    public boolean existsCustomVariable(String name) {
        return variableRepository.existsByName(name);
    }


    /**
     * 사용자정의 변수 실행
     * @param name
     * @param arg
     * @return
     */
    public QueryResult execCustomVariable(String name, String arg) {
        CustomVariableEntity var = variableRepository.findByName(name);
        if( var == null ) {
            return null;
        }
        String sql = var.getSqlTxt();
        if( !StringUtils.isEmpty(var.getSearchKey()) && !StringUtils.isEmpty(arg) ) {
            String condition = var.getSearchKey() + " = '" + arg + "' ";
            if( sql.toUpperCase().contains("WHERE") ) {
                sql += " and " + condition;
            } else {
                sql += " where " + condition;
            }
        }
        QueryResult result = connectionService.queryForList(var.getDataSource().getId(), sql, 0, 0);
        return result;
    }
}
