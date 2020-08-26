package app.metatron.portal.portal.search.domain;

import app.metatron.portal.common.value.index.IndexVO;

import java.io.Serializable;

/**
 * 커뮤니케이션 색인 VO
 */
public class CommunicationIndexVO extends IndexVO implements Serializable {

    private static final long serialVersionUID = 1L;

    // target
    private String postTitle;

    // target
    private String postContent;

    private int commentCount;

    private String imageLink;

    private String displayNm;

    private String postLink;

    public String getPostTitle() {
        return postTitle;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public String getPostContent() {
        return postContent;
    }

    public void setPostContent(String postContent) {
        this.postContent = postContent;
    }

    public int getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }

    public String getImageLink() {
        return imageLink;
    }

    public void setImageLink(String imageLink) {
        this.imageLink = imageLink;
    }

    public String getDisplayNm() {
        return displayNm;
    }

    public void setDisplayNm(String displayNm) {
        this.displayNm = displayNm;
    }

    public String getPostLink() {
        return postLink;
    }

    public void setPostLink(String postLink) {
        this.postLink = postLink;
    }
}
