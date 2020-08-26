package app.metatron.portal.portal.datasource.domain;

import org.springframework.util.StringUtils;

/**
 * mySql 확장
 */
public class MySqlConnection extends JdbcConnection {

    /**
     * 프로토콜
     */
    private static final String MYSQL_URL_PREFIX = "jdbc:mysql:/";
    /**
     * 기본 옵션 파라미터
     */
    private static final String MYSQL_DEFAULT_OPTIONS = "autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&useSSL=false";

    @Override
    public String getDriverClass() {
        return "com.mysql.jdbc.Driver";
    }

    @Override
    public String getTestQuery() {
        return "SELECT 1";
    }

    @Override
    public String getShowTableQuery(String schema) {
        return "SHOW TABLES";
    }

    @Override
    public String getConnectUrl() {
        StringBuilder builder = new StringBuilder();
        builder.append(MYSQL_URL_PREFIX);
        builder.append("/");
        builder.append(this.getHost());
        if( !StringUtils.isEmpty(this.getPort())) {
            builder.append(":");
            builder.append(this.getPort());
        }
        builder.append("/");
        builder.append(this.getDatabaseNm());
        builder.append("?");
        builder.append(MYSQL_DEFAULT_OPTIONS);
        return builder.toString();
    }
}
