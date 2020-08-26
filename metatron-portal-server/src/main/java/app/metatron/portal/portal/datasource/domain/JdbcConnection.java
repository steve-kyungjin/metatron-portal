package app.metatron.portal.portal.datasource.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * JDBC 커넥션을 위한 확장 정보
 */
public abstract class JdbcConnection extends DataSourceEntity {

    /**
     * 드라이버 클래스
     * @return
     */
    @JsonIgnore
    public abstract String getDriverClass();

    /**
     * 테스트 쿼리
     * @return
     */
    @JsonIgnore
    public abstract String getTestQuery();

    /**
     * 테이블 조회
     * @param schema
     * @return
     */
    @JsonIgnore
    public abstract String getShowTableQuery(String schema);

    /**
     * 커넥션 정보
     * @return
     */
    @JsonIgnore
    public abstract String getConnectUrl();

    // 기능 전개되는 것 확인 후 추가 정의
//    @JsonIgnore
//    public abstract String getShowSchemaQuery();
//
//    @JsonIgnore
//    public abstract String getShowTableDescribeQuery(String tableName);
//
//    @JsonIgnore
//    public abstract String getTableName(String schema, String table);
//
//    @JsonIgnore
//    public abstract String getDefaultTimeFormat();
//
//    @JsonIgnore
//    public abstract String getCharToDateStmt(String timeStr, String timeFormat);
//
//    @JsonIgnore
//    public abstract String getCurrentTimeStamp();

    /**
     * 커넥션 생성 (빈 오브젝트)
     * @param databaseType
     * @return
     */
    public static JdbcConnection create(DatabaseType databaseType) {
        if( DatabaseType.HIVE == databaseType ) {
            return new HiveConnection();
        } else if( DatabaseType.MYSQL == databaseType ) {
            return new MySqlConnection();
        } else if( DatabaseType.POSTGRESQL == databaseType ) {
            return new PostgreSqlConnection();
        }
        return null;
    }

    /**
     * 커넥션 생성
     * @param dataSource
     * @return
     */
    public static JdbcConnection create(DataSourceEntity dataSource) {
        JdbcConnection connection = create(dataSource.getDatabaseType());
        connection.setId(dataSource.getId());
        connection.setName(dataSource.getName());
        connection.setHost(dataSource.getHost());
        connection.setPort(dataSource.getPort());
        connection.setDatabaseNm(dataSource.getDatabaseNm());
        connection.setDatabaseType(dataSource.getDatabaseType());
        connection.setDatabaseUser(dataSource.getDatabaseUser());
        connection.setDatabasePassword(dataSource.getDatabasePassword());
        return connection;
    }

    /**
     * 커넥션 생성
     * @param dataSource
     * @return
     */
    public static JdbcConnection create(DataSourceDto.ONCE dataSource) {
        JdbcConnection connection = create(DatabaseType.valueOf(dataSource.getDatabaseType()));
        connection.setHost(dataSource.getHost());
        connection.setPort(dataSource.getPort());
        connection.setDatabaseNm(dataSource.getDatabaseNm());
        connection.setDatabaseType(DatabaseType.valueOf(dataSource.getDatabaseType()));
        connection.setDatabaseUser(dataSource.getDatabaseUser());
        connection.setDatabasePassword(dataSource.getDatabasePassword());
        return connection;
    }
}
