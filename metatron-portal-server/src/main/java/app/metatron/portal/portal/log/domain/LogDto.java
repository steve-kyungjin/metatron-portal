package app.metatron.portal.portal.log.domain;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * 로그 DTO
 */
public class LogDto {

    @Setter
    @Getter
    @ApiModel("LogDto.Action")
    public static class Action {

        @NotNull
        private String system;

        @NotNull
        private String module;

        @NotNull
        private String type;

        @NotNull
        private String action;

        private String var;
    }

}
