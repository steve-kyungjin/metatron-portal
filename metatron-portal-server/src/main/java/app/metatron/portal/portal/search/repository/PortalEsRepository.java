package app.metatron.portal.portal.search.repository;

import app.metatron.portal.common.util.CommonUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.portal.search.domain.AnalysisAppIndexVO;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.text.Text;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 포탈 전체 통합 검색
 */
@Slf4j
@Repository
public class PortalEsRepository {

    @Autowired
    private TransportClient client;

    @Autowired
    public PortalEsRepository(TransportClient client) {
        this.client = client;
    }

    public HashMap<String, Object> findString(String str, Pageable pageable) {
        if( null == client ){
            HashMap<String ,Object> result = new HashMap<>();
            result.put("total", 0);
            result.put("contentsList", null);
            result.put("pageable", pageable);
            return  result;
        }
        HighlightBuilder highlightBuilder = new HighlightBuilder();
        HighlightBuilder.Field highlightTitle =
                new HighlightBuilder.Field("autocomplete");
//        highlightTitle.highlighterType("unified");
        highlightBuilder.field(highlightTitle);

        SearchResponse response = client.prepareSearch(Const.ElasticSearch.INDEX)
                .setTypes(Const.ElasticSearch.TYPE_COMMUNICATION,Const.ElasticSearch.TYPE_META_COLUMN,Const.ElasticSearch.TYPE_REPORT_APP,Const.ElasticSearch.TYPE_ANALYSIS_APP,Const.ElasticSearch.TYPE_PROJECT,Const.ElasticSearch.TYPE_META_TABLE)
//                .setTypes(Const.ElasticSearch.TYPE_ANALYSIS_APP)
                .highlighter(highlightBuilder)
                .setFetchSource(false)
                .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
//                .addStoredField("autocomplete")
                .setQuery(QueryBuilders.termQuery("autocomplete", str))
                .setFrom(pageable.getPageNumber()*pageable.getPageSize()).setSize(pageable.getPageSize())
                .get();


        SearchHits hits = response.getHits();
        SearchHit[] hitArray = response.getHits().getHits();
        List<String> keywordList = new ArrayList<>();
        for ( int i = 0 ; i < hitArray.length ; i++ ){
            SearchHit hit = hitArray[i];
            Text[] texts = hit.getHighlightFields().get("autocomplete").getFragments();
            keywordList.add( texts[0].toString());
        }
        HashMap<String ,Object> result = new HashMap<>();

        result.put("total", hits.getTotalHits());
        result.put("keywordList", keywordList);
        result.put("pageable", pageable);

        return result;
    }

    public SearchHit[] rangeIndexDate(String startDate,String endDate){
        if( null == client ){
            HashMap<String ,Object> result = new HashMap<>();
            result.put("total", 0);
            result.put("list", null);
            return  null;
        }

        QueryBuilder queryBuilder = QueryBuilders.rangeQuery("indexDate")
                .gte(startDate+ " 00:00")
                .lte(endDate+" 00:00");

        SearchResponse response = client.prepareSearch(Const.ElasticSearch.INDEX)
                .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                .setQuery(queryBuilder)
                .setSize(10000)
                .get();

        SearchHits hits = response.getHits();


        return   hits.getHits();
    }
    public void bulkDelIndex(SearchHit[] hitArray ){
        if( null == client ){
            return ;
        }

        BulkRequestBuilder brb = client.prepareBulk();
        ObjectMapper mapper = new ObjectMapper();

        for ( int i = 0 ; i < hitArray.length ; i++ ){
            SearchHit hit = hitArray[i];
            try {
                brb.add(client.prepareDelete(Const.ElasticSearch.INDEX,hit.getType(),hit.getId()));
            }catch (Exception e){
                log.error(e.getMessage());
            }

        }

        if (brb.numberOfActions() > 0) {
            ActionListener<BulkResponse> responseHandler = new ActionListener<BulkResponse>() {
                public void onResponse(BulkResponse response) {
                    if (response.hasFailures()) {
                        log.warn("Indexing objects in bulk might have failed - status {}. Reason: {}",
                                "", response.buildFailureMessage());
                    }
                }
                public void onFailure(Exception e) {
                    log.error("Bulk indexing failure: {}", e);
                }
            };
            brb.execute(responseHandler);

        }

    }

    public void setBulk(List<AnalysisAppIndexVO> list) {

        if( null == client ){
            return;
        }

        BulkRequestBuilder brb = client.prepareBulk();
        ObjectMapper mapper = new ObjectMapper();
        list.forEach( vo -> {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                Calendar cal = Calendar.getInstance();
                Date today = cal.getTime();
                String indexDate = sdf.format(today);
                vo.setIndexDate(indexDate);

                //Object to JSON in String
                String jsonInString = mapper.writeValueAsString(vo);
                log.debug(jsonInString);
                brb.add(client.prepareIndex(Const.ElasticSearch.INDEX,"analysis-app",vo.getId()).setSource(mapper.writeValueAsString(vo)));
            }catch (Exception e){
                log.error(e.getMessage());
            }

        });
        if (brb.numberOfActions() > 0) {
            ActionListener<BulkResponse> responseHandler = new ActionListener<BulkResponse>() {
                public void onResponse(BulkResponse response) {
                    if (response.hasFailures()) {
                        log.warn("Indexing objects in bulk might have failed - status {}. Reason: {}",
                                "", response.buildFailureMessage());
                    }
                }
                public void onFailure(Exception e) {
                    log.error("Bulk indexing failure: {}", e);
                }
            };
            brb.execute(responseHandler);
        }
        log.debug("Search.indexAll() {}", list.size());
    }

    public void delIndex(String type,String id, String title){

        if( null == client ){
            return ;
        }

        try {
            DeleteResponse response = client.prepareDelete(Const.ElasticSearch.INDEX, type, id).get();
            log.debug(response.getResult().toString());
            response = client.prepareDelete(Const.ElasticSearch.INDEX, Const.ElasticSearch.TYPE_AUTO_COMPLETE, title).get();
            log.debug(response.getResult().toString());
        } catch(Exception e) {
            log.error("[ElasticSearch] error " + e.getMessage());
        }

    }
}

