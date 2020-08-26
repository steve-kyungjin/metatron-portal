package app.metatron.portal.web.api.common;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.file.domain.FileGroupEntity;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.file.domain.FileEntity;
import app.metatron.portal.common.file.service.FileGroupService;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class FileController extends AbstractController {

    @Autowired
    private FileGroupService fileGroupService;

    /**
     * 파일 목록
     * @return
     * @throws Exception
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "파일 목록",
            notes = "파일 목록"
    )
    @RequestMapping(value = Path.FILE_LIST, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getFileListByGroup(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam(value = "id", required = false) String id
    ) throws Exception{

        FileGroupEntity fileGroup = fileGroupService.get(id);

        Map<String, Object> data = new HashMap<>();
        data.put("fileGroup", fileGroup);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * 파일 업로드
     * @return
     * @throws Exception
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "파일 업로드",
            notes = "파일 업로드"
    )
    @RequestMapping(value = Path.FILE_UPLOAD, method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultVO> uploadFile(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam(value = "module", required = false) String module,
            @RequestParam(value = "groupId", required = false) String groupId,
            @RequestParam("file") MultipartFile file
    ) throws Exception{
        module = module == null? "": module;
        FileGroupEntity fileGroup = fileGroupService.addFile(groupId, file, module);

        Map<String, Object> data = new HashMap<>();
        data.put("fileGroup", fileGroup);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    @ApiOperation(
            value = "파일 다운로드",
            notes = "파일 다운로드"
    )
    @RequestMapping(value = Path.FILE_DOWNLOAD, method = RequestMethod.GET)
    public HttpEntity downloadFile(
            HttpServletResponse response,
            @ApiParam(
                    defaultValue = "",
                    value = "File id"
            )
            @PathVariable("id") String id
    ) throws Exception {

        FileEntity file = fileGroupService.getFile(id);
        if( file == null ) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        response.setContentType(file.getContentType());
        response.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(file.getOriginalNm(), "utf-8"));

        byte[] fileContents = fileGroupService.readFile(file);

        InputStream inputStream = new ByteArrayInputStream(fileContents);
        StreamUtils.copy(inputStream, response.getOutputStream());

        return new ResponseEntity(HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "파일 삭제",
            notes = "파일 삭제"
    )
    @RequestMapping(value = Path.FILE_LIST, method = RequestMethod.DELETE)
    public HttpEntity deleteFile(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "File group id"
            )
            @PathVariable("id") String id,
            @RequestParam(name = "delFileIds", required = false) List<String> delFileIds
            ) throws Exception {
        boolean result = false;
        if( delFileIds == null ) {
            result = fileGroupService.removeFiles(id);
        } else {
            result = fileGroupService.removeFiles(id, delFileIds);
        }

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }
}
