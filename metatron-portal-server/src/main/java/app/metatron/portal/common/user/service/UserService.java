package app.metatron.portal.common.user.service;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.media.service.MediaService;
import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.common.user.domain.*;
import app.metatron.portal.common.user.repository.UserRepository;
import app.metatron.portal.common.user.repository.UserStartPageRepository;
import app.metatron.portal.common.media.domain.MediaGroupEntity;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.LocalDateTime;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

/**
 * 사용자 서비스
 */
@Slf4j
@Service
@Transactional
public class UserService extends AbstractGenericService<UserEntity, String> {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserStartPageRepository startPageRepository;

    @Autowired
    private MediaService mediaService;

    @Autowired
    private RoleGroupService roleGroupService;

    @Autowired
    protected ModelMapper modelMapper;

    @Override
    protected JpaRepository<UserEntity, String> getRepository() {
        return userRepository;
    }


    /**
     * 시작 페이지 조회
     * @param userId
     * @return
     */
    public String getStartPage(String userId) {
        UserStartPageEntity userStartPage = startPageRepository.findByUser_UserId(userId);
        if(userStartPage == null) {
            return null;
        }
        return userStartPage.getStartPage();
    }

    /**
     * 사용자 이메일 검색 조회
     * @param keyword
     * @return
     */
    public List<UserEmailVO> getUserSearchEmailList(String keyword) {
        List<UserEmailVO> userEmailList = new ArrayList<>();
        List<UserEntity> userList = userRepository.getUserSearchEmail(keyword);
        if( userList != null && userList.size() > 0 ) {
            userList.forEach(user -> {
                UserEmailVO userEmail = new UserEmailVO();
                userEmail.setUserNm(user.getUserNm());
                userEmail.setOrgNm(user.getOrgNm());
                userEmail.setEmail(user.getEmailAddr());
                userEmailList.add(userEmail);
            });
        }
        return userEmailList;
    }

    /**
     * 비보안 정보 조회 (주로 로그인 당사자 기준)
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<UserDto.User> getUserListWithInsecure(String keyword, Pageable pageable) {
        return userRepository.getUserListSearchByKeyword(keyword, pageable);
    }

    /**
     * 시작 페이지 등록 또는 갱신
     * @param userId
     * @param startPage
     */
    public void updateStartPage(String userId, String startPage) {
        UserStartPageEntity userStartPage = new UserStartPageEntity();
        userStartPage.setUser(this.get(userId));
        userStartPage.setStartPage(startPage);

        UserStartPageEntity existPage = startPageRepository.findByUser_UserId(userId);
        if(existPage != null) {
            userStartPage.setId(existPage.getId());
        }

        startPageRepository.save(userStartPage);
    }

    /**
     * 프로필 변경
     * @param file
     * @return
     * @throws Exception
     */
    public UserEntity uploadUserProfile(MultipartFile file) throws Exception {
        UserEntity user = this.getCurrentUser();

        String groupId = user.getMediaGroup() != null? user.getMediaGroup().getId(): null;

        MediaGroupEntity mediaGroup = mediaService.saveProfile(file);
        user.setMediaGroup(mediaGroup);
        this.setUpdateUserInfo(user);
        user = userRepository.save(user);

        if( groupId != null ) {
            mediaService.deleteAll(groupId);
        }
        return user;

    }

    /**
     * 프로필 삭제
     * @return
     */
    public UserEntity deleteUploadedUserProfile() {
        UserEntity user = this.getCurrentUser();

        String groupId = user.getMediaGroup() != null? user.getMediaGroup().getId(): null;

        user.setMediaGroup(null);
        user = userRepository.save(user);

        if( groupId != null ) {
            mediaService.deleteAll(groupId);
        }
        return user;
    }

    /**
     * 사용자 추가
     * @param userDto
     * @return
     */
    public UserEntity addUser(UserDto.CREATE userDto){
//        UserEntity userEntity = modelMapper.map(userDto, UserEntity.class);

        UserEntity userEntity = new UserEntity();
        userEntity.setUserId(userDto.getUserId());
        userEntity.setUserNm(userDto.getUserNm());
        userEntity.setEmailAddr(userDto.getEmailAddr());
        userEntity.setCelpTlno(userDto.getCelpTlno());
        userEntity.setUseYn(true);

        Object obj=userDto;
        log.debug( "USER DTO ########################");
        for (Field field : obj.getClass().getDeclaredFields()){
            try {
                field.setAccessible(true);
                Object value=field.get(obj);
                log.debug( field.getName()+","+value);
            }catch (Exception e){

            }

        }

        obj=userEntity;
        log.debug( "UserEntity ########################");
        for (Field field : obj.getClass().getDeclaredFields()){
            try {
                field.setAccessible(true);
                Object value=field.get(obj);
                log.debug( field.getName()+","+value);
            }catch (Exception e){

            }

        }

        userEntity.setPassword(userDto.getUserId());
        userEntity.setCreatedBy(userRepository.findOne(Const.USER.ADMIN_ID));
        userEntity.setUpdatedBy(userRepository.findOne(Const.USER.ADMIN_ID));
        userEntity.setCreatedDate(LocalDateTime.now());
        userEntity.setUpdatedDate(LocalDateTime.now());

        userEntity = getRepository().save(userEntity);

        // organization
        // 초기화
        roleGroupService.removeRoleGroupUserRels(RoleGroupType.ORGANIZATION, userEntity.getUserId());
        if( userEntity.getUserId().contains("SKB")  ) {
            roleGroupService.saveRelation(userEntity.getUserId(), "SKB");
        } else {
            if( !StringUtils.isEmpty(userDto.getOrgId()) && roleGroupService.exists(userDto.getOrgId()) ) {
                roleGroupService.saveRelation(userEntity.getUserId(), userDto.getOrgId());
            }
        }

        // system default role group
        roleGroupService.saveRelation(userEntity.getUserId(), Const.RoleGroup.DEFAULT_USER);

        // private role group
        RoleGroupEntity roleGroup = new RoleGroupEntity();
        roleGroup.setId(userEntity.getUserId());
        roleGroup.setName(userEntity.getUserNm());
        roleGroup.setType(RoleGroupType.PRIVATE);
        roleGroup = roleGroupService.save(roleGroup);
        roleGroupService.saveRelation(userEntity, roleGroup);

        return  userEntity;
    }



    /**
     * 사용자 추가 batch
     * @param userEntity
     * @return userEntity
     */
    public UserEntity addUserFromMetatron(UserEntity userEntity){
        userEntity.setCreatedBy(userRepository.findOne(Const.USER.ADMIN_ID));
        userEntity.setUpdatedBy(userRepository.findOne(Const.USER.ADMIN_ID));
        userEntity.setCreatedDate(LocalDateTime.now());
        userEntity.setUpdatedDate(LocalDateTime.now());
        userEntity = getRepository().save(userEntity);
        // organization
        // 초기화
        roleGroupService.removeRoleGroupUserRels(RoleGroupType.ORGANIZATION, userEntity.getUserId());
        if( userEntity.getUserId().contains("SKB")  ) {
            roleGroupService.saveRelation(userEntity.getUserId(), "SKB");
        }
        // system default role group
        roleGroupService.saveRelation(userEntity.getUserId(), Const.RoleGroup.DEFAULT_USER);
        // private role group
        RoleGroupEntity roleGroup = new RoleGroupEntity();
        roleGroup.setId(userEntity.getUserId());
        roleGroup.setName(userEntity.getUserNm());
        roleGroup.setType(RoleGroupType.PRIVATE);
        roleGroup = roleGroupService.save(roleGroup);
        roleGroupService.saveRelation(userEntity, roleGroup);
        return  userEntity;
    }

    /**
     * 비보안 정보 조회 (주로 로그인 당사자 기준)
     * @param userId
     * @return
     */
    public UserDto.User getUserWithInsecure(String userId) {
        return userRepository.findByUserId(userId);
    }
}
