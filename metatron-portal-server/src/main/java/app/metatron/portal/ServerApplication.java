package app.metatron.portal;

import app.metatron.portal.portal.search.repository.PortalEsRepository;
import app.metatron.portal.portal.search.service.ElasticSearchRelayService;
import app.metatron.portal.web.config.ApplicationConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
//import org.springframework.data.elasticsearch.core.ElasticsearchOperations;

/**
 * 포탈 어플리케이션
 */
@Slf4j
@SpringBootApplication(scanBasePackageClasses = {ApplicationConfig.class})
public class ServerApplication extends SpringBootServletInitializer implements CommandLineRunner {

	@Autowired
	private ElasticSearchRelayService elasticSearchRelayService;
	@Autowired
	private PortalEsRepository portalEsRepository;

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(ServerApplication.class);
	}

	@Override
	public void run(String... args) throws Exception {
//		log.debug("run");
//		portalEsRepository.rangeIndexDate();
//		elasticSearchRelayService.analysisAppIndexAll();
//		elasticSearchRelayService.reportAppIndexAll();
//		elasticSearchRelayService.projectAppIndexAll();
//		elasticSearchRelayService.communicationIndexAll();
//		elasticSearchRelayService.metaColumnIndexAll();
//		elasticSearchRelayService.metaTableIndexAll();

	}


}
