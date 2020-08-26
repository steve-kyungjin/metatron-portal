package app.metatron.portal.portal.email.repository;

import app.metatron.portal.portal.email.domain.EmailTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EmailTemplateRepository extends JpaRepository<EmailTemplateEntity, String> {
}
