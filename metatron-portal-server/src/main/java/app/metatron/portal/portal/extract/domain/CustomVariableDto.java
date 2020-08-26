package app.metatron.portal.portal.extract.domain;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

public class CustomVariableDto {

    @Setter
    @Getter
    @ApiModel("CustomVariableDto.CREATE")
    public static class CREATE {
        /**
         * 이름
         */
        private String name;

        /**
         * 설명
         */
        private String description;

        /**
         * 쿼리
         */
        private String sqlTxt;

        /**
         * 검색키
         */
        private String searchKey;

        /**
         * 데이터소스
         */
        private String dataSourceId;
    }

    @Setter
    @Getter
    @ApiModel("CustomVariableDto.EDIT")
    public static class EDIT {
        private String id;

        /**
         * 이름
         */
        private String name;

        /**
         * 설명
         */
        private String description;

        /**
         * 쿼리
         */
        private String sqlTxt;

        /**
         * 검색키
         */
        private String searchKey;

        /**
         * 데이터소스
         */
        private String dataSourceId;
    }

}
