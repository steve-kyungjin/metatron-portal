package app.metatron.portal.portal.datasource.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.ws.rs.DefaultValue;

/**
 * 데이터소스 DTO
 */
public class DataSourceDto {

    @Getter
    @Setter
    @ApiModel("DataSourceDto.CREATE")
    public static class CREATE {

        @NotNull
        @ApiModelProperty(required = true)
        private String name;

        @NotNull
        @ApiModelProperty(required = true)
        private String host;

        private String port;

        @NotNull
        @ApiModelProperty(value= "databaseType", allowableValues="HIVE, MYSQL, POSTGRESQL", notes = "Database Type : HIVE, MYSQL",required = true)
        private String databaseType;

        @DefaultValue(value = "")
        private String databaseNm;

        @DefaultValue(value = "")
        private String databaseUser;

        @DefaultValue(value = "")
        private String databasePassword;
    }

    @Getter
    @Setter
    @ApiModel("DataSourceDto.EDIT")
    public static class EDIT {

        @NotNull
        @ApiModelProperty(required = true)
        private String id;

        @NotNull
        @ApiModelProperty(required = true)
        private String name;

        @NotNull
        @ApiModelProperty(required = true)
        private String host;

        private String port;

        @NotNull
        @ApiModelProperty(value= "databaseType", allowableValues="HIVE, MYSQL, POSTGRESQL", notes = "Database Type : HIVE, MYSQL",required = true)
        private String databaseType;

        @DefaultValue(value = "")
        private String databaseNm;

        @DefaultValue(value = "")
        private String databaseUser;

        @DefaultValue(value = "")
        private String databasePassword;
    }

    /**
     * 1회성 데이터 소스
     */
    @Getter
    @Setter
    @ApiModel("DataSourceDto.ONCE")
    public static class ONCE {

        @NotNull
        @ApiModelProperty(required = true)
        private String host;

        private String port;

        @NotNull
        @ApiModelProperty(value= "databaseType", allowableValues="HIVE, MYSQL, POSTGRESQL", notes = "Database Type : HIVE, MYSQL",required = true)
        private String databaseType;

        @DefaultValue(value = "")
        private String databaseNm;

        @DefaultValue(value = "")
        private String databaseUser;

        @DefaultValue(value = "")
        private String databasePassword;
    }
}
