package app.metatron.portal.web.api.common;

import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.media.domain.MediaEntity;
import app.metatron.portal.common.media.service.MediaService;
import app.metatron.portal.common.util.media.MediaUtil;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

@RestController
public class MediaController extends AbstractController {

    @Autowired
    private MediaService mediaService;

    @ApiOperation(
            value = "이미지 뷰어",
            notes = "이미지 뷰어"
    )
    @RequestMapping(value = Path.MEDIA_VIEW, method = RequestMethod.GET)
    public HttpEntity view(
            HttpServletResponse response,
            @PathVariable("id") String id
    ) throws Exception {

        return viewByType(response, id, MediaUtil.MEDIA_TYPE_LARGE);
    }

    @ApiOperation(
            value = "이미지 뷰어",
            notes = "이미지 뷰어"
    )
    @RequestMapping(value = Path.MEDIA_VIEW_TYPE, method = RequestMethod.GET)
    public HttpEntity viewByType(
            HttpServletResponse response,
            @PathVariable("id") String id,
            @ApiParam(
                    defaultValue = "L",
                    value = "L : large, T : thumbnail, P : profile(thumbnail)"
            )
            @PathVariable("type") String type
    ) throws Exception {

        MediaEntity media = mediaService.loadMedia(id);
        if( media == null ) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        response.setContentType(media.getContentType());

        byte[] mediaContents = null;
        if( media.getContents() == null || media.getContents().length == 0 ) {
            mediaContents = media.getThumbnail();
        } else {
            if( MediaUtil.MEDIA_TYPE_LARGE.equals(type.toUpperCase()) ) {
                mediaContents = media.getContents();
            } else {
                // T, P
                mediaContents = media.getThumbnail();
            }
        }

        InputStream inputStream = new ByteArrayInputStream(mediaContents);
        StreamUtils.copy(inputStream, response.getOutputStream());

        return new ResponseEntity(HttpStatus.OK);
    }

}
