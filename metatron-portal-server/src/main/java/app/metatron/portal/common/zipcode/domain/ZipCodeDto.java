package app.metatron.portal.common.zipcode.domain;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/*
 * Class Name : UserDto
 * 
 * Class Description: UserDto Class
 *
 * Created by nogah on 2018-01-26.
 *
 * Version : v1.0
 *
 */
public class ZipCodeDto {

    public interface Sido {
        String getSido();
    }
    public interface Sigungu {
        String getSigungu();
    }

    public interface SigunguExp {
        String getSigungu();
        String getSigunguCd();
    }

    public interface Dong {
        String getRi();
        String getDong();
        String getDongcode();
    }

    @Setter
    @Getter
    @ApiModel("ZipCodeDto.Zipcode")
    public static class Zipcode {
        private String zipcode;
        private List<String> wkt;
    }

    @Setter
    @Getter
    @ApiModel("ZipCodeDto.PARAM")
    public static class PARAM {

        private List<String> sido;

        private List<String> sigungu;

        private List<String> dong;

        private List<String> zipcode;
    }
}


