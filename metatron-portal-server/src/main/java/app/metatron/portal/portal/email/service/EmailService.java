package app.metatron.portal.portal.email.service;

import app.metatron.portal.portal.communication.domain.PostStatus;
import app.metatron.portal.portal.email.repository.EmailSendRepository;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.common.util.CollectionUtil;
import app.metatron.portal.portal.email.domain.EmailSendEntity;
import app.metatron.portal.portal.email.domain.EmailTemplateEntity;
import app.metatron.portal.portal.email.domain.EmailVO;
import app.metatron.portal.portal.email.repository.EmailTemplateRepository;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * 이메일 발송 서비스
 */
@Slf4j
@Service
public class EmailService {

    // 메일폼의 치환 대상
    private static final String EXP_CREATOR = "##__CREATOR__##";
    private static final String EXP_WORKER = "##__WORKER__##";
    private static final String EXP_STATUS = "##__STATUS__##";
    private static final String EXP_TITLE = "##__TITLE__##";
    private static final String EXP_BODY = "##__BODY__##";
    private static final String EXP_LINK = "##__LINK__##";

    @Autowired
    private EmailTemplateRepository templateRepository;

    @Autowired
    private EmailSendRepository sendRepository;

    private boolean available = true;

    /**
     * 발송메일 저장
     * @param email
     */
    public void sendEmail(EmailVO email) {
        String senderAddr = email.getSender() == null? Const.Email.ADDRESS_SYSTEM: email.getSender().getEmailAddr();

        if( !available ) {
            return;
        }

        List<EmailSendEntity> sends = new ArrayList<>();
        if( email.getRecipients() != null && email.getRecipients().size() > 0 ) {
            email.getRecipients().stream()
                    .filter(s -> !StringUtils.isEmpty(s.getEmailAddr()))
                    .filter(CollectionUtil.distinctByKey(UserEntity::getUserId))
                    .forEach(r -> {
                        EmailSendEntity send = new EmailSendEntity();
                        send.setSender(senderAddr);
                        send.setSend(false);
                        send.setObjectType(email.getObjectType());
                        send.setObjectId(email.getObjectId());
                        send.setSubject(email.getSubject());
                        send.setContent(email.getContents());
                        send.setReceiver(r.getEmailAddr());
                        send.setRegistDate(LocalDateTime.now());
                        sends.add(send);
                    });
        }
        if( sends.size() > 0 ) {
            sendRepository.save(sends);
        }

    }

    /**
     * 메일폼
     */
    public String getEmailContents(String templateId, String title, String body, String link, PostStatus status, String creator, String worker ) {
        EmailTemplateEntity template = templateRepository.findOne(templateId);
        if( template == null ) {
            return null;
        }
        String contents = template.getTemplate();
        if( !StringUtils.isEmpty(title) ) {
            contents = contents.replace(EXP_TITLE, title);
        }
        if( !StringUtils.isEmpty(body) ) {
            contents = contents.replace(EXP_BODY, body);
        }
        if( !StringUtils.isEmpty(link) ) {
            contents = contents.replace(EXP_LINK, link);
        } else {
            contents = contents.replace(EXP_LINK, "#");
        }
        if( status != null ) {
            String label = "";
            switch(status) {
                case REQUESTED:
                    label = "요청 등록";
                    break;
                case REVIEW:
                    label = "요청 검토";
                    break;
                case CANCELED:
                    label = "요청 취소";
                    break;
                case PROGRESS:
                    label = "진행";
                    break;
                case COMPLETED:
                    label = "처리 완료";
                    break;
                case CLOSED:
                    label = "요청 완료 확인";
                    break;
                case COMMENT:
                    label = "문의/답변, 기타의견";
                    break;
                default:
                    label = status.toString();
                    break;
            }
            if(Const.Email.TEMPLATE_REQUEST_RLY.equals(templateId)) {
                label = "댓글 등록 - " + label;
            }
            contents = contents.replace(EXP_STATUS, label);
        }
        if( !StringUtils.isEmpty(creator) ) {
            contents = contents.replace(EXP_CREATOR, creator);
        }
        if( !StringUtils.isEmpty(worker) ) {
            contents = contents.replace(EXP_WORKER, worker);
        }
        return contents;
    }

    /**
     * 메일 제목
     * @param templateId
     * @return
     */
    public String getEmailSubject( String templateId ) {
        EmailTemplateEntity template = templateRepository.findOne(templateId);
        if( template == null ) {
            return null;
        }
        return template.getSubject();
    }



}
