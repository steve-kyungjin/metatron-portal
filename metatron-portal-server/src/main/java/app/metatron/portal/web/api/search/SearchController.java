package app.metatron.portal.web.api.search;

import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.exception.AccessDeniedException;
import app.metatron.portal.common.user.domain.MenuVO;
import app.metatron.portal.common.util.CommonUtil;
import app.metatron.portal.portal.search.service.ElasticSearchRelayService;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.user.service.IAService;
import app.metatron.portal.common.util.PageUtil;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * Class Name : SearchController
 * 
 * Class Description: SearchController Class
 *
 * Created by nogah on 2018-04-03.
 *
 * Version : v1.0
 *
 */
@Slf4j
@RestController
public class SearchController extends AbstractController{

    @Autowired
    private ElasticSearchRelayService elasticSearchRelayService;

    @Autowired
    private IAService iaService;
    /**
     * 자동완성 데이터 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "자동완성",
            notes = "자동완성"
    )
    @RequestMapping(value = Path.SEARCH_AUTO_COMPLETE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAutoCom(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue=" ",
                    value ="검색어"
            )
            @RequestParam(required = false) String keyword

    ){

        Map<String, Object> data = new HashMap<String, Object>();
        List<String> sortValue = new ArrayList<>();
        sortValue.add("createdDate,desc");
        String userId = this.getCurrentUserId();
        // 페이징 설정
        Pageable pageable = new PageRequest(
                0,// 페이지
                10, // Size
                PageUtil.getPageSort(sortValue)
        );
        Map<String, Object> result = elasticSearchRelayService.getAutoComplete(keyword,pageable);
        // elastic search no such index 검색결과 없음 처리
        if(result == null){
            result = CommonUtil.getEsEmptyData("keywordList", pageable);
        }
        data.put("autoComplete", result);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);;
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 전체 검색
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "전체 검색",
            notes = "전체 검색"
    )
    @RequestMapping(value = Path.SEARCH_ALL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getAppMain(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue=" ",
                    value ="검색어"
            )
            @RequestParam(required = false) String keyword

    ){

        Map<String, Object> data = new HashMap<String, Object>();
        List<String> sortValue = new ArrayList<>();
        sortValue.add("createdDate,desc");
        String userId = this.getCurrentUserId();
        // 페이징 설정
        Pageable pageable = new PageRequest(
                0,// 페이지
                3, // Size
                PageUtil.getPageSort(sortValue)
        );

        // 권한체크하여 검색
        List<MenuVO> menus = iaService.getMenuListFor1Depth(this.getCurrentUserId());
        menus.forEach(menu -> {
            switch(menu.getId()) {
                case Const.IA.APP_PLACE:
                    data.put("analysisApp", elasticSearchRelayService.getAnalysisApp(keyword,pageable));
                    data.put("reportApp", elasticSearchRelayService.getReportApp(keyword,pageable));
                    break;
                case Const.IA.COMMUNICATION:
                    data.put("communication", elasticSearchRelayService.getCommunication(keyword,pageable));
                    data.put("project", elasticSearchRelayService.getProject(keyword,pageable));
                    break;
                case Const.IA.METADATA:
                    data.put("metaTable", elasticSearchRelayService.getMetaTable(keyword,pageable));
                    data.put("metaColumn", elasticSearchRelayService.getMetaColumn(keyword,pageable));
                    break;
            }
        });

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * 타입 검색
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "타입 검색",
            notes = "타입 검색"
    )
    @RequestMapping(value = Path.SEARCH_TYPE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getTypeSearch(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String keyword,
            @ApiParam(
                    defaultValue=" ",
                    value ="Pageable"
            )
            @PageableDefault(sort = {"createdDate"}, direction = Sort.Direction.DESC) Pageable pageable

    ){
        boolean isAuth = false;
        Map<String, Object> data = new HashMap<String, Object>();

        if( Const.ElasticSearch.TYPE_COMMUNICATION.equals(type) && isAuth(Const.IA.COMMUNICATION)){
            data.put("result",elasticSearchRelayService.getCommunication(keyword, pageable));
        }else if( Const.ElasticSearch.TYPE_PROJECT.equals(type)  && isAuth(Const.IA.COMMUNICATION)){
            data.put("result",elasticSearchRelayService.getProject(keyword, pageable));
        }else if( Const.ElasticSearch.TYPE_REPORT_APP.equals(type)  && isAuth(Const.IA.APP_PLACE) ){
            data.put("result",elasticSearchRelayService.getReportApp(keyword, pageable));
        }else if( Const.ElasticSearch.TYPE_ANALYSIS_APP.equals(type)  && isAuth(Const.IA.APP_PLACE) ){
            data.put("result",elasticSearchRelayService.getAnalysisApp(keyword, pageable));
        }else if( Const.ElasticSearch.TYPE_META_TABLE.equals(type)  && isAuth(Const.IA.METADATA) ) {
            data.put("result",elasticSearchRelayService.getMetaTable(keyword, pageable));
        }else if( Const.ElasticSearch.TYPE_META_COLUMN.equals(type)  && isAuth(Const.IA.METADATA) ){
            data.put("result",elasticSearchRelayService.getMetaColumn(keyword, pageable));
        }else{
            throw new AccessDeniedException("권한이 없습니다.");
        }

//        HashMap<String ,Object> result = new HashMap<>();
//
//        result.put("total", 0);
//        result.put("contentsList", new ArrayList<>());
//        result.put("pageable", pageable);
//        data.put("result",result);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }



}
