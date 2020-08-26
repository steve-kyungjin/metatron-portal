package app.metatron.portal.portal.metadata.service;

import app.metatron.portal.common.service.BaseService;
import org.springframework.stereotype.Service;

/**
 * 메타데이터 아이디 채번 서비스
 */
@Service
public class MetaIdGenerator extends BaseService {

    /**
     * 메타데이터 주제영역 아이디 생성
     * @return
     */
    public String genSubjectId( String criteriaId, int level ) {
        /*
    - 주제영역 ID의 구성
       -> DSA-주제영역 분류 기준 코드-4자리 코드
       -> 4자리 코드는 각각 36진법으로 할용(즉 0 ~ 9와 A ~ Z까지 활용)
    - 주제영역 ID의 생성
       -> 최상위 주제영역은 4자리 중 반드시 첫째자리에 x000으로 생성
       -> 2레벨 주제영역은 4자리 중, 두번째 자리에 xz00으로 생성

         */



        return null;
    }

    /**
     * 메타데이터 연계 시스템 아이디 생성
     * @return
     */
    public String genSystemId() {
        /*
    연계 시스템 ID
    - 3자리 코드이며, 각 자리마다 36진법을 활용

         */


        return null;
    }

    /**
     * 메타데이터 인스턴스 아이디 생성
     * @return
     */
    public String genInstanceId() {
        /*

ㅇDBMS 인스턴스 ID
    - 5자리 숫자 코드로 구성 ( 10000~99999 )
    - 최대치에서 1식 증가 추가
ㅇ상하위 관계 ID
    - 하위는 DBMS 데이터베이스와 연결되나, 연결성은 DBMS 데이터베이스쪽에서 잡도록 구성
ㅇ 상호 관계 구성
    - 연계 시스템 ID와 DBMS 인스턴스 ID는 M:M 관계를 가짐
    - 기존에는 관계 정의가 되어 있지 않았던 부분으로, 관계 정의가 추가되어야 함


         */


        return null;
    }

    /**
     * 메타데이터 데이터베이스 아이디 생성
     * @return
     */
    public String genDatabaseId() {
        /*

ㅇ 데이터베이스 ID 관리 (자동화)
    - 7자리 숫자 코드로 구성 ( 1000000 ~ 9999999 )
    - 최대치에서 MAX로 구성
ㅇ 상하위 관계 ID
    - 상위는 반드시 DBMS 인스턴스 ID와 연계되어야 함
         */


        return null;
    }

    /**
     * 메타데이터 테이블 아이디 생성
     * @return
     */
    public String genTableId() {
        /*

ㅇ 테이블 ID 규칙
   - 1000000 ~ 9999999 사이의 숫자중, 빈 숫자로 설정
   - 현재는 ODS는 1000000대, DW는 2000000대, DM은 3000000대로 되어 있으나, 빈 곳으로 처리하면되므로, 30000000대 이후 MAX로 처리


         */

        return null;
    }

    /**
     * 메타데이터 주제영역 컬럼 생성
     * @return
     */
    public String genColumnId() {
        /*

ㅇ 컬럼 ID 규칙
   - 테이블 ID에서 연계하여 생성
   - 테이블 ID X 10000 + 1 ~ 9999 로 생성
   - 만약, 테이블 ID는 1000999 이면, 10009990000 + 1 = 10009990001 과 같이 생성
   - 컬럼이 추가 삭제될 때, ID는 다음과 같이 처리
      추가 시는 MAX로 처리, 삭제시는 논리적인 삭제로 처리

         */

        return null;
    }

}
