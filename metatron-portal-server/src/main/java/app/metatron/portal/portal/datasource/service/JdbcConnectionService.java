package app.metatron.portal.portal.datasource.service;

import app.metatron.portal.common.service.BaseService;
import app.metatron.portal.common.value.workbench.QueryResult;
import app.metatron.portal.portal.datasource.domain.DataSourceDto;
import app.metatron.portal.portal.datasource.domain.DataSourceEntity;
import app.metatron.portal.portal.datasource.domain.JdbcConnection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.*;
import java.util.*;

/**
 *  즉흥 데이터소스 연결 서비스
 */
@Slf4j
@Service
public class JdbcConnectionService extends BaseService {

    private static final String CLAUSE_SELECT = "select";

    @Autowired
    private DataSourceService dataSourceService;

    /**
     * 연결 테스트
     * @param dataSourceId
     * @return
     */
    public boolean connectionTest(String dataSourceId) {
        boolean result = false;
        DataSourceEntity dataSourceEntity = dataSourceService.get(dataSourceId);
        if( dataSourceEntity != null ) {
            JdbcConnection connection = JdbcConnection.create(dataSourceEntity);
            result = connectionTestInternal(connection);
        }
        return result;
    }

    /**
     * 연결 테스트
     * @param dataSourceDto
     * @return
     */
    public boolean connectionTest(DataSourceDto.ONCE dataSourceDto) {
        boolean result = false;
        if( dataSourceDto != null ) {
            JdbcConnection connection = JdbcConnection.create(dataSourceDto);
            result = connectionTestInternal(connection);
        }
        return result;
    }

    /**
     * 쿼리 유효성 체크
     * @param sql
     * @return
     */
    public boolean validateQuery(String sql) {
        sql = sql.trim().toLowerCase();
        // 궁극적으로는 맞는 sql 인지 판단 필요
        boolean result = sql.indexOf(CLAUSE_SELECT) > -1;
        return result;
    }

    /**
     * 쿼리로 목록 조회
     * @param dataSourceId
     * @param sql
     * @param maxRows
     * @param fetchSize
     * @return
     */
    public QueryResult queryForList(String dataSourceId, String sql, int maxRows, int fetchSize) {
        if( !this.validateQuery(sql) ) {
            return null;
        }
        DataSourceEntity dataSourceEntity = dataSourceService.get(dataSourceId);
        if( dataSourceEntity != null ) {
            JdbcConnection connection = JdbcConnection.create(dataSourceEntity);
            return queryForListInternal(connection, sql, maxRows, fetchSize);
        }
        return null;
    }

    /**
     * 쿼리로 목록 조회
     * @param dataSourceDto
     * @param sql
     * @param maxRows
     * @param fetchSize
     * @return
     */
    public QueryResult queryForList(DataSourceDto.ONCE dataSourceDto, String sql, int maxRows, int fetchSize) {
        if( !this.validateQuery(sql) ) {
            return null;
        }
        if( dataSourceDto != null ) {
            JdbcConnection connection = JdbcConnection.create(dataSourceDto);
            return queryForListInternal(connection, sql, maxRows, fetchSize);
        }
        return null;
    }

    /**
     * 쿼리 실행
     * @param dataSourceId
     * @param sql
     * @return
     */
    public boolean execute(String dataSourceId, String sql) {
        boolean result = false;
        DataSourceEntity dataSourceEntity = dataSourceService.get(dataSourceId);
        if( dataSourceEntity != null ) {
            JdbcConnection connection = JdbcConnection.create(dataSourceEntity);
            result = executeInternal(connection, sql);
        }
        return result;
    }

    /**
     * 쿼리 실행
     * @param dataSourceDto
     * @param sql
     * @return
     */
    public boolean execute(DataSourceDto.ONCE dataSourceDto, String sql) {
        boolean result = false;
        if( dataSourceDto != null ) {
            JdbcConnection connection = JdbcConnection.create(dataSourceDto);
            result = executeInternal(connection, sql);
        }
        return result;
    }


    /**
     * 연결 테스트 내부
     * @param connection
     * @return
     */
    private boolean connectionTestInternal(JdbcConnection connection) {
        boolean result = false;
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            con = createConnection(connection);
            stmt = con.createStatement();
            rs = stmt.executeQuery(connection.getTestQuery());
            result = true;
        } catch (Exception e) {
            log.warn("Fail to check query : {}", e.getMessage());
            result = false;
        } finally {
            releaseConnection(con, stmt, rs);
        }
        return result;
    }

    /**
     * 쿼리로 목록 조회 내부
     * @param connection
     * @param sql
     * @param maxRows
     * @param fetchSize
     * @return
     */
    private QueryResult queryForListInternal(JdbcConnection connection, String sql, int maxRows, int fetchSize) {
        QueryResult queryResult = new QueryResult();
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            con = createConnection(connection);
            stmt = con.createStatement();
            if( maxRows > 0 ) {
                stmt.setMaxRows(maxRows);
            }
            if( fetchSize > 0 ) {
                if (fetchSize > maxRows) {
                    fetchSize = maxRows;
                }
                stmt.setFetchSize(fetchSize);
            }
            rs = stmt.executeQuery(sql);

            Set<String> headList = new HashSet<>();
            ResultSetMetaData meta = rs.getMetaData();
            for( int i=1; i<=meta.getColumnCount(); i++ ) {
                String colNm = StringUtils.isEmpty(meta.getColumnLabel(i))? meta.getColumnName(i): meta.getColumnLabel(i);
                headList.add(colNm);
            }

            List<Map<String, Object>> resultList = new ArrayList<>();
            while( rs.next() ) {
                Map<String, Object> row = new HashMap<>();
                for( String head : headList ) {
                    row.put(head, rs.getObject(head));
                }
                resultList.add(row);
            }

            queryResult.setHeadList(headList);
            queryResult.setResultList(resultList);
        } catch (Exception e) {
            log.warn("Fail to check query : {}", e.getMessage());
        } finally {
            releaseConnection(con, stmt, rs);
        }
        return queryResult;
    }

    /**
     * 실행 내부
     * @param connection
     * @param sql
     * @return
     */
    private boolean executeInternal(JdbcConnection connection, String sql) {
        boolean result = false;
        Connection con = null;
        Statement stmt = null;
        try {
            con = createConnection(connection);
            stmt = con.createStatement();
            result = stmt.execute(sql);
        } catch (Exception e) {
            log.warn("Fail to check query : {}", e.getMessage());
        } finally {
            releaseConnection(con, stmt, null);
        }
        return result;
    }

    /**
     * 커넥션 생성
     * @param connection
     * @return
     */
    private Connection createConnection(JdbcConnection connection) {
        try {
            Class.forName(connection.getDriverClass());
            Connection con = DriverManager.getConnection(connection.getConnectUrl(), connection.getDatabaseUser(), connection.getDatabasePassword());
            return con;
        } catch(Exception e) {
            log.error("Creation datasource failed : {}", connection.getConnectUrl());
        }
        return null;
    }

    /**
     * 커넥션 반환
     * @param connection
     * @param stmt
     * @param rs
     */
    private void releaseConnection(Connection connection, Statement stmt, ResultSet rs) {
        try {
            if( rs != null ) {
                rs.close();
            }
            if( stmt != null ) {
                stmt.close();
            }
            if( connection != null ) {
                connection.close();
            }
        } catch (SQLException e) {
            log.warn("Fail to get connection.");
        }
    }
}
