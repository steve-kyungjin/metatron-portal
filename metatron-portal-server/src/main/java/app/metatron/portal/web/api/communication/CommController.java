package app.metatron.portal.web.api.communication;

import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.constant.Path;
import app.metatron.portal.common.controller.AbstractController;
import app.metatron.portal.common.exception.BadRequestException;
import app.metatron.portal.common.exception.ResourceNotFoundException;
import app.metatron.portal.common.media.service.MediaService;
import app.metatron.portal.portal.communication.domain.*;
import app.metatron.portal.portal.communication.service.CommMasterService;
import app.metatron.portal.portal.communication.service.CommPostService;
import app.metatron.portal.portal.search.domain.CommunicationIndexVO;
import app.metatron.portal.common.media.domain.MediaGroupEntity;
import app.metatron.portal.common.value.ResultVO;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class CommController extends AbstractController {

    @Autowired
    private CommMasterService masterService;

    @Autowired
    private CommPostService postService;

    @Autowired
    private MediaService mediaService;

    /**
     * communication master list
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "communication master list",
            notes = "communication master list"
    )
    @RequestMapping(value = Path.COMMUNICATION, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommMasters(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            Pageable pageable
    ) {

        Page<CommMasterEntity> masterList = masterService.getMasterList(pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("masterList", masterList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication master list by post type
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication master list by post type",
            notes = "communication master list by post type"
    )
    @RequestMapping(value = Path.COMMUNICATION_BY_TYPE, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommMasters(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="WORKFLOW",
                    value ="post type : NOTICE, GENERAL, WORKFLOW"
            )
            @RequestParam(name = "postType") String type
    ) {
        CommMasterEntity.PostType postType = StringUtils.isEmpty(type)? null: CommMasterEntity.PostType.valueOf(type);
        List<CommMasterEntity> masterList = masterService.getMasterListByPostType(postType);

        Map<String, Object> data = new HashMap<>();
        data.put("masterList", masterList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication master detail
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication master detail",
            notes = "communication master detail"
    )
    @RequestMapping(value = Path.COMMUNICATION_MASTER, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommMaster(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug
    ) {

        CommMasterEntity master = masterService.getOneBySlug(slug);
        if( master == null ) {
            throw new ResourceNotFoundException(slug);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("master", master);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication master add
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "communication master add",
            notes = "communication master add"
    )
    @RequestMapping(value = Path.COMMUNICATION, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addCommMaster(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid @RequestBody CommDto.Master master,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        boolean result = masterService.addMaster(master);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication master edit
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "communication master edit",
            notes = "communication master edit"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> editCommMaster(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @Valid @RequestBody CommDto.Master master,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        boolean result = masterService.editMaster(slug, master);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication master delete
     */
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "communication master delete",
            notes = "communication master delete"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> editCommMaster(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug
    ) {

        boolean result = masterService.deleteMaster(slug);

        ResultVO resultVO = null;
        if( result ) {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        } else {
            resultVO = new ResultVO(Const.Common.RESULT_CODE.FAIL, "", null);
        }
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post list
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post list",
            notes = "communication post list"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommPosts(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @ApiParam(
                    defaultValue="REQUESTED",
                    value ="status"
            )
            @RequestParam(name = "status", required = false) String statusStr,
            @ApiParam(
                    defaultValue="",
                    value ="keyword"
            )
            @RequestParam(name = "keyword", required = false) String keyword,
            Pageable pageable
    ) {
        CommMasterEntity master = masterService.getOneBySlug(slug);
        if( master == null ) {
            throw new ResourceNotFoundException(slug);
        }
        PostStatus status = StringUtils.isEmpty(statusStr)? null: PostStatus.valueOf(statusStr.toUpperCase());
        Page<CommPostEntity> postList = postService.getPostList(slug, status, keyword, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("postList", postList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * Media 업로드
     * @return
     * @throws Exception
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "Media 업로드",
            notes = "Media 업로드"
    )
    @RequestMapping(value = Path.COMMUNICATION_MEDIA_UPLOAD, method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultVO> uploadMedia(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam("file") MultipartFile file
    ) throws Exception{

        MediaGroupEntity mediaGroup = mediaService.saveCommunication(file);

        Map<String, Object> data = new HashMap<>();
        data.put("mediaGroup", mediaGroup);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * Media 업로드 Change
     * @return
     * @throws Exception
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "Media 업로드 Change",
            notes = "Media 업로드 Change"
    )
    @RequestMapping(value = Path.COMMUNICATION_MEDIA_UPLOAD_CHANGE, method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultVO> uploadMediaChange(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @PathVariable("id") String id,
            @RequestParam("file") MultipartFile file
    ) throws Exception{

        MediaGroupEntity mediaGroup = mediaService.changeCommunication(id, file);

        Map<String, Object> data = new HashMap<>();
        data.put("mediaGroup", mediaGroup);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * Media 업로드 delete
     * @return
     * @throws Exception
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "Media 업로드 delete",
            notes = "Media 업로드 delete"
    )
    @RequestMapping(value = Path.COMMUNICATION_MEDIA_UPLOAD_CHANGE, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteMedia(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue = "",
                    value = "media group id"
            )
            @PathVariable("id") String id
    ) throws Exception{

        postService.removeMedia(id);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post add
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post add",
            notes = "communication post add"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addCommPost(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @Valid @RequestBody CommDto.Post postDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        CommPostEntity post = postService.addPost(slug, postDto);

        Map<String, Object> data = new HashMap<>();
        data.put("post", post);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post edit
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post edit",
            notes = "communication post edit"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> editCommPost(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @PathVariable(name = "id") String id,
            @Valid @RequestBody CommDto.Post postDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        postDto.setId(id);
        CommPostEntity post = postService.editPost(slug, postDto);

        Map<String, Object> data = new HashMap<>();
        data.put("post", post);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post edit for worker
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post edit for worker",
            notes = "communication post edit for worker"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_WORKER, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> editCommPostForWorker(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @PathVariable(name = "id") String id,
            @Valid @RequestBody CommDto.PostWorker workerDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        workerDto.setId(id);
        CommPostEntity post = postService.editPostForWorker(workerDto);

        Map<String, Object> data = new HashMap<>();
        data.put("post", post);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post delete
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post delete",
            notes = "communication post delete"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteCommPost(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @PathVariable(name = "id") String id
    ) {

        postService.removePost(slug, id);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post detail
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post detail",
            notes = "communication post detail"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_DETAIL, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommPost(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @ApiParam(
                    defaultValue="PP0000012",
                    value ="post id"
            )
            @PathVariable(name = "id") String id
    ) {

        CommPostEntity post = postService.getPost(slug, id);
        if(post == null) {
            throw new ResourceNotFoundException(slug);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("post", post);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post get draft
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post get draft",
            notes = "communication post get draft"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_DRAFT, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommDraftPost(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug
    ) {

        CommPostEntity draft = postService.getDraftPost(slug);

        Map<String, Object> data = new HashMap<>();
        data.put("draft", draft);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post delete draft
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post delete draft",
            notes = "communication post delete draft"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_DRAFT, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> deleteCommDraftPost(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug
    ) {

        postService.removeDraftPost(slug);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);

        return ResponseEntity.ok(resultVO);
    }


    /**
     * communication post replies
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post replies",
            notes = "communication post replies"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_REPLIES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommPostReplies(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @ApiParam(
                    defaultValue="PP0000012",
                    value ="post id"
            )
            @PathVariable(name = "id") String id
    ) {
        List<CommReplyEntity> postReplyList = postService.getPostReplyList(slug, id);

        Map<String, Object> data = new HashMap<>();
        data.put("postReplyList", postReplyList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post reply add
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post reply add",
            notes = "communication post reply add"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_REPLIES, method = RequestMethod.POST)
    public ResponseEntity<ResultVO> addCommPostReply(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @ApiParam(
                    defaultValue="PP0000012",
                    value ="post id"
            )
            @PathVariable(name = "id") String id,
            @Valid @RequestBody CommDto.Reply replyDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        CommReplyEntity reply = postService.addPostReply(slug, id, replyDto);

        Map<String, Object> data = new HashMap<>();
        data.put("reply", reply);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post reply edit
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post reply edit",
            notes = "communication post reply edit"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_REPLIES_DETAIL, method = RequestMethod.PUT)
    public ResponseEntity<ResultVO> editCommPostReply(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @ApiParam(
                    defaultValue="PP0000012",
                    value ="post id"
            )
            @PathVariable(name = "id") String id,
            @ApiParam(
                    defaultValue="PR0000001",
                    value ="post reply id"
            )
            @PathVariable(name = "replyId") String replyId,
            @Valid @RequestBody CommDto.Reply replyDto,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        replyDto.setId(replyId);
        CommReplyEntity reply = postService.editPostReply(slug, id, replyDto);

        Map<String, Object> data = new HashMap<>();
        data.put("reply", reply);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post reply delete
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post reply delete",
            notes = "communication post reply delete"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_REPLIES_DETAIL, method = RequestMethod.DELETE)
    public ResponseEntity<ResultVO> editCommPostReply(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @ApiParam(
                    defaultValue="magazine",
                    value ="slug"
            )
            @PathVariable(name = "slug") String slug,
            @ApiParam(
                    defaultValue="PP0000012",
                    value ="post id"
            )
            @PathVariable(name = "id") String id,
            @ApiParam(
                    defaultValue="PR0000001",
                    value ="post reply id"
            )
            @PathVariable(name = "replyId") String replyId,
            @ApiParam(
                    defaultValue="",
                    value ="post status"
            )
            @RequestParam(name = "status", required = false) String status
    ) {
        PostStatus postStatus = StringUtils.isEmpty(status)? null: PostStatus.valueOf(status);
        postService.removePostReply(replyId, postStatus);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", null);
        return ResponseEntity.ok(resultVO);
    }


    /**
     * communication my posts
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication my posts",
            notes = "communication my posts"
    )
    @RequestMapping(value = Path.COMMUNICATION_MY_POSTS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommMyPosts(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        List<CommDto.SimplePost> postList = postService.getMyPostList();

        Map<String, Object> data = new HashMap<>();
        data.put("postList", postList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication my replies
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication my replies",
            notes = "communication my replies"
    )
    @RequestMapping(value = Path.COMMUNICATION_POSTS_MY_REPLIES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommPostMyReplies(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        List<CommReplyEntity> postReplyList = postService.getMyPostReplyList();

        Map<String, Object> data = new HashMap<>();
        data.put("postReplyList", postReplyList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication replies to my posts
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication replies to my posts",
            notes = "communication replies to my posts"
    )
    @RequestMapping(value = Path.COMMUNICATION_REPLIES_TO_MY_POSTS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommPostRepliesToMyPosts(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        List<CommReplyEntity> postReplyList = postService.getReplyListToMyPost();

        Map<String, Object> data = new HashMap<>();
        data.put("postReplyList", postReplyList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    ///////////////////////////////////////////////////////////////
    //
    // Landing
    //
    ///////////////////////////////////////////////////////////////

    /**
     * communication summary
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication summary",
            notes = "communication summary"
    )
    @RequestMapping(value = Path.COMMUNICATION_SUMMARY, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommSummary(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization
    ) {
        Map<String, Integer> allCount = postService.getSummaryCount(false);
        Map<String, Integer> myCount = postService.getSummaryCount(true);
        Map<String, Integer> noticeCount = postService.getSummaryNoticeCount();

        Map<String, Object> data = new HashMap<>();
        data.put("allCount", allCount);
        data.put("myCount", myCount);
        data.put("noticeCount", noticeCount);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    /**
     * communication post all list
     */
    @PreAuthorize("hasAuthority('DEFAULT_USER')")
    @ApiOperation(
            value = "communication post all list",
            notes = "communication post all list"
    )
    @RequestMapping(value = Path.COMMUNICATION_ALL_POSTS, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getCommAllPosts(
            @ApiParam(
                    defaultValue="bearer ",
                    value ="토큰"
            )
            @RequestHeader(name = "Authorization") String authorization,
            @Valid CommDto.Filter filter,
            Pageable pageable,
            BindingResult bindingResult
    ) {
        // Valid Error 체크
        if( bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult);
        }

        Page<CommPostEntity> postList = postService.getAllPostList(filter, pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("postList", postList);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);
        return ResponseEntity.ok(resultVO);
    }

    ///////////////////////////////////////////////////////////////
    //
    // for indexing
    //
    ///////////////////////////////////////////////////////////////

    //    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    @ApiOperation(
            value = "communication 색인용 데이터 조회",
            notes = "communication 색인용 데이터 조회"
    )
    @RequestMapping(value = Path.COMMUNICATION_INDICES, method = RequestMethod.GET)
    public ResponseEntity<ResultVO> getIndices(
//            @ApiParam(
//                    defaultValue="bearer ",
//                    value ="토큰"
//            )
//            @RequestHeader(name = "Authorization") String authorization,
            Pageable pageable
    ) throws Exception {

        Page<CommunicationIndexVO> indices = postService.getIndices(pageable);

        Map<String, Object> data = new HashMap<>();
        data.put("indices", indices);

        ResultVO resultVO = new ResultVO(Const.Common.RESULT_CODE.SUCCESS, "", data);

        return ResponseEntity.ok(resultVO);
    }
}
