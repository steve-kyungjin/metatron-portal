package app.metatron.portal.portal.main.service;

import app.metatron.portal.common.user.domain.MenuVO;
import app.metatron.portal.portal.communication.domain.CommDto;
import app.metatron.portal.portal.communication.domain.CommPostEntity;
import app.metatron.portal.portal.communication.service.CommPostService;
import app.metatron.portal.portal.main.domain.ContentsVO;
import app.metatron.portal.portal.main.domain.MainVO;
import app.metatron.portal.portal.report.domain.ReportAppEntity;
import app.metatron.portal.portal.report.service.ReportAppRecommendService;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.service.BaseService;
import app.metatron.portal.common.user.service.IAService;
import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.analysis.service.AnalysisAppRecommendService;
import app.metatron.portal.portal.analysis.service.AnalysisAppService;
import app.metatron.portal.portal.communication.domain.CommMasterEntity;
import app.metatron.portal.portal.log.domain.AppLogEntity;
import app.metatron.portal.portal.report.service.ReportAppService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 메인 컨텐츠 서비스
 */
@Slf4j
@Service
public class MainService extends BaseService {

    /**
     * 분석앱 제한 갯수
     */
    private static final int MAX_COUNT_ANALYSIS_APP = 4;

    /**
     * 리포트앱 제한 갯수
     */
    private static final int MAX_COUNT_REPORT_APP = 4;

    /**
     * 커뮤니케이션 섹션 A 제한 갯수
     */
    private static final int MAX_COUNT_COMMUNICATION_A = 2;

    /**
     * 커뮤니케이션 섹션 B 제한 갯수
     */
    private static final int MAX_COUNT_COMMUNICATION_B = 4;

    /**
     * 커뮤니케이션 섹션 B 중 마이 제한 갯수
     */
    private static final int MAX_COUNT_COMMUNICATION_B_MY = 2;

    @Autowired
    private AnalysisAppService analysisAppService;

    @Autowired
    private AnalysisAppRecommendService analysisAppRecommendService;

    @Autowired
    private ReportAppService reportAppService;

    @Autowired
    private ReportAppRecommendService reportAppRecommendService;

    @Autowired
    private CommPostService postService;

    @Autowired
    private IAService iaService;

    /**
     * 메인 컨텐츠 전체 정보
     * @return
     */
    public MainVO getAll() {
        MainVO main = new MainVO();
        List<MenuVO> menus = iaService.getMenuListFor1Depth(this.getCurrentUserId());
        menus.forEach(menu -> {
            switch(menu.getId()) {
                case Const.IA.APP_PLACE:
                    main.setAnalysisApps(this.getAnalysisApps());
                    main.setReportApps(this.getReportApps());
                    break;
                case Const.IA.COMMUNICATION:
                    main.setCommunications(this.getCommunications());
                    break;
            }
        });
        return main;
    }

    /**
     * 커뮤니케이션 정보
     * @return
     */
    public List<ContentsVO> getCommunications() {
        List<ContentsVO> communications = new ArrayList<>();
        List<CommPostEntity> posts = new ArrayList<>();
        // 중복없음, 갯수 limit

        // 1. A type 최신글 2개
        List<CommPostEntity> postsTypeA = postService.getTopPostLatestList(CommMasterEntity.Section.A, null, false, MAX_COUNT_COMMUNICATION_A);
        posts.addAll(postsTypeA);

        // 2. B type 내가 작성한 최신글 2개
        List<CommPostEntity> postsTypeB = postService.getTopPostLatestList(CommMasterEntity.Section.B, posts, true, MAX_COUNT_COMMUNICATION_B_MY);
        int remain = MAX_COUNT_COMMUNICATION_B - postsTypeB.size();
        posts.addAll(postsTypeB);

        // 3. B type 최신글
        postsTypeB = postService.getTopPostLatestList(CommMasterEntity.Section.B, posts, false, remain);
        posts.addAll(postsTypeB);

        // 4. mapping
        posts.forEach(post -> {
            ContentsVO contentsVO = new ContentsVO();
            contentsVO.setId(post.getId());
            contentsVO.setTitle(post.getTitle());
            contentsVO.setDescription(post.getStrippedContent());
            if( post.getMediaGroup() != null
                    && post.getMediaGroup().getMedias() != null
                    && post.getMediaGroup().getMedias().size() > 0 ) {
                contentsVO.setMedia(post.getMediaGroup().getMedias().get(0).getId());
            }
            List<String> categories = new ArrayList<>();
            categories.add(post.getMaster().getName() + "#" + post.getMaster().getSlug());
            contentsVO.setCategories(categories);
            contentsVO.setMy(false);
            String postLink = post.getMaster().getPrePath() +
                    "/" + post.getMaster().getSlug() + "/post/" + post.getId();
            contentsVO.setExtra(postLink);
            communications.add(contentsVO);
        });

        return communications;
    }

    /**
     * 분석앱 정보
     * @return
     */
    public List<ContentsVO> getAnalysisApps() {
        List<ContentsVO> analysisApps = new ArrayList<>();

        int remain = 0 ;
        // 1. 최근 실행한 마이앱
        List<AnalysisAppEntity> appList = analysisAppRecommendService.getMyAppList(AppLogEntity.Action.EXEC, null, MAX_COUNT_ANALYSIS_APP);
        appList.forEach( app -> {
            app.setMy(true);
        } );

        // 2. 최근 추가한 마이앱
        if( appList.size() < MAX_COUNT_ANALYSIS_APP ) {
            analysisAppRecommendService.getMyAppList(AppLogEntity.Action.ADD, appList, MAX_COUNT_ANALYSIS_APP - appList.size())
                    .forEach( app -> {
                        app.setMy(true);
                        appList.add(app);
                    } );
        }

        // 3. 사용자 많은 앱
        if( appList.size() < MAX_COUNT_ANALYSIS_APP ) {
            analysisAppRecommendService.getPopularAppListExceptApps(AppLogEntity.Action.ADD, appList, MAX_COUNT_ANALYSIS_APP - appList.size())
                    .forEach( app -> {
                        appList.add(app);
                    } );
        }

        // 4. 나머지 최근 등록앱
        if( appList.size() < MAX_COUNT_ANALYSIS_APP ) {
            analysisAppService.getAppListOrderByCreatedDate(getAnalysisExceptIds(appList)).stream().limit(MAX_COUNT_ANALYSIS_APP - appList.size())
                    .forEach( app -> {
                        appList.add(app);
                    } );
        }

        // 5. 매핑
        appList.forEach( app -> {
            ContentsVO appVO = new ContentsVO();
            appVO.setId(app.getId());
            appVO.setTitle(app.getAppNm());
            appVO.setDescription(app.getSummary());
            appVO.setMy(app.isMy());
            if( app.getMediaGroup() != null && app.getMediaGroup().getMedias() != null ) {
                appVO.setMedia(app.getMediaGroup().getMedias().stream().findFirst().get().getId());
            }
            List<String> categories = new ArrayList<>();
            if( app.getCategories() != null && app.getCategories().size() > 0 ) {
                app.getCategories().forEach( cate -> {
                    categories.add(cate.getNmKr());
                } );
            }
            appVO.setCategories(categories);
            if( app.getExternalYn() && app.getHeaderType() == AnalysisAppEntity.HeaderType.URL) {
                appVO.setExternalUrl(app.getUrlHeader().getUrl());
            }
            analysisApps.add(appVO);
        } );

        return analysisApps;
    }

    /**
     * 리포트앱 정보
     * @return
     */
    public List<ContentsVO> getReportApps() {
        List<ContentsVO> reportApps = new ArrayList<>();

        int remain = 0 ;
        // 1. 최근 실행한 마이앱
        List<ReportAppEntity> appList = reportAppRecommendService.getMyAppList(AppLogEntity.Action.EXEC, null, MAX_COUNT_REPORT_APP);
        appList.forEach( app -> {
            app.setMy(true);
        } );

        // 2. 최근 추가한 마이앱
        if( appList.size() < MAX_COUNT_REPORT_APP ) {
            reportAppRecommendService.getMyAppList(AppLogEntity.Action.ADD, appList, MAX_COUNT_REPORT_APP - appList.size())
                    .forEach( app -> {
                        app.setMy(true);
                        appList.add(app);
                    } );
        }

        // 3. 사용자 많은 앱
        if( appList.size() < MAX_COUNT_REPORT_APP ) {
            reportAppRecommendService.getPopularAppListExceptApps(AppLogEntity.Action.ADD, appList, MAX_COUNT_REPORT_APP - appList.size())
                    .forEach( app -> {
                        appList.add(app);
                    } );
        }

        // 4. 나머지 최근 등록앱
        if( appList.size() < MAX_COUNT_REPORT_APP ) {
            reportAppService.getAppListOrderByCreatedDate(getReportExceptIds(appList)).stream().limit(MAX_COUNT_REPORT_APP - appList.size())
                    .forEach( app -> {
                        appList.add(app);
                    } );
        }

        // 5. 매핑
        appList.forEach( app -> {
            ContentsVO appVO = new ContentsVO();
            appVO.setId(app.getId());
            appVO.setTitle(app.getAppNm());
            appVO.setDescription(app.getSummary());
            appVO.setMy(app.isMy());
            if( app.getMediaGroup() != null && app.getMediaGroup().getMedias() != null ) {
                appVO.setMedia(app.getMediaGroup().getMedias().stream().findFirst().get().getId());
            }
            List<String> categories = new ArrayList<>();
            if( app.getCategories() != null && app.getCategories().size() > 0 ) {
                app.getCategories().forEach( cate -> {
                    categories.add(cate.getNmKr());
                } );
            }
            appVO.setCategories(categories);
            if( app.getExternalYn() && app.getHeaderType() == ReportAppEntity.HeaderType.URL) {
                appVO.setExternalUrl(app.getUrlHeader().getUrl());
            }
            reportApps.add(appVO);
        } );

        return reportApps;
    }

    /**
     * 공지 알림 정보
     * @return
     */
    public List<CommDto.SimplePost> getNotices() {
        return postService.getNoticeListForSimple();
    }

    /**
     * 나의 요청건 중 미진행건
     * @return
     */
    public List<CommDto.SimplePost> getMyRequestedNotProcessList() {
        return postService.getRequestedNotProcessListForSimple(true);
    }

    /**
     * 나의 요청건 중 진행중건
     * @return
     */
    public List<CommDto.SimplePost> getMyRequestedProcessList() {
        return postService.getRequestedProcessListForSimple(true);
    }

    /**
     * 나의 요청건 중 처리완료
     * @return
     */
    public List<CommDto.SimplePost> getMyRequestedCompletedList() {
        return postService.getRequestedCompletedListForSimple(true);
    }

    /**
     * GNB 알림 영역 Badge 카운트
     * @return
     */
    public Map<String, Integer> getAlarmBadge() {
        return postService.getAlarmCount();
    }

    /**
     * 공지 알림 신규 확인
     * @param id 마지막 최상위 공지 알림 아이디
     * @return
     */
    public boolean checkNoticesForNew(String id) {
        List<CommDto.SimplePost> notices = postService.getNoticeListForSimple();
        if( notices != null && notices.size() > 0 ) {
            CommDto.SimplePost notice = notices.get(0);
            if( !notice.getId().equals(id) ) {
                return true;
            }
        }
        return false;
    }

    public List<String> getAnalysisExceptIds(List<AnalysisAppEntity> appList){
        List<String> exceptIds = new ArrayList<>();
        appList.forEach(app -> {
            exceptIds.add(app.getId());
        });
        return exceptIds;
    }

    public List<String> getReportExceptIds(List<ReportAppEntity> appList){
        List<String> exceptIds = new ArrayList<>();
        appList.forEach(app -> {
            exceptIds.add(app.getId());
        });
        return exceptIds;
    }

}
