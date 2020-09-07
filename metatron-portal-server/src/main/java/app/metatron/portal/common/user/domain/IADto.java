package app.metatron.portal.common.user.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * IA DTO
 */
public class IADto {

    @Setter
    @Getter
    @ApiModel("IADto.CREATE")
    public static class CREATE {

        @NotNull
        @Size(max = 100)
        private String iaNm;

        @Size(max = 255)
        private String iaDesc;

        @NotNull
        private int depth;

        private boolean externalYn = false;

        private boolean displayYn = false;

        private boolean linkYn = false;

        // not available
        private boolean editYn = true;

        private String icon;
        private boolean extraYn = false;
        private String iaDetailDesc;

        @Size(max = 200)
        private String path;

        @NotNull
        private int iaOrder;

        private String parentId;
    }

    @Setter
    @Getter
    @ApiModel("IADto.EDIT")
    public static class EDIT {

        private String id;

        @NotNull
        @Size(max = 100)
        private String iaNm;

        @Size(max = 255)
        private String iaDesc;

        @NotNull
        private int depth;

        private boolean externalYn = false;

        private boolean displayYn = false;

        private boolean linkYn = false;

        // not available
        private boolean editYn = true;

        private String icon;
        private boolean extraYn = false;
        private String iaDetailDesc;

        @Size(max = 200)
        private String path;

        @NotNull
        private int iaOrder;

        private String parentId;

    }

}
