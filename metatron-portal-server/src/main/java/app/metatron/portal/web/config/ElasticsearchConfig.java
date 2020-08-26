package app.metatron.portal.web.config;

import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.net.InetAddress;

/*
 * Class Name : ElasticsearchConfig
 * 
 * Class Description: ElasticsearchConfig Class
 *
 * Created by nogah on 2018-06-11.
 *
 * Version : v1.0
 *
 */
@Configuration
public class ElasticsearchConfig implements FactoryBean<TransportClient>, InitializingBean, DisposableBean {

    private static final Logger logger = LoggerFactory.getLogger(ElasticsearchConfig.class);

    @Value("${spring.data.elasticsearch.cluster-nodes}")
    private String clusterNodes;

    @Value("${spring.data.elasticsearch.cluster-name}")
    private String clusterName;

    private TransportClient transportClient;
    private PreBuiltTransportClient preBuiltTransportClient;

    @Override
    public void destroy() throws Exception {
        try {
            logger.info("Closing elasticSearch client");
            if (transportClient != null) {
                transportClient.close();
            }
        } catch (final Exception e) {
            logger.error("Error closing ElasticSearch client: ", e);
        }
    }

    @Override
    public TransportClient getObject() throws Exception {
        return transportClient;
    }

    @Override
    public Class<TransportClient> getObjectType() {
        return TransportClient.class;
    }

    @Override
    public boolean isSingleton() {
        return false;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        buildClient();
    }

    protected void buildClient() {
        try {
            preBuiltTransportClient = new PreBuiltTransportClient(settings());
            if( null == clusterNodes  || "".equals(clusterNodes)){
                transportClient = null;
                return;
            }
            String InetSocket[] = clusterNodes.split(":");
            String address = InetSocket[0];
            Integer port = Integer.valueOf(InetSocket[1]);
            transportClient = preBuiltTransportClient.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(address), port));
//
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    /**
     * Elastic Client
     */
    private Settings settings() {
//		Settings settings = Settings.builder().put("cluster.name", clusterName).put("client.transport.sniff", true).build();
        Settings settings = Settings.builder().put("cluster.name", clusterName).build();
        return settings;
    }
}
