package app.metatron.portal.portal.search.domain;

import java.io.Serializable;

/**
 * 검색어 자동완성 색인 VO
 */
public class AutoCompleteIndexVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private String autocomplete;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAutocomplete() {
        return autocomplete;
    }

    public void setAutocomplete(String autocomplete) {
        this.autocomplete = autocomplete;
    }
}
