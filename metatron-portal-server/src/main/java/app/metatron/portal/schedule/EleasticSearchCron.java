package app.metatron.portal.schedule;

import app.metatron.portal.portal.search.service.ElasticSearchRelayService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 통합검색 색인 스캐줄
 */
@Slf4j
@Component
public class EleasticSearchCron {

    @Autowired
    private ElasticSearchRelayService elasticSearchRelayService;

    @Value("#{new Boolean('${app.batch.isRun}')}")
    private boolean isRun;

    @Scheduled(cron = "${app.cron.elastic-search-indexing}")
    public void elasticSearchIndexing() throws Exception {

        if( !isRun ) {
            return;
        }
        log.info("== Start ElasticSearchindexing ==");

        elasticSearchRelayService.analysisAppIndexAll();
        elasticSearchRelayService.reportAppIndexAll();
        elasticSearchRelayService.projectAppIndexAll();
        elasticSearchRelayService.communicationIndexAll();
        elasticSearchRelayService.metaColumnIndexAll();
        elasticSearchRelayService.metaTableIndexAll();


        log.info("== END ElasticSearchindexing ==");

    }

    @Scheduled(cron = "${app.cron.elastic-search-index-comm}")
    public void elasticSearchIndexingCommunication() throws Exception {
        if( !isRun ) {
            return;
        }
        log.info("== Start ElasticSearchIndexingCommunication ==");

        elasticSearchRelayService.projectAppIndexAll();
        elasticSearchRelayService.communicationIndexAll();

        log.info("== END ElasticSearchIndexingCommunication ==");
    }

    @Scheduled(cron = "${app.cron.elastic-search-index-app}")
    public void elasticSearchIndexingApp() throws Exception {
        if( !isRun ) {
            return;
        }
        log.info("== Start ElasticSearchIndexingApp ==");

        elasticSearchRelayService.projectAppIndexAll();
        elasticSearchRelayService.communicationIndexAll();

        log.info("== END ElasticSearchIndexingApp ==");
    }

    @Scheduled(cron = "${app.cron.elastic-search-index-delete}")
    public void elasticSearchIndexDelete() throws Exception {
        if( !isRun ) {
            return;
        }
        log.info("== Start elasticSearchIndexDelete ==");

        elasticSearchRelayService.deleteIndex();

        log.info("== END elasticSearchIndexDelete ==");

    }


}
