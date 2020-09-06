package app.metatron.portal.common.user.service;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.common.user.domain.*;
import app.metatron.portal.common.user.repository.IARepository;
import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.analysis.service.AnalysisAppRecommendService;
import app.metatron.portal.portal.analysis.service.AnalysisAppService;
import app.metatron.portal.portal.log.domain.AppLogEntity;
import app.metatron.portal.portal.report.domain.ReportAppEntity;
import app.metatron.portal.portal.report.service.ReportAppRecommendService;
import app.metatron.portal.portal.report.service.ReportAppService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * IA 서비스
 */
@Service
public class IAService extends AbstractGenericService<IAEntity, String> {

    @Autowired
    private IARepository iaRepository;

    @Autowired
    private RoleGroupService roleGroupService;

    @Autowired
    private AnalysisAppService analysisAppService;

    @Autowired
    private ReportAppService reportAppService;

    @Autowired
    private AnalysisAppRecommendService analysisAppRecommendService;

    @Autowired
    private ReportAppRecommendService reportAppRecommendService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    protected JpaRepository<IAEntity, String> getRepository() {
        return iaRepository;
    }

    /**
     * IA 루트 목록
     * @return
     */
    public List<IAEntity> getIARootList() {
        return iaRepository.findByParentIsNullOrderByIaOrder();
    }

    /**
     * IA 하위 노드
     * @param parentId
     * @return
     */
    public List<IAEntity> getIAChildrenList(String parentId) {
        IAEntity parent = iaRepository.findOne(parentId);
        if( parent == null ) {
            return null;
        }
        return parent.getChildren();
    }

    /**
     * IA 추가
     * @param iaDto
     * @return
     */
    public IAEntity addIA(IADto.CREATE iaDto) {
        IAEntity ia = modelMapper.map(iaDto, IAEntity.class);
        if( !StringUtils.isEmpty(iaDto.getParentId())) {
            IAEntity parent = iaRepository.findOne(iaDto.getParentId());
            ia.setParent(parent);
        }
        this.setCreateUserInfo(ia);
        iaRepository.save(ia);

        // 1depth 메뉴일 경우 권한 추가
        if (ia.getDepth() == 1) {
            List<RoleGroupDto.IA> iaAndPermissions = new ArrayList<>();
            RoleGroupDto.IA iaAndPermission = new RoleGroupDto.IA();
            iaAndPermission.setIaId(ia.getId());
            iaAndPermission.setPermission(PermissionType.RW.toString());
            iaAndPermissions.add(iaAndPermission);
            roleGroupService.addIAPermission(Const.RoleGroup.DEFAULT_USER, iaAndPermissions);

            iaAndPermissions = new ArrayList<>();
            iaAndPermission = new RoleGroupDto.IA();
            iaAndPermission.setIaId(ia.getId());
            iaAndPermission.setPermission(PermissionType.SA.toString());
            iaAndPermissions.add(iaAndPermission);

            roleGroupService.addIAPermission(Const.RoleGroup.SYSTEM_ADMIN, iaAndPermissions);
        }

        return ia;
    }

    /**
     * IA 수정
     * @param iaDto
     * @return
     */
    public IAEntity editIA(IADto.EDIT iaDto) {
        IAEntity ia = modelMapper.map(iaDto, IAEntity.class);
        if( !StringUtils.isEmpty(iaDto.getParentId())) {
            IAEntity parent = iaRepository.findOne(iaDto.getParentId());
            ia.setParent(parent);
        }
        this.setUpdateUserInfo(ia);
        return iaRepository.save(ia);
    }

    /**
     * IA 삭제
     * @param iaId
     * @return
     */
    public boolean removeIA(String iaId) {
        IAEntity ia = iaRepository.findOne(iaId);
        if( ia.getChildren() != null && ia.getChildren().size() > 0 ) {
            return false;
        }
        iaRepository.delete(ia);
        return true;
    }

    /**
     * 메뉴 트리 데이터
     * @return
     */
    public List<MenuVO> getMenuList(String userId) {
        // For Communication 2depth last 2day counts
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar cal = Calendar.getInstance();
        String startDate = sdf.format(cal.getTime());
        cal.add(Calendar.DAY_OF_MONTH, -2);
        String endDate = sdf.format(cal.getTime());

        List<MenuVO> allMenu = new ArrayList<>();

        // 사용자 기준 가능 IA 와 퍼미션 조회
        List<MenuVO.IAAndPermission> iaAndPermissions = roleGroupService.getIAAndPermissionListByUserId(userId);

        // 인기, 최신
        List<AnalysisAppEntity> analysisAppLatest = analysisAppRecommendService.getLatestRegisteredAppList(null, Const.App.TOP_2);
        List<ReportAppEntity> reportAppLatest = reportAppRecommendService.getLatestRegisteredAppList(null, Const.App.TOP_2);

        List<AnalysisAppEntity> analysisAppTop3 = analysisAppRecommendService.getPopularAppListExceptApps(AppLogEntity.Action.ADD, null, Const.App.TOP_3);
        List<ReportAppEntity> reportAppTop3 = reportAppRecommendService.getPopularAppListExceptApps(AppLogEntity.Action.ADD, null, Const.App.TOP_3);

        // 마이앱 정보
        List<AnalysisAppEntity> myAnalysisApp = analysisAppService.getMyAppList();
        List<ReportAppEntity> myReportApp = reportAppService.getMyAppList();

        iaAndPermissions.forEach(depth1 -> {
            MenuVO depth1VO = mappingIAToMenu(depth1.getIa(), depth1.getPermission().toString());
            allMenu.add(depth1VO);
            if( depth1.getIa().getChildren() != null ) {
                depth1.getIa().getChildren().forEach(depth2 -> {
                    MenuVO depth2VO = mappingIAToMenu(depth2, depth1.getPermission().toString());
                    depth1VO.getChildren().add(depth2VO);
                    if( depth2.getChildren() != null ) {
                        depth2.getChildren().forEach(depth3 -> {
                            MenuVO depth3VO = mappingIAToMenu(depth3, depth1.getPermission().toString());
                            depth2VO.getChildren().add(depth3VO);
                        });
                    }
                    // APP
                    switch( depth2.getId() ) {
                        case Const.IA.MY_REPORT:
                            myReportApp.forEach(app -> {
                                depth2VO.getChildren().add(mappingReportAppToMenu(app, depth2VO.getPath(), depth1.getPermission().toString(), null, true));
                            });
                            break;
                        case Const.IA.MY_ANALYSIS:
                            myAnalysisApp.forEach(app -> {
                                depth2VO.getChildren().add(mappingAnalysisAppToMenu(app, depth2VO.getPath(), depth1.getPermission().toString(), null, true));
                            });
                            break;
                        case Const.IA.REPORT:
                            reportAppTop3.forEach(app -> {
                                depth2VO.getChildren().add(mappingReportAppToMenu(app, depth2VO.getPath(), depth1.getPermission().toString(), MenuVO.AppType.POPULAR, false));
                            });
                            reportAppLatest.forEach(app -> {
                                depth2VO.getChildren().add(mappingReportAppToMenu(app, depth2VO.getPath(), depth1.getPermission().toString(), MenuVO.AppType.LATEST, false));
                            });
                            break;
                        case Const.IA.ANALYSIS:
                            analysisAppTop3.forEach(app -> {
                                depth2VO.getChildren().add(mappingAnalysisAppToMenu(app, depth2VO.getPath(), depth1.getPermission().toString(), MenuVO.AppType.POPULAR, false));
                            });
                            analysisAppLatest.forEach(app -> {
                                depth2VO.getChildren().add(mappingAnalysisAppToMenu(app, depth2VO.getPath(), depth1.getPermission().toString(), MenuVO.AppType.LATEST, false));
                            });
                            break;
                    }
                    // Communication 2 Depth Last 2day counts
                    if( Const.IA.COMMUNICATION.equals(depth2.getParent().getId()) ) {
                        depth2VO.setExtra(iaRepository.getPostLast2DayCountByIa(depth2.getId(), startDate, endDate));
                    }
                });
            }
        });

        return allMenu;
    }


    /**
     * 특정 IA 코드(1레벨)로 권한 보유 여부 확인
     * @param ia
     * @return
     */
    public boolean hasRoleForIA(String userId, String ia) {
        List<MenuVO.IAAndPermission> iaAndPermissions = roleGroupService.getIAAndPermissionListByUserId(userId);
        for( MenuVO.IAAndPermission depth1 : iaAndPermissions ) {
            if( depth1.getIa().getId().equals(ia) ) {
                return true;
            }
        }
        return false;
    }

    /**
     * 1레벨 메뉴 조회
     * @param userId
     * @return
     */
    public List<MenuVO> getMenuListFor1Depth(String userId) {
        List<MenuVO> menus = new ArrayList<>();
        List<MenuVO.IAAndPermission> iaAndPermissions = roleGroupService.getIAAndPermissionListByUserId(userId);
        iaAndPermissions.forEach(depth1 -> {
            menus.add(mappingIAToMenu(depth1.getIa(), depth1.getPermission().toString()));
        });
        return menus;
    }

    /**
     * IA 를 메뉴로 변환
     * @param ia
     * @param permission
     * @return
     */
    private MenuVO mappingIAToMenu(IAEntity ia, String permission) {
        MenuVO menu = new MenuVO();
        menu.setId(ia.getId());
        menu.setName(ia.getIaNm());
        menu.setDesc(ia.getIaDesc());
        menu.setDetailDesc(ia.getIaDetailDesc());
        menu.setPath(ia.getPath());
        menu.setExternal(ia.getExternalYn());
        menu.setLink(ia.getLinkYn());
        menu.setDisplay(ia.getDisplayYn());
        menu.setPermission(permission);
        menu.setExtraMenu(ia.getExtraYn());
        menu.setIcon(ia.getIcon());
        return menu;
    }

    /**
     * 분석앱을 메뉴로 변환
     * @param app
     * @param basePath
     * @param permission
     * @param appType
     * @return
     */
    private MenuVO mappingAnalysisAppToMenu(AnalysisAppEntity app, String basePath, String permission, MenuVO.AppType appType, boolean isMy) {
        MenuVO menu = new MenuVO();
        menu.setId(app.getId());
        menu.setName(app.getAppNm());
        menu.setDesc(app.getSummary());
        menu.setExternal(app.getExternalYn());
        if( menu.isExternal() && isMy ) {
            if( app.getHeaderType() == AnalysisAppEntity.HeaderType.URL ) {
                menu.setPath(app.getUrlHeader().getNavigation());
            }
        } else {
            menu.setExternal(false);
            menu.setPath(basePath + "/"+app.getId());
        }

        menu.setLink(true);
        menu.setDisplay(true);
        menu.setPermission(permission);
        // 마이앱인 경우 이미지 포함 하나만
        if( app.getMediaGroup() != null
                && app.getMediaGroup().getMedias() != null
                && app.getMediaGroup().getMedias().size() > 0) {
            menu.setMedia(app.getMediaGroup().getMedias().get(0).getId());
        }
        menu.setExtra(app.getCategories());
        menu.setAppType(appType);
        return menu;
    }

    /**
     * 리포트 앱을 메뉴로 변환
     * @param app
     * @param basePath
     * @param permission
     * @param appType
     * @return
     */
    private MenuVO mappingReportAppToMenu(ReportAppEntity app, String basePath, String permission, MenuVO.AppType appType, boolean isMy) {
        MenuVO menu = new MenuVO();
        menu.setId(app.getId());
        menu.setName(app.getAppNm());
        menu.setDesc(app.getSummary());
        menu.setExternal(app.getExternalYn());
        if( menu.isExternal() && isMy ) {
            if( app.getHeaderType() == ReportAppEntity.HeaderType.URL ) {
                menu.setPath(app.getUrlHeader().getNavigation());
            }
        } else {
            menu.setExternal(false);
            menu.setPath(basePath + "/"+app.getId());
        }
        menu.setLink(true);
        menu.setDisplay(true);
        menu.setPermission(permission);
        // 마이앱인 경우 이미지 포함 하나만
        if( app.getMediaGroup() != null
                && app.getMediaGroup().getMedias() != null
                && app.getMediaGroup().getMedias().size() > 0) {
            menu.setMedia(app.getMediaGroup().getMedias().get(0).getId());
        }
        menu.setExtra(app.getCategories());
        menu.setAppType(appType);
        return menu;
    }
}
