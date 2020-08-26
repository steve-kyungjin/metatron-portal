package app.metatron.portal.portal.search.domain;

import app.metatron.portal.common.value.index.IndexVO;

import java.io.Serializable;

/**
 * 과제 검색 색인 VO
 */
public class ProjectIndexVO extends IndexVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String projectType;

    private String name;

    private String summary;

    private String progress;

    private String worker;

    private String workOrg;

    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public String getWorker() {
        return worker;
    }

    public void setWorker(String worker) {
        this.worker = worker;
    }

    public String getWorkOrg() {
        return workOrg;
    }

    public void setWorkOrg(String workOrg) {
        this.workOrg = workOrg;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }
}
