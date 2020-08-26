package app.metatron.portal.portal.search.repository;

import app.metatron.portal.common.util.CommonUtil;
import app.metatron.portal.portal.search.domain.AutoCompleteIndexVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import app.metatron.portal.common.constant.Const;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.ArrayUtils;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.admin.indices.analyze.AnalyzeRequest;
import org.elasticsearch.action.admin.indices.analyze.AnalyzeResponse;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * 검색어 자동완성
 */
@Slf4j
@Repository
public class AutoCompleteEsRepository {

    @Autowired
    private TransportClient client;

    @Autowired
    public AutoCompleteEsRepository(TransportClient client) {
        this.client = client;
    }

    public HashMap<String, Object> findString(String str, Pageable pageable) {
        if( null == client ){
            HashMap<String ,Object> result = new HashMap<>();
            result.put("total", 0);
            result.put("keywordList", new ArrayList<>());
            result.put("pageable", pageable);
            return  result;
        }
        HighlightBuilder highlightBuilder = new HighlightBuilder();
        HighlightBuilder.Field highlightTitle =
                new HighlightBuilder.Field(Const.ElasticSearch.FIELD_AUTOCOMPLETE);
//        highlightTitle.highlighterType("unified");
        highlightBuilder.field(highlightTitle);
        QueryBuilder queryBuilder = QueryBuilders.boolQuery()
                .should(QueryBuilders.matchQuery(Const.ElasticSearch.FIELD_AUTOCOMPLETE, str))
                .should(QueryBuilders.prefixQuery(Const.ElasticSearch.FIELD_AUTOCOMPLETE, str));
        SearchResponse response = null;
        HashMap<String ,Object> result = new HashMap<>();
        try{
            response = client.prepareSearch(Const.ElasticSearch.INDEX)
                    .setTypes(Const.ElasticSearch.TYPE_AUTO_COMPLETE)
//                .setTypes(Const.ElasticSearch.TYPE_ANALYSIS_APP)
                    .highlighter(highlightBuilder)
                    .setFetchSource(false)
                    .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
//                .addStoredField("autocomplete")
                    .setQuery(queryBuilder)
                    .setFrom(pageable.getPageNumber()*pageable.getPageSize()).setSize(pageable.getPageSize())
                    .get();

            SearchHits hits = response.getHits();
            SearchHit[] hitArray = response.getHits().getHits();
            List<String> keywordList = new ArrayList<>();
            for ( int i = 0 ; i < hitArray.length ; i++ ){
                SearchHit hit = hitArray[i];
                Text[] texts = hit.getHighlightFields().get(Const.ElasticSearch.FIELD_AUTOCOMPLETE).getFragments();
                keywordList.add( texts[0].toString());
            }
            result.put("total", hits.getTotalHits());
            result.put("keywordList", keywordList);
            result.put("pageable", pageable);
        }catch(Exception e){
            log.error(e.getMessage());

        }
        return result;

    }

    public void setBulk(List<AutoCompleteIndexVO> list) {
        if( null == client ){
            return;
        }
        BulkRequestBuilder brb = client.prepareBulk();
        list.forEach(vo -> {
            AnalyzeRequest request = (new AnalyzeRequest("metatron-portal").text(vo.getAutocomplete())).analyzer("korean");
            List<AnalyzeResponse.AnalyzeToken> tokens = client.admin().indices().analyze(request).actionGet().getTokens();
            ObjectMapper mapper = new ObjectMapper();

            try {
                brb.add(client.prepareIndex(Const.ElasticSearch.INDEX, Const.ElasticSearch.TYPE_AUTO_COMPLETE, vo.getId()).setSource(mapper.writeValueAsString(vo)));
                for (AnalyzeResponse.AnalyzeToken token : tokens) {
                    if (!ArrayUtils.contains(Const.ElasticSearch.AUTOCOMPLETE_TAG, token.getType())) {
                        continue;
                    }
                    AutoCompleteIndexVO autoCompleteIndexVO = new AutoCompleteIndexVO();
                    autoCompleteIndexVO.setAutocomplete(token.getTerm());
                    autoCompleteIndexVO.setId(token.getTerm());


                    //Object to JSON in String
                    String jsonInString = mapper.writeValueAsString(autoCompleteIndexVO);
                    brb.add(client.prepareIndex(Const.ElasticSearch.INDEX, Const.ElasticSearch.TYPE_AUTO_COMPLETE, autoCompleteIndexVO.getId()).setSource(mapper.writeValueAsString(autoCompleteIndexVO)));


                }
            } catch (Exception e) {
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
    }

}
