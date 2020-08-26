package app.metatron.portal.portal.datasource.domain;

/**
 * postgres 확장
 */
public class PostgreSqlConnection extends JdbcConnection {

    /**
     * 프로토콜
     */
    private static final String POSTGRE_URL_PREFIX = "jdbc:postgresql://";
    /**
     * postgresql 서버에 ssl 설정이 있는 경우에만 유효. 설정 없는 경우 붙이면 오류발생
     */
    private static final String POSTGRE_DEFAULT_OPTIONS = "ssl=false";

    @Override
    public String getDriverClass() {
        return "org.postgresql.Driver";
    }

    @Override
    public String getTestQuery() {
        return "SELECT 1";
    }

    @Override
    public String getShowTableQuery(String schema) {
        return "SELECT tname FROM tab WHERE tabtype='TABLE'";
    }

    @Override
    public String getConnectUrl() {
        StringBuilder builder = new StringBuilder();
        builder.append(POSTGRE_URL_PREFIX);
        builder.append(this.getHost());
        builder.append(":");
        builder.append(this.getPort());
        builder.append("/");
        builder.append(this.getDatabaseNm());
//        builder.append("?");
//        builder.append("user=");
//        builder.append(this.getDatabaseUser());
//        builder.append("&password=");
//        builder.append(this.getDatabasePassword());
//        builder.append("&");
//        builder.append(POSTGRE_DEFAULT_OPTIONS);
        return builder.toString();
    }
}
