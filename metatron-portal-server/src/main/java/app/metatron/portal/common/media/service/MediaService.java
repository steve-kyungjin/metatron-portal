package app.metatron.portal.common.media.service;

import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.media.domain.MediaEntity;
import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.common.media.domain.MediaGroupEntity;
import app.metatron.portal.common.media.repository.MediaGroupRepository;
import app.metatron.portal.common.media.repository.MediaRepository;
import app.metatron.portal.common.util.media.MediaUtil;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 미디어 서비스
 */
@Service
@Transactional
public class MediaService extends AbstractGenericService<MediaEntity, String> {

    /**
     * 미디어 가공을 위한 임시 경로
     */
    @Value("${config.media.temp}")
    private String tempDir;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private MediaGroupRepository mediaGroupRepository;

    @Autowired
    private MediaUtil mediaUtil;

    @Override
    protected JpaRepository<MediaEntity, String> getRepository() {
        return mediaRepository;
    }

    /**
     * 그룹으로 미디어 파일 조회
     * @param groupId
     * @return
     */
    public List<MediaEntity> getMediaListByGroup(String groupId) {
        return mediaRepository.findByGroup_IdOrderByCreatedDateAsc(groupId);
    }

    /**
     * 미디어 그룹 조회
     * @param groupId
     * @return
     */
    public MediaGroupEntity getMediaGroup(String groupId) {
        return mediaGroupRepository.findOne(groupId);
    }

    /**
     * 그룹으로 미디어 파일 삭제
     * @param groupId
     */
    public void deleteMediaByGroup(String groupId) {
        mediaRepository.deleteByGroup_Id(groupId);
    }

    /**
     * 그룹을 기준으로 미디어 삭제 (그룹포함)
     * @param groupId
     */
    public void deleteAll(String groupId) {
        mediaRepository.deleteByGroup_Id(groupId);
        mediaGroupRepository.delete(groupId);
    }

    /**
     * 미디어 파일 저장 (복수)
     * @param files
     * @return
     * @throws Exception
     */
    public MediaGroupEntity saveMedia(MultipartFile[] files) throws Exception {

        if( files == null || files.length == 0 ) {
            throw new BadRequestException("File not Found");
        }

        MediaGroupEntity group = new MediaGroupEntity();
        this.setCreateUserInfo(group);
        group = mediaGroupRepository.save(group);

        for( MultipartFile file : files ) {
            MediaEntity media = this.makeMedia(group, file);
            mediaRepository.save(media);
        }
        return group;
    }

    /**
     * 미디어 파일 저장 (프로필만 사용)
     * @param file
     * @return
     * @throws Exception
     */
    public MediaGroupEntity saveProfile(MultipartFile file) throws Exception {
        if( file == null ) {
            throw new BadRequestException("File not Found");
        }

        MediaGroupEntity group = new MediaGroupEntity();
        this.setCreateUserInfo(group);
        group = mediaGroupRepository.save(group);

        MediaEntity media = this.makeProfile(group, file);
        mediaRepository.save(media);
        return group;
    }

    /**
     * 미디어 파일 저장 (communication 만 사용)
     * @param file
     * @return
     * @throws Exception
     */
    public MediaGroupEntity saveCommunication(MultipartFile file) throws Exception {
        if( file == null ) {
            throw new BadRequestException("File not Found");
        }

        MediaGroupEntity group = new MediaGroupEntity();
        this.setCreateUserInfo(group);

        MediaEntity media = this.makeCommunication(group, file);
        media = mediaRepository.save(media);

        List<MediaEntity> medias = new ArrayList<>();
        medias.add(media);
        group.setMedias(medias);

        group = mediaGroupRepository.save(group);
        return group;
    }

    /**
     * 미디어 불러오기
     * @param mediaId
     * @return
     */
    public MediaEntity loadMedia(String mediaId) {
        MediaEntity media = mediaRepository.findOne(mediaId);
        if( media == null ) {
            throw new BadRequestException("File not Found");
        }
        return media;
    }

    /**
     * 미디어 파일 변경
     * @param groupId
     * @param addFiles
     * @param delFileIds
     * @return
     * @throws Exception
     */
    public MediaGroupEntity changeMedia(String groupId, MultipartFile[] addFiles, List<String> delFileIds) throws Exception {
        MediaGroupEntity group = mediaGroupRepository.findOne(groupId);
        if( group == null ) {
            throw new BadRequestException("File not Found");
        }
        if( delFileIds != null && delFileIds.size() > 0 ) {
            mediaRepository.deleteByIdIn(delFileIds);
        }
        if( addFiles != null && addFiles.length > 0 ) {
            for( MultipartFile file : addFiles ) {
                MediaEntity media = this.makeMedia(group, file);
                mediaRepository.save(media);
            }
        }
        return group;
    }

    /**
     * 미디어 파일 변경 (profile)
     * 현재 사용안함
     * @param groupId
     * @param addFile
     * @return
     * @throws Exception
     */
    public MediaGroupEntity changeProfile(String groupId, MultipartFile addFile) throws Exception {
        MediaGroupEntity group = mediaGroupRepository.findOne(groupId);
        if( group == null ) {
            throw new BadRequestException("File not Found");
        }
        mediaRepository.delete(group.getMedias());
        if( addFile != null ) {
            MediaEntity media = this.makeMedia(group, addFile);
            mediaRepository.save(media);
        }
        return group;
    }

    /**
     * 미디어 파일 변경 (communication)
     * 현재 사용안함
     * @param groupId
     * @param addFile
     * @return
     * @throws Exception
     */
    public MediaGroupEntity changeCommunication(String groupId, MultipartFile addFile) throws Exception {
        MediaGroupEntity group = mediaGroupRepository.findOne(groupId);
        if( group == null ) {
            throw new BadRequestException("File not Found");
        }
        mediaRepository.delete(group.getMedias());
        if( addFile != null ) {
            MediaEntity media = this.makeCommunication(group, addFile);
            mediaRepository.save(media);
        }
        return group;
    }

    /**
     * 미디어 엔터티 생성
     * @param group
     * @param file
     * @return
     * @throws Exception
     */
    private MediaEntity makeMedia(MediaGroupEntity group, MultipartFile file) throws Exception {

        String mediaName = file.getOriginalFilename();
        String extension = FilenameUtils.getExtension(mediaName);

        if(!mediaUtil.acceptable(extension)) {
            throw new BadRequestException("Not acceptable media file extension");
        }

        // 중간 가공이나 처리가 있는 경우 temp 파일 필요함
        String tempMediaName = String.valueOf(System.currentTimeMillis());

        File tempMediaDir = new File(tempDir);
        if( !tempMediaDir.exists() || !tempMediaDir.isDirectory() ) {
            tempMediaDir.mkdir();
        }

        File tempMedia = new File(tempMediaDir, tempMediaName);
        file.transferTo(tempMedia);

        Map<String, File> transformImages = mediaUtil.transform(tempMedia, extension);
        File large = transformImages.get(MediaUtil.MEDIA_TYPE_LARGE);
        File thumbnail = transformImages.get(MediaUtil.MEDIA_TYPE_THUMBNAIL);

        MediaEntity media = new MediaEntity();
        media.setName(mediaName);
        media.setContentType(file.getContentType());
        media.setExtension(extension);

        media.setContents(FileUtils.readFileToByteArray(large));
        media.setThumbnail(FileUtils.readFileToByteArray(thumbnail));

        media.setGroup(group);
        this.setCreateUserInfo(media);

        // remove
        large.delete();
        thumbnail.delete();
        tempMedia.delete();

        return media;
    }

    /**
     * 미디어 엔터티 생성 (프로필)
     * @param group
     * @param file
     * @return
     * @throws Exception
     */
    private MediaEntity makeProfile(MediaGroupEntity group, MultipartFile file) throws Exception {

        String mediaName = file.getOriginalFilename();
        String extension = FilenameUtils.getExtension(mediaName);

        if(!mediaUtil.acceptable(extension)) {
            throw new BadRequestException("Not acceptable media file extension");
        }

        // 중간 가공이나 처리가 있는 경우 temp 파일 필요함
        String tempMediaName = String.valueOf(System.currentTimeMillis());

        File tempMediaDir = new File(tempDir);
        if( !tempMediaDir.exists() || !tempMediaDir.isDirectory() ) {
            tempMediaDir.mkdir();
        }

        File tempMedia = new File(tempMediaDir, tempMediaName);
        file.transferTo(tempMedia);

        File profile = mediaUtil.transformProfile(tempMedia, extension);

        MediaEntity media = new MediaEntity();
        media.setName(mediaName);
        media.setContentType(file.getContentType());
        media.setExtension(extension);

        media.setThumbnail(FileUtils.readFileToByteArray(profile));

        media.setGroup(group);
        this.setCreateUserInfo(media);

        // remove
        profile.delete();
        tempMedia.delete();

        return media;
    }

    /**
     * 미디어 엔터티 생성 (communication)
     * @param group
     * @param file
     * @return
     * @throws Exception
     */
    private MediaEntity makeCommunication(MediaGroupEntity group, MultipartFile file) throws Exception {

        String mediaName = file.getOriginalFilename();
        String extension = FilenameUtils.getExtension(mediaName);

        if(!mediaUtil.acceptable(extension)) {
            throw new BadRequestException("Not acceptable media file extension");
        }

        // 중간 가공이나 처리가 있는 경우 temp 파일 필요함
        String tempMediaName = String.valueOf(System.currentTimeMillis());

        File tempMediaDir = new File(tempDir);
        if( !tempMediaDir.exists() || !tempMediaDir.isDirectory() ) {
            tempMediaDir.mkdir();
        }

        File tempMedia = new File(tempMediaDir, tempMediaName);
        file.transferTo(tempMedia);

        File commFile = mediaUtil.transformCommunication(tempMedia, extension);

        MediaEntity media = new MediaEntity();
        media.setName(mediaName);
        media.setContentType(file.getContentType());
        media.setExtension(extension);

        media.setThumbnail(FileUtils.readFileToByteArray(commFile));

        media.setGroup(group);
        this.setCreateUserInfo(media);

        // remove
        commFile.delete();
        tempMedia.delete();

        return media;
    }
}
