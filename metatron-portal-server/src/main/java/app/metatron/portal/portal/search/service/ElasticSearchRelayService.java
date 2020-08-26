package app.metatron.portal.portal.search.service;

import app.metatron.portal.portal.communication.service.CommPostService;
import app.metatron.portal.portal.search.domain.*;
import app.metatron.portal.portal.search.repository.*;
import app.metatron.portal.common.service.BaseService;
import app.metatron.portal.common.value.index.IndexVO;
import app.metatron.portal.portal.analysis.service.AnalysisAppService;
import app.metatron.portal.portal.metadata.service.MetaService;
import app.metatron.portal.portal.project.service.ProjectService;
import app.metatron.portal.portal.report.service.ReportAppService;
import org.elasticsearch.search.SearchHit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 검색엔진 연계 서비스 (elasticsearch)
 */
@Service
public class ElasticSearchRelayService extends BaseService {

    private int pageSize = 10000;

    @Autowired
    private AutoCompleteEsRepository autoCompleteEsRepository;

    @Autowired
    private AnalysisAppService analysisAppService;

    @Autowired
    private ReportAppService reportAppService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private MetaService metaService;

    @Autowired
    private CommPostService commPostService;


    @Autowired
    private PortalEsRepository portalEsRepository;

    @Autowired
    private CommunicationEsRepository communicationEsRepository;

    @Autowired
    private ProjectEsRepository projectEsRepository;

    @Autowired
    private ReportAppEsRepository reportAppEsRepository;

    @Autowired
    private AnalysisAppEsRepository analysisAppEsRepository;

    @Autowired
    private MetaTableEsRepository metaTableEsRepository;

    @Autowired
    private MetaColumnEsRepository metaColumnEsRepository;


    public void analysisAppIndexAll(){
        List<AnalysisAppIndexVO> analysisAppIndexVOList = analysisAppService.getIndices();

        analysisAppEsRepository.setBulk(analysisAppIndexVOList);

        autoCompleteEsRepository.setBulk(getAutoCompleteIndexVO(analysisAppIndexVOList));


    }

    public void reportAppIndexAll(){
        List<ReportAppIndexVO> reportAppIndexVOList = reportAppService.getIndices();

        reportAppEsRepository.setBulk(reportAppIndexVOList);
        autoCompleteEsRepository.setBulk(getAutoCompleteIndexVO(reportAppIndexVOList));

    }

    public void projectAppIndexAll(){
        Page<ProjectIndexVO> firstPage = projectService.getIndices(new PageRequest(0,pageSize));
        if( firstPage.getContent().size() > 0 ){
            projectEsRepository.setBulk(firstPage.getContent());
            autoCompleteEsRepository.setBulk(getAutoCompleteIndexVO(firstPage.getContent()));
            for (int i = 1 ;i<firstPage.getTotalPages();i++){
                Page<ProjectIndexVO> indicesPage = projectService.getIndices(new PageRequest(i,pageSize));
                projectEsRepository.setBulk(indicesPage.getContent());
                autoCompleteEsRepository.setBulk(getAutoCompleteIndexVO(indicesPage.getContent()));
            }
        }
    }

    public void communicationIndexAll(){
        Page<CommunicationIndexVO> firstPage = commPostService.getIndices(new PageRequest(0,pageSize));
        if( firstPage.getContent().size() > 0 ){
            communicationEsRepository.setBulk(firstPage.getContent());
            autoCompleteEsRepository.setBulk(getAutoCompleteIndexVO(firstPage.getContent()));
            for (int i = 1 ;i<firstPage.getTotalPages();i++){
                Page<CommunicationIndexVO> indicesPage = commPostService.getIndices(new PageRequest(i,pageSize));
                communicationEsRepository.setBulk(indicesPage.getContent());
                autoCompleteEsRepository.setBulk(getAutoCompleteIndexVO(indicesPage.getContent()));
            }
        }
    }

    public void metaTableIndexAll(){
        Page<MetaTableIndexVO> firstPage = metaService.getTableIndices(new PageRequest(0,pageSize));
        if( firstPage.getContent().size() > 0 ){
            metaTableEsRepository.setBulk(firstPage.getContent());
            autoCompleteEsRepository.setBulk(getAutoCompleteIndexVO(firstPage.getContent()));
            for (int i = 1 ;i<firstPage.getTotalPages();i++){
                Page<MetaTableIndexVO> indicesPage = metaService.getTableIndices(new PageRequest(i,pageSize));
                metaTableEsRepository.setBulk(indicesPage.getContent());
                autoCompleteEsRepository.setBulk(getAutoCompleteIndexVO(indicesPage.getContent()));
            }
        }
    }

    public void metaColumnIndexAll(){
        Page<MetaColumnIndexVO> metaColumnIndexVOList = metaService.getColumnIndices(new PageRequest(0,pageSize));

        Page<MetaColumnIndexVO> firstPage = metaService.getColumnIndices(new PageRequest(0,pageSize));
        if( firstPage.getContent().size() > 0 ){
            metaColumnEsRepository.setBulk(firstPage.getContent());
            autoCompleteEsRepository.setBulk(getAutoCompleteIndexVO(firstPage.getContent()));
            for (int i = 1 ;i<firstPage.getTotalPages();i++){
                Page<MetaColumnIndexVO> indicesPage = metaService.getColumnIndices(new PageRequest(i,pageSize));
                metaColumnEsRepository.setBulk(indicesPage.getContent());
                autoCompleteEsRepository.setBulk(getAutoCompleteIndexVO(indicesPage.getContent()));
            }
        }
    }

    // 자동완성 검색
    public Map<String ,Object> getAutoComplete(String str, Pageable pageable){
        return autoCompleteEsRepository.findString(str, pageable);
    }

    // 커뮤니케이션 검색
    public Map<String ,Object> getCommunication(String str, Pageable pageable){
        return communicationEsRepository.findString(str,pageable);
    }

    // DT과제 검색
    public Map<String ,Object> getProject(String str, Pageable pageable){
        return projectEsRepository.findString(str,pageable);
    }

    // 리포트앱 검색
    public Map<String ,Object> getReportApp(String str, Pageable pageable){
        return reportAppEsRepository.findString(str,pageable);
    }

    // 분석앱 검색
    public Map<String ,Object> getAnalysisApp(String str, Pageable pageable){
        return analysisAppEsRepository.findString(str,pageable);
    }

    // 데이터 테이블
    public Map<String ,Object> getMetaTable(String str, Pageable pageable){
        return metaTableEsRepository.findString(str,pageable);
    }

    // 데이터 컬럼
    public Map<String ,Object> getMetaColumn(String str, Pageable pageable){
        return metaColumnEsRepository.findString(str,pageable);
    }

    private List<AutoCompleteIndexVO> getAutoCompleteIndexVO(List list){
        List<AutoCompleteIndexVO> autoCompleteIndexVOList = new ArrayList<>();
        list.forEach( vo -> {

            IndexVO indexVO = (IndexVO)vo;
            indexVO.getAutocompletes().forEach( str ->{
                AutoCompleteIndexVO autoCompleteIndexVO = new AutoCompleteIndexVO();
                autoCompleteIndexVO.setAutocomplete(str);
                autoCompleteIndexVO.setId(str);
                autoCompleteIndexVOList.add(autoCompleteIndexVO);
            });

        });

        return  autoCompleteIndexVOList;
    }

    // 엘라스틱 서치 인덱스를 삭제 한다.
    public void delIndex(String type,String id, String title){
        portalEsRepository.delIndex(type,id,title);
    }

    // 더이상 업데이트가 되지 않는 index를 삭제한다.
    public void deleteIndex(){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd") ;
        Calendar cal = Calendar.getInstance();

        Date today = cal.getTime();

        cal.add(Calendar.DATE, -7);
        Date yesterday = cal.getTime();

        cal.add(Calendar.MONTH, -1);
        Date monthYesterday = cal.getTime();

        cal.add(Calendar.DATE, 1);
        Date monthToday = cal.getTime();

        String startDate = sdf.format(monthToday);
        String endDate = sdf.format(yesterday);

        SearchHit[] hitArray = portalEsRepository.rangeIndexDate(startDate,endDate);

        portalEsRepository.bulkDelIndex(hitArray);
    }
}
