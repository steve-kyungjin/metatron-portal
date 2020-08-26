package app.metatron.portal.portal.search.repository;

import app.metatron.portal.common.util.CommonUtil;
import app.metatron.portal.portal.search.domain.MetaTableIndexVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import app.metatron.portal.common.constant.Const;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHits;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 메타데이터 테이블 검색
 */
@Slf4j
@Repository
public class MetaTableEsRepository {

    @Autowired
    private TransportClient client;

    @Autowired
    public MetaTableEsRepository(TransportClient client) {
        this.client = client;
    }

    public Map<String, Object> findString(String str, Pageable pageable) {
        if( null == client ){
            return  CommonUtil.getEsEmptyData("contentsList", pageable);
        }
        str = StringUtils.lowerCase(str);
        QueryBuilder queryBuilder = QueryBuilders.boolQuery()
                .should(QueryBuilders.matchQuery("logicalNm", str))
                .should(QueryBuilders.prefixQuery("physicalNm", str))
                .should(QueryBuilders.prefixQuery("description", str))
                .should(QueryBuilders.prefixQuery("dataLayer", str))
                .should(QueryBuilders.prefixQuery("databaseNm", str))
                .should(QueryBuilders.prefixQuery("subjects", str))
                .should(QueryBuilders.prefixQuery("firstCreated", str))
                .should(QueryBuilders.prefixQuery("manager", str))
                .should(QueryBuilders.prefixQuery("dataType", str))
                .should(QueryBuilders.prefixQuery("dataCycle", str))
                .should(QueryBuilders.prefixQuery("historyType", str))
                .should(QueryBuilders.prefixQuery("retentionPeriod", str))
                .should(QueryBuilders.prefixQuery("securityLevel", str))
                .should(QueryBuilders.prefixQuery("privacyLevel", str));


        Map<String ,Object> result = new HashMap<>();
        SearchResponse response = null;
        try{
            response = client.prepareSearch(Const.ElasticSearch.INDEX)
                    .setTypes(Const.ElasticSearch.TYPE_META_TABLE)
                    .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                    .setQuery(queryBuilder)
                    .setFrom(pageable.getPageNumber()*pageable.getPageSize()).setSize(pageable.getPageSize())
                    .get();
            SearchHits hits = response.getHits();
            result.put("total", hits.getTotalHits());
            result.put("contentsList", hits.getHits());
            result.put("pageable", pageable);
        }catch(Exception e){
            result = CommonUtil.getEsEmptyData("contentsList", pageable);
        }
        return result;
    }

    public void setBulk(List<MetaTableIndexVO> list) {
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
                brb.add(client.prepareIndex(Const.ElasticSearch.INDEX,Const.ElasticSearch.TYPE_META_TABLE,vo.getId()).setSource(mapper.writeValueAsString(vo)));
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
}
