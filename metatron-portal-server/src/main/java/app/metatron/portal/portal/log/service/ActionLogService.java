package app.metatron.portal.portal.log.service;

import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.common.user.domain.IAEntity;
import app.metatron.portal.portal.log.domain.ActionLogEntity;
import app.metatron.portal.portal.log.domain.LogDto;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.common.user.service.IAService;
import app.metatron.portal.common.util.CmdUtil;
import app.metatron.portal.portal.log.repository.ActionLogRepository;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.LocalDateTime;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

/**
 * 액션 로그(태깅 서비스
 */
@Slf4j
@Transactional
@Service
public class ActionLogService extends AbstractGenericService<ActionLogEntity, String> {

    @Autowired
    private ActionLogRepository actionLogRepository;

    @Autowired
    private IAService iaService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    protected JpaRepository<ActionLogEntity, String> getRepository() {
        return this.actionLogRepository;
    }

    /**
     * 로그 쓰기
     * @param logDto
     */
    public void write(LogDto.Action logDto) {
        ActionLogEntity actionLog = modelMapper.map(logDto, ActionLogEntity.class);
        // 모듈은 메뉴 정보이기 때문에 IA 조회하여 사용
        IAEntity ia = iaService.get(logDto.getModule());
        actionLog.setModuleId(ia.getId());
        actionLog.setModuleNm(ia.getIaNm());
        UserEntity user = this.getCurrentUser();
        actionLog.setUserId(user.getUserId());
        actionLog.setUserNm(user.getUserNm());
        if( user.getOrg() != null ) {
            actionLog.setOrgId(user.getOrg().getId());
            actionLog.setOrgNm(user.getOrg().getName());
        }
        actionLog.setTime(LocalDateTime.now());
        // request 정보를 신뢰할 수 없어서 command 로 처리
        actionLog.setHost(CmdUtil.exec("hostname"));

        actionLogRepository.save(actionLog);
    }

    // 기간(시간)을 조건으로 로그 조회

    // 일정 시간 전의 로그 삭제


}
