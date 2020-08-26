package app.metatron.portal.portal.datasource.domain;

import org.springframework.util.StringUtils;

/**
 * 하이브 확장
 */
public class HiveConnection extends JdbcConnection {

    /**
     * 프로토콜
     */
    private static final String HIVE_URL_PREFIX = "jdbc:hive2:/";

    @Override
    public String getDriverClass() {
        return "org.apache.hive.jdbc.HiveDriver";
    }

    @Override
    public String getTestQuery() {
        if(!StringUtils.isEmpty(this.getDatabaseNm())) {
            return "SHOW TABLES";
        }
        return "SHOW DATABASES";
    }

    @Override
    public String getShowTableQuery(String schema) {
        return "SHOW TABLES";
    }

    @Override
    public String getConnectUrl() {
        StringBuilder builder = new StringBuilder();
        builder.append(HIVE_URL_PREFIX);
        builder.append("/");
        builder.append(this.getHost());
        if( !StringUtils.isEmpty(this.getPort())) {
            builder.append(":");
            builder.append(this.getPort());
        }
        if( !StringUtils.isEmpty(this.getDatabaseNm()) ) {
            builder.append("/");
            builder.append(this.getDatabaseNm());
        }
        return builder.toString();
    }
}
