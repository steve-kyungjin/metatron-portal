package app.metatron.portal.portal.communication.service;

import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.portal.communication.repository.CommMasterRepository;
import app.metatron.portal.portal.communication.domain.CommDto;
import app.metatron.portal.portal.communication.domain.CommMasterEntity;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

/**
 * 마스터 서비스
 */
@Transactional
@Service
public class CommMasterService extends AbstractGenericService<CommMasterEntity, String> {

    @Autowired
    private CommMasterRepository masterRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    protected JpaRepository<CommMasterEntity, String> getRepository() {
        return masterRepository;
    }

    /**
     * 마스터 목록
     * @param pageable
     * @return
     */
    public Page<CommMasterEntity> getMasterList(Pageable pageable) {
        return masterRepository.findByUseYnOrderByCreatedDateDesc(true, pageable);
    }

    /**
     * 유형에 따른 마스터 목록
     * @param postType
     * @return
     */
    public List<CommMasterEntity> getMasterListByPostType(CommMasterEntity.PostType postType) {
        return masterRepository.getMasterListByPostType(postType);
    }

    /**
     * 특정 마스터 조회 슬러그로
     * @param slug
     * @return
     */
    public CommMasterEntity getOneBySlug(String slug) {
        return masterRepository.findBySlug(slug);
    }

    /**
     * 마스터 추가
     * @param master
     * @return
     */
    public boolean addMaster(CommDto.Master master) {
        master.setId(null);

        CommMasterEntity masterEntity = modelMapper.map(master, CommMasterEntity.class);
        this.setCreateUserInfo(masterEntity);

        return masterRepository.save(masterEntity) != null;
    }

    /**
     * 마스터 수정
     * @param slug
     * @param master
     * @return
     */
    public boolean editMaster(String slug, CommDto.Master master) {
        CommMasterEntity old = masterRepository.findBySlug(slug);
        if( old == null ) {
            return false;
        }

        old.setName(master.getName());
        old.setSlug(master.getSlug());
        old.setUseYn(master.isUseYn());
        old.setReplyYn(master.isReplyYn());
        old.setListType(CommMasterEntity.ListType.valueOf(master.getListType()));
        old.setPostType(CommMasterEntity.PostType.valueOf(master.getPostType()));
        old.setSection(CommMasterEntity.Section.valueOf(master.getSection()));
        old.setDispOrder(master.getDispOrder());
        old.setPrePath(master.getPrePath());
        old.setSecondaryType(master.getSecondaryType());
        this.setUpdateUserInfo(old);

        return masterRepository.save(old) != null;
    }

    /**
     * 마스터 삭제
     * @param slug
     * @return
     */
    public boolean deleteMaster(String slug) {
        CommMasterEntity master = masterRepository.findBySlug(slug);
        if( master == null ) {
            return false;
        }
        // 실제 삭제가 아닌 사용 플래그 처리
        master.setUseYn(false);
        return masterRepository.save(master) != null;
    }
}
