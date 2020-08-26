package app.metatron.portal.portal.analysis.domain;

import app.metatron.portal.common.constant.Const;
//import app.metatron.portal.common.user.domain.RoleDto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Set;

public class AnalysisAppDto {

    // 검색 PARAM
    @Getter
    @Setter
    @ApiModel("AnalysisAppDto.PARAM")
    public static class PARAM {
        // 카테고리 리스트
        private Set<String> categories;
        // 검색어
        private String keyword;
        // 검색컬럼
        private String column;
        // use flag
        private String use = Const.Common.VALUE_Y;
        // del flag
        private String del = Const.Common.VALUE_N;
    }

    @Getter
    @Setter
    @ApiModel("AnalysisAppDto.CREATE")
    public static class CREATE {

        // 헤더타입
        @NotNull
        @Size(min=2, max=30)
        @ApiModelProperty(value= "headerType", allowableValues="URL, METATRON, EXTRACT", notes = "AnalysisApp HeaderType : URL, METATRON, EXTRACT",required = true)
        private String headerType;

        // URL 헤더
        private UrlHeader urlHeader;
        // 메타트론 헤더
        private MetatronHeader metatronHeader;
        // Extract 헤더
        private ExtractHeader extractHeader;

        /**
         * 카테고리 리스트
         */
        @NotNull
        @ApiModelProperty(required = true)
        private List<String> categories;

        /**
         * 권한 리스트
         */
        @ApiModelProperty
        private List<String> roles;
        // App 명
        @NotNull
        @ApiModelProperty(required = true)
        private String appNm;
        // App 요약
        @NotNull
        @ApiModelProperty(required = true)
        private String summary;
        // App 소개
        @NotNull
        @Size(min=0, max=3000)
        @ApiModelProperty(required = true)
        private String contents;
        // App 버전
        @NotNull
        @Size(min=0, max=10)
        @ApiModelProperty(required = true)
        private String ver;

        // App 버전
        @Size(min=0, max=3000)
        private String verInfo;

        // 사용 여부
        private Boolean useYn;

        // 새창여부
        private Boolean externalYn = false;
    }

    @Getter
    @Setter
    @ApiModel("AnalysisAppDto.EDIT")
    public static class EDIT {

        @NotNull
        private  String id;

        // 헤더타입
        @NotNull
        @Size(min=2, max=30)
        @ApiModelProperty(value= "headerType", allowableValues="URL, METATRON, EXTRACT", notes = "AnalysisApp HeaderType : URL, METATRON, EXTRACT",required = true)
        private String headerType;

        // URL 헤더
        private UrlHeader urlHeader;
        // 메타트론 헤더
        private MetatronHeader metatronHeader;
        // Extract 헤더
        private ExtractHeader extractHeader;

        /**
         * 카테고리 리스트
         */
        @NotNull
        @ApiModelProperty(required = true)
        private List<String> categories;

        /**
         * 권한 리스트
         */
        @ApiModelProperty
        private List<String> roles;
        // App 명
        @NotNull
        @ApiModelProperty(required = true)
        private String appNm;
        // App 요약
        @NotNull
        @ApiModelProperty(required = true)
        private String summary;
        // App 소개
        @NotNull
        @Size(min=0, max=3000)
        @ApiModelProperty(required = true)
        private String contents;
        // App 버전
        @NotNull
        @Size(min=0, max=10)
        @ApiModelProperty(required = true)
        private String ver;

        // App 버전
        @Size(min=0, max=3000)
        private String verInfo;

        // 사용 여부
        private Boolean useYn;

        // 파일 그룹
        private String mediaGroupId;


        // 삭제 파일 아이디
        private List<String> delFileIds;

        // 새창여부
        private Boolean externalYn = false;
    }

    @Getter
    @Setter
    @ApiModel("AnalysisAppDto.UrlHeader")
    public static class UrlHeader {
        private String url;
    }

    @Getter
    @Setter
    @ApiModel("AnalysisAppDto.MetatronHeader")
    public static class MetatronHeader {
        private String type;
        private String contentsId;
        private String contentsNm;
        private String locationId;

    }
    @Getter
    @Setter
    @ApiModel("AnalysisAppDto.ExtractHeader")
    public static class ExtractHeader {
        private String sqlTxt;
        private String dataSourceId;

    }




}
