package app.metatron.portal.web.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EntityScan( basePackages = {"app.metatron.portal"})
@EnableJpaRepositories(basePackages = {"app.metatron.portal"})
public class DBConfig {

    @Autowired
    private Environment env;

    @Bean
    public JdbcTemplate jdbcTemplateMeta(){
        DataSource dataSource = DataSourceBuilder.create()
                .url(env.getProperty("metatron.datasource.url"))
                .driverClassName(env.getProperty("metatron.datasource.driver-class-name"))
                .username(env.getProperty("metatron.datasource.username"))
                .password(env.getProperty("metatron.datasource.password"))
                .build();
        return new JdbcTemplate(dataSource);
    }


}
