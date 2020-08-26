package app.metatron.portal.portal.extract.repository;

import app.metatron.portal.portal.extract.domain.CustomVariableEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface CustomVariableRepository extends JpaRepository<CustomVariableEntity, String> {

    /**
     * 사용자 정의 변수 목록
     * @param keyword
     * @param pageable
     * @return
     */
    @Query("select var from CustomVariableEntity var " +
            "where (:keyword is null or var.name like concat('%',:keyword,'%') ) " +
            "order by var.name asc ")
    Page<CustomVariableEntity> getCustomVariableList(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 변수명으로 존재여부 확인
     * @param name
     * @return
     */
    boolean existsByName(String name);

    /**
     * 변수명으로 얻기
     * @param name
     * @return
     */
    CustomVariableEntity findByName(String name);
}
