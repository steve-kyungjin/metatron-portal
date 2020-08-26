package app.metatron.portal.portal.analysis.service;

import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.media.service.MediaService;
import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.common.user.service.RoleGroupService;
import app.metatron.portal.common.util.CommonUtil;
import app.metatron.portal.portal.analysis.domain.*;
import app.metatron.portal.portal.analysis.repository.AnalysisAppCategoryRelRepository;
import app.metatron.portal.portal.analysis.repository.AnalysisAppRepository;
import app.metatron.portal.portal.analysis.repository.AnalysisAppRoleGroupRelRepository;
import app.metatron.portal.portal.datasource.service.DataSourceService;
import app.metatron.portal.portal.log.domain.AppLogEntity;
import app.metatron.portal.portal.log.service.AppLogService;
import app.metatron.portal.portal.search.domain.AnalysisAppIndexVO;
import app.metatron.portal.portal.search.service.ElasticSearchRelayService;
import app.metatron.portal.common.code.service.CodeService;
import app.metatron.portal.common.domain.INavigable;
import app.metatron.portal.common.media.domain.MediaGroupEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.portal.analysis.repository.AnalysisAppUserRelRepository;
import app.metatron.portal.portal.datasource.domain.DataSourceEntity;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

/**
 * 분석앱 서비스
 */
@Slf4j
@Service
@Transactional
public class AnalysisAppService extends AbstractGenericService<AnalysisAppEntity, String> {

    @Value("${metatron.path.workbook-share-path}")
    private String workbookSharePath;

    @Value("${metatron.path.dashboard-share-path}")
    private String dashboardSharePath;

    @Autowired
    private AnalysisAppRepository analysisAppRepository;

    @Autowired
    private AnalysisAppUserRelRepository analysisAppUserRelRepository;

    @Autowired
    private AnalysisAppCategoryRelRepository analysisAppCategoryRelRepository;

    @Autowired
    private AnalysisAppRoleGroupRelRepository analysisAppRoleGroupRelRepository;

    @Autowired
    private AppLogService appLogService;

    @Autowired
    private MediaService mediaService;

    @Autowired
    private RoleGroupService roleGroupService;

    @Autowired
    private CodeService codeService;

    @Autowired
    private DataSourceService dataSourceService;

    @Autowired
    protected ModelMapper modelMapper;

    @Autowired
    private ElasticSearchRelayService searchService;

    @Override
    protected JpaRepository<AnalysisAppEntity, String> getRepository() {
        return analysisAppRepository;
    }

    /**
     * 특정 앱 삭제
     * @param appId
     */
    public void deleteAnalysisApp(String appId) {
        AnalysisAppEntity app = analysisAppRepository.findOne(appId);
        if( app != null ) {
            // 삭제 플래그만 변경
            app.setDelYn(true);
            analysisAppRepository.save(app);

            // delete index
            searchService.delIndex(Const.ElasticSearch.TYPE_ANALYSIS_APP, app.getId(), app.getAppNm());
        }
    }

    /**
     * 분석앱 추가
     * @param analysisAppDto
     * @param files
     * @return
     * @throws Exception
     */
    public AnalysisAppEntity addAnalysisApp(AnalysisAppDto.CREATE analysisAppDto, MultipartFile[] files) throws Exception{

        // Model Mapper
        AnalysisAppEntity analysisAppEntity = modelMapper.map(analysisAppDto, AnalysisAppEntity.class);

        // 파일 저장
        MediaGroupEntity mediaGroup = mediaService.saveMedia(files);
        analysisAppEntity.setMediaGroup(mediaGroup);

        // 코드 리스트
        List<AnalysisAppCategoryRelEntity> analysisAppCategoryRelList = new ArrayList<>();

        // 코드 추가
        analysisAppDto.getCategories().forEach(category -> {
            Optional.of(codeService.get(category)).ifPresent(codeEntity -> {
                analysisAppCategoryRelList.add(CommonUtil.getAnalysisAppCategoryEntity(codeEntity, analysisAppEntity));
            });
        });
        analysisAppEntity.setCategoryRel(analysisAppCategoryRelList);

        // 롤 리스트
        List<AnalysisAppRoleGroupRelEntity> analysisAppRoleRelList = new ArrayList<>();
        // 권한 추가
        if( analysisAppDto.getRoles() != null ) {
            analysisAppDto.getRoles().forEach(roleGroup -> {
                Optional.of(roleGroupService.get(roleGroup)).ifPresent( rg -> {
                    analysisAppRoleRelList.add(CommonUtil.getAnalysisAppRoleGroupEntity(rg, analysisAppEntity));
                });
            });
            analysisAppEntity.setRoleRel(analysisAppRoleRelList);
        }

        // 헤더 추가
        switch (analysisAppEntity.getHeaderType()){
            case URL:
                AnalysisAppUrlHeaderEntity analysisAppUrlHeaderEntity = new AnalysisAppUrlHeaderEntity();
                analysisAppUrlHeaderEntity.setUrl(analysisAppDto.getUrlHeader().getUrl());
                analysisAppUrlHeaderEntity.setApp(analysisAppEntity);
                analysisAppEntity.setUrlHeader(analysisAppUrlHeaderEntity);
                break;
            case METATRON:
                AnalysisAppMetatronHeaderEntity analysisAppMetatronHeaderEntity = new AnalysisAppMetatronHeaderEntity();
                analysisAppMetatronHeaderEntity.setType( AnalysisAppMetatronHeaderEntity.Type.valueOf(analysisAppDto.getMetatronHeader().getType()) );
                analysisAppMetatronHeaderEntity.setContentsId(analysisAppDto.getMetatronHeader().getContentsId());
                analysisAppMetatronHeaderEntity.setContentsNm(analysisAppDto.getMetatronHeader().getContentsNm());
                analysisAppMetatronHeaderEntity.setLocationId(analysisAppDto.getMetatronHeader().getLocationId());
                analysisAppMetatronHeaderEntity.setApp(analysisAppEntity);
                analysisAppEntity.setMetatronHeader(analysisAppMetatronHeaderEntity);
                break;
            case EXTRACT:
                AnalysisAppExtractHeaderEntity analysisAppExtractHeaderEntity = new AnalysisAppExtractHeaderEntity();
                analysisAppExtractHeaderEntity.setSqlTxt(analysisAppDto.getExtractHeader().getSqlTxt());
                DataSourceEntity dataSource = dataSourceService.get(analysisAppDto.getExtractHeader().getDataSourceId());
                analysisAppExtractHeaderEntity.setDataSource(dataSource);
                analysisAppExtractHeaderEntity.setApp(analysisAppEntity);
                analysisAppEntity.setExtractHeader(analysisAppExtractHeaderEntity);
                break;
        }


        this.setCreateUserInfo(analysisAppEntity);
        // Entity 추가
        return analysisAppRepository.save(analysisAppEntity);
    }

    /**
     * 앱 수정
     * @param analysisAppDto
     * @param files
     * @return
     * @throws Exception
     */
    public AnalysisAppEntity editAnalysisApp( AnalysisAppDto.EDIT analysisAppDto, MultipartFile[] files) throws Exception{

        // Model Mapper
        AnalysisAppEntity analysisAppEntity = analysisAppRepository.findOne(analysisAppDto.getId());
        analysisAppEntity.setAppNm(analysisAppDto.getAppNm());
        analysisAppEntity.setSummary(analysisAppDto.getSummary());
        analysisAppEntity.setContents(analysisAppDto.getContents());
        analysisAppEntity.setVer(analysisAppDto.getVer());
        analysisAppEntity.setVerInfo(analysisAppDto.getVerInfo());
        analysisAppEntity.setUseYn(analysisAppDto.getUseYn());
        analysisAppEntity.setExternalYn(analysisAppDto.getExternalYn());
        if( !analysisAppDto.getUseYn() ) {
            // delete index
            searchService.delIndex(Const.ElasticSearch.TYPE_ANALYSIS_APP, analysisAppEntity.getId(), analysisAppEntity.getAppNm());
        }

        // 파일 수정
        MediaGroupEntity mediaGroup = mediaService.changeMedia(analysisAppDto.getMediaGroupId(),files,analysisAppDto.getDelFileIds());
        analysisAppEntity.setMediaGroup(mediaGroup);

        // 코드 리스트
        List<AnalysisAppCategoryRelEntity> analysisAppCategoryRelList = new ArrayList<>();

        // 코드 삭제
        analysisAppCategoryRelRepository.delete(analysisAppEntity.getCategoryRel());

        // 코드 추가
//        analysisAppCategoryRelRepository.delete();
        analysisAppDto.getCategories().forEach(category -> {
            Optional.of(codeService.get(category)).ifPresent(codeEntity -> {
                analysisAppCategoryRelList.add(CommonUtil.getAnalysisAppCategoryEntity(codeEntity, analysisAppEntity));
            });
        });
        analysisAppEntity.setCategoryRel(analysisAppCategoryRelList);

        if( analysisAppEntity.getRoleRel() != null ) {
            analysisAppRoleGroupRelRepository.delete(analysisAppEntity.getRoleRel());
        }
        // 롤 리스트
        List<AnalysisAppRoleGroupRelEntity> analysisAppRoleRelList = new ArrayList<>();
        // 권한 추가
        if( analysisAppDto.getRoles() != null ) {
            analysisAppDto.getRoles().forEach(roleGroup -> {
                Optional.of(roleGroupService.get(roleGroup)).ifPresent( rg -> {
                    analysisAppRoleRelList.add(CommonUtil.getAnalysisAppRoleGroupEntity(rg, analysisAppEntity));
                });
            });
            analysisAppEntity.setRoleRel(analysisAppRoleRelList);
        } else {
            analysisAppEntity.setRoleRel(null);
        }

        // 헤더 추가
        switch (analysisAppEntity.getHeaderType()){
            case URL:
                analysisAppEntity.getUrlHeader().setUrl(analysisAppDto.getUrlHeader().getUrl());
                analysisAppEntity.getUrlHeader().setApp(analysisAppEntity);
                break;
            case METATRON:
                analysisAppEntity.getMetatronHeader().setType( AnalysisAppMetatronHeaderEntity.Type.valueOf(analysisAppDto.getMetatronHeader().getType()) );
                analysisAppEntity.getMetatronHeader().setContentsId(analysisAppDto.getMetatronHeader().getContentsId());
                analysisAppEntity.getMetatronHeader().setContentsNm(analysisAppDto.getMetatronHeader().getContentsNm());
                analysisAppEntity.getMetatronHeader().setLocationId(analysisAppDto.getMetatronHeader().getLocationId());
                analysisAppEntity.getMetatronHeader().setApp(analysisAppEntity);
                break;
            case EXTRACT:
                analysisAppEntity.getExtractHeader().setSqlTxt(analysisAppDto.getExtractHeader().getSqlTxt());
                DataSourceEntity dataSource = dataSourceService.get(analysisAppDto.getExtractHeader().getDataSourceId());
                analysisAppEntity.getExtractHeader().setDataSource(dataSource);
                analysisAppEntity.getExtractHeader().setApp(analysisAppEntity);
                break;
        }

        this.setUpdateUserInfo(analysisAppEntity);
        // Entity 추가
        return analysisAppRepository.save(analysisAppEntity);
    }

    /**
     * 카테고리 코드를 입력 받아 해당하는 앱 목록을 보여줌
     * @param param
     * @param pageable
     * @return
     */
    public Page<AnalysisAppEntity> listBySearchValuesWithPage(AnalysisAppDto.PARAM param,Pageable pageable){
        return analysisAppRepository.findQueryDslBySearchValuesWithPage( param , pageable);
    }

    /**
     * 전체 앱 목록 조회
     * @return
     */
    public List<AnalysisAppEntity> getAppListOrderByCreatedDate() {
        return analysisAppRepository.findByUseYnAndDelYnOrderByCreatedDateDesc(true, false);
    }

    /**
     * 특정 앱들을 제외하고 전체 앱 목록 조회
     * @param exceptIds
     * @return
     */
    public List<AnalysisAppEntity> getAppListOrderByCreatedDate(List<String> exceptIds) {
        if( exceptIds != null && exceptIds.size() > 0  ) {
            return analysisAppRepository.findByIdNotInAndUseYnAndDelYnOrderByCreatedDateDesc(exceptIds, true, false);
        } else {
            return analysisAppRepository.findByUseYnAndDelYnOrderByCreatedDateDesc(true, false);
        }
    }

    /**
     * 마이앱 목록 조회
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<AnalysisAppEntity> getMyAppList(String keyword, Pageable pageable) {
        return analysisAppRepository.getMyAppList(this.getCurrentUserId(), keyword, pageable);
    }

    /**
     * 마이앱 목록 조회 (전체)
     * @return
     */
    public List<AnalysisAppEntity> getMyAppList() {
        return analysisAppRepository.getMyAppListAll(this.getCurrentUserId());
    }

    /**
     * 마이앱 추가
     * @param appId
     */
    public void addMyApp(String appId) {
        UserEntity user = this.getCurrentUser();
        AnalysisAppUserRelEntity oldRel = analysisAppUserRelRepository.findByApp_IdAndUser_UserId(appId, user.getUserId());
        if( oldRel != null ) {
            analysisAppUserRelRepository.delete(oldRel);
        }
        AnalysisAppEntity app = analysisAppRepository.findOne(appId);

        AnalysisAppUserRelEntity newRel = new AnalysisAppUserRelEntity();
        newRel.setApp(app);
        newRel.setUser(user);
        AnalysisAppUserRelEntity result = analysisAppUserRelRepository.save(newRel);
        if( result != null ) {
            appLogService.write(AppLogEntity.Type.ANALYSIS, AppLogEntity.Action.ADD, app.getId());
        }
    }

    /**
     * 마이앱 삭제
     * @param appId
     */
    public void delMyApp(String appId) {
        UserEntity user = this.getCurrentUser();
        AnalysisAppUserRelEntity oldRel = analysisAppUserRelRepository.findByApp_IdAndUser_UserId(appId, user.getUserId());
        if( oldRel != null ) {
            analysisAppUserRelRepository.delete(oldRel);
            appLogService.write(AppLogEntity.Type.ANALYSIS, AppLogEntity.Action.DELETE, oldRel.getApp().getId());
        }
    }

    /**
     * 마이앱 실행 요청
     * 대상 앱의 상태와 권한 판단해서 실행 가능 url 조회
     * @param appId
     * @return
     */
    public Map<String, Object> execMyApp(String appId) {
        Map<String, Object> result = new HashMap<>();
        AnalysisAppUserRelEntity oldRel = analysisAppUserRelRepository.findByApp_IdAndUser_UserId(appId, this.getCurrentUserId());
        if( oldRel != null ) {
            AnalysisAppEntity app = oldRel.getApp();
            appLogService.write(AppLogEntity.Type.ANALYSIS, AppLogEntity.Action.EXEC, app.getId());
            INavigable navigable = null;
            if( AnalysisAppEntity.HeaderType.URL == app.getHeaderType() ) {
                navigable = app.getUrlHeader();
            } else if( AnalysisAppEntity.HeaderType.METATRON == app.getHeaderType() ) {
                app.getMetatronHeader().setDashboardSharePath(dashboardSharePath);
                app.getMetatronHeader().setWorkbookSharePath(workbookSharePath);
                navigable = app.getMetatronHeader();
            } else if( AnalysisAppEntity.HeaderType.EXTRACT == app.getHeaderType() ) {
                navigable = app.getExtractHeader();
            }
            if(navigable != null) {
                result.put("path", navigable.getNavigation());
                result.put("appNm", app.getAppNm());
                result.put("summary", app.getSummary());
                result.put("type", app.getHeaderType());
            }
        }
        return result;
    }

    /**
     * 마이앱 추가 여부
     * @param appId
     * @return
     */
    public boolean isAddedMyApp(String appId) {
        return analysisAppUserRelRepository.countByApp_IdAndUser_UserId(appId, this.getCurrentUserId()) > 0;
    }

    /**
     * 특정 앱에 대한 현재 사용자 수용여부 (권한 판단)
     * @param appId
     * @return
     */
    public boolean acceptableApp(String appId) {
        AnalysisAppEntity app = analysisAppRepository.findOne(appId);
        if( app != null ) {
            if( app.getRoleRel() == null || app.getRoleRel().size() == 0 ) {
                return false;
            }
            UserEntity user = this.getCurrentUser();
            if( user.isAdmin() ) {
                return true;
            }
            List<RoleGroupEntity> myRoles = roleGroupService.getRoleGroupListByUser(user.getUserId());
            for( RoleGroupEntity role : myRoles ) {
                for( AnalysisAppRoleGroupRelEntity rel : app.getRoleRel() ) {
                    if( rel.getRoleGroup().getId().equals(role.getId()) ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 특정 앱에 대한 권한 목록
     * @param appId
     * @return
     */
    public List<RoleGroupEntity> getAppRoleList(String appId) {
        return analysisAppRoleGroupRelRepository.getAppRoleList(appId);
    }

    /**
     * 앱과 권한 그룹 관계 저장
     * @param roleGroup
     * @param app
     * @return
     */
    public boolean saveRoleGroupRelation( RoleGroupEntity roleGroup, AnalysisAppEntity app ) {
        AnalysisAppRoleGroupRelEntity rel = new AnalysisAppRoleGroupRelEntity();
        rel.setRoleGroup(roleGroup);
        rel.setApp(app);
        this.setCreateUserInfo(rel);
        return analysisAppRoleGroupRelRepository.save(rel) != null;
    }

    /**
     * 권한 그룹으로 관련 관계 삭제
     * @param roleGroup
     */
    public void removeRoleGroupRels(RoleGroupEntity roleGroup) {
        analysisAppRoleGroupRelRepository.deleteByRoleGroup(roleGroup);
    }

    /**
     * 분석 앱 카테고리 조회 (카테고리별 연관 앱 카운트 포함)
     * @return
     */
    public List<CodeEntity> getCategories() {
        List<CodeEntity> categories = codeService.listByGrpCdKey(Const.App.CATEGORY_ANALYSIS);
        categories.forEach(cate -> {
            cate.setExtra(analysisAppRepository.getCountByCategory(cate.getId()));
        });
        return categories;
    }

    ///////////////////////////////////////////////////////////////
    //
    // for indexing
    //
    ///////////////////////////////////////////////////////////////

    public List<AnalysisAppIndexVO> getIndices() {
        List<AnalysisAppIndexVO> indices = new ArrayList<>();
        List<AnalysisAppEntity> appList = analysisAppRepository.findByUseYnAndDelYnOrderByCreatedDateDesc(true, false);
        if( appList != null && appList.size() > 0 ) {
            appList.forEach(app -> {
                AnalysisAppIndexVO index = new AnalysisAppIndexVO();
                index.setAppNm(app.getAppNm());
                index.setAppSummary(app.getSummary());

                List<String> categories = new ArrayList<>();
                app.getCategories().forEach(cate -> {
                    categories.add(cate.getNmKr());

                });
                index.setCategories(StringUtils.collectionToCommaDelimitedString(categories));

                if( app.getMediaGroup() != null && app.getMediaGroup().getMedias() != null ) {
                    index.setMediaId(app.getMediaGroup().getMedias().stream().findFirst().get().getId());
                }

                index.setUsage(app.getUsage());

                index.setId(app.getId());
                index.setCreatedDate(app.getCreatedDate()==null? null: app.getCreatedDate().toString("yyyy-MM-dd HH:mm"));

                List<String> tags = new ArrayList<>();
                tags.add(app.getAppNm());
                index.setAutocompletes(tags);

                indices.add(index);
            });
        }
        return indices;
    }

}
