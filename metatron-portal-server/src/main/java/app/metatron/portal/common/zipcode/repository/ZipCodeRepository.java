package app.metatron.portal.common.zipcode.repository;

import app.metatron.portal.common.zipcode.domain.ZipCodeDto;
import app.metatron.portal.common.zipcode.domain.ZipCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ZipCodeRepository extends JpaRepository<ZipCodeEntity, String>{

    List<ZipCodeDto.Sido> findDistinctByOrderBySido();

    List<ZipCodeDto.Sigungu> findDistinctBySidoInOrderBySigungu(List<String> sido);

    List<ZipCodeDto.Dong> findDistinctBySidoAndSigunguInOrderByDong(List<String> sido, List<String> sigungu);

    @Query("select distinct zip.sigungu as sigungu, " +
            "concat(substring(zip.dongcode, 1, 5),'00000') as sigunguCd " +
            "from ZipCodeEntity zip " +
            "where zip.sido = :sido " +
            "group by zip.sigungu " +
            "order by zip.sigungu asc " )
    List<ZipCodeDto.SigunguExp> getDongCodeBySido(@Param("sido") String sido);

    List<ZipCodeDto.Dong> findDistinctBySidoAndSigunguOrderByDong(String sido, String sigungu);


    @Query(
            "select distinct zip.zipcode from ZipCodeEntity zip " +
                    "where " +
                    "zip.sido in :sido " +
                    "and zip.sigungu in :sigungu " +
                    "and (zip.dong in :dong or zip.ri in :dong) " +
                    "order by zip.zipcode asc "
    )
    List<String> getZipCodeList(@Param("sido") List<String> sido, @Param("sigungu") List<String> sigungu, @Param("dong") List<String> dong);

    @Query(
            "select distinct zip.zipcode from ZipCodeEntity zip " +
                    "where " +
                    "zip.sido in :sido " +
                    "and (zip.dong in :dong or zip.ri in :dong) " +
                    "order by zip.zipcode asc "
    )
    List<String> getZipCodeListSidoAndDong(@Param("sido") List<String> sido, @Param("dong") List<String> dong);

    @Query(
            "select distinct zip.zipcode from ZipCodeEntity zip " +
                    "where " +
                    "zip.sido in :sido " +
                    "and zip.sigungu in :sigungu " +
                    "order by zip.zipcode asc "
    )
    List<String> getZipCodeList(@Param("sido") List<String> sido, @Param("sigungu") List<String> sigungu);


    @Query(
            "select distinct zip.zipcode from ZipCodeEntity zip " +
                    "where " +
                    "zip.sido in :sido " +
                    "order by zip.zipcode asc "
    )
    List<String> getZipCodeList(@Param("sido") List<String> sido);



}