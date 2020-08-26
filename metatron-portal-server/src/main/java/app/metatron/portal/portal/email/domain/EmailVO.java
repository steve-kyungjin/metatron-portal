package app.metatron.portal.portal.email.domain;

import app.metatron.portal.common.user.domain.UserEntity;

import java.io.Serializable;
import java.util.List;


public class EmailVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String subject;

    private String contents;

    private EmailSendEntity.ObjectType objectType;

    private String objectId;

    private List<UserEntity> recipients;

    private UserEntity sender;

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public EmailSendEntity.ObjectType getObjectType() {
        return objectType;
    }

    public void setObjectType(EmailSendEntity.ObjectType objectType) {
        this.objectType = objectType;
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public List<UserEntity> getRecipients() {
        return recipients;
    }

    public void setRecipients(List<UserEntity> recipients) {
        this.recipients = recipients;
    }

    public UserEntity getSender() {
        return sender;
    }

    public void setSender(UserEntity sender) {
        this.sender = sender;
    }
}
