package app.metatron.portal.portal.search.domain;

import app.metatron.portal.common.value.index.IndexVO;

import java.io.Serializable;

/**
 * 리포트앱 검색 색인 VO
 */
public class ReportAppIndexVO extends IndexVO implements Serializable {

    private static final long serialVersionUID = 1L;

    // target
    private String appNm;

    // target
    private String appSummary;

    // target
    private String categories;

    private String mediaId;

    private int usage;


    public String getAppNm() {
        return appNm;
    }

    public void setAppNm(String appNm) {
        this.appNm = appNm;
    }

    public String getAppSummary() {
        return appSummary;
    }

    public void setAppSummary(String appSummary) {
        this.appSummary = appSummary;
    }

    public String getCategories() {
        return categories;
    }

    public void setCategories(String categories) {
        this.categories = categories;
    }


    public String getMediaId() {
        return mediaId;
    }

    public void setMediaId(String mediaId) {
        this.mediaId = mediaId;
    }

    public int getUsage() {
        return usage;
    }

    public void setUsage(int usage) {
        this.usage = usage;
    }
}
