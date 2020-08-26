package app.metatron.portal.web.api.user;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.user.domain.MenuVO;
import app.metatron.portal.common.user.domain.UserDto;
import app.metatron.portal.common.user.domain.UserEmailVO;
import app.metatron.portal.common.user.service.RoleGroupService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import app.metatron.portal.common.user.service.UserService;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * Class Name : CodeController
 * 
 * Class Description: CodeController Class
 *
 * Created by nogah on 2018-03-05.
 *
 * Version : v1.0
 *
 */
@RestController
public class UserController extends AbstractController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleGroupService roleGroupService;

    /**
     * 메타트론 경로
     */
    @Value("${app.sso.metatron-url}")
    private String metatronUrl;

    /**
     * 사용자 리스트 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "사용자 리스트 조회",
            notes = "사용자 리스트 조회"
    )
    @RequestMapping(value = Path.USER, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getUserList(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="",
                    value ="keyword : userNm, userId"
            )
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ){
        Page<UserDto.User> userList = userService.getUserListWithInsecure(keyword, pageable);
        Map<String, Object> data = new HashMap<>();
        data.put("userList", userList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 사용자 email search
     * @return
     */
//    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "Metatron Portal",
            notes = "사용자 email search"
    )
    @RequestMapping(value = Path.USER_SEARCH_EMAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getUserEmailList(
//            @ApiParam(
//                    defaultValue="bearer ",
//                    value ="토큰"
//            )
//            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam(name = "keyword", required = false) String keyword
    ){

        List<UserEmailVO> userEmailList = userService.getUserSearchEmailList(keyword);
        Map<String, Object> data = new HashMap<>();
        data.put("emailList", userEmailList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 사용자 리스트 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "Metatron Portal",
            notes = "사용자 조회"
    )
    @RequestMapping(value=Path.USER_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO>  getUser(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "admin",
                    value = "User ID"
            )
            @PathVariable("id") String id
    ){

        UserDto.User user = userService.getUserWithInsecure(id);
        List<MenuVO.IAAndPermission> iaAndPermissionList = roleGroupService.getIAAndPermissionListByUserId(id);

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("user", user);
        data.put("iaAndPermissionList", iaAndPermissionList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }


    /**
     * 사용자 시작 페이지 조회
     * @param authorization
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "User's start page",
            notes = "사용자 시작 페이지 조회"
    )
    @RequestMapping(value=Path.USER_START_PAGE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO>  getUserStartPage(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ){

        String startPage = userService.getStartPage(this.getCurrentUserId());

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("startPage", startPage);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 사용자 시작 페이지 설정
     * @param authorization
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "User's start page",
            notes = "사용자 시작 페이지 설정"
    )
    @RequestMapping(value=Path.USER_START_PAGE, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO>  updateUserStartPage(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="http://www.google.co.kr",
                    value ="시작 페이지"
            )
            @RequestParam(name = "startPage") String startPage
    ){

        userService.updateStartPage(this.getCurrentUserId(), startPage);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 로그인 사용자 정보 조회
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "로그인 사용자 정보 조회",
            notes = "로그인 사용자 정보 조회"
    )
    @RequestMapping(value=Path.USER_ME, method = RequestMethod.GET)
    public ResponseEntity<ResultVO>  getUserMe(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ){
        String userId = this.getCurrentUserId();
        if( userId == null ) {
            throw  new BadRequestException("Need Authorization");
        }

        UserDto.User user = userService.getUserWithInsecure(userId);
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("user", user);
        data.put("metatronUrl", metatronUrl);
        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 사용자 프로필 업로드
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "사용자 프로필 업로드",
            notes = "사용자 프로필 업로드"
    )
    @RequestMapping(value=Path.USER_PROFILE, method = RequestMethod.POST)
    public ResponseEntity<ResultVO>  uploadUserProfile(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        userService.uploadUserProfile(file);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);

        return ResponseEntity.ok(resultVO);
    }

    /**
     * 사용자 프로필 삭제
     * @return
     */
    @PreAuthorize("permitAll()")
    @ApiOperation(
            value = "사용자 프로필 삭제",
            notes = "사용자 프로필 삭제"
    )
    @RequestMapping(value=Path.USER_PROFILE, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO>  deleteUploadedUserProfile(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        userService.deleteUploadedUserProfile();

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);

        return ResponseEntity.ok(resultVO);
    }
}
