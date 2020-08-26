package app.metatron.portal.common.zipcode.service;


import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.common.zipcode.domain.ZipCodeDto;
import app.metatron.portal.common.zipcode.domain.ZipCodeEntity;
import app.metatron.portal.common.zipcode.repository.ZipCodeRepository;
import app.metatron.portal.portal.datasource.service.JdbcConnectionService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.ArrayList;
import java.util.List;

@Service
@Validated
@Transactional
public class ZipCodeService extends AbstractGenericService<ZipCodeEntity, String> {

//    @Value("${tango.gis.host}")
//    private String gisHost;
//
//    @Value("${tango.gis.port}")
//    private String gisPort;
//
//    @Value("${tango.gis.database}")
//    private String gisDatabase;
//
//    @Value("${tango.gis.user}")
//    private String gisUser;
//
//    @Value("${tango.gis.password}")
//    private String gisPassword;


    @Autowired
    private ZipCodeRepository zipCodeRepository;

    @Autowired
	private JdbcConnectionService jdbcConnectionService;

    @Autowired
	protected ModelMapper modelMapper;
    
	@Override
	protected JpaRepository<ZipCodeEntity, String> getRepository() {
		return zipCodeRepository;
	}

	public List<ZipCodeDto.Sido> getSidoList() {
	    return zipCodeRepository.findDistinctByOrderBySido();
	}

	public List<ZipCodeDto.Sigungu> getSigunguList(List<String> sido) {
		return zipCodeRepository.findDistinctBySidoInOrderBySigungu(sido);
	}

    public List<ZipCodeDto.SigunguExp> getSigunguList(String sido) {
//        return zipCodeRepository.findDistinctBySidoOrderBySigungu(sido);
        return zipCodeRepository.getDongCodeBySido(sido);
    }

	public List<ZipCodeDto.Dong> getDongList(List<String> sido, List<String> sigungu ) {

		return zipCodeRepository.findDistinctBySidoAndSigunguInOrderByDong(sido, sigungu);
	}

    public List<ZipCodeDto.Dong> getDongList(String sido, String sigungu ) {

        return zipCodeRepository.findDistinctBySidoAndSigunguOrderByDong(sido, sigungu);
    }



	public List<String> getZipCodeSimpleList(List<String> sido, List<String> sigungu, List<String> dong ) {
	    ZipCodeDto.PARAM param = new ZipCodeDto.PARAM();
	    param.setSido(sido);
	    param.setSigungu(sigungu);
	    param.setDong(dong);
	    List<ZipCodeDto.Zipcode> zipcodes = this.getZipCodeList(param);

	    List<String> zips = new ArrayList<>();
	    if( zipcodes != null && zipcodes.size() > 0 ) {
	        zipcodes.forEach(zip -> {
	            zips.add(zip.getZipcode());
            });
        }
	    return zips;
    }

    public List<ZipCodeDto.Zipcode> getZipCodeList(ZipCodeDto.PARAM param/*, boolean withWkt*/) {
	    List<ZipCodeDto.Zipcode> zipCodeList = new ArrayList<>();
	    List<String> zipCodes = null;
	    if( param.getZipcode() != null && param.getZipcode().size() > 0 ) {
	        zipCodes = param.getZipcode();
        } else {
            if( param.getDong() != null && param.getDong().size() > 0) {
                if (param.getSigungu() == null || param.getSigungu().size() == 0 ){
                    zipCodes = zipCodeRepository.getZipCodeListSidoAndDong(param.getSido(), param.getDong());
                }else{
                    zipCodes = zipCodeRepository.getZipCodeList(param.getSido(), param.getSigungu(), param.getDong());
                }

            } else if( param.getSigungu() != null && param.getSigungu().size() > 0 ) {
                zipCodes = zipCodeRepository.getZipCodeList(param.getSido(), param.getSigungu());
            } else {
                zipCodes = zipCodeRepository.getZipCodeList(param.getSido());
            }
        }

        // make datasource
//        DataSourceDto.ONCE dataSourceDto = new DataSourceDto.ONCE();
//        dataSourceDto.setDatabaseType(DatabaseType.POSTGRESQL.toString());
//        dataSourceDto.setHost(gisHost);
//        dataSourceDto.setPort(gisPort);
//        dataSourceDto.setDatabaseNm(gisDatabase);
//        dataSourceDto.setDatabaseUser(gisUser);
//        dataSourceDto.setDatabasePassword(gisPassword);

        if( zipCodes != null && zipCodes.size() > 0 ) {
	        zipCodes.forEach(zip -> {
                ZipCodeDto.Zipcode zipcode = new ZipCodeDto.Zipcode();
                zipcode.setZipcode(zip);
//	            if( withWkt ) {
//                    List<String> wkt = new ArrayList<>();
//                    List<Map<String, Object>> polygonVectors = getPolygonVector(dataSourceDto, zip);
//                    if( polygonVectors != null && polygonVectors.size() > 0 ) {
//                        polygonVectors.forEach(pv -> {
//                            String wktValue = null;
//                            String wktStr = pv.get("wkt")==null? "": pv.get("wkt").toString();
//                            if( wktStr.indexOf(";") > -1 ) {
//                                String[] wktArr = wktStr.split(";");
//                                if( wktArr.length > 1 ) {
//                                    wktValue = wktArr[1];
//                                }
//                            }
//                            wkt.add(wktValue);
//                        });
//                    }
//                    zipcode.setWkt(wkt);
//                }
                zipCodeList.add(zipcode);
            });
        }
        return zipCodeList;
    }

//    private List<Map<String, Object>> getPolygonVector(DataSourceDto.ONCE dataSourceDto, String zipcode) {
//	    // generate sql
//        StringBuilder sqlBuilder = new StringBuilder();
//        sqlBuilder.append("select st_asewkt(st_transform(st_setsrid(the_geom,5181),4326)) as wkt ");
//        sqlBuilder.append("from ");
//        sqlBuilder.append("(select st_union(the_geom) as the_geom from gis_tl_kodis_bas where ");
//        sqlBuilder.append("bas_id = ");
//        sqlBuilder.append("'");
//        sqlBuilder.append(zipcode);
//        sqlBuilder.append("'");
//        sqlBuilder.append(" ) as g1");
//
//        QueryResult queryResult = jdbcConnectionService.queryForList(dataSourceDto, sqlBuilder.toString(), 0, 0);
//	    return queryResult.getResultList();
//    }

}