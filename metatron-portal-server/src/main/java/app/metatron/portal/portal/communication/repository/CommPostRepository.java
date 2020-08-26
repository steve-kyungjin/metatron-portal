package app.metatron.portal.portal.communication.repository;

import app.metatron.portal.portal.communication.domain.CommDto;
import app.metatron.portal.portal.communication.domain.CommPostEntity;
import app.metatron.portal.portal.communication.domain.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommPostRepository extends JpaRepository<CommPostEntity, String> {

    /**
     * 마스터 사용여부에 따른 포스트 조회
     * @param useYn
     * @param pageable
     * @return
     */
    Page<CommPostEntity> findByMaster_UseYnOrderByCreatedDateDesc(boolean useYn, Pageable pageable);

    /**
     * 포스트 목록 슬러그별
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.slug = :slug " +
            "and post.master.useYn = true " +
            "and post.draft = :draft " +
            "and (:status is null or post.status = :status) " +
            "order by post.createdDate desc ")
    Page<CommPostEntity> getPostList(@Param("slug") String slug, @Param("status") PostStatus status, @Param("draft") boolean draft, Pageable pageable);

    /**
     * 포스트 목록 슬러그별
     */
    @Query("select post from CommPostEntity post " +
            "left join post.worker " +
            "where post.master.slug = :slug " +
            "and post.master.useYn = true " +
            "and post.draft = :draft " +
            "and (:status is null or post.status = :status) " +
            "and ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') or post.worker.userNm like concat('%',:keyword,'%') ) " +
            "order by post.createdDate desc ")
    Page<CommPostEntity> getPostList(@Param("slug") String slug, @Param("status") PostStatus status, @Param("keyword") String keyword, @Param("draft") boolean draft, Pageable pageable);

    /**
     * 특정 사용자 포스트 목록
     * @param userId
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.useYn = true " +
            "and post.draft = false " +
            "and post.createdBy.userId = :userId " +
            "order by post.createdDate desc ")
    List<CommDto.SimplePost> getPostListByUser(@Param("userId") String userId);

    /**
     * 특정 포스트 조회
     * @param slug
     * @param postId
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.slug = :slug " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and post.id = :postId ")
    CommPostEntity getPostBySlug(@Param("slug") String slug, @Param("postId") String postId);

    /**
     * 슬러그와 사용자 관련 임시저장 포스트
     * @param slug
     * @param userId
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.slug = :slug " +
            "and post.draft = true " +
            "and post.master.useYn = true " +
            "and post.createdBy.userId = :userId " +
            "order by post.createdDate desc ")
    List<CommPostEntity> getDraftPostByUser(@Param("slug") String slug, @Param("userId") String userId);

    /**
     * 슬러그와 사용자에 대한 임시저장 건 삭제
     * @param slug
     * @param userId
     * @return
     */
    @Query("delete from CommPostEntity post " +
            "where post.master.slug = :slug " +
            "and post.draft = true " +
            "and post.createdBy = :userId ")
    int removeDraftPostByUser(@Param("slug") String slug, @Param("userId") String userId);

    /**
     * 특정 대표이미지로 포스트 조회
     * @param groupId
     * @return
     */
    List<CommPostEntity> findByMediaGroup_Id(String groupId);

    /**
     * 특정 기간내 공지 알림 조회
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.postType = 'NOTICE' " +
            "and post.bannerYn = true " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and post.dispStartDate <= date_format(now(), '%Y-%m-%d') " +
            "and post.dispEndDate >= date_format(now(), '%Y-%m-%d') " +
            "order by post.dispStartDate desc, post.updatedDate desc ")
    List<CommDto.SimplePost> getNoticeListForSimple();

    /**
     * 공지알림 카운트
     * @return
     */
    @Query("select count(post) from CommPostEntity post " +
            "where post.master.postType = 'NOTICE' " +
            "and post.bannerYn = true " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and post.dispStartDate <= date_format(now(), '%Y-%m-%d') " +
            "and post.dispEndDate >= date_format(now(), '%Y-%m-%d') " )
    int getNoticeCount();

    /**
     * 등록한 요청건 중 미진행 건
     * @param userId
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and post.status = 'REQUESTED' " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "order by post.createdDate desc" )
    List<CommDto.SimplePost> getRequestedNotProcessListForSimple(@Param("userId") String userId);

    /**
     * 등록한 요청건 중 미진행 건 카운트
     * @param userId
     * @return
     */
    @Query("select count(post) from CommPostEntity post " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and post.status = 'REQUESTED' " +
            "and post.draft = false " +
            "and post.master.useYn = true " )
    int getRequestedNotProcessCount(@Param("userId") String userId);

    /**
     * 등록한 요청건 중 진행중 건
     * @param userId
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and post.status not in ('REQUESTED','CANCELED','CLOSED','COMPLETED') " +
            "and post.master.useYn = true " +
            "and post.draft = false " +
            "order by post.updatedDate desc" )
    List<CommDto.SimplePost> getRequestedProcessListForSimple(@Param("userId") String userId);

    /**
     * 등록한 요청건 중 진행중 건 카운트
     * @param userId
     * @return
     */
    @Query("select count(post) from CommPostEntity post " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and post.status not in ('REQUESTED','CANCELED','CLOSED','COMPLETED') " +
            "and post.master.useYn = true " +
            "and post.draft = false " )
    int getRequestedProcessCount(@Param("userId") String userId);


    /**
     * 등록한 요청건 중 처리완료 건
     * @param userId
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and post.status = 'COMPLETED' " +
            "and post.master.useYn = true " +
            "and post.draft = false " +
            "order by post.updatedDate desc" )
    List<CommDto.SimplePost> getRequestedCompletedListForSimple(@Param("userId") String userId);

    /**
     * 등록한 요청건 중 처리완료 건 카운트
     * @param userId
     * @return
     */
    @Query("select count(post) from CommPostEntity post " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and post.status = 'COMPLETED' " +
            "and post.master.useYn = true " +
            "and post.draft = false " )
    int getRequestedCompletedCount(@Param("userId") String userId);

    /**
     * 등록한 요청건 전체 카운트
     * @param userId
     * @return
     */
    @Query("select count(post) from CommPostEntity post " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and post.master.useYn = true " +
            "and post.draft = false " )
    int getRequestedAllCount(@Param("userId") String userId);

    /**
     * 등록한 일반형(Q&A) 전체 카운트
     * @param userId
     * @return
     */
    @Query("select count(post) from CommPostEntity post " +
            "where post.master.postType = 'GENERAL' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and post.master.useYn = true " +
            "and post.draft = false " )
    int getGeneralAllCount(@Param("userId") String userId);

    /**
     * 등록한 일반형(Q&A) 미답변 카운트
     * @param userId
     * @return
     */
    @Query("select count(post) from CommPostEntity post " +
            "where post.master.postType = 'GENERAL' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and size(post.replies) = 0 " +
            "and post.master.useYn = true " +
            "and post.draft = false " )
    int getGeneralNoAnswerCount(@Param("userId") String userId);

    /**
     * 등록한 일반형(Q&A) 답변 카운트
     * @param userId
     * @return
     */
    @Query("select count(post) from CommPostEntity post " +
            "where post.master.postType = 'GENERAL' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and size(post.replies) > 0 " +
            "and post.master.useYn = true " +
            "and post.draft = false " )
    int getGeneralAnswerCount(@Param("userId") String userId);

    /**
     * 공지(가이드) 전체 카운트
     * @return
     */
    @Query("select count(post) from CommPostEntity post " +
            "where post.master.postType = 'NOTICE' " +
            "and post.master.useYn = true " +
            "and post.draft = false " )
    int getNoticeAllCount();

    /**
     * 공지(시스템공지) 카운트
     * @return
     */
    @Query("select count(post) from CommPostEntity post " +
            "where post.master.postType = 'NOTICE' " +
            "and post.master.id = 'BO000001' " +
            "and post.master.useYn = true " +
            "and post.draft = false " )
    int getNoticeCountForSystem();

    /////////////////////////////////////////////////////////////////////////////////////
    //
    // Communication Landing
    //
    /////////////////////////////////////////////////////////////////////////////////////

    /**
     * 요청건 전체
     * @param slug
     * @param keyword
     * @param userId
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "left join post.worker " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') or post.worker.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " +
            "and post.draft = false " )
    Page<CommPostEntity> getRequestedAllList(@Param("slug") String slug, @Param("keyword") String keyword, @Param("userId") String userId, Pageable pageable);

    /**
     * 미답변 요청건 (요청등록과 동일)
     * @param slug
     * @param keyword
     * @param userId
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "left join post.worker " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') or post.worker.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.status = 'REQUESTED' " +
//            "and size(post.replies) = 0 " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) ")
    Page<CommPostEntity> getRequestedNotProcessList(@Param("slug") String slug, @Param("keyword") String keyword, @Param("userId") String userId, Pageable pageable);

    /**
     * 처리 진행중 요청건
     * @param slug
     * @param keyword
     * @param userId
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "left join post.worker " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') or post.worker.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.status not in ('REQUESTED','COMPLETED','CANCELED','CLOSED') " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " )
    Page<CommPostEntity> getRequestedIncompleteList(@Param("slug") String slug, @Param("keyword") String keyword, @Param("userId") String userId, Pageable pageable);


    /**
     * 최근 3일 요청건
     * @param slug
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "left join post.worker " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') or post.worker.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " +
//            "and date_format(post.createdDate, '%Y-%m-%d') <= date_format(now(), '%Y-%m-%d') " +
//            "and date_format(post.createdDate, '%Y-%m-%d') > date_format(date_sub(now(), interval 3 day), '%Y-%m-%d') " +
            "and date_format(post.createdDate, '%Y-%m-%d') <= :startDate " +
            "and date_format(post.createdDate, '%Y-%m-%d') > :endDate " )
    Page<CommPostEntity> getRequestedLast3DaysList(@Param("slug") String slug, @Param("keyword") String keyword, @Param("startDate") String startDate, @Param("endDate") String endDate, Pageable pageable);
//    Page<CommPostEntity> getRequestedLast3DaysList(@Param("slug") String slug, @Param("keyword") String keyword, Pageable pageable);


    /**
     * 공지(가이드) 전체
     * @param slug
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.postType = 'NOTICE' " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " +
            "and post.draft = false " )
    Page<CommPostEntity> getNoticeAllList(@Param("slug") String slug, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 가이드&Tip 전체
     * @param slug
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.postType = 'NOTICE' " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.master.useYn = true " +
            "and post.master.id <> 'BO000001' " +
            "and (:slug is null or post.master.slug = :slug) " +
            "and post.draft = false " )
    Page<CommPostEntity> getGuideAndTipList(@Param("slug") String slug, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 최근 7일 공지(가이드)
     * @param slug
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.postType = 'NOTICE' " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " +
            "and post.draft = false " +
//            "and date_format(post.createdDate, '%Y-%m-%d') <= date_format(now(), '%Y-%m-%d') " +
//            "and date_format(post.createdDate, '%Y-%m-%d') > date_format(date_sub(now(), interval 7 day), '%Y-%m-%d') " +
            "and date_format(post.createdDate, '%Y-%m-%d') <= :startDate " +
            "and date_format(post.createdDate, '%Y-%m-%d') > :endDate " )
    Page<CommPostEntity> getNoticeLastList(@Param("slug") String slug, @Param("keyword") String keyword, @Param("startDate") String startDate, @Param("endDate") String endDate, Pageable pageable);


    /**
     * Q&A 전체
     * @param slug
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.postType = 'GENERAL' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " +
            "and post.draft = false " )
    Page<CommPostEntity> getQnaAllList(@Param("slug") String slug, @Param("keyword") String keyword, @Param("userId") String userId, Pageable pageable);


    /**
     * Q&A 미 답변
     * @param slug
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.postType = 'GENERAL' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') ) ) " +
            "and size(post.replies) = 0 " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " +
            "and post.draft = false " )
    Page<CommPostEntity> getQnaNoAnswerList(@Param("slug") String slug, @Param("keyword") String keyword, @Param("userId") String userId, Pageable pageable);


    /**
     * Q&A 답변
     * @param slug
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "where post.master.postType = 'GENERAL' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') ) ) " +
            "and size(post.replies) > 0 " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " +
            "and post.draft = false " )
    Page<CommPostEntity> getQnaAnswerList(@Param("slug") String slug, @Param("keyword") String keyword, @Param("userId") String userId, Pageable pageable);

    //

    /**
     * 상태별 요청건
     * @param slug
     * @param keyword
     * @param userId
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "left join post.worker " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:userId is null or post.createdBy.userId = :userId) " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') or post.worker.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.status = :status " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and (:sType is null or post.master.secondaryType = :sType) " +
            "and (:slug is null or post.master.slug = :slug) " )
    Page<CommPostEntity> getRequestedListByStatus(@Param("slug") String slug, @Param("sType") String secondaryType, @Param("status") PostStatus status, @Param("keyword") String keyword, @Param("userId") String userId, Pageable pageable);

    //

    /**
     * 담당자 미지정 요청건
     * @param slug
     * @param keyword
     * @param userId
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "left join post.worker " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') or post.worker.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.worker is null " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " )
    Page<CommPostEntity> getRequestedNoWorkerList(@Param("slug") String slug, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 처리자 미지정 요청건
     * @param slug
     * @param keyword
     * @param userId
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "left join post.worker " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') or post.worker.userNm like concat('%',:keyword,'%') ) ) " +
            "and size(post.userRels) = 0 " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " )
    Page<CommPostEntity> getRequestedNoCoworkerList(@Param("slug") String slug, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 마이 담당자 요청건
     * @param slug
     * @param keyword
     * @param userId
     * @param pageable
     * @return
     */
    @Query("select post from CommPostEntity post " +
            "left join post.worker " +
            "where post.master.postType = 'WORKFLOW' " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') or post.worker.userNm like concat('%',:keyword,'%') ) ) " +
            "and post.worker.userId = :userId " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " )
    Page<CommPostEntity> getRequestedListByMeWorker(@Param("slug") String slug, @Param("keyword") String keyword, @Param("userId") String userId, Pageable pageable);

    /**
     * 마이 처리자 요청건
     * @param slug
     * @param keyword
     * @param userId
     * @param pageable
     * @return
     */
    @Query("select distinct post from CommPostEntity post, CommPostUserRelEntity rel " +
            "left join post.worker " +
            "where post.master.postType = 'WORKFLOW' " +
            "and post = rel.post " +
            "and (:keyword is null or ( post.title like concat('%',:keyword,'%') or post.strippedContent like concat('%',:keyword,'%') or post.createdBy.userNm like concat('%',:keyword,'%') or post.worker.userNm like concat('%',:keyword,'%') ) ) " +
            "and rel.user.userId = :userId " +
            "and post.draft = false " +
            "and post.master.useYn = true " +
            "and (:slug is null or post.master.slug = :slug) " )
    Page<CommPostEntity> getRequestedListByMeCoworker(@Param("slug") String slug, @Param("keyword") String keyword, @Param("userId") String userId, Pageable pageable);



}
