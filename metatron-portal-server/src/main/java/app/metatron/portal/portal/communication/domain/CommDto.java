package app.metatron.portal.portal.communication.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.joda.time.LocalDateTime;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 커뮤니케이션
 */
public class CommDto {

    /**
     * 게시판 마스터
     */
    @Setter
    @Getter
    @ApiModel("CommDto.Master")
    public static class Master {
        private String id;

        @NotNull
        private String name;

        @NotNull
        private String slug;

        private String prePath;

        @NotNull
        @ApiModelProperty(value= "postType", allowableValues="GENERAL, WORKFLOW, NOTICE", notes = "Post Type : GENERAL, WORKFLOW, NOTICE",required = true)
        private String postType;

        @NotNull
        @ApiModelProperty(value= "listType", allowableValues="BOTH, LIST, CARD", notes = "List Type : BOTH, LIST, CARD",required = true)
        private String listType;

        @NotNull
        private boolean replyYn = true;

        @NotNull
        private boolean useYn = true;

        @NotNull
        @ApiModelProperty(value= "section", allowableValues="A, B, ETC", notes = "Section : A, B, ETC",required = true)
        private String section;

        @NotNull
        private int dispOrder;

        private String secondaryType;
    }

    /**
     * 게시판 포스트
     */
    @Setter
    @Getter
    @ApiModel("CommDto.Post")
    public static class Post {

        private String id;

        private String title;

        @ApiModelProperty(value= "contentType", allowableValues="HTML, TEXT", notes = "Content Type : HTML, TEXT")
        private String contentType;

        private String content;

        private boolean bannerYn = false;

        private String dispStartDate;

        private String dispEndDate;

        private boolean draft = false;

        private String mediaGroupId;

        private String fileGroupId;

        private String attachGroupId;

        private String createdById;

        private String createdDateStr;

        // 마스터 변경시 사용
        private String changedSlug;

        private String workerId;

        private List<String> coworkerIds;
    }

    /**
     * 댓글
     */
    @Setter
    @Getter
    @ApiModel("CommDto.Reply")
    public static class Reply {
        private String id;

        private String content;

        @NotNull
        private String postId;

        private String fileGroupId;

        @ApiModelProperty(value= "status", allowableValues="REQUESTED, PROGRESS, COMPLETED, CANCELED, CLOSED, COMMENT", notes = "status : REQUESTED, PROGRESS, COMPLETED, CANCELED, CLOSED, COMMENT")
        private String status;

        private String completeType;
    }

    /**
     * 포스트 전체 목록 조회 필터
     */
    @Setter
    @Getter
    @ApiModel("CommDto.Filter")
    public static class Filter {

        @NotNull
        private CommMasterEntity.PostType postType;

        @NotNull
        private FilterType filterType;

        // 제목,내용,등록자 대상
        private String keyword;

        private String slug;

        private boolean my = false;

    }

    /**
     * 담당자 처리자 only
     */
    @Setter
    @Getter
    @ApiModel("CommDto.PostWorker")
    public static class PostWorker {
        private String id;

        private String workerId;

        private List<String> coworkerIds;
    }

    /**
     * 포스트 간단 정보
     */
    public interface SimplePost {
        String getId();
        String getTitle();
        LocalDateTime getCreatedDate();
        String getStrippedContent();
        CommMasterEntity getMaster();
    }
}
