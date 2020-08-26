package app.metatron.portal.portal.analysis.domain;

//import app.metatron.portal.common.user.domain.RoleDto;
import io.swagger.annotations.ApiModel;
        import io.swagger.annotations.ApiParam;
import lombok.Getter;
import lombok.Setter;

/**
 * 앱 리뷰
 */
public class AnalysisAppReviewDto {


    @Getter
    @Setter
    @ApiModel("AnalysisAppDto.CREATE")
    public static class CREATE {
        @ApiParam(
                value = "APP000001",
                required = true
        )
        private String appId;
        private String contents;
        private String parent;
    }

    @Getter
    @Setter
    @ApiModel("AnalysisAppDto.EDIT")
    public static class EDIT {
        private String id;
        private String contents;
    }

}
