package app.metatron.portal.portal.main.domain;

import java.io.Serializable;
import java.util.List;

/**
 * 메인 컨텐츠 개별 VO
 */
public class ContentsVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 컨텐츠 아이디
     */
    private String id;

    /**
     * 타이틀
     */
    private String title;

    /**
     * 내용
     */
    private String description;

    /**
     * 관련 카테고리
     */
    private List<String> categories;

    /**
     * 마이 컨텐츠 여부
     */
    private boolean my;

    /**
     * 미디어 정보
     */
    private String media;

    /**
     * 추가 정보
     */
    private Object extra;

    /**
     * 새창열기 인 경우 사용
     */
    private String externalUrl;

    private boolean acceptable = true;

    public String getExternalUrl() {
        return externalUrl;
    }

    public void setExternalUrl(String externalUrl) {
        this.externalUrl = externalUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public boolean isMy() {
        return my;
    }

    public void setMy(boolean my) {
        this.my = my;
    }

    public String getMedia() {
        return media;
    }

    public void setMedia(String media) {
        this.media = media;
    }

    public Object getExtra() {
        return extra;
    }

    public void setExtra(Object extra) {
        this.extra = extra;
    }

    public boolean isAcceptable() {
        return acceptable;
    }

    public void setAcceptable(boolean acceptable) {
        this.acceptable = acceptable;
    }
}
