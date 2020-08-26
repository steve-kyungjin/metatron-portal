package app.metatron.portal.portal.communication.repository;

import app.metatron.portal.portal.communication.domain.CommReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommReplyRepository extends JpaRepository<CommReplyEntity, String> {

    /**
     * 특정 사용자에 대한 댓글 조회
     * @param userId
     * @return
     */
    @Query("select reply from CommReplyEntity reply " +
            "where reply.post.master.useYn = true " +
            "and reply.post.master.replyYn = true " +
            "and reply.post.draft = false " +
            "and reply.createdBy.userId = :userId " +
            "order by reply.createdDate desc ")
    List<CommReplyEntity> getReplyListByUser(@Param("userId") String userId);

    /**
     * 특정 사용자의 글에 작성된 댓글 조회
     * @param userId
     * @return
     */
    @Query("select reply from CommReplyEntity reply " +
            "where reply.post.master.useYn = true " +
            "and reply.post.master.replyYn = true " +
            "and reply.post.draft = false " +
            "and reply.createdBy.userId <> :userId " +
            "and reply.post.createdBy.userId = :userId " +
            "order by reply.createdDate desc ")
    List<CommReplyEntity> getReplyListToMyPostByUser(@Param("userId") String userId);

    /**
     * 특정 포스트에 대한 댓글 조회
     * @param slug
     * @param id
     * @return
     */
    List<CommReplyEntity> findByPost_Master_SlugAndPost_IdOrderByCreatedDateAsc(String slug, String id);
}
