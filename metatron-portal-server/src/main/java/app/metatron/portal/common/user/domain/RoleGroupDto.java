package app.metatron.portal.common.user.domain;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * RoleGroup DTO
 */
public class RoleGroupDto {

    @Setter
    @Getter
    @ApiModel("RoleGroupDto.CREATE")
    public static class CREATE {

        @NotNull
        @ApiModelProperty(value= "type", allowableValues="GENERAL, ORGANIZATION, SYSTEM, PRIVATE", notes = "type : GENERAL, ORGANIZATION, SYSTEM, PRIVATE")
        private String type;

        @NotNull
        private String name;

        private String description;

        private String parentId;
    }

    @Setter
    @Getter
    @ApiModel("RoleGroupDto.EDIT")
    public static class EDIT {
        @NotNull
        private String id;

        @NotNull
        @ApiModelProperty(value= "type", allowableValues="GENERAL, ORGANIZATION, SYSTEM, PRIVATE", notes = "type : GENERAL, ORGANIZATION, SYSTEM, PRIVATE")
        private String type;

        @NotNull
        private String name;

        private String description;

        private String parentId;
    }

    @Setter
    @Getter
    @ApiModel("RoleGroupDto.AddMember")
    public static class AddMember {
        private String groupId;

        private List<String> users;
    }

    @Setter
    @Getter
    @ApiModel("RoleGroupDto.IA")
    public static class IA {
        private String iaId;

        private String permission;
    }

}
