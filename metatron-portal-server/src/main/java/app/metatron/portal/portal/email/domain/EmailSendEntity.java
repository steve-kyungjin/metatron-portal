package app.metatron.portal.portal.email.domain;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "mp_em_send")
public class EmailSendEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    public enum ObjectType {
        COMMUNICATION
    }

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    /**
     * 메일 발송 출처
     */
    @Enumerated(EnumType.STRING)
    @Column
    private ObjectType objectType;

    /**
     * 메일 발송 출처 아이디
     */
    @Column
    private String objectId;

    /**
     * 제목
     */
    @Column(length = 100)
    private String subject;

    /**
     * 내용
     */
    @Column(length = 2000)
    private String content;

    /**
     * 보내는 사람
     */
    @Column(length = 100)
    private String sender;

    /**
     * 받는 사람
     */
    @Column(length = 100)
    private String receiver;

    /**
     * 발송 여부
     */
    @Type(type = "yes_no")
    @Column(length = 1, columnDefinition = "varchar(1) default 'N'")
    private Boolean send = false;

    /**
     * 발송 결과
     */
    @Column(length = 1000)
    private String result;

    /**
     * 발송등록일
     */
    @Column(name = "regist_date")
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
    protected LocalDateTime registDate;

    /**
     * 발송일
     */
    @Column(name = "send_date")
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
    protected LocalDateTime sendDate;

    public ObjectType getObjectType() {
        return objectType;
    }

    public void setObjectType(ObjectType objectType) {
        this.objectType = objectType;
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Boolean getSend() {
        return send;
    }

    public void setSend(Boolean send) {
        this.send = send;
    }

    public LocalDateTime getRegistDate() {
        return registDate;
    }

    public void setRegistDate(LocalDateTime registDate) {
        this.registDate = registDate;
    }

    public LocalDateTime getSendDate() {
        return sendDate;
    }

    public void setSendDate(LocalDateTime sendDate) {
        this.sendDate = sendDate;
    }
}
