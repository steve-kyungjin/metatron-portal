package app.metatron.portal.portal.email.repository;

import app.metatron.portal.portal.email.domain.EmailSendEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EmailSendRepository extends JpaRepository<EmailSendEntity, String> {

}
