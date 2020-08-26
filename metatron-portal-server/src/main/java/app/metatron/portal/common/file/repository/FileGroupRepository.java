package app.metatron.portal.common.file.repository;


import app.metatron.portal.common.file.domain.FileGroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileGroupRepository extends JpaRepository<FileGroupEntity, String> {
	

}
