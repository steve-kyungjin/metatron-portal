package app.metatron.portal.common.file.repository;


import app.metatron.portal.common.file.domain.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FileRepository extends JpaRepository<FileEntity, String> {
	

}
