package app.metatron.portal.web.api.common;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.zipcode.domain.ZipCodeDto;
//import app.metatron.portal.common.user.domain.RoleEntity;
import app.metatron.portal.common.value.ResultVO;
import app.metatron.portal.common.zipcode.service.ZipCodeService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * Class Name : ZipCodeController
 * 
 * Class Description: ZipCodeController Class
 *
 * Created by nogah on 2018-05-14.
 *
 * Version : v1.0
 *
 */
@RestController
public class ZipCodeController {

    @Autowired
    private ZipCodeService zipCodeService;

    /**
     * 시도 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "시도 조회",
            notes = "시도 조회"
    )
    @RequestMapping(value = Path.ZIPCODE_SIDO, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSido(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ){

        List<ZipCodeDto.Sido> zipCodeList = zipCodeService.getSidoList();
//
        Map<String, Object> data = new HashMap<>();
        data.put("zipCodeList", zipCodeList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 시군구 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "시군구 조회",
            notes = "시군구 조회"
    )
    @RequestMapping(value = Path.ZIPCODE_SIGUNGU, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getSigungu(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable(name = "sido-nm") String sidoNm
    ){

        List<ZipCodeDto.SigunguExp> zipCodeList = zipCodeService.getSigunguList(sidoNm);
//
        Map<String, Object> data = new HashMap<>();
        data.put("zipCodeList", zipCodeList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 동 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "동 조회",
            notes = "동 조회"
    )
    @RequestMapping(value = Path.ZIPCODE_DONG, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getDong(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable(name = "sido-nm") String sidoNm,
            @PathVariable(name = "sigungu-nm") String sigunguNm
    ){
        if("null".equals(sigunguNm)){
            sigunguNm= "";
        }
        List<ZipCodeDto.Dong> zipCodeList = zipCodeService.getDongList(sidoNm,sigunguNm);
//
        Map<String, Object> data = new HashMap<>();
        data.put("zipCodeList", zipCodeList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "우편번호 조회",
            notes = "우편번호 조회"
    )
    @RequestMapping(value = Path.ZIPCODE, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> getZipCodes(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "{ \"sido\": [\"서울특별시\", \"경기도\"]," +
                            "\"sigungu\": [\"\", \"\"]," +
                            "\"dong\": [\"\", \"\"]" +
                            " }",
                    value = "시도"
            )
            @RequestBody ZipCodeDto.PARAM param
    ) {

        List<ZipCodeDto.Zipcode> zipCodeList = zipCodeService.getZipCodeList(param);
        Map<String, Object> data = new HashMap<>();
        data.put("zipCodeList", zipCodeList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

//    @PreAuthorize("permitAll()")
//    @ApiOperation(
//            value = "우편번호 폴리곤 조회",
//            notes = "우편번호 폴리곤 조회"
//    )
//    @RequestMapping(value = Path.ZIPCODE_POLYGON, method = RequestMethod.POST)
//    public ResponseEntity<ResultVO> getZipCodePolygon(
//            @ApiParam(
//                    defaultValue="bearer ",
//                    value ="토큰"
//            )
//            @RequestHeader(name = "Authorization") String authorization,
//            @ApiParam(
//                    defaultValue = "{ \"sido\": [\"서울특별시\", \"경기도\"]," +
//                            "\"sigungu\": [\"\", \"\"]," +
//                            "\"dong\": [\"\", \"\"]" +
//                            " }",
//                    value = "시도"
//            )
//            @RequestBody ZipCodeDto.PARAM param
//    ) {
//
//        List<ZipCodeDto.Zipcode> zipCodeList = zipCodeService.getZipCodeList(param/*, true*/);
//        Map<String, Object> data = new HashMap<>();
//        data.put("zipCodeList", zipCodeList);
//
//        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
//        return ResponseEntity.ok(resultVO);
//    }
}
