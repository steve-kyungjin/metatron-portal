package app.metatron.portal.web.api.analysis;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.user.service.UserService;
import app.metatron.portal.portal.analysis.domain.AnalysisAppDto;
import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.analysis.domain.AnalysisAppReviewDto;
import app.metatron.portal.portal.analysis.domain.AnalysisAppReviewEntity;
import app.metatron.portal.portal.log.domain.AppLogEntity;
import app.metatron.portal.portal.search.domain.AnalysisAppIndexVO;
import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.code.service.CodeService;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.value.ResultVO;
import app.metatron.portal.portal.analysis.service.AnalysisAppRecommendService;
import app.metatron.portal.portal.analysis.service.AnalysisAppReviewService;
import app.metatron.portal.portal.analysis.service.AnalysisAppService;
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
import java.util.*;

/*
 * Class Name : AppPlaceController
 * 
 * Class Description: AnalysisAppController Class
 *
 * Created by nogah on 2018-04-03.
 *
 * Version : v1.0
 *
 */
@Slf4j
@RestController
public class AnalysisAppController extends AbstractController{

    @Autowired
    private AnalysisAppService analysisAppService;

    @Autowired
    private AnalysisAppReviewService analysisAppReviewService;

    @Autowired
    private AnalysisAppRecommendService appRecommendService;

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
    @RequestMapping(value = Path.ANALYSIS_APPS_PAGE_MAIN, method = RequestMethod.GET)
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
                    AnalysisAppDto.PARAM param,
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
        List<CodeEntity> categoryList = codeService.listByGrpCdKey(Const.App.CATEGORY_ANALYSIS);
        data.put("categoryList", categoryList);

        // 분석앱 리스트
        Page<AnalysisAppEntity> analysisAppList  = analysisAppService.listBySearchValuesWithPage(param,pageable);
        data.put("analysisAppList", analysisAppList);

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
     * 분석앱 상세 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "분석앱 상세 (페이지 통합)",
            notes = "분석앱 상세 (페이지 통합)"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS_PAGE_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAnalysisAppDetail(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable String id
    ){

        String userId = this.getCurrentUserId();
        Map<String, Object> data = new HashMap<String, Object>();
        // 분석앱 상세정보
        AnalysisAppEntity analysisApp  = analysisAppService.get(id);
//        if( analysisApp.getDelYn()
//                || !analysisApp.getUseYn() ) {
//            throw new ResourceNotFoundException(id);
//        }

        data.put("analysisApp",analysisApp);
        // 분석앱 추가여부
        data.put("isAddedMyApp",analysisAppService.isAddedMyApp(id));
        // 분석앱에 대한 나의권한여부
        data.put("acceptableApp",analysisAppService.acceptableApp(id));

        // category
        List<String> categoryIds = new ArrayList<>();
        if( analysisApp.getCategories() != null ) {
            analysisApp.getCategories().forEach(category -> {
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
     * 분석앱 삭제
     * @return
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "분석앱 삭제",
            notes = "분석앱 삭제"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteAnalysisApp(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable String id
    ){

        analysisAppService.deleteAnalysisApp(id);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 분석 앱 리스트 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "분석앱 조회",
            notes = "분석앱 조회"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAnalysisAppList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            AnalysisAppDto.PARAM param,
            @PageableDefault(sort = {"createdDate"}, direction = Sort.Direction.DESC) Pageable pageable
    ){
        Map<String, Object> data = new HashMap<String, Object>();

        Page<AnalysisAppEntity> analysisAppList  = analysisAppService.listBySearchValuesWithPage(param,pageable);
        data.put("analysisAppList", analysisAppList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 분석 앱 Category 리스트 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "분석앱 Category 조회",
            notes = "분석앱 Category 조회"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS_CATEGORIES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAnalysisAppCategoryList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ){
        List<CodeEntity> categoryList = analysisAppService.getCategories();

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
            value = "카테고리별 분석앱 조회",
            notes = "카테고리별 분석앱 조회"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS_CODE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAnalysisAppListWithCode(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            AnalysisAppDto.PARAM param,
            @PageableDefault(sort = {"createdDate"}, direction = Sort.Direction.DESC) Pageable pageable
    ){

        String userId = this.getCurrentUserId();
        Map<String, Object> data = new HashMap<String, Object>();

        Page<AnalysisAppEntity> analysisAppList  = analysisAppService.listBySearchValuesWithPage(param,pageable);
        data.put("analysisAppList", analysisAppList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 분석앱 등록하기
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "분석앱 등록하기",
            notes = "분석앱 등록하기"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS, method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultVO> addAnalysisApp(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "분석 앱 정보",
                    required = true
            )
            @Valid
            AnalysisAppDto.CREATE analysisAppDto,
            @Valid @NotNull @RequestParam("files") MultipartFile[] files,
            BindingResult bindingResult

    ) throws Exception {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        // 분석앱 추가
        AnalysisAppEntity analysisAppEntity = analysisAppService.addAnalysisApp(analysisAppDto,files);

        // URI 생성
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path(Path.ANALYSIS_APPS_DETAIL).buildAndExpand(analysisAppEntity.getId()).toUri();
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
    @RequestMapping(value = Path.ANALYSIS_APPS_DETAIL, method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultVO> editAnalysisApp(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "분석 앱 정보",
                    required = true
            )
            @Valid AnalysisAppDto.EDIT analysisAppDto,
            @Valid @RequestParam("files") MultipartFile[] files,
            BindingResult bindingResult
    ) throws Exception{
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        // 분석앱 추가
        AnalysisAppEntity analysisAppEntity = analysisAppService.editAnalysisApp(analysisAppDto,files);

        // URI 생성
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path(Path.ANALYSIS_APPS_DETAIL).buildAndExpand(analysisAppEntity.getId()).toUri();
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
    @RequestMapping(value = Path.ANALYSIS_MY_APP_MAIN, method = RequestMethod.GET)
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
        data.put("myAppList", analysisAppService.getMyAppList(keyword, pageable));

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
    @RequestMapping(value = Path.ANALYSIS_MY_APP, method = RequestMethod.GET)
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
        data.put("myAppList", analysisAppService.getMyAppList(keyword, pageable));

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
    @RequestMapping(value = Path.ANALYSIS_MY_APP_DETAIL, method = RequestMethod.POST)
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

        analysisAppService.addMyApp(id);

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
    @RequestMapping(value = Path.ANALYSIS_MY_APP_DETAIL, method = RequestMethod.DELETE)
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

        analysisAppService.delMyApp(id);

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
    @RequestMapping(value = Path.ANALYSIS_MY_APP_DETAIL, method = RequestMethod.GET)
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
        analysisAppService.get(id);

        ResultVO resultVO = null;
        if( analysisAppService.acceptableApp(id) ) {
            Map<String, Object> result = analysisAppService.execMyApp(id);
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", result);
        } else {
            analysisAppService.delMyApp(id);
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 분석앱 리뷰보기
     * @param id
     * @return ResultVO
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "분석앱 리뷰상세 ",
            notes = "분석앱 리뷰상세"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS_REVIEWS_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAnalysisAppReviews(
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
        AnalysisAppReviewEntity review  = analysisAppReviewService.get(id);
        data.put("review",review);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", review);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 분석앱 리뷰보기 리스트보기
     * @param id
     * @return ResultVO
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "분석앱 리뷰 리스트보기",
            notes = "분석앱 리뷰 리스트보기"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS_ID_REVIEWS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAnalysisAppReviews(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="APP000001",
                    value ="분석앱 아이디"
            )
            @PathVariable String id,
            @ApiParam(
                    defaultValue="APP000001",
                    value ="페이징"
            )
            @PageableDefault(sort = {"createdDate"}, direction = Sort.Direction.DESC) Pageable pageable

    ){

        Map<String, Object> data = new HashMap<String, Object>();
        Page<AnalysisAppReviewEntity> reviewList  = analysisAppReviewService.listByAppId(id,pageable);
        data.put("reviewList",reviewList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 분석앱 등록하기
     * @param analysisAppReviewDto
     * @return ResultVO
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "분석앱 리뷰 등록하기",
            notes = "분석앱 리뷰 등록하기"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS_REVIEWS, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addAnalysisAppReviews(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "",
                    required = true
            )
            @RequestBody AnalysisAppReviewDto.CREATE analysisAppReviewDto,
            BindingResult bindingResult

    ) throws Exception {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        AnalysisAppReviewEntity analysisAppReviewEntity = new AnalysisAppReviewEntity();
        analysisAppReviewEntity.setApp( analysisAppService.get(analysisAppReviewDto.getAppId()));
        analysisAppReviewEntity.setContents(analysisAppReviewDto.getContents());

        // 답글인지 체크
        if( null != analysisAppReviewDto.getParent() ){
            AnalysisAppReviewEntity parent = analysisAppReviewService.get(analysisAppReviewDto.getParent());
            analysisAppReviewEntity.setParent(parent);
        }
        // 유저 추가
        String userId = this.getCurrentUserId();
        analysisAppReviewEntity.setUser(userService.get(userId));

        analysisAppReviewService.add(analysisAppReviewEntity);

        // URI 생성
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/analysis-apps/reviews/{id}").buildAndExpand(analysisAppReviewEntity.getId()).toUri();
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("review",analysisAppReviewEntity);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 분석앱 수정하기
     * @param analysisAppReviewDto
     * @return ResultVO
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "분석앱 리뷰 수정하기",
            notes = "분석앱 리뷰 수정하기"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS_REVIEWS, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> addAnalysisAppReviews(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    value = "",
                    required = true
            )
            @RequestBody AnalysisAppReviewDto.EDIT analysisAppReviewDto,
            BindingResult bindingResult

    ) throws Exception {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }
        // 답글 수정
        AnalysisAppReviewEntity analysisAppReviewEntity = analysisAppReviewService.get(analysisAppReviewDto.getId());
        analysisAppReviewEntity.setContents(analysisAppReviewDto.getContents());

        // 유저 추가
        String userId = this.getCurrentUserId();
        analysisAppReviewEntity.setUser(userService.get(userId));

        analysisAppReviewService.add(analysisAppReviewEntity);

        // URI 생성
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/analysis-apps/reviews/{id}").buildAndExpand(analysisAppReviewEntity.getId()).toUri();
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("review",analysisAppReviewEntity);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 분석앱 리뷰 삭제
     * @param
     * @return ResultVO
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "분석앱 리뷰 삭제",
            notes = "분석앱 리뷰 삭제"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS_REVIEWS_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> delAnalysisAppReviews(
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
        AnalysisAppReviewEntity analysisAppReviewEntity = analysisAppReviewService.get(id);


        // 유저 추가
        String userId = this.getCurrentUserId();
        analysisAppReviewEntity.setUser(userService.get(userId));

        analysisAppReviewService.remove( analysisAppReviewEntity );

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
            value = "분석앱 색인용 데이터 조회",
            notes = "분석앱 색인용 데이터 조회"
    )
    @RequestMapping(value = Path.ANALYSIS_APPS_INDICES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getIndices(
//            @ApiParam(
//                    defaultValue="bearer ",
//                    value ="토큰"
//            )
//            @RequestHeader(name = "Authorization") String authorization,
    ) throws Exception {

        List<AnalysisAppIndexVO> indices = analysisAppService.getIndices();

        Map<String, Object> data = new HashMap<>();
        data.put("indices", indices);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

}
