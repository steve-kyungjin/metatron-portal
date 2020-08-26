package app.metatron.portal.schedule;

import app.metatron.portal.common.user.service.UserBatchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 사용자 배치 스케쥴
 */
@Slf4j
@Component
public class UserBatchCron {

    @Autowired
    private UserBatchService batchService;

    @Value("#{new Boolean('${app.batch.isRun}')}")
    private boolean isRun;

    @Scheduled(cron = "${app.cron.user-batch}")
    public void userBatchRun() throws Exception {
        if( !isRun ) {
            return;
        }
        log.info("== Start userBatchRun ==");
        batchService.setBatchMetatronUser();
        log.info("== END userBatchRun ==");

    }



}
