package app.metatron.portal.common.media.repository;

import app.metatron.portal.common.media.domain.MediaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<MediaEntity, String> {

    /**
     * 미디어 그룹으로 미디어 조회
     * @param groupId
     * @return
     */
    List<MediaEntity> findByGroup_IdOrderByCreatedDateAsc(String groupId);

    /**
     * 미디어 그룹으로 연관 미디어 삭제
     * @param groupId
     * @return
     */
    int deleteByGroup_Id(String groupId);

    /**
     * 미디어 아이디들로 삭제
     * @param ids
     * @return
     */
    int deleteByIdIn(List<String> ids);

}
