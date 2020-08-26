package app.metatron.portal.web.api.report;

import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.portal.report.domain.ReportAppDto;
import app.metatron.portal.portal.report.domain.ReportAppEntity;
import app.metatron.portal.portal.report.domain.ReportAppReviewDto;
import app.metatron.portal.portal.report.domain.ReportAppReviewEntity;
import app.metatron.portal.portal.report.service.ReportAppRecommendService;
import app.metatron.portal.portal.search.domain.ReportAppIndexVO;
import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.code.service.CodeService;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.user.service.UserService;
import app.metatron.portal.common.value.ResultVO;
import app.metatron.portal.portal.log.domain.AppLogEntity;
import app.metatron.portal.portal.report.service.ReportAppReviewService;
import app.metatron.portal.portal.report.service.ReportAppService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
public class ReportAppController extends AbstractController {


    @Autowired
    private ReportAppService reportAppService;

    @Autowired
    private ReportAppReviewService reportAppReviewService;

    @Autowired
    private ReportAppRecommendService appRecommendService;

    @Autowired
    private CodeService codeService;

    @Autowired
    private UserService userService;

    /**
     * 자동 추천앱 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "메인 페이지 통합 정보 조회",
            notes = "메인 페이지 통합 정보 조회"
    )
    @RequestMapping(value = Path.REPORT_APPS_PAGE_MAIN, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAppMain(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue=" ",
                    value ="Pageable"
            )
                    ReportAppDto.PARAM param,
            @ApiParam(
                    defaultValue=" ",
                    value ="Pageable"
            )
            @PageableDefault(sort = {"createdDate"}, direction = Sort.Direction.DESC) Pageable pageable

    ){
        List<String> sortValue = new ArrayList<>();
        sortValue.add("createdDate,desc");
        String userId = this.getCurrentUserId();

        Map<String, Object> data = new HashMap<String, Object>();
        // 카테고리 리스트
        List<CodeEntity> categoryList = codeService.listByGrpCdKey(Const.App.CATEGORY_REPORT);
        data.put("categoryList", categoryList);

        // 리포트앱 리스트
        Page<ReportAppEntity> reportAppList  = reportAppService.listBySearchValuesWithPage(param,pageable);
        data.put("reportAppList", reportAppList);

        // 최신앱 리스트
        data.put("latestAppList", appRecommendService.getLatestRegisteredAppList(null, Const.App.TOP_12));

        // 사용자 추가 앱 탑3
        data.put("addAppList", appRecommendService.getPopularAppList(AppLogEntity.Action.ADD, null, Const.App.TOP_3));

        // 사용자 실행 앱 탑3
        data.put("execAppList", appRecommendService.getPopularAppList(AppLogEntity.Action.EXEC, null, Const.App.TOP_3));

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * 리포트앱 상세 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "리포트앱 상세 (페이지 통합)",
            notes = "리포트앱 상세 (페이지 통합)"
    )
    @RequestMapping(value = Path.REPORT_APPS_PAGE_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getReportAppDetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable String id
    ){

        String userId = this.getCurrentUserId();
        Map<String, Object> data = new HashMap<String, Object>();
        // 리포트앱 상세정보
        ReportAppEntity reportApp  = reportAppService.get(id);
//        if( reportApp.getDelYn()
//                || !reportApp.getUseYn() ) {
//            throw new ResourceNotFoundException(id);
//        }
        data.put("reportApp",reportApp);
        // 리포트앱 추가여부
        data.put("isAddedMyApp",reportAppService.isAddedMyApp(id));
        // 리포트앱에 대한 나의권한여부
        data.put("acceptableApp",reportAppService.acceptableApp(id));

        // category
        List<String> categoryIds = new ArrayList<>();
        if( reportApp.getCategories() != null ) {
            reportApp.getCategories().forEach(category -> {
                categoryIds.add(category.getId());
            });
        }
        // 최신앱 리스트
        data.put("latestAppList", appRecommendService.getLatestRegisteredAppList(categoryIds, Const.App.TOP_3));
        // 사용자 추가 앱 탑3
        data.put("addAppList", appRecommendService.getPopularAppList(AppLogEntity.Action.ADD, categoryIds, Const.App.TOP_3));

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 리포트앱 삭제
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "리포트앱 삭제",
            notes = "리포트앱 삭제"
    )
    @RequestMapping(value = Path.REPORT_APPS_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteReportApp(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable String id
    ){

        reportAppService.deleteReportApp(id);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 리포트 앱 리스트 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "리포트앱 조회",
            notes = "리포트앱 조회"
    )
    @RequestMapping(value = Path.REPORT_APPS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getReportAppList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            ReportAppDto.PARAM param,
            @PageableDefault(sort = {"createdDate"}, direction = Sort.Direction.DESC) Pageable pageable
    ){
        Map<String, Object> data = new HashMap<String, Object>();

        Page<ReportAppEntity> reportAppList  = reportAppService.listBySearchValuesWithPage(param,pageable);
        data.put("reportAppList", reportAppList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 리포트 앱 Category 리스트 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "리포트앱 Category 조회",
            notes = "리포트앱 Category 조회"
    )
    @RequestMapping(value = Path.REPORT_APPS_CATEGORIES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getReportAppCategoryList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ){
        List<CodeEntity> categoryList = reportAppService.getCategories();

        Map<String, Object> data = new HashMap<>();
        data.put("categoryList", categoryList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * 카테고리 코드를 입력 받아 해당하는 앱 목록을 보여줌
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "카테고리별 리포트앱 조회",
            notes = "카테고리별 리포트앱 조회"
    )
    @RequestMapping(value = Path.REPORT_APPS_CODE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getReportAppListWithCode(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            ReportAppDto.PARAM param,
            @PageableDefault(sort = {"createdDate"}, direction = Sort.Direction.DESC) Pageable pageable
    ){

        String userId = this.getCurrentUserId();
        Map<String, Object> data = new HashMap<String, Object>();

        Page<ReportAppEntity> reportAppList  = reportAppService.listBySearchValuesWithPage(param,pageable);
        data.put("reportAppList", reportAppList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 리포트앱 등록하기
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "리포트앱 등록하기",
            notes = "리포트앱 등록하기"
    )
    @RequestMapping(value = Path.REPORT_APPS, method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultVO> addReportApp(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "리포트 앱 정보",
                    required = true
            )
            @Valid
                    ReportAppDto.CREATE reportAppDto,
            @Valid @NotNull @RequestParam("files") MultipartFile[] files,
            BindingResult bindingResult

    ) throws Exception {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        // 리포트앱 추가
        ReportAppEntity reportAppEntity = reportAppService.addReportApp(reportAppDto,files);

        // URI 생성
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path(Path.REPORT_APPS_DETAIL).buildAndExpand(reportAppEntity.getId()).toUri();
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", location);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 앱 수정하기
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "앱 수정하기",
            notes = "앱 수정하기"
    )
    @RequestMapping(value = Path.REPORT_APPS_DETAIL, method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultVO> editReportApp(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "리포트 앱 정보",
                    required = true
            )
            @Valid ReportAppDto.EDIT reportAppDto,
            @Valid @RequestParam("files") MultipartFile[] files,
            BindingResult bindingResult
    ) throws Exception{
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        // 리포트앱 추가
        ReportAppEntity reportAppEntity = reportAppService.editReportApp(reportAppDto,files);

        // URI 생성
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path(Path.REPORT_APPS_DETAIL).buildAndExpand(reportAppEntity.getId()).toUri();
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", location);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 마이앱 페이지
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "마이앱 페이지",
            notes = "마이앱 페이지"
    )
    @RequestMapping(value = Path.REPORT_MY_APP_MAIN, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getMyAppPage(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="테스트",
                    value ="앱이름 검색어"
            )
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @ApiParam(
                    defaultValue=" ",
                    value ="Pageable"
            )
            @PageableDefault Pageable pageable

    ){

        Map<String, Object> data = new HashMap<>();
        data.put("myAppList", reportAppService.getMyAppList(keyword, pageable));

        // 최신앱 리스트
        data.put("latestAppList", appRecommendService.getLatestRegisteredAppList(null, Const.App.TOP_3));

        // 사용자 추가 앱 탑3
        data.put("addAppList", appRecommendService.getPopularAppList(AppLogEntity.Action.ADD, null, Const.App.TOP_3));

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 마이앱 목록
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "마이앱 목록",
            notes = "마이앱 목록"
    )
    @RequestMapping(value = Path.REPORT_MY_APP, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getMyAppList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="테스트",
                    value ="앱이름 검색어"
            )
            @RequestParam(name = "keyword", defaultValue = "", required = false) String keyword,
            @ApiParam(
                    defaultValue=" ",
                    value ="Pageable"
            )
            @PageableDefault Pageable pageable

    ){

        Map<String, Object> data = new HashMap<>();
        data.put("myAppList", reportAppService.getMyAppList(keyword, pageable));

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 마이앱 추가
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "마이앱 추가",
            notes = "마이앱 추가"
    )
    @RequestMapping(value = Path.REPORT_MY_APP_DETAIL, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addMyApp(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "App ID",
                    required = true
            )
            @PathVariable(name = "id") String id
    ){

        reportAppService.addMyApp(id);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 마이앱 삭제
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "마이앱 삭제",
            notes = "마이앱 삭제"
    )
    @RequestMapping(value = Path.REPORT_MY_APP_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> delMyApp(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "App ID",
                    required = true
            )
            @PathVariable(name = "id") String id
    ){

        reportAppService.delMyApp(id);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 마이앱 실행 로그
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "마이앱 실행 로그",
            notes = "마이앱 실행 로그"
    )
    @RequestMapping(value = Path.REPORT_MY_APP_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> execMyApp(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "App ID",
                    required = true
            )
            @PathVariable(name = "id") String id
    ){
        // check exist
        reportAppService.get(id);

        ResultVO resultVO = null;
        if( reportAppService.acceptableApp(id) ) {
            Map<String, Object> result = reportAppService.execMyApp(id);
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", result);
        } else {
            reportAppService.delMyApp(id);
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }
    /**
     * 리포트앱 리뷰보기
     * @param id
     * @return ResultVO
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "리포트앱 리뷰상세 ",
            notes = "리포트앱 리뷰상세"
    )
    @RequestMapping(value = Path.REPORT_APPS_REVIEWS_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getReportAppReviews(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="",
                    value ="리뷰 아이디"
            )
            @PathVariable String id
    ){

        Map<String, Object> data = new HashMap<String, Object>();
        ReportAppReviewEntity review  = reportAppReviewService.get(id);
        data.put("review",review);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", review);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 리포트앱 리뷰보기 리스트보기
     * @param id
     * @return ResultVO
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "리포트앱 리뷰 리스트보기",
            notes = "리포트앱 리뷰 리스트보기"
    )
    @RequestMapping(value = Path.REPORT_APPS_ID_REVIEWS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getReportAppReviews(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="APP000001",
                    value ="리포트앱 아이디"
            )
            @PathVariable String id,
            @ApiParam(
                    defaultValue="APP000001",
                    value ="페이징"
            )
            @PageableDefault(sort = {"createdDate"}, direction = Sort.Direction.DESC) Pageable pageable

    ){

        Map<String, Object> data = new HashMap<String, Object>();
        Page<ReportAppReviewEntity> reviewList  = reportAppReviewService.listByAppId(id,pageable);
        data.put("reviewList",reviewList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 리포트앱 등록하기
     * @param reportAppReviewDto
     * @return ResultVO
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "리포트앱 리뷰 등록하기",
            notes = "리포트앱 리뷰 등록하기"
    )
    @RequestMapping(value = Path.REPORT_APPS_REVIEWS, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addReportAppReviews(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "",
                    required = true
            )
            @RequestBody ReportAppReviewDto.CREATE reportAppReviewDto,
            BindingResult bindingResult

    ) throws Exception {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        ReportAppReviewEntity reportAppReviewEntity = new ReportAppReviewEntity();
        reportAppReviewEntity.setApp( reportAppService.get(reportAppReviewDto.getAppId()));
        reportAppReviewEntity.setContents(reportAppReviewDto.getContents());

        // 답글인지 체크
        if( null != reportAppReviewDto.getParent() ){
            ReportAppReviewEntity parent = reportAppReviewService.get(reportAppReviewDto.getParent());
            reportAppReviewEntity.setParent(parent);
        }
        // 유저 추가
        String userId = this.getCurrentUserId();
        reportAppReviewEntity.setUser(userService.get(userId));

        reportAppReviewService.add(reportAppReviewEntity);

        // URI 생성
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/report-apps/reviews/{id}").buildAndExpand(reportAppReviewEntity.getId()).toUri();
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("review",reportAppReviewEntity);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 리포트앱 수정하기
     * @param reportAppReviewDto
     * @return ResultVO
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "리포트앱 리뷰 수정하기",
            notes = "리포트앱 리뷰 수정하기"
    )
    @RequestMapping(value = Path.REPORT_APPS_REVIEWS, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> addReportAppReviews(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "",
                    required = true
            )
            @RequestBody ReportAppReviewDto.EDIT reportAppReviewDto,
            BindingResult bindingResult

    ) throws Exception {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }
        // 답글 수정
        ReportAppReviewEntity reportAppReviewEntity = reportAppReviewService.get(reportAppReviewDto.getId());
        reportAppReviewEntity.setContents(reportAppReviewDto.getContents());

        // 유저 추가
        String userId = this.getCurrentUserId();
        reportAppReviewEntity.setUser(userService.get(userId));

        reportAppReviewService.add(reportAppReviewEntity);

        // URI 생성
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/report-apps/reviews/{id}").buildAndExpand(reportAppReviewEntity.getId()).toUri();
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("review",reportAppReviewEntity);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 리포트앱 리뷰 삭제
     * @param
     * @return ResultVO
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "리포트앱 리뷰 삭제",
            notes = "리포트앱 리뷰 삭제"
    )
    @RequestMapping(value = Path.REPORT_APPS_REVIEWS_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> delReportAppReviews(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="",
                    value ="리뷰 아이디"
            )
            @PathVariable String id

    ) throws Exception {
        // Valid Error 체크

        // 답글 수정
        ReportAppReviewEntity reportAppReviewEntity = reportAppReviewService.get(id);

        // 유저 추가
        String userId = this.getCurrentUserId();
        reportAppReviewEntity.setUser(userService.get(userId));

        reportAppReviewService.remove( reportAppReviewEntity );

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);

        return ResponseEntity.ok(resultVO);
    }


    ///////////////////////////////////////////////////////////////
    //
    // for indexing
    //
    ///////////////////////////////////////////////////////////////

    //    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "리포트앱 색인용 데이터 조회",
            notes = "리포트앱 색인용 데이터 조회"
    )
    @RequestMapping(value = Path.REPORT_APPS_INDICES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getIndices(
//            @ApiParam(
//                    defaultValue="bearer ",
//                    value ="토큰"
//            )
//            @RequestHeader(name = "Authorization") String authorization,
    ) throws Exception {

        List<ReportAppIndexVO> indices = reportAppService.getIndices();

        Map<String, Object> data = new HashMap<>();
        data.put("indices", indices);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

}
