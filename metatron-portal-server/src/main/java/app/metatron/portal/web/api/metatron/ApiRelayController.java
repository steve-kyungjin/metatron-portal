package app.metatron.portal.web.api.metatron;

import app.metatron.portal.common.constant.Path;
import app.metatron.portal.portal.metatron.service.MetatronRelayService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = Path.API)
public class ApiRelayController {

    private final String AUTHORIZATION_METATRON = "Authorization-Metatron";

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    private final MetatronRelayService metatronRelayService;

    @Autowired
    public ApiRelayController(MetatronRelayService metatronRelayService) {
        this.metatronRelayService = metatronRelayService;
    }

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Getter & Setter
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /**
     * 워크스페이스 조회 ( 워크스페이스 Root 내 컨텐츠 목록 조회 )
     *
     * @param token
     * @return
     */
    @SuppressWarnings("JavaDoc")
    @RequestMapping(value = Path.METATRON + "/workspace", method = RequestMethod.GET)
    @ApiOperation(
            value = "get Metatron Workspace API",
            notes = "get Metatron Workspace API"
    )
    public Object getMetatronMyWorkspace(@RequestHeader(value = AUTHORIZATION_METATRON) final String token) {
        return metatronRelayService.getMtApi(token, "/api/workspaces/my?projection=forDetailView");
    }

    /**
     * 워크스페이스 아이디로 워크스페이스 조회 ( 워크스페이스 Root 내 컨텐츠 목록 조회 )
     *
     * @param token
     * @param workspaceId
     * @return
     */
    @SuppressWarnings("JavaDoc")
    @RequestMapping(value = Path.METATRON + "/workspace/{workspaceId}", method = RequestMethod.GET)
    @ApiOperation(
            value = "get Metatron Workspace API",
            notes = "get Metatron Workspace API"
    )
    public Object getMetatronWorkspaceById(@RequestHeader(value = AUTHORIZATION_METATRON) final String token,
                                           @SuppressWarnings("DefaultAnnotationParam")
                                           @PathVariable() final String workspaceId) {
        return metatronRelayService.getMtApi(token, "/api/workspaces/" + workspaceId + "?projection=forDetailView");
    }

    /**
     * 워크스페이스 폴더 조회 ( 폴더 내 컨텐츠 목록 조회 )
     *
     * @param token
     * @param id
     * @return
     */
    @SuppressWarnings("JavaDoc")
    @RequestMapping(value = Path.METATRON + "/books/{id}", method = RequestMethod.GET)
    @ApiOperation(
            value = "get Metatron Workspace Folder API",
            notes = "get Metatron Workspace Folder API"
    )
    public Object getMetatronWorkspaceFolder(@RequestHeader(value = AUTHORIZATION_METATRON) final String token,
                                             @SuppressWarnings("DefaultAnnotationParam")
                                             @PathVariable() final String id) {
        return metatronRelayService.getMtApi(token, "/api/books/" + id + "?projection=forListWithWorkspaceView");
    }

    /**
     * 워크북 상세 정보 조회
     *
     * @param token
     * @return
     * @throws Exception
     */
    @SuppressWarnings("JavaDoc")
    @RequestMapping(value = Path.METATRON + "/workbook/{id}", method = RequestMethod.GET)
    @ApiOperation(
            value = "get Metatron Workbook Detail API",
            notes = "get Metatron Workbook Detail API"
    )
    public Object getMetatronWorkbookDetail(@RequestHeader(value = AUTHORIZATION_METATRON) final String token,
                                            @SuppressWarnings("DefaultAnnotationParam")
                                            @PathVariable() final String id) {
        return metatronRelayService.getMtApi(token, "/api/workbooks/" + id + "?projection=forDetailView");
    }

    /**
     * 워크북 하위 대시보드 목록
     *
     * @param token
     * @return
     * @throws Exception
     */
    @SuppressWarnings("JavaDoc")
    @RequestMapping(value = Path.METATRON + "/workbooks/{id}/dashboards", method = RequestMethod.GET)
    @ApiOperation(
            value = "get Metatron Workbook In Dashboard List API",
            notes = "get Metatron Workbook In Dashboard List API"
    )
    public Object getMetatronWorkbookInDashboardList(@RequestHeader(value = AUTHORIZATION_METATRON) final String token,
                                                     @SuppressWarnings("DefaultAnnotationParam")
                                                     @PathVariable() final String id) {
        return metatronRelayService.getMtApi(token, "/api/workbooks/" + id + "?projection=forListView");
    }

    /**
     * 권한 있는 공유 워크스페이스 목록 조회
     *
     * @param token
     * @return
     * @throws Exception
     */
    @SuppressWarnings("JavaDoc")
    @RequestMapping(value = Path.METATRON + "/my/public/workspaces", method = RequestMethod.GET)
    @ApiOperation(
            value = "get Metatron Public Workspace List API",
            notes = "get Metatron Public Workspace List API"
    )
    public Object getMetatronPublicWorkspaceList(@RequestHeader(value = AUTHORIZATION_METATRON) final String token) {
        return metatronRelayService.getMtApi(token, "/api/workspaces/my/public?projection=forListView&size=5000&page=0&sort=createdTime,asc");
    }

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
