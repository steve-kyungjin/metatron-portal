package app.metatron.portal.portal.communication.service;

import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.common.util.CommonUtil;
import app.metatron.portal.portal.analysis.domain.AnalysisAppEntity;
import app.metatron.portal.portal.analysis.domain.AnalysisAppRoleGroupRelEntity;
import app.metatron.portal.portal.communication.domain.*;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.common.user.service.RoleGroupService;
import app.metatron.portal.portal.communication.repository.CommPostUserRelRepository;
import app.metatron.portal.portal.email.domain.EmailSendEntity;
import app.metatron.portal.portal.email.domain.EmailVO;
import app.metatron.portal.portal.email.service.EmailService;
import app.metatron.portal.common.file.domain.FileGroupEntity;
import app.metatron.portal.common.file.service.FileGroupService;
import app.metatron.portal.common.media.domain.MediaGroupEntity;
import app.metatron.portal.common.media.service.MediaService;
import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.common.user.service.UserService;
import app.metatron.portal.common.util.HtmlUtil;
import app.metatron.portal.portal.communication.repository.CommPostRepository;
import app.metatron.portal.portal.communication.repository.CommReplyRepository;
import app.metatron.portal.portal.search.domain.CommunicationIndexVO;
import app.metatron.portal.portal.search.service.ElasticSearchRelayService;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.LocalDateTime;
import org.joda.time.format.DateTimeFormat;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 포스트 서비스
 */
@Slf4j
@Transactional
@Service
public class CommPostService extends AbstractGenericService<CommPostEntity, String> {

    @Autowired
    private CommPostRepository postRepository;

    @Autowired
    private CommReplyRepository replyRepository;

    @Autowired
    private CommPostUserRelRepository userRelRepository;

    @Autowired
    private CommMasterService masterService;

    @Autowired
    private MediaService mediaService;

    @Autowired
    private FileGroupService fileGroupService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ElasticSearchRelayService searchService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RoleGroupService roleGroupService;

    @Override
    protected JpaRepository<CommPostEntity, String> getRepository() {
        return postRepository;
    }

    /**
     * 포스트 추가
     * @param slug
     * @param postDto
     * @return
     */
    public CommPostEntity addPost(String slug, CommDto.Post postDto) {
        postDto.setId(null);
        CommPostEntity post = modelMapper.map(postDto, CommPostEntity.class);

        CommMasterEntity master = masterService.getOneBySlug(slug);
        post.setMaster(master);

        // remove script tag
        post.setContent(HtmlUtil.removeTags(post.getContent()));

        // 검색용 태그제거 본문
        if( !StringUtils.isEmpty(postDto.getContent()) ) {
            post.setStrippedContent(HtmlUtil.removeTag(postDto.getContent()));
        }

        if( !StringUtils.isEmpty(postDto.getFileGroupId())) {
            FileGroupEntity fileGroup = fileGroupService.getFileGroup(postDto.getFileGroupId());
            post.setFileGroup(fileGroup);
        }

        if( !StringUtils.isEmpty(postDto.getMediaGroupId()) ) {
            MediaGroupEntity mediaGroup = mediaService.getMediaGroup(postDto.getMediaGroupId());
            post.setMediaGroup(mediaGroup);
        }

        if( !StringUtils.isEmpty(postDto.getAttachGroupId()) ) {
            FileGroupEntity attachGroup = fileGroupService.getFileGroup(postDto.getAttachGroupId());
            post.setAttachGroup(attachGroup);
        }

        // 요청형이면 등록시 요청상태 처리
        if( master.getPostType() == CommMasterEntity.PostType.WORKFLOW ) {
            post.setStatus(PostStatus.REQUESTED);
        }

        this.setCreateUserInfo(post);

        // 등록자 변경
        if( !StringUtils.isEmpty(postDto.getCreatedById()) ) {
            post.setCreatedBy(userService.get(postDto.getCreatedById()));
        }

        // 등록일 변경
        if( !StringUtils.isEmpty(postDto.getCreatedDateStr())) {
            post.setCreatedDate(LocalDateTime.parse(postDto.getCreatedDateStr(), DateTimeFormat.forPattern("yyyy-MM-dd HH:mm")));
        }

        // 담당자
        if( !StringUtils.isEmpty(postDto.getWorkerId()) ) {
            UserEntity worker = userService.get(postDto.getWorkerId());
            post.setWorker(worker);
        }

        // 롤 리스트
        List<CommRoleGroupRelEntity> commRoleGroupRelEntities = new ArrayList<>();
        // 권한 추가
        if( postDto.getRoleIds() != null ) {
            postDto.getRoleIds().forEach(roleGroup -> {
                Optional.of(roleGroupService.get(roleGroup)).ifPresent( rg -> {
                    commRoleGroupRelEntities.add(CommonUtil.getCommRoleGroupEntity(rg, post));
                });
            });
            post.setRoleRel(commRoleGroupRelEntities);
        }

        postRepository.save(post);

        // 처리자
        if( postDto.getCoworkerIds() != null && postDto.getCoworkerIds().size() > 0 ) {
            for(int i=0; i<postDto.getCoworkerIds().size(); i++) {
                CommPostUserRelEntity rel = new CommPostUserRelEntity();
                rel.setPost(post);
                rel.setUser(userService.get(postDto.getCoworkerIds().get(i)));
                rel.setDispOrder(i);
                this.setCreateUserInfo(rel);
                userRelRepository.save(rel);
            }
        }

        // send email
        if( post.getMaster().getPostType() == CommMasterEntity.PostType.WORKFLOW ) {
            this.sendEmailByRegist(post);
        }

        return post;
    }

    /**
     * 포스트 수정
     * @param slug
     * @param postDto
     * @return
     */
    public CommPostEntity editPost(String slug, CommDto.Post postDto) {
        if( StringUtils.isEmpty(postDto.getId()) ) {
            return null;
        }

        CommPostEntity post = postRepository.findOne(postDto.getId());

        // 마스터 변경시
        if( !StringUtils.isEmpty(postDto.getChangedSlug()) ) {
            CommMasterEntity changedMaster = masterService.getOneBySlug(postDto.getChangedSlug());
            post.setMaster(changedMaster);
        }

        post.setTitle(postDto.getTitle());
        // remove script tag
        post.setContent(HtmlUtil.removeTags(postDto.getContent()));
        post.setDraft(postDto.isDraft());

        if( postDto.getContentType() != null ) {
            post.setContentType(CommPostEntity.ContentType.valueOf(postDto.getContentType().toUpperCase()));
        }
        post.setBannerYn(postDto.isBannerYn());
        post.setDispStartDate(postDto.getDispStartDate());
        post.setDispEndDate(postDto.getDispEndDate());

        // 검색용 태그 제거 본문
        if( !StringUtils.isEmpty(postDto.getContent()) ) {
            post.setStrippedContent(HtmlUtil.removeTag(postDto.getContent()));
        }

        if( !StringUtils.isEmpty(postDto.getFileGroupId())) {
            FileGroupEntity fileGroup = fileGroupService.getFileGroup(postDto.getFileGroupId());
            post.setFileGroup(fileGroup);
        }

        if( !StringUtils.isEmpty(postDto.getMediaGroupId()) ) {
            MediaGroupEntity mediaGroup = mediaService.getMediaGroup(postDto.getMediaGroupId());
            post.setMediaGroup(mediaGroup);
        }

        if( !StringUtils.isEmpty(postDto.getAttachGroupId()) ) {
            FileGroupEntity attachGroup = fileGroupService.getFileGroup(postDto.getAttachGroupId());
            post.setAttachGroup(attachGroup);
        }

        this.setUpdateUserInfo(post);

        // 등록자 변경
        if( !StringUtils.isEmpty(postDto.getCreatedById()) ) {
            if( post.getCreatedBy() == null || !post.getCreatedBy().getUserId().equals(postDto.getCreatedById()) ) {
                post.setCreatedBy(userService.get(postDto.getCreatedById()));
            }
        }

        // 등록일 변경
        if( !StringUtils.isEmpty(postDto.getCreatedDateStr())) {
            post.setCreatedDate(LocalDateTime.parse(postDto.getCreatedDateStr(), DateTimeFormat.forPattern("yyyy-MM-dd HH:mm")));
        }

        String oldWorkerId = post.getWorker()==null? null: post.getWorker().getUserId();
        String newWorkerId = postDto.getWorkerId();

        // 담당자
        boolean email = isAssignee(oldWorkerId, newWorkerId);
        if( !StringUtils.isEmpty(postDto.getWorkerId()) ) {
            UserEntity worker = userService.get(postDto.getWorkerId());
            post.setWorker(worker);
        } else {
            post.setWorker(null);
        }

        // 롤 리스트
        List<CommRoleGroupRelEntity> commRoleGroupRelEntities = new ArrayList<>();
        // 권한 추가
        if( postDto.getRoleIds() != null ) {
            postDto.getRoleIds().forEach(roleGroup -> {
                Optional.of(roleGroupService.get(roleGroup)).ifPresent( rg -> {
                    commRoleGroupRelEntities.add(CommonUtil.getCommRoleGroupEntity(rg, post));
                });
            });
            post.setRoleRel(commRoleGroupRelEntities);
        } else {
            post.setRoleRel(null);
        }

        postRepository.save(post);

        // 처리자
        userRelRepository.deleteByPost_Id(post.getId());
        if( postDto.getCoworkerIds() != null && postDto.getCoworkerIds().size() > 0 ) {
            for(int i=0; i<postDto.getCoworkerIds().size(); i++) {
                CommPostUserRelEntity rel = new CommPostUserRelEntity();
                rel.setPost(post);
                rel.setUser(userService.get(postDto.getCoworkerIds().get(i)));
                rel.setDispOrder(i);
                this.setCreateUserInfo(rel);
                userRelRepository.save(rel);
            }
        }

        if( email && post.getMaster().getPostType() == CommMasterEntity.PostType.WORKFLOW ) {
            this.sendEmailByModify(post);
        }

        return post;
    }

    /**
     * 포스트 삭제
     * @param slug
     * @param postId
     */
    public void removePost(String slug, String postId) {
        CommPostEntity post = postRepository.getPostBySlug(slug, postId);
        if( post == null ) {
            return;
        }
        // 댓글 삭제
        if( post.getReplies() != null && post.getReplies().size() > 0 ) {
            post.getReplies().forEach(reply -> {
                removePostReply(reply.getId(), null);
            });
        }
        // 처리자
        if( post.getUserRels() != null && post.getUserRels().size() > 0 ) {
            userRelRepository.delete(post.getUserRels());
        }
        // 포스트 삭제
        postRepository.delete(post);
        // 대표 이미지 삭제
        if( post.getMediaGroup() != null ) {
            mediaService.deleteAll(post.getMediaGroup().getId());
        }
        // 첨부 파일 삭제
        if( post.getFileGroup() != null ) {
            fileGroupService.removeFiles(post.getFileGroup().getId());
        }
        // 본문 삽입 파일 삭제
        if( post.getAttachGroup() != null ) {
            fileGroupService.removeFiles(post.getAttachGroup().getId());
        }

        // delete index
        searchService.delIndex(Const.ElasticSearch.TYPE_COMMUNICATION, post.getId(), post.getTitle());
    }

    /**
     * 담당자와 처리자만 수정
     * @param workerDto
     * @return
     */
    public CommPostEntity editPostForWorker(CommDto.PostWorker workerDto) {
        if( StringUtils.isEmpty(workerDto.getId()) ) {
            return null;
        }
        CommPostEntity post = postRepository.findOne(workerDto.getId());
        if( post == null ) {
            return null;
        }


        String oldWorkerId = post.getWorker()==null? null: post.getWorker().getUserId();
        String newWorkerId = workerDto.getWorkerId();
        // 담당자
        boolean email = isAssignee(oldWorkerId, newWorkerId);
        if( !StringUtils.isEmpty(workerDto.getWorkerId()) ) {
            UserEntity worker = userService.get(workerDto.getWorkerId());
            post.setWorker(worker);
        } else {
            post.setWorker(null);
        }
        // 처리자
        userRelRepository.deleteByPost_Id(post.getId());
        if( workerDto.getCoworkerIds() != null && workerDto.getCoworkerIds().size() > 0 ) {
            for(int i=0; i<workerDto.getCoworkerIds().size(); i++) {
                CommPostUserRelEntity rel = new CommPostUserRelEntity();
                rel.setPost(post);
                rel.setUser(userService.get(workerDto.getCoworkerIds().get(i)));
                rel.setDispOrder(i);
                this.setCreateUserInfo(rel);
                userRelRepository.save(rel);
            }
        }
        this.setUpdateUserInfo(post);

        if( email && post.getMaster().getPostType() == CommMasterEntity.PostType.WORKFLOW ) {
            this.sendEmailByModify(post);
        }

        return postRepository.save(post);
    }

    /**
     * 포스트 목록 슬러그로
     * @return
     */
    public Page<CommPostEntity> getPostList(String slug, PostStatus status, String keyword, Pageable pageable) {
        if( StringUtils.isEmpty(keyword) ) {
            return postRepository.getPostList(slug, status, false, pageable);
        } else {
            return postRepository.getPostList(slug, status, keyword, false, pageable);
        }
    }

    /**
     * 전체 통합 포스트 목록
     * @return
     */
    public Page<CommPostEntity> getAllPostList(CommDto.Filter filter, Pageable pageable) {
        Page<CommPostEntity> result = null;

        String userId = filter.isMy()? this.getCurrentUserId(): null;
        filter.setPostType(filter.getPostType()==null? CommMasterEntity.PostType.WORKFLOW: filter.getPostType());
        filter.setFilterType(filter.getFilterType()==null? FilterType.REQ_ALL: filter.getFilterType());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar cal = Calendar.getInstance();
        String startDate = null;
        String endDate = null;

        switch( filter.getFilterType() ) {
            // Requested
            case REQ_ALL:
                result = postRepository.getRequestedAllList(filter.getSlug(), filter.getKeyword(), userId, pageable);
                break;
            case REQ_LAST_3D:
                startDate = sdf.format(cal.getTime());
                cal.add(Calendar.DAY_OF_MONTH, -3);
                endDate = sdf.format(cal.getTime());
                result = postRepository.getRequestedLast3DaysList(filter.getSlug(), filter.getKeyword(), startDate, endDate, pageable);
                break;
            case REQ_NOT_PROC:
                result = postRepository.getRequestedNotProcessList(filter.getSlug(), filter.getKeyword(), userId, pageable);
                break;
            case REQ_INCOMPL:
                result = postRepository.getRequestedIncompleteList(filter.getSlug(), filter.getKeyword(), userId, pageable);
                break;
            case REQ_COMPL:
                result = postRepository.getRequestedListByStatus(filter.getSlug(), null, PostStatus.COMPLETED, filter.getKeyword(), userId, pageable);
                break;
            case REQ_REVIEW:
                result = postRepository.getRequestedListByStatus(filter.getSlug(), null, PostStatus.REVIEW, filter.getKeyword(), userId, pageable);
                break;
            case REQ_PROG_NOR:
                result = postRepository.getRequestedListByStatus(filter.getSlug(), "NORMAL", PostStatus.PROGRESS, filter.getKeyword(), userId, pageable);
                break;
            case REQ_PROG_REV:
                result = postRepository.getRequestedListByStatus(filter.getSlug(), "REVIEW", PostStatus.PROGRESS, filter.getKeyword(), userId, pageable);
                break;
            case REQ_NO_WOR:
                result = postRepository.getRequestedNoWorkerList(filter.getSlug(), filter.getKeyword(), pageable);
                break;
            case REQ_NO_COWOR:
                result = postRepository.getRequestedNoCoworkerList(filter.getSlug(), filter.getKeyword(), pageable);
                break;
            case REQ_WOR:
                result = postRepository.getRequestedListByMeWorker(filter.getSlug(), filter.getKeyword(), userId, pageable);
                break;
            case REQ_COWOR:
                result = postRepository.getRequestedListByMeCoworker(filter.getSlug(), filter.getKeyword(), userId, pageable);
                break;

            // Q&A
            case QNA_ALL:
                result = postRepository.getQnaAllList(filter.getSlug(), filter.getKeyword(), userId, pageable);
                break;
            case QNA_NO_ANS:
                result = postRepository.getQnaNoAnswerList(filter.getSlug(), filter.getKeyword(), userId, pageable);
                break;
            case QNA_ANS:
                result = postRepository.getQnaAnswerList(filter.getSlug(), filter.getKeyword(), userId, pageable);
                break;

            // Guide & Notice
            case GUD_ALL:
                result = postRepository.getNoticeAllList(filter.getSlug(), filter.getKeyword(), pageable);
                break;
            case GUD_TIP:
                result = postRepository.getGuideAndTipList(filter.getSlug(), filter.getKeyword(), pageable);
                break;
            case GUD_LAST_3D:
                startDate = sdf.format(cal.getTime());
                cal.add(Calendar.DAY_OF_MONTH, -3);
                endDate = sdf.format(cal.getTime());
                result = postRepository.getNoticeLastList(filter.getSlug(), filter.getKeyword(), startDate, endDate, pageable);
                break;
            case GUD_LAST_7D:
                startDate = sdf.format(cal.getTime());
                cal.add(Calendar.DAY_OF_MONTH, -7);
                endDate = sdf.format(cal.getTime());
                result = postRepository.getNoticeLastList(filter.getSlug(), filter.getKeyword(), startDate, endDate, pageable);
                break;
        }

        return result;
    }

    /**
     * 특정 포스트 조회
     * @param slug
     * @param postId
     * @return
     */
    public CommPostEntity getPost(String slug, String postId) {
        CommPostEntity post = postRepository.getPostBySlug(slug, postId);
        if( post != null ) {
            // 단이 ㄹ포스트 조회시 뷰 카운트 증가 처리
            int viewCnt = post.getViewCnt()==null? 0: post.getViewCnt();
            post.setViewCnt(++viewCnt);
            postRepository.save(post);
        }
        return post;
    }

    /**
     * 특정 포스트 댓글 목록
     * @param slug
     * @param postId
     * @return
     */
    public List<CommReplyEntity> getPostReplyList(String slug, String postId) {
        return replyRepository.findByPost_Master_SlugAndPost_IdOrderByCreatedDateAsc(slug, postId);
    }

    /**
     * 특정 사용자 등록 포스트
     * @return
     */
    public List<CommDto.SimplePost> getMyPostList() {
        // 내가 작성한 것, 최신순, 5건
        List<CommDto.SimplePost> myPosts = postRepository.getPostListByUser(this.getCurrentUserId())
                .stream().limit(5).collect(Collectors.toList());
        return myPosts;
    }

    /**
     * 특정 사용자 등록 댓글
     * @return
     */
    public List<CommReplyEntity> getMyPostReplyList() {
        // 내가 작성한 것, 최신순, 5건
        List<CommReplyEntity> myReplies = replyRepository.getReplyListByUser(this.getCurrentUserId())
                .stream().limit(5).collect(Collectors.toList());
        return myReplies;
    }

    /**
     * 특정 사용자의 글에 작성된 댓글
     * @return
     */
    public List<CommReplyEntity> getReplyListToMyPost() {
        // 나의 글에 작성된 것, 최신순, 5건
        List<CommReplyEntity> replies = replyRepository.getReplyListToMyPostByUser(this.getCurrentUserId())
                .stream().limit(5).collect(Collectors.toList());
        return replies;
    }

    /**
     * 슬러그에 대한 임시저장 포스트
     * @param slug
     * @return
     */
    public CommPostEntity getDraftPost(String slug) {
        List<CommPostEntity> drafts = postRepository.getDraftPostByUser(slug, this.getCurrentUserId());
        if( drafts != null && drafts.size() > 0 ) {
            return drafts.stream().findFirst().get();
        }
        return null;
    }

    /**
     * 임시저장 포스트 삭제
     * @param slug
     */
    public void removeDraftPost(String slug) {
        // 혹시 가비지가 있을 수 있기 때문에 복수건이라고 가정
        List<CommPostEntity> drafts = postRepository.getDraftPostByUser(slug, this.getCurrentUserId());
        drafts.forEach(draft -> {
            // 포스트 삭제
            postRepository.delete(draft);
            // 대표이미지 삭제
            if( draft.getMediaGroup() != null ) {
                mediaService.deleteAll(draft.getMediaGroup().getId());
            }
            // 첨부 파일 삭제
            if( draft.getFileGroup() != null ) {
                fileGroupService.removeFiles(draft.getFileGroup().getId());
            }
            // 본문 삽입용 파일 삭제
            if( draft.getAttachGroup() != null ) {
                fileGroupService.removeFiles(draft.getAttachGroup().getId());
            }
        });
    }

    /**
     * 댓글 추가
     * @param slug
     * @param postId
     * @param replyDto
     * @return
     */
    public CommReplyEntity addPostReply(String slug, String postId, CommDto.Reply replyDto) {
        if( StringUtils.isEmpty(postId) ) {
            return null;
        }
        replyDto.setId(null);

        CommReplyEntity reply = modelMapper.map(replyDto, CommReplyEntity.class);
        CommPostEntity post = postRepository.getPostBySlug(slug, postId);
        reply.setPost(post);

        if(StringUtils.isEmpty(replyDto.getStatus())) {
            reply.setStatus(PostStatus.COMMENT);
        }

        // 요청형일 경우 상태 값이 전달됐다면 설정
        if( post.getMaster().getPostType() == CommMasterEntity.PostType.WORKFLOW
                && reply.getStatus() != PostStatus.COMMENT ) {
            post.setStatus( PostStatus.valueOf(replyDto.getStatus().toUpperCase()) );
            postRepository.save(post);
        }

        if( !StringUtils.isEmpty(replyDto.getFileGroupId()) ) {
            FileGroupEntity fileGroup = fileGroupService.getFileGroup(replyDto.getFileGroupId());
            reply.setFileGroup(fileGroup);
        }

        this.setCreateUserInfo(reply);

        reply = replyRepository.save(reply);

        if( post.getMaster().getPostType() == CommMasterEntity.PostType.WORKFLOW ) {
            this.sendEmailByReply(post, reply);
        }

        return reply;
    }

    /**
     * 댓글 수정
     * @param slug
     * @param postId
     * @param replyDto
     * @return
     */
    public CommReplyEntity editPostReply(String slug, String postId, CommDto.Reply replyDto) {
        if( StringUtils.isEmpty(replyDto.getId()) ) {
            return null;
        }
        CommReplyEntity reply = replyRepository.findOne(replyDto.getId());
        CommPostEntity post = postRepository.getPostBySlug(slug, postId);

        reply.setContent(replyDto.getContent());
        reply.setPost(post);

        if(StringUtils.isEmpty(replyDto.getStatus())) {
            reply.setStatus(PostStatus.COMMENT);
        }

        // 요청형일 경우 상태 값이 전달됐다면 설정
        if( post.getMaster().getPostType() == CommMasterEntity.PostType.WORKFLOW
                && reply.getStatus() != PostStatus.COMMENT ) {
            post.setStatus( PostStatus.valueOf(replyDto.getStatus().toUpperCase()) );
            postRepository.save(post);
        }

        if( !StringUtils.isEmpty(replyDto.getFileGroupId()) ) {
            FileGroupEntity fileGroup = fileGroupService.getFileGroup(replyDto.getFileGroupId());
            reply.setFileGroup(fileGroup);
        }

        this.setUpdateUserInfo(reply);
        return replyRepository.save(reply);
    }

    /**
     * 댓글 삭제
     * @param replyId
     */
    public void removePostReply(String replyId, PostStatus status) {
        CommReplyEntity reply = replyRepository.findOne(replyId);
        if( reply == null ) {
            return;
        }
        CommPostEntity post = reply.getPost();
        // 댓글 삭제
        replyRepository.delete(reply);
        // 댓글의 첨부 파일 삭제
        if( reply.getFileGroup() != null ) {
            fileGroupService.removeFiles(reply.getFileGroup().getId());
        }

        // 모든 댓글이 삭제되면 요청형 포스트인 경우 등록요청으로 상태 변경
        if( post.getMaster().getPostType() == CommMasterEntity.PostType.WORKFLOW ) {
            if( post.getReplyCnt() == 1 ) { // 나 자신을 제외하고 없을 경우, 최종적으로는 나 자신도 삭제될 것이기 때문에 1로 판단
                post.setStatus(PostStatus.REQUESTED);
                postRepository.save(post);
            } else if(status != null) {
                post.setStatus(status);
                postRepository.save(post);
            }
        }

    }

    /**
     * 대표 이미지 삭제
     * @param groupId
     */
    public void removeMedia(String groupId) {
        postRepository.findByMediaGroup_Id(groupId).forEach(post -> {
            post.setMediaGroup(null);
            postRepository.save(post);
        });
        mediaService.deleteAll(groupId);
    }

    /**
     * 커뮤니케이션 색인용
     * @param pageable
     * @return
     */
    public Page<CommunicationIndexVO> getIndices(Pageable pageable) {
        List<CommunicationIndexVO> indices = new ArrayList<>();
        Page<CommPostEntity> posts = postRepository.findByMaster_UseYnOrderByCreatedDateDesc(true, pageable);
        if( posts != null && posts.getSize() > 0 ) {
            posts.forEach(post -> {
                CommunicationIndexVO index = new CommunicationIndexVO();
                index.setPostTitle(post.getTitle());
                index.setPostContent(post.getStrippedContent());
                String displayNm = post.getCreatedBy().getUserNm() + " (" + post.getCreatedBy().getOrgNm() + ")";
                index.setDisplayNm(displayNm);
                index.setCommentCount(post.getReplyCnt());
                if( post.getMediaGroup() != null
                        && post.getMediaGroup().getMedias() !=null
                        && post.getMediaGroup().getMedias().size() > 0 ) {
                    index.setImageLink(post.getMediaGroup().getMedias().get(0).getId());
                }
                String postLink = post.getMaster().getPrePath() +
                        "/" + post.getMaster().getSlug() + "/post/" + post.getId();
                index.setPostLink(postLink);

                index.setId(post.getId());

                List<String> tags = new ArrayList<>();
                tags.add(post.getTitle());
                index.setAutocompletes(tags);

                index.setType(Const.ElasticSearch.TYPE_COMMUNICATION);
                index.setCreatedDate(post.getCreatedDate()== null? null: post.getCreatedDate().toString("yyyy-MM-dd HH:mm"));

                indices.add(index);
            });
        }
        return new PageImpl<>(indices, pageable, posts.getTotalElements());
    }

    /**
     * 메인 컨텐츠 조회용
     * @param section
     * @param excepts
     * @param isMy
     * @param limit
     * @return
     */
    public List<CommPostEntity> getTopPostLatestList(CommMasterEntity.Section section, List<CommPostEntity> excepts, boolean isMy, int limit) {
        String queryString = "select post " +
                "from CommPostEntity post " +
                "where post.draft = false " +
                "and post.master.useYn = true " +
                "and post.master.section = :section ";
        if( isMy ) {
            queryString += "and post.createdBy.userId = :userId ";
        }
        if( excepts != null && excepts.size() > 0 ) {
            queryString += "and post not in :excepts ";
        }
//        queryString += "order by post.master.dispOrder asc, post.createdDate desc ";
        queryString += "order by post.createdDate desc ";
        Query query = entityManager.createQuery(queryString);
        query.setParameter("section", section);
        if( isMy ) {
            query.setParameter("userId", this.getCurrentUserId());
        }
        if( excepts != null && excepts.size() > 0 ) {
            query.setParameter("excepts", excepts);
        }
        query.setMaxResults(limit);

        List<CommPostEntity> postList = (List<CommPostEntity>) query.getResultList();
        return postList;
    }

    /**
     * GNB 알림 영역의 Badge 카운트
     * @return
     */
    public Map<String, Integer> getAlarmCount() {
        String userId = this.getCurrentUserId();

        Map<String, Integer> result = new HashMap<>();
        // 공지알림 건수
        result.put("notice", postRepository.getNoticeCount());

        // 요청건 중 미진행건
        result.put("notProcess", postRepository.getRequestedNotProcessCount(userId));

        // 요청건 중 진행중 건
        result.put("process", postRepository.getRequestedProcessCount(userId));

        // 요청건 중 처리완료 건
        result.put("completed", postRepository.getRequestedCompletedCount(userId));

        return result;
    }

    /**
     * summary count
     * @param isMy
     * @return
     */
    public Map<String, Integer> getSummaryCount(boolean isMy) {
        String userId = isMy? this.getCurrentUserId(): null;

        Map<String, Integer> result = new HashMap<>();

        int all = postRepository.getRequestedAllCount(userId);
        int notProcess = postRepository.getRequestedNotProcessCount(userId);
        int process = postRepository.getRequestedProcessCount(userId);
        int complete = postRepository.getRequestedCompletedCount(userId);

        // 전체
        result.put("all", all);
        // 미진행
        result.put("notProcess", notProcess);
        // 진행중
        result.put("process", process);
        // 미완료 : 미진행 + 진행중
//        result.put("incomplete", notProcess + process);
        // 처리완료
        result.put("complete", complete);

        int qnaAll = postRepository.getGeneralAllCount(userId);
        int qnaNoAnswer = postRepository.getGeneralNoAnswerCount(userId);
        int qnaAnswer = postRepository.getGeneralAnswerCount(userId);

        // Q&A 전체
        result.put("qnaAll", qnaAll);
        // 미답변 Q&A
        result.put("qnaNoAnswer", qnaNoAnswer);
        // 답변 Q&A
        result.put("qnaAnswer", qnaAnswer);

        return result;
    }

    /**
     * 커뮤니케이션 랜딩 공지 카운트
     * @return
     */
    public Map<String, Integer> getSummaryNoticeCount() {
        Map<String, Integer> result = new HashMap<>();

        // 공지현황
        int noticeAll = postRepository.getNoticeAllCount();
        int systemNotice = postRepository.getNoticeCountForSystem();
        result.put("guide",noticeAll-systemNotice);
        result.put("notice", systemNotice);

        return result;
    }

    /**
     * 공지 알림 조회
     * @return
     */
    public List<CommDto.SimplePost> getNoticeListForSimple() {
        return postRepository.getNoticeListForSimple();
    }

    /**
     * 내가 요청한 건 중 미진행
     * @return
     */
    public List<CommDto.SimplePost> getRequestedNotProcessListForSimple(boolean isMy) {
        if(isMy) {
            return postRepository.getRequestedNotProcessListForSimple(this.getCurrentUserId());
        } else {
            return postRepository.getRequestedNotProcessListForSimple(null);
        }
    }

    /**
     * 내가 요청한 건 중 진행중
     * @return
     */
    public List<CommDto.SimplePost> getRequestedProcessListForSimple(boolean isMy) {
        if(isMy) {
            return postRepository.getRequestedProcessListForSimple(this.getCurrentUserId());
        } else {
            return postRepository.getRequestedProcessListForSimple(null);
        }
    }

    /**
     * 내가 요청한 건 중 처리완료
     * @return
     */
    public List<CommDto.SimplePost> getRequestedCompletedListForSimple(boolean isMy) {
        if(isMy) {
            return postRepository.getRequestedCompletedListForSimple(this.getCurrentUserId());
        } else {
            return postRepository.getRequestedCompletedListForSimple(null);
        }
    }

    /**
     * 요청등록 메일 발송
     * @param post
     */
    private void sendEmailByRegist( CommPostEntity post ) {
        String link = this.getBasePath() +
                post.getMaster().getPrePath() +
                "/" + post.getMaster().getSlug() + "/post/" + post.getId();

        String workerNm = post.getWorker()==null? "(미지정)": post.getWorker().getUserNm();
        String subject = "";//emailService.getEmailSubject(Const.Email.TEMPLATE_REQUEST_REG);
        String contents = "";//emailService.getEmailContents(Const.Email.TEMPLATE_REQUEST_REG, post.getTitle(), post.getStrippedContent(), link, post.getStatus(), post.getCreatedBy().getUserNm(), workerNm);

        List<UserEntity> recipients = roleGroupService.getRoleGroupMembers(Const.RoleGroup.EMAIL_RECIPIENT_GROUP);

        EmailVO email = new EmailVO();
        email.setSubject(subject);
        email.setContents(contents);
        email.setObjectId(post.getId());
        email.setObjectType(EmailSendEntity.ObjectType.COMMUNICATION);
        email.setRecipients(recipients);
        email.setSender(null);

        //emailService.sendEmail(email);
    }

    /**
     * 요청 수정 메일 발송
     * @param post
     */
    private void sendEmailByModify( CommPostEntity post ) {
        String link = this.getBasePath() +
                post.getMaster().getPrePath() +
                "/" + post.getMaster().getSlug() + "/post/" + post.getId();

        String workerNm = post.getWorker()==null? "(미지정)": post.getWorker().getUserNm();
        String subject = "";//emailService.getEmailSubject(Const.Email.TEMPLATE_REQUEST_MOD);
        String contents = "";//emailService.getEmailContents(Const.Email.TEMPLATE_REQUEST_MOD, post.getTitle(), post.getStrippedContent(), link,  post.getStatus(), post.getCreatedBy().getUserNm(), workerNm);

        List<UserEntity> recipients = new ArrayList<>();
        recipients.add(post.getCreatedBy());
        recipients.add(post.getWorker());

        EmailVO email = new EmailVO();
        email.setSubject(subject);
        email.setContents(contents);
        email.setObjectId(post.getId());
        email.setObjectType(EmailSendEntity.ObjectType.COMMUNICATION);
        email.setRecipients(recipients);
        email.setSender(null);

        //emailService.sendEmail(email);
    }

    /**
     * 요청 댓글 메일 발송
     * @param post
     * @param reply
     */
    private void sendEmailByReply( CommPostEntity post, CommReplyEntity reply ) {
        String link = this.getBasePath() +
                post.getMaster().getPrePath() +
                "/" + post.getMaster().getSlug() + "/post/" + post.getId();

        String workerNm = post.getWorker()==null? "(미지정)": post.getWorker().getUserNm();
        String subject = "";//emailService.getEmailSubject(Const.Email.TEMPLATE_REQUEST_RLY);
        String contents = "";//emailService.getEmailContents(Const.Email.TEMPLATE_REQUEST_RLY, post.getTitle(), reply.getContent(), link, post.getStatus(), post.getCreatedBy().getUserNm(), workerNm);

        List<UserEntity> recipients = new ArrayList<>();
        recipients.add(post.getCreatedBy());
        if( post.getWorker() != null ) {
            recipients.add(post.getWorker());
        }
        recipients.add(reply.getCreatedBy());
        if( post.getCoworkers() != null && post.getCoworkers().size() > 0 ) {
            recipients.addAll(post.getCoworkers());
        }

        EmailVO email = new EmailVO();
        email.setSubject(subject);
        email.setContents(contents);
        email.setObjectId(post.getId());
        email.setObjectType(EmailSendEntity.ObjectType.COMMUNICATION);
        email.setRecipients(recipients);
        email.setSender(null);

        //emailService.sendEmail(email);
    }

    public boolean isAssignee(String oldWorkerId, String newWorkerId){
        boolean email = false;
        if( oldWorkerId == null && newWorkerId == null ) {
            email = false;
        } else if( oldWorkerId != null && newWorkerId != null ) {
            email = !oldWorkerId.equals(newWorkerId);
        } else if( newWorkerId == null ) {
            email = false;
        } else {
            email = true;
        }
        return email;
    }

    /**
     * post에 대한 현재 사용자 수용여부 (권한 판단)
     * @param postId
     * @return
     */
    public boolean acceptablePost(String postId) {
        CommPostEntity post = postRepository.findOne(postId);
        if( post != null ) {
            if( post.getRoleRel() == null || post.getRoleRel().size() == 0 ) {
                return true;
            }
            UserEntity user = this.getCurrentUser();
            if( user.isAdmin() ) {
                return true;
            }
            List<RoleGroupEntity> myRoles = roleGroupService.getRoleGroupListByUser(user.getUserId());
            for( RoleGroupEntity role : myRoles ) {
                for( CommRoleGroupRelEntity rel : post.getRoleRel() ) {
                    if( rel.getRoleGroup().getId().equals(role.getId()) ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
