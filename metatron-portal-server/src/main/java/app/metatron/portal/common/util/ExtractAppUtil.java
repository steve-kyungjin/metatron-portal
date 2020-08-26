package app.metatron.portal.common.util;

import app.metatron.portal.common.value.workbench.BasicNamespace;
import app.metatron.portal.common.value.workbench.ExtractAppModule;
import app.metatron.portal.common.value.workbench.ExtractAppSql;
import app.metatron.portal.portal.extract.service.ExtractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 추출앱 유틸
 *
 *
 기본형
 ${변수종류:변수명('기본값')|'설명'}

 사용자정의형
 단수선택 : &{변수종류:변수명()|'설명'}
 복수선택 : &{변수종류*:변수명()|'설명'}
 *
 */
@Component
public class ExtractAppUtil {

    private static final String NS_TEXT = "text";
    private static final String NS_NUMBER = "number";
    private static final String NS_DATE = "date";
    private static final String NS_SELECT = "select";
    private static final String NS_ARRAY = "array";
    private static final String NS_DATETIME = "datetime";

    /**
     * 접두(네임스페이스)
     */
    private static List<String> BasicNamespaces;

    static {
        BasicNamespaces = new ArrayList<>();
        BasicNamespaces.add(NS_TEXT);
        BasicNamespaces.add(NS_NUMBER);
        BasicNamespaces.add(NS_DATE);
        BasicNamespaces.add(NS_SELECT);
        BasicNamespaces.add(NS_ARRAY);
        BasicNamespaces.add(NS_DATETIME);
    }

    private static final String PATTERN_ITEM = "\\$\\{.+?[^(\\{|\\})]\\}";
    private static final String PATTERN_ATTR = "(text|number|date|select|array|datetime):(.+)\\((.+|)\\)\\|(.+)";

    private static final String PATTERN_CUSTOM_ITEM = "\\&\\{.+?[^(\\{|\\})]\\}";
    private static final String PATTERN_CUSTOM_ATTR = "(.+):(.+)\\((.+|)\\)\\|(.+)";

    private static final String PREFIX_BASIC = "${";
    private static final String PREFIX_CUSTOM = "&{";
    private static final String SUFFIX = "}";

    private static final String DELIMITER = "##";

    @Autowired
    private ExtractService extractService;

    /**
     * 유효성 검사
     */
    public boolean valid(ExtractAppModule.ModuleType moduleType, String namespace) {
        if(ExtractAppModule.ModuleType.BASIC == moduleType) {
            return BasicNamespaces.contains(namespace.toLowerCase());
        }
        return extractService.existsCustomVariable(namespace);
    }

    /**
     * 추출앱 표현식 파싱
     * @param sql
     * @return
     */
    public ExtractAppSql parse(String sql) {
        String processed = sql;

        List<String> items = new ArrayList<>();

        // 기본 변수
        Pattern p = Pattern.compile(PATTERN_ITEM);
        Matcher m = p.matcher(sql);
        while(m.find()) {
            items.add(m.group());
        }

        List<ExtractAppModule> modules = new ArrayList<>();
        int idx = 0;
        p = Pattern.compile(PATTERN_ATTR);
        for( String item : items ) {
            String id = DELIMITER + System.currentTimeMillis() + "_" + idx + DELIMITER;
            m = p.matcher(item.replace(PREFIX_BASIC, "").replace(SUFFIX, ""));
            while(m.find()) {

                String namespace = m.group(1);
                String name = m.group(2);
                String arguments = m.group(3).replace("'", "").replace("\"", "");
                String description = m.group(4).replace("'", "").replace("\"", "");
                if( this.valid(ExtractAppModule.ModuleType.BASIC, namespace) ) {
                    processed = processed.replace(item, id);

                    ExtractAppModule module = new ExtractAppModule();
                    module.setId(id);
                    module.setModuleType(ExtractAppModule.ModuleType.BASIC);
                    module.setNamespace(BasicNamespace.valueOf(namespace.toUpperCase()).toString());
                    module.setName(name);
                    module.setDescription(description);
                    if( !StringUtils.isEmpty(arguments) ) {
                        String[] args = arguments.split(",");
                        String[] newArgs = new String[args.length];
                        for( int i=0; i<args.length; i++ ) {
                            newArgs[i] = args[i].trim();
                        }
                        module.setArgs(newArgs);
                    }
                    modules.add(module);
                }
            }
            idx++;
        }

        // 사용자정의 변수
        items.clear();
        p = Pattern.compile(PATTERN_CUSTOM_ITEM);
        m = p.matcher(sql);
        while(m.find()) {
            items.add(m.group());
        }
        p = Pattern.compile(PATTERN_CUSTOM_ATTR);
        for( String item : items ) {
            String id = DELIMITER + System.currentTimeMillis() + "_" + idx + DELIMITER;
            m = p.matcher(item.replace(PREFIX_CUSTOM, "").replace(SUFFIX, ""));
            while(m.find()) {
                String namespace = m.group(1);
                String name = m.group(2);
                String argument = m.group(3).replace("'", "").replace("\"", "");
                String description = m.group(4).replace("'", "").replace("\"", "");
                boolean multiple = false;
                if( namespace.contains("*") ) {
                    multiple = true;
                    namespace = namespace.replace("*", "");
                }

                if( this.valid(ExtractAppModule.ModuleType.CUSTOM, namespace) ) {
                    processed = processed.replace(item, id);

                    ExtractAppModule module = new ExtractAppModule();
                    module.setId(id);
                    module.setModuleType(ExtractAppModule.ModuleType.CUSTOM);
                    module.setNamespace(namespace);
                    module.setMultiple(multiple);
                    module.setName(name);
                    module.setDescription(description);
                    if( !StringUtils.isEmpty(argument) ) {
                        String[] newArgs = new String[1];
                        newArgs[0] = argument.trim();
                        module.setArgs(newArgs);
                    }
                    modules.add(module);
                }
            }
            idx++;
        }

        ExtractAppSql extractAppSql = new ExtractAppSql();
        extractAppSql.setOriginal(sql);
        extractAppSql.setProcessed(processed);
        extractAppSql.setModules(modules);

        return extractAppSql;
    }

    /**
     * 실행 쿼리로 치환
     * @param extractAppSql
     * @return
     */
    public String process(ExtractAppSql extractAppSql) {

        SimpleDateFormat dFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat dtFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

        String processed = extractAppSql.getProcessed();
        for( ExtractAppModule module : extractAppSql.getModules() ) {
            String input = module.getInput();
            if( ExtractAppModule.ModuleType.BASIC == module.getModuleType() ) {
                if( BasicNamespace.ARRAY == BasicNamespace.valueOf(module.getNamespace()) ) {
                    String[] source = input.trim().split(",");
                    List<String> target = new ArrayList<>();
                    Arrays.stream(source).forEach(s -> {
                        target.add("'" + s.trim() + "'");
                    });
                    input = StringUtils.collectionToCommaDelimitedString(target);
                } else if( BasicNamespace.DATE == BasicNamespace.valueOf(module.getNamespace()) ) {
                    // UI에서 포매팅하지 않고 서버에서 포맷팅 진행
                    if( module.getArgs() != null && module.getArgs().length > 0 ) {
                        try {
                            Date inputDate = dFormat.parse(input);
                            SimpleDateFormat nFormat = new SimpleDateFormat(module.getArgs()[0]);
                            input = nFormat.format(inputDate);
                        } catch(Exception e) {
                            // ignore
                        }
                    }
                    input = "'" + input + "'";
                } else if( BasicNamespace.DATETIME == BasicNamespace.valueOf(module.getNamespace()) ) {
                    // UI에서 포매팅하지 않고 서버에서 포맷팅 진행
                    if( module.getArgs() != null && module.getArgs().length > 1 ) {
                        try {
                            Date inputDatetime = dtFormat.parse(input);
                            StringBuilder nFormatSb = new StringBuilder();
                            nFormatSb.append(module.getArgs()[0].trim());
                            nFormatSb.append(" ");
                            nFormatSb.append(module.getArgs()[1].trim());
                            SimpleDateFormat nFormat = new SimpleDateFormat( nFormatSb.toString() );
                            input = nFormat.format(inputDatetime);
                        } catch(Exception e) {
                            // ignore
                        }
                    }
                    input = "'" + input + "'";
                } else if( BasicNamespace.NUMBER != BasicNamespace.valueOf(module.getNamespace()) ) {
                    input = "'"+ input.trim() + "'";
                }
                processed = processed.replace(module.getId(), input);
            } else if( ExtractAppModule.ModuleType.CUSTOM == module.getModuleType() ) {
                if( module.isMultiple() ) {
                    String[] source = input.trim().split(",");
                    List<String> target = new ArrayList<>();
                    Arrays.stream(source).forEach(s -> {
                        target.add("'" + s.trim() + "'");
                    });
                    input = StringUtils.collectionToCommaDelimitedString(target);
                } else {
                    input = "'" + input + "'";
                }
                processed = processed.replace(module.getId(), input);
            }
        }
        return processed;
    }

}
