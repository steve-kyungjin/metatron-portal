package app.metatron.portal.portal.report.service;

import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.media.service.MediaService;
import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.common.user.service.RoleGroupService;
import app.metatron.portal.common.util.CommonUtil;
import app.metatron.portal.portal.datasource.domain.DataSourceEntity;
import app.metatron.portal.portal.datasource.service.DataSourceService;
import app.metatron.portal.portal.log.domain.AppLogEntity;
import app.metatron.portal.portal.log.service.AppLogService;
import app.metatron.portal.portal.report.domain.*;
import app.metatron.portal.portal.report.repository.ReportAppCategoryRelRepository;
import app.metatron.portal.portal.report.repository.ReportAppRepository;
import app.metatron.portal.portal.report.repository.ReportAppUserRelRepository;
import app.metatron.portal.portal.search.domain.ReportAppIndexVO;
import app.metatron.portal.portal.search.service.ElasticSearchRelayService;
import app.metatron.portal.common.code.service.CodeService;
import app.metatron.portal.common.domain.INavigable;
import app.metatron.portal.common.media.domain.MediaGroupEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.portal.report.repository.ReportAppRoleGroupRelRepository;
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
 * 리포트앱 서비스
 */
@Service
@Transactional
public class ReportAppService extends AbstractGenericService<ReportAppEntity, String> {

    /**
     * 워크북 기본 경로
     */
    @Value("${metatron.path.workbook-share-path}")
    private String workbookSharePath;

    /**
     * 대시보드 기본 경로
     */
    @Value("${metatron.path.dashboard-share-path}")
    private String dashboardSharePath;

    @Autowired
    private ReportAppRepository reportAppRepository;

    @Autowired
    private ReportAppUserRelRepository reportAppUserRelRepository;

    @Autowired
    private ReportAppCategoryRelRepository reportAppCategoryRelRepository;

    @Autowired
    private ReportAppRoleGroupRelRepository reportAppRoleGroupRelRepository;

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
    protected JpaRepository<ReportAppEntity, String> getRepository() {
        return reportAppRepository;
    }

    /**
     * 특정앱 삭제
     * @param appId
     */
    public void deleteReportApp(String appId) {
        ReportAppEntity app = reportAppRepository.findOne(appId);
        if( app != null ) {
            app.setDelYn(true);
            reportAppRepository.save(app);

            // delete index
            searchService.delIndex(Const.ElasticSearch.TYPE_REPORT_APP, app.getId(), app.getAppNm());
        }
    }

    /**
     * 리포트앱 추가
     * @param reportAppDto
     * @param files
     * @return
     * @throws Exception
     */
    public ReportAppEntity addReportApp(ReportAppDto.CREATE reportAppDto, MultipartFile[] files) throws Exception{

        // Model Mapper
        ReportAppEntity reportAppEntity = modelMapper.map(reportAppDto, ReportAppEntity.class);

        // 파일 저장
        MediaGroupEntity mediaGroup = mediaService.saveMedia(files);
        reportAppEntity.setMediaGroup(mediaGroup);

        // 코드 리스트
        List<ReportAppCategoryRelEntity> reportAppCategoryRelList = new ArrayList<>();

        // 코드 추가
        reportAppDto.getCategories().forEach(category -> {
            Optional.of(codeService.get(category)).ifPresent(codeEntity -> {
                reportAppCategoryRelList.add(CommonUtil.getReportAppCategoryEntity(codeEntity, reportAppEntity));
            });
        });
        reportAppEntity.setCategoryRel(reportAppCategoryRelList);

        // 롤 리스트
        List<ReportAppRoleGroupRelEntity> reportAppRoleRelList = new ArrayList<>();
        // 권한 추가
        if( reportAppDto.getRoles() != null ) {
            reportAppDto.getRoles().forEach(roleGroup -> {
                Optional.of(roleGroupService.get(roleGroup)).ifPresent( rg -> {
                    reportAppRoleRelList.add(CommonUtil.getReportAppRoleGroupEntity(rg, reportAppEntity));
                });
            });
            reportAppEntity.setRoleRel(reportAppRoleRelList);
        }

        // 헤더 추가
        switch (reportAppEntity.getHeaderType()){
            case URL:
                ReportAppUrlHeaderEntity reportAppUrlHeaderEntity = new ReportAppUrlHeaderEntity();
                reportAppUrlHeaderEntity.setUrl(reportAppDto.getUrlHeader().getUrl());
                reportAppUrlHeaderEntity.setApp(reportAppEntity);
                reportAppEntity.setUrlHeader(reportAppUrlHeaderEntity);
                break;
            case METATRON:
                ReportAppMetatronHeaderEntity reportAppMetatronHeaderEntity = new ReportAppMetatronHeaderEntity();
                reportAppMetatronHeaderEntity.setType( ReportAppMetatronHeaderEntity.Type.valueOf(reportAppDto.getMetatronHeader().getType()) );
                reportAppMetatronHeaderEntity.setContentsId(reportAppDto.getMetatronHeader().getContentsId());
                reportAppMetatronHeaderEntity.setContentsNm(reportAppDto.getMetatronHeader().getContentsNm());
                reportAppMetatronHeaderEntity.setLocationId(reportAppDto.getMetatronHeader().getLocationId());
                reportAppMetatronHeaderEntity.setApp(reportAppEntity);
                reportAppEntity.setMetatronHeader(reportAppMetatronHeaderEntity);
                break;
            case EXTRACT:
                ReportAppExtractHeaderEntity reportAppExtractHeaderEntity = new ReportAppExtractHeaderEntity();
                reportAppExtractHeaderEntity.setSqlTxt(reportAppDto.getExtractHeader().getSqlTxt());
                DataSourceEntity dataSource = dataSourceService.get(reportAppDto.getExtractHeader().getDataSourceId());
                reportAppExtractHeaderEntity.setDataSource(dataSource);
                reportAppExtractHeaderEntity.setApp(reportAppEntity);
                reportAppEntity.setExtractHeader(reportAppExtractHeaderEntity);
                break;
        }

        this.setCreateUserInfo(reportAppEntity);
        // Entity 추가
        return reportAppRepository.save(reportAppEntity);
    }

    /**
     * 리포트앱 수정
     * @param reportAppDto
     * @param files
     * @return
     * @throws Exception
     */
    public ReportAppEntity editReportApp( ReportAppDto.EDIT reportAppDto, MultipartFile[] files) throws Exception{

        // Model Mapper
        ReportAppEntity reportAppEntity = reportAppRepository.findOne(reportAppDto.getId());
        reportAppEntity.setAppNm(reportAppDto.getAppNm());
        reportAppEntity.setSummary(reportAppDto.getSummary());
        reportAppEntity.setContents(reportAppDto.getContents());
        reportAppEntity.setVer(reportAppDto.getVer());
        reportAppEntity.setVerInfo(reportAppDto.getVerInfo());
        reportAppEntity.setUseYn(reportAppDto.getUseYn());
        reportAppEntity.setExternalYn(reportAppDto.getExternalYn());
        if( !reportAppDto.getUseYn() ) {
            // delete index
            searchService.delIndex(Const.ElasticSearch.TYPE_REPORT_APP, reportAppEntity.getId(), reportAppEntity.getAppNm());
        }

        // 파일 수정
        MediaGroupEntity mediaGroup = mediaService.changeMedia(reportAppDto.getMediaGroupId(),files,reportAppDto.getDelFileIds());
        reportAppEntity.setMediaGroup(mediaGroup);

        // 코드 리스트
        List<ReportAppCategoryRelEntity> reportAppCategoryRelList = new ArrayList<>();

        // 코드 삭제
        reportAppCategoryRelRepository.delete(reportAppEntity.getCategoryRel());

        // 코드 추가
//        reportAppCategoryRelRepository.delete();
        reportAppDto.getCategories().forEach(category -> {
            Optional.of(codeService.get(category)).ifPresent(codeEntity -> {
                reportAppCategoryRelList.add(CommonUtil.getReportAppCategoryEntity(codeEntity, reportAppEntity));
            });
        });
        reportAppEntity.setCategoryRel(reportAppCategoryRelList);

        if( reportAppEntity.getRoleRel() != null ) {
            reportAppRoleGroupRelRepository.delete(reportAppEntity.getRoleRel());
        }
        // 롤 리스트
        List<ReportAppRoleGroupRelEntity> reportAppRoleRelList = new ArrayList<>();
        // 권한 추가
        if( reportAppDto.getRoles() != null ) {
            reportAppDto.getRoles().forEach(roleGroup -> {
                Optional.of(roleGroupService.get(roleGroup)).ifPresent( rg -> {
                    reportAppRoleRelList.add(CommonUtil.getReportAppRoleGroupEntity(rg, reportAppEntity));
                });
            });
            reportAppEntity.setRoleRel(reportAppRoleRelList);
        } else {
            reportAppEntity.setRoleRel(null);
        }

        // 헤더 추가
        switch (reportAppEntity.getHeaderType()){
            case URL:
                reportAppEntity.getUrlHeader().setUrl(reportAppDto.getUrlHeader().getUrl());
                reportAppEntity.getUrlHeader().setApp(reportAppEntity);
                break;
            case METATRON:
                reportAppEntity.getMetatronHeader().setType( ReportAppMetatronHeaderEntity.Type.valueOf(reportAppDto.getMetatronHeader().getType()) );
                reportAppEntity.getMetatronHeader().setContentsId(reportAppDto.getMetatronHeader().getContentsId());
                reportAppEntity.getMetatronHeader().setContentsNm(reportAppDto.getMetatronHeader().getContentsNm());
                reportAppEntity.getMetatronHeader().setLocationId(reportAppDto.getMetatronHeader().getLocationId());
                reportAppEntity.getMetatronHeader().setApp(reportAppEntity);
                break;
            case EXTRACT:
                reportAppEntity.getExtractHeader().setSqlTxt(reportAppDto.getExtractHeader().getSqlTxt());
                DataSourceEntity dataSource = dataSourceService.get(reportAppDto.getExtractHeader().getDataSourceId());
                reportAppEntity.getExtractHeader().setDataSource(dataSource);
                reportAppEntity.getExtractHeader().setApp(reportAppEntity);
                break;
        }

        this.setUpdateUserInfo(reportAppEntity);
        // Entity 추가
        return reportAppRepository.save(reportAppEntity);
    }

    /**
     * 리포트앱 조회
     * @param param
     * @param pageable
     * @return
     */
    public Page<ReportAppEntity> listBySearchValuesWithPage(ReportAppDto.PARAM param, Pageable pageable){
        return reportAppRepository.findQueryDslBySearchValuesWithPage(param , pageable);
    }

    /**
     * 앱 목록
     * @return
     */
    public List<ReportAppEntity> getAppListOrderByCreatedDate() {
        return reportAppRepository.findByUseYnAndDelYnOrderByCreatedDateDesc(true, false);
    }

    /**
     * 앱 목록
     * @param exceptIds
     * @return
     */
    public List<ReportAppEntity> getAppListOrderByCreatedDate(List<String> exceptIds) {
        if( exceptIds != null && exceptIds.size() > 0  ) {
            return reportAppRepository.findByIdNotInAndUseYnAndDelYnOrderByCreatedDateDesc(exceptIds, true, false);
        } else {
            return reportAppRepository.findByUseYnAndDelYnOrderByCreatedDateDesc(true, false);
        }
    }

    /**
     * 마이앱 목록
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<ReportAppEntity> getMyAppList(String keyword, Pageable pageable) {
        return reportAppRepository.getMyAppList(this.getCurrentUserId(), keyword, pageable);
    }

    /**
     * 마이앱 목록
     * @return
     */
    public List<ReportAppEntity> getMyAppList() {
        return reportAppRepository.getMyAppListAll(this.getCurrentUserId());
    }

    /**
     * 마이앱 추가
     * @param appId
     */
    public void addMyApp(String appId) {
        UserEntity user = this.getCurrentUser();
        ReportAppUserRelEntity oldRel = reportAppUserRelRepository.findByApp_IdAndUser_UserId(appId, user.getUserId());
        if( oldRel != null ) {
            reportAppUserRelRepository.delete(oldRel);
        }
        ReportAppEntity app = reportAppRepository.findOne(appId);

        ReportAppUserRelEntity newRel = new ReportAppUserRelEntity();
        newRel.setApp(app);
        newRel.setUser(user);
        ReportAppUserRelEntity result = reportAppUserRelRepository.save(newRel);
        if( result != null ) {
            appLogService.write(AppLogEntity.Type.REPORT, AppLogEntity.Action.ADD, app.getId());
        }
    }

    /**
     * 마이앱 삭제
     * @param appId
     */
    public void delMyApp(String appId) {
        UserEntity user = this.getCurrentUser();
        ReportAppUserRelEntity oldRel = reportAppUserRelRepository.findByApp_IdAndUser_UserId(appId, user.getUserId());
        if( oldRel != null ) {
            reportAppUserRelRepository.delete(oldRel);
            appLogService.write(AppLogEntity.Type.REPORT, AppLogEntity.Action.DELETE, oldRel.getApp().getId());
        }
    }

    /**
     * 마이앱 실행
     * app의 실행 path 전달
     * @param appId
     * @return
     */
    public Map<String, Object> execMyApp(String appId) {
        Map<String, Object> result = new HashMap<>();
        ReportAppUserRelEntity oldRel = reportAppUserRelRepository.findByApp_IdAndUser_UserId(appId, this.getCurrentUserId());
        if( oldRel != null ) {
            ReportAppEntity app = oldRel.getApp();
            appLogService.write(AppLogEntity.Type.REPORT, AppLogEntity.Action.EXEC, app.getId());
            INavigable navigable = null;
            if( ReportAppEntity.HeaderType.URL == app.getHeaderType() ) {
                navigable = app.getUrlHeader();
            } else if( ReportAppEntity.HeaderType.METATRON == app.getHeaderType() ) {
                app.getMetatronHeader().setDashboardSharePath(dashboardSharePath);
                app.getMetatronHeader().setWorkbookSharePath(workbookSharePath);
                navigable = app.getMetatronHeader();
            } else if( ReportAppEntity.HeaderType.EXTRACT == app.getHeaderType() ) {
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
     * 마이앱 추가여부 확인
     * @param appId
     * @return
     */
    public boolean isAddedMyApp(String appId) {
        return reportAppUserRelRepository.countByApp_IdAndUser_UserId(appId, this.getCurrentUserId()) > 0;
    }

    /**
     * 앱 권한여부 확인
     * @param appId
     * @return
     */
    public boolean acceptableApp(String appId) {
        ReportAppEntity app = reportAppRepository.findOne(appId);
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
                for( ReportAppRoleGroupRelEntity rel : app.getRoleRel() ) {
                    if( rel.getRoleGroup().getId().equals(role.getId()) ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 앱 권한그룹 목록
     * @param appId
     * @return
     */
    public List<RoleGroupEntity> getAppRoleList(String appId) {
        return reportAppRoleGroupRelRepository.getAppRoleList(appId);
    }

    /**
     * 권한 그룹 관계 저장
     * @param roleGroup
     * @param app
     * @return
     */
    public boolean saveRoleGroupRelation( RoleGroupEntity roleGroup, ReportAppEntity app ) {
        ReportAppRoleGroupRelEntity rel = new ReportAppRoleGroupRelEntity();
        rel.setRoleGroup(roleGroup);
        rel.setApp(app);
        this.setCreateUserInfo(rel);
        return reportAppRoleGroupRelRepository.save(rel) != null;
    }

    /**
     * 권한그룹 관계 삭제
     * @param roleGroup
     */
    public void removeRoleGroupRels(RoleGroupEntity roleGroup) {
        reportAppRoleGroupRelRepository.deleteByRoleGroup(roleGroup);
    }

    /**
     * 카테고리 목록 (카테고리별 앱 카운트 포함)
     * @return
     */
    public List<CodeEntity> getCategories() {
        List<CodeEntity> categories = codeService.listByGrpCdKey(Const.App.CATEGORY_REPORT);
        categories.forEach(cate -> {
            cate.setExtra(reportAppRepository.getCountByCategory(cate.getId()));
        });
        return categories;
    }

    ///////////////////////////////////////////////////////////////
    //
    // for indexing
    //
    ///////////////////////////////////////////////////////////////

    public List<ReportAppIndexVO> getIndices() {
        List<ReportAppIndexVO> indices = new ArrayList<>();
        List<ReportAppEntity> appList = reportAppRepository.findByUseYnAndDelYnOrderByCreatedDateDesc(true, false);
        if( appList != null && appList.size() > 0 ) {
            appList.forEach(app -> {
                ReportAppIndexVO index = new ReportAppIndexVO();
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
