package app.metatron.portal.common.user.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * IA를 이용한 메뉴 구성 VO
 */
public class MenuVO implements Serializable {

    public enum AppType {
        POPULAR, LATEST
    }

    /**
     * IA 와 퍼미션
     */
    public interface IAAndPermission {
        IAEntity getIa();
        PermissionType getPermission();
    }

    private static final long serialVersionUID = 1L;

    /**
     * ID
     */
    private String id;

    /**
     * 이름
     */
    private String name;

    /**
     * 설명
     */
    private String desc;

    /**
     * 외부/내부 여부
     */
    private boolean external;

    /**
     * 기본 경로
     */
    private String path;

    /**
     * 퍼미션 : RO, RW, SA
     */
    private String permission;

    /**
     * 링크 여부
     */
    private boolean link;

    /**
     * 메뉴 노출여부
     */
    private boolean display;

    /**
     * 하위 메뉴
     */
    private List<MenuVO> children = new ArrayList<>();

    /**
     * 앱에서 사용될 썸네일 미디어 아이디
     */
    private String media;

    private Object extra;

    private AppType appType;

    public AppType getAppType() {
        return appType;
    }

    public void setAppType(AppType appType) {
        this.appType = appType;
    }

    public Object getExtra() {
        return extra;
    }

    public void setExtra(Object extra) {
        this.extra = extra;
    }

    public boolean isDisplay() {
        return display;
    }

    public void setDisplay(boolean display) {
        this.display = display;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isExternal() {
        return external;
    }

    public void setExternal(boolean external) {
        this.external = external;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public boolean isLink() {
        return link;
    }

    public void setLink(boolean link) {
        this.link = link;
    }

    public List<MenuVO> getChildren() {
        return children;
    }

    public void setChildren(List<MenuVO> children) {
        this.children = children;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getMedia() {
        return media;
    }

    public void setMedia(String media) {
        this.media = media;
    }
}
