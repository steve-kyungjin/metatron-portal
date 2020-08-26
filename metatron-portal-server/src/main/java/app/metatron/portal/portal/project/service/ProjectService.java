package app.metatron.portal.portal.project.service;

import app.metatron.portal.common.file.domain.FileGroupEntity;
import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.common.user.service.RoleGroupService;
import app.metatron.portal.portal.project.repository.ProjectRepository;
import app.metatron.portal.portal.search.domain.ProjectIndexVO;
import app.metatron.portal.portal.search.service.ElasticSearchRelayService;
import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.code.service.CodeService;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.file.service.FileGroupService;
import app.metatron.portal.common.user.domain.RoleGroupEntity;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.common.user.service.UserService;
import app.metatron.portal.portal.project.domain.ProjectDto;
import app.metatron.portal.portal.project.domain.ProjectEntity;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * 과제 서비스
 */
@Service
public class ProjectService extends AbstractGenericService<ProjectEntity, String> {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private RoleGroupService roleGroupService;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileGroupService fileGroupService;

    @Autowired
    private CodeService codeService;

    @Autowired
    private ElasticSearchRelayService searchService;

    @Override
    protected JpaRepository<ProjectEntity, String> getRepository() {
        return this.projectRepository;
    }

    /**
     * 연도로 과제 목록
     * @param year
     * @param pageable
     * @return
     */
    public Page<ProjectEntity> getProjectListByYear(String year, Pageable pageable) {
        return projectRepository.findByStartDateStartingWith(year, pageable);
    }

    /**
     * 과제 추가
     * @param projectDto
     * @return
     */
    public boolean addProject(ProjectDto.CREATE projectDto) {
        ProjectEntity project = modelMapper.map(projectDto, ProjectEntity.class);

        if( !StringUtils.isEmpty(projectDto.getWorkOrgId())) {
            RoleGroupEntity workOrg = roleGroupService.get(projectDto.getWorkOrgId());
            project.setWorkOrg(workOrg);
        }

        if( !StringUtils.isEmpty(projectDto.getCoworkOrgId()) ) {
            RoleGroupEntity coworkOrg = roleGroupService.get(projectDto.getCoworkOrgId());
            project.setCoworkOrg(coworkOrg);
        }

        if( !StringUtils.isEmpty(projectDto.getWorkerId()) ) {
            UserEntity worker = userService.get(projectDto.getWorkerId());
            project.setWorker(worker);
        }
        if( !StringUtils.isEmpty(projectDto.getFileGroupId()) ) {
            FileGroupEntity fileGroup = fileGroupService.getFileGroup(projectDto.getFileGroupId());
            project.setFileGroup(fileGroup);
        }

        if( !StringUtils.isEmpty(projectDto.getTypeId()) ) {
            CodeEntity type = codeService.get(projectDto.getTypeId());
            project.setType(type);
        }

        this.setCreateUserInfo(project);

        return projectRepository.save(project) != null;
    }

    /**
     * 과제 수정
     * @param projectDto
     * @return
     */
    public boolean editProject(ProjectDto.EDIT projectDto) {
        ProjectEntity project = projectRepository.findOne(projectDto.getId());
        project.setName(projectDto.getName());
        project.setBenefit(projectDto.getBenefit());
        project.setDescription(projectDto.getDescription());
        project.setProgress(ProjectEntity.Progress.valueOf(projectDto.getProgress().toUpperCase()));
        project.setSummary(projectDto.getSummary());
        project.setStartDate(projectDto.getStartDate());
        project.setEndDate(projectDto.getEndDate());
        project.setType(codeService.get(projectDto.getTypeId()));

        if( !StringUtils.isEmpty(projectDto.getWorkOrgId())) {
            RoleGroupEntity workOrg = roleGroupService.get(projectDto.getWorkOrgId());
            project.setWorkOrg(workOrg);
        } else {
            project.setWorkOrg(null);
        }

        if( !StringUtils.isEmpty(projectDto.getCoworkOrgId()) ) {
            RoleGroupEntity coworkOrg = roleGroupService.get(projectDto.getCoworkOrgId());
            project.setCoworkOrg(coworkOrg);
        } else {
            project.setCoworkOrg(null);
        }

        if( !StringUtils.isEmpty(projectDto.getWorkerId()) ) {
            UserEntity worker = userService.get(projectDto.getWorkerId());
            project.setWorker(worker);
        } else {
            project.setWorker(null);
        }

        if( !StringUtils.isEmpty(projectDto.getFileGroupId()) ) {
            FileGroupEntity fileGroup = fileGroupService.getFileGroup(projectDto.getFileGroupId());
            project.setFileGroup(fileGroup);
        }

        if( !StringUtils.isEmpty(projectDto.getTypeId()) ) {
            CodeEntity type = codeService.get(projectDto.getTypeId());
            project.setType(type);
        }

        this.setUpdateUserInfo(project);

        return projectRepository.save(project) != null;
    }

    /**
     * 과제 삭제
     * @param projectId
     */
    public void removeProject(String projectId) {
        ProjectEntity project = projectRepository.findOne(projectId);
        projectRepository.delete(project);
        if( project.getFileGroup() != null ) {
            fileGroupService.removeFiles(project.getFileGroup().getId());
        }

        // delete index
        searchService.delIndex(Const.ElasticSearch.TYPE_PROJECT, project.getId(), project.getName());
    }

    /**
     * 과제 검색 색인
     * @param pageable
     * @return
     */
    public Page<ProjectIndexVO> getIndices(Pageable pageable) {
        List<ProjectIndexVO> indices = new ArrayList<>();
        Page<ProjectEntity> projects = projectRepository.findByOrderByCreatedDateDesc(pageable);
        if( projects != null && projects.getSize() > 0 ) {
            projects.forEach(project -> {
                ProjectIndexVO index = new ProjectIndexVO();
                index.setType(Const.ElasticSearch.TYPE_PROJECT);
                index.setName(project.getName());
                index.setSummary(project.getSummary());
                index.setProgress(project.getProgress().toString());
                if( project.getType() != null ) {
                    index.setProjectType(project.getType().getNmKr());
                }
                if( project.getWorker() != null ) {
                    index.setWorker(project.getWorker().getUserNm());
                }
                if( project.getWorkOrg() != null ) {
                    index.setWorkOrg(project.getWorkOrg().getName());
                }

                index.setId(project.getId());
                index.setCreatedDate(project.getCreatedDate()== null? null: project.getCreatedDate().toString("yyyy-MM-dd HH:mm"));

                List<String> tags = new ArrayList<>();
                tags.add(project.getName());
                index.setAutocompletes(tags);

                indices.add(index);
            });
        }
        return new PageImpl<>(indices, pageable, projects.getTotalElements());
    }

}
