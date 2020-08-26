package app.metatron.portal.portal.project.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * 과제 DTO
 */
public class ProjectDto {

    @Setter
    @Getter
    @ApiModel("ProjectDto.CREATE")
    public static class CREATE {
        @NotNull
        private String name;

        @NotNull
        private String summary;

        private String benefit;

        private String startDate;

        private String endDate;

        @NotNull
        @ApiModelProperty(value= "progress", allowableValues="PLANNING, DESIGN, DEVELOP, TEST, PRODUCT", notes = "Progress Types : PLANNING, DESIGN, DEVELOP, TEST, PRODUCT",required = true)
        private String progress;

        private String description;

        @NotNull
        private String typeId;

        private String workOrgId;

        private String workerId;

        private String coworkOrgId;

        private String fileGroupId;
    }

    @Setter
    @Getter
    @ApiModel("ProjectDto.EDIT")
    public static class EDIT {
        @NotNull
        private String id;

        @NotNull
        private String name;

        @NotNull
        private String summary;

        private String benefit;

        private String startDate;

        private String endDate;

        @NotNull
        @ApiModelProperty(value= "progress", allowableValues="PLANNING, DESIGN, DEVELOP, TEST, PRODUCT", notes = "Progress Types : PLANNING, DESIGN, DEVELOP, TEST, PRODUCT",required = true)
        private String progress;

        private String description;

        @NotNull
        private String typeId;

        private String workOrgId;

        private String workerId;

        private String coworkOrgId;

        private String fileGroupId;
    }

}
