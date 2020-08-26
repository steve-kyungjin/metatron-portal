package app.metatron.portal.portal.report.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiParam;
import lombok.Getter;
import lombok.Setter;

/**
 * 리포트앱 리뷰 DTO
 */
public class ReportAppReviewDto {


    @Getter
    @Setter
    @ApiModel("ReportAppDto.CREATE")
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
    @ApiModel("ReportAppDto.EDIT")
    public static class EDIT {
        private String id;
        private String contents;
    }

}
