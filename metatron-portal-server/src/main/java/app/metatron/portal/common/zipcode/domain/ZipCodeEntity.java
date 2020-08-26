package app.metatron.portal.common.zipcode.domain;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;

/*
 * Class Name : ZipCodeEntity
 * 
 * Class Description: ZipCodeEntity Class
 *
 * Created by nogah on 2018-05-09.
 *
 * Version : v1.0
 *
 */
@Entity
@Table(name = "mp_cm_zipcode" ,indexes = {
        @Index(name = "idx_mp_cm_zipcode_sido",  columnList="sido", unique = false),
        @Index(name = "idx_mp_cm_zipcode_sigungu",  columnList="sigungu", unique = false),
        @Index(name = "idx_mp_cm_zipcode_dong",  columnList="dong", unique = false),
        @Index(name = "idx_mp_cm_zipcode_street",  columnList="street", unique = false),
        @Index(name = "idx_mp_cm_zipcode_zipcode",  columnList="zipcode", unique = false),
        @Index(name = "idx_mp_cm_zipcode_dongcode",  columnList="dongcode", unique = false),
        @Index(name = "idx_mp_cm_zipcode_sido_dongcode",  columnList="sido, dongcode", unique = false),
        @Index(name = "idx_mp_cm_zipcode_sido_sigungu_dongcode",  columnList="sido, sigungu, dongcode", unique = false)
})
public class ZipCodeEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;
    // 우편번호
    private String zipcode;
    // 시도
    private String sido;
    // 시도 영문
    private String sido_en;
    // 시군구
    private String sigungu;
    //시군구 영문
    private String sigungu_en;
    // 읍면
    private String eupmyun;
    // 읍면 영문
    private String eupmyun_eng;
    //도로명 코드
    private String streetcode;
    // 도로명
    private String street;
    // 도로명 영문
    private String street_eng;
    // 지하여부
    @Type(type = "yes_no")
    @Column(length = 1 )
    private boolean isunder;
    // 건물번호 본번
    private int buildingnum1;
    // 건물번호 부번
    private int buildingnum2;
    // 건물관리번호
    private String buildingcode;
    // 다량배달처명
    private String massdestination;
    // 시군구용건물명
    private String building;
    // 법정동코드
    private String dongcode;
    // 법정동명
    private String dong;
    // 행정동명
    private String dongAdmin;
    // 리
    private String ri;
    // 산여부
    @Type(type = "yes_no")
    @Column(length = 1 )
    private boolean ismountain;
    // 지번본번
    private int jibun1;
    // 읍명동일련번호
    private String dongseq;
    // 지번부번
    private int jibun2;

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

    public String getSido() {
        return sido;
    }

    public void setSido(String sido) {
        this.sido = sido;
    }

    public String getSido_en() {
        return sido_en;
    }

    public void setSido_en(String sido_en) {
        this.sido_en = sido_en;
    }

    public String getSigungu() {
        return sigungu;
    }

    public void setSigungu(String sigungu) {
        this.sigungu = sigungu;
    }

    public String getSigungu_en() {
        return sigungu_en;
    }

    public void setSigungu_en(String sigungu_en) {
        this.sigungu_en = sigungu_en;
    }

    public String getEupmyun() {
        return eupmyun;
    }

    public void setEupmyun(String eupmyun) {
        this.eupmyun = eupmyun;
    }

    public String getEupmyun_eng() {
        return eupmyun_eng;
    }

    public void setEupmyun_eng(String eupmyun_eng) {
        this.eupmyun_eng = eupmyun_eng;
    }

    public String getStreetcode() {
        return streetcode;
    }

    public void setStreetcode(String streetcode) {
        this.streetcode = streetcode;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getStreet_eng() {
        return street_eng;
    }

    public void setStreet_eng(String street_eng) {
        this.street_eng = street_eng;
    }

    public boolean isIsunder() {
        return isunder;
    }

    public void setIsunder(boolean isunder) {
        this.isunder = isunder;
    }

    public int getBuildingnum1() {
        return buildingnum1;
    }

    public void setBuildingnum1(int buildingnum1) {
        this.buildingnum1 = buildingnum1;
    }

    public int getBuildingnum2() {
        return buildingnum2;
    }

    public void setBuildingnum2(int buildingnum2) {
        this.buildingnum2 = buildingnum2;
    }

    public String getBuildingcode() {
        return buildingcode;
    }

    public void setBuildingcode(String buildingcode) {
        this.buildingcode = buildingcode;
    }

    public String getMassdestination() {
        return massdestination;
    }

    public void setMassdestination(String massdestination) {
        this.massdestination = massdestination;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getDongcode() {
        return dongcode;
    }

    public void setDongcode(String dongcode) {
        this.dongcode = dongcode;
    }

    public String getDong() {
        return dong;
    }

    public void setDong(String dong) {
        this.dong = dong;
    }

    public String getRi() {
        return ri;
    }

    public void setRi(String ri) {
        this.ri = ri;
    }

    public String getDongAdmin() {
        return dongAdmin;
    }

    public void setDongAdmin(String dongAdmin) {
        this.dongAdmin = dongAdmin;
    }

    public boolean isIsmountain() {
        return ismountain;
    }

    public void setIsmountain(boolean ismountain) {
        this.ismountain = ismountain;
    }

    public int getJibun1() {
        return jibun1;
    }

    public void setJibun1(int jibun1) {
        this.jibun1 = jibun1;
    }

    public String getDongseq() {
        return dongseq;
    }

    public void setDongseq(String dongseq) {
        this.dongseq = dongseq;
    }

    public int getJibun2() {
        return jibun2;
    }

    public void setJibun2(int jibun2) {
        this.jibun2 = jibun2;
    }
}
