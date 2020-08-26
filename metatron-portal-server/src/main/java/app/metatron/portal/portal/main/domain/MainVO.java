package app.metatron.portal.portal.main.domain;

import java.io.Serializable;
import java.util.List;

/**
 * 메인 컨텐츠 묶음
 */
public class MainVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 커뮤니케이션 컨텐츠
     */
    private List<ContentsVO> communications;

    /**
     * 분석앱 컨텐츠
     */
    private List<ContentsVO> analysisApps;

    /**
     * 리포트 컨텐츠
     */
    private List<ContentsVO> reportApps;

    public List<ContentsVO> getCommunications() {
        return communications;
    }

    public void setCommunications(List<ContentsVO> communications) {
        this.communications = communications;
    }

    public List<ContentsVO> getAnalysisApps() {
        return analysisApps;
    }

    public void setAnalysisApps(List<ContentsVO> analysisApps) {
        this.analysisApps = analysisApps;
    }

    public List<ContentsVO> getReportApps() {
        return reportApps;
    }

    public void setReportApps(List<ContentsVO> reportApps) {
        this.reportApps = reportApps;
    }
}
