package app.metatron.portal.portal.metadata.service;

import app.metatron.portal.common.service.AbstractGenericService;
import app.metatron.portal.portal.metadata.domain.*;
import app.metatron.portal.portal.metadata.repository.*;
import app.metatron.portal.portal.search.domain.MetaColumnIndexVO;
import app.metatron.portal.common.code.domain.CodeEntity;
import app.metatron.portal.common.code.service.CodeService;
import app.metatron.portal.common.constant.Const;
import app.metatron.portal.common.user.domain.UserEntity;
import app.metatron.portal.common.user.service.UserService;
import app.metatron.portal.common.util.CsvUtil;
import app.metatron.portal.common.value.workbench.QueryResult;
import app.metatron.portal.portal.search.domain.MetaTableIndexVO;
import org.apache.commons.io.FileUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * 메타데이터 서비스
 */
@Service
@Transactional
public class MetaService extends AbstractGenericService<MetaSubjectEntity, String> {

    /**
     * 조회 조건 : 전체 물리명 논리명
     */
    public enum Target {
        ALL, PHYSICAL, LOGICAL
    }

    /**
     * 조회 조건 (연계시스템) : 전체 , 표준명 전체명
     */
    public enum SystemTarget {
        ALL, STD, FULL
    }

    @Autowired
    private MetaSubjectRepository subjectRepository;

    @Autowired
    private MetaTableRepository tableRepository;

    @Autowired
    private MetaColumnRepository columnRepository;

    @Autowired
    private MetaSystemRepository systemRepository;

    @Autowired
    private MetaDatabaseRepository databaseRepository;

    @Autowired
    private MetaInstanceRepository instanceRepository;

    @Autowired
    private MetaSubjectTableRelRepository subjectTableRelRepository;

    @Autowired
    private MetaDictionaryRepository dictionaryRepository;

    @Autowired
    private CsvUtil csvUtil;

    @Autowired
    private CodeService codeService;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    protected JpaRepository<MetaSubjectEntity, String> getRepository() {
        return this.subjectRepository;
    }

    /**
     * 연계시스템 목록
     * @param operTypeId
     * @param directionId
     * @param target
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<MetaSystemEntity> getSystemList( String operTypeId, String directionId, SystemTarget target, String keyword, Pageable pageable ) {
        Page<MetaSystemEntity> systemList = null;
        switch(target) {
            case ALL:
                systemList = systemRepository.getSystemList(operTypeId, directionId, keyword, pageable);
                break;
            case STD:
                systemList = systemRepository.getSystemListByStdNm(operTypeId, directionId, keyword, pageable);
                break;
            case FULL:
                systemList = systemRepository.getSystemListByFullNm(operTypeId, directionId, keyword, pageable);
                break;
        }
        return systemList;
    }

    /**
     * 연계 시스템 루트 목록
     * @return
     */
    public List<MetaSystemEntity> getSystemRootList() {
        return systemRepository.getSystemRootList();
    }

    /**
     * 연계시스템 하위 노드
     * @param systemId
     * @return
     */
    public List<MetaSystemEntity> getSystemChildren( String systemId ) {
        MetaSystemEntity parent = systemRepository.findOne(systemId);
        if( parent == null ) {
            return null;
        }
        return parent.getChildren();
    }

    /**
     * 인스턴스 목록
     * @return
     */
    public List<MetaInstanceEntity> getInstanceList() {
        return instanceRepository.findByDelYnOrderByLogicalNmAscPhysicalNmAsc(false);
    }

    /**
     * 데이터베이스 목록
     * @param instanceId
     * @param layerId
     * @param target
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<MetaDatabaseEntity> getDatabaseList(String instanceId, String layerId, Target target, String keyword, Pageable pageable) {
        Page<MetaDatabaseEntity> databaseList = null;
        switch(target) {
            case ALL:
                databaseList = databaseRepository.getDatabaseListByInstance(instanceId, layerId, keyword, pageable);
                break;
            case PHYSICAL:
                databaseList = databaseRepository.getDatabaseListByInstanceAndPhysical(instanceId, layerId, keyword, pageable);
                break;
            case LOGICAL:
                databaseList = databaseRepository.getDatabaseListByInstanceAndLogical(instanceId, layerId, keyword, pageable);
                break;
        }
        return databaseList;
    }

    /**
     * 주제영역 초기 노드 조회
     * @return
     */
    public List<MetaSubjectEntity> getSubjectRootList(String criteriaId) {
        List<MetaSubjectEntity> subjectList = null;
        if( StringUtils.isEmpty(criteriaId) ) {
            subjectList = subjectRepository.findByDelYnAndParentIsNullOrderByIdAsc(false);
        } else {
            subjectList = subjectRepository.findByDelYnAndCriteria_IdAndParentIsNullOrderByIdAsc(false, criteriaId);
        }
        if( subjectList != null ) {
            subjectList.forEach(subject -> {
                this.blockSubjectDetail(subject.getChildren());
            });
        }

        return subjectList;
    }

    /**
     * 주제영역 목록
     * @param criteriaId
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<MetaSubjectEntity> getSubjectListByCriteria(String criteriaId, String keyword, Pageable pageable) {
        return  subjectRepository.getSubjectListByCriteria(criteriaId, keyword, pageable);
    }

    /**
     * 주제영역 특정 노드 조회
     * @param parentId
     * @return
     */
    public MetaSubjectEntity getSubject(String parentId) {
        MetaSubjectEntity subject = subjectRepository.findOne(parentId);
        blockSubjectDetail(subject.getChildren());
        return subject;
    }

    /**
     * 특정 테이블 관련 주제영역 목록
     * @param tableId
     * @return
     */
    public List<MetaSubjectEntity> getSubjectListByTable(String tableId) {
        List<MetaSubjectEntity> subjects = subjectTableRelRepository.getSubjectListByTable(tableId);
        this.blockSubjectDetail(subjects);
        return subjects;
    }

    /**
     * 주제영역으로 테이블 리스트 조회
     * @param subjectId
     * @param criteriaId
     * @param target
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<MetaTableEntity> getTableListBySubject(String subjectId, String criteriaId, Target target, String layerId, String keyword, Pageable pageable) {
        Page<MetaTableEntity> tableList = null;
        List<String> subjects = null;
        if( !StringUtils.isEmpty(subjectId) ) {
            subjects = new ArrayList<>();
            MetaSubjectEntity start = subjectRepository.findOne(subjectId);
            this.recursiveSubject(start, subjects);
        }

        switch(target) {
            case ALL:
                if( subjects == null ) {
                    tableList = tableRepository.getTableListBySubject(criteriaId, layerId, keyword, pageable);
                } else {
                    tableList = tableRepository.getTableListBySubject(subjects, criteriaId, layerId, keyword, pageable);
                }
                break;
            case PHYSICAL:
                if( subjects == null ) {
                    tableList = tableRepository.getTableListBySubjectAndPhysical(criteriaId, layerId, keyword, pageable);
                } else {
                    tableList = tableRepository.getTableListBySubjectAndPhysical(subjects, criteriaId, layerId, keyword, pageable);
                }
                break;
            case LOGICAL:
                if( subjects == null ) {
                    tableList = tableRepository.getTableListBySubjectAndLogical(criteriaId, layerId, keyword, pageable);
                } else {
                    tableList = tableRepository.getTableListBySubjectAndLogical(subjects, criteriaId, layerId, keyword, pageable);
                }
                break;
        }
        blockTableDetail(tableList);
        return tableList;
    }

    /**
     * 데이터베이스로 테이블 목록
     * @param databaseId
     * @param target
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<MetaTableEntity> getTableListByDatabase(String databaseId, Target target, String layerId, String keyword, Pageable pageable) {
        Page<MetaTableEntity> tableList = null;
        switch(target) {
            case ALL:
                tableList = tableRepository.getTableListByDatabase(databaseId, layerId, keyword, pageable);
                break;
            case PHYSICAL:
                tableList = tableRepository.getTableListByDatabaseAndPhysical(databaseId, layerId, keyword, pageable);
                break;
            case LOGICAL:
                tableList = tableRepository.getTableListByDatabaseAndLogical(databaseId, layerId, keyword, pageable);
                break;
        }
        blockTableDetail(tableList);
        return tableList;
    }

    /**
     * 인스턴스로 테이블 목록
     * @param instanceId
     * @param target
     * @param layerId
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<MetaTableEntity> getTableListByInstance(String instanceId, Target target, String layerId, String keyword, Pageable pageable) {
        Page<MetaTableEntity> tableList = null;
        switch(target) {
            case ALL:
                tableList = tableRepository.getTableListByInstance(instanceId, layerId, keyword, pageable);
                break;
            case PHYSICAL:
                tableList = tableRepository.getTableListByInstanceAndPhysical(instanceId, layerId, keyword, pageable);
                break;
            case LOGICAL:
                tableList = tableRepository.getTableListByInstanceAndLogical(instanceId, layerId, keyword, pageable);
                break;
        }
        blockTableDetail(tableList);
        return tableList;
    }

    /**
     * 컬럼으로 동일 물리명 참조 테이블 조회
     * @param columnId
     * @param pageable
     * @return
     */
    public Page<MetaTableEntity> getRelationTableByColumn(String columnId, Pageable pageable) {
        MetaColumnEntity column = columnRepository.findOne(columnId);
        return this.getRelationTableByColumn(column, pageable);
    }

    /**
     * 컬럼으로 동일 물리명 참조 테이블 조회
     * @param column
     * @param pageable
     * @return
     */
    public Page<MetaTableEntity> getRelationTableByColumn(MetaColumnEntity column, Pageable pageable) {
        if( column == null ) {
            return null;
        }
        return tableRepository.getRelationTableByColumn(column.getPhysicalNm(), pageable);
    }

    /**
     * 연계 시스템 조회
     * @param systemId
     * @return
     */
    public MetaSystemEntity getSystem(String systemId) {
        return systemRepository.findOne(systemId);
    }

    /**
     * 인스턴스 조회
     * @param instanceId
     * @return
     */
    public MetaInstanceEntity getInstance(String instanceId) {
        return instanceRepository.findOne(instanceId);
    }

    /**
     * 데이터베이스 조회
     * @param databaseId
     * @return
     */
    public MetaDatabaseEntity getDatabase(String databaseId) {
        return databaseRepository.findOne(databaseId);
    }

    /**
     * 테이블 조회
     * @param tableId
     * @return
     */
    public MetaTableEntity getTable(String tableId) {
        return tableRepository.findOne(tableId);
    }

    /**
     * 테이블 연관 컬럼 조회
     * @param tableId
     * @return
     */
    public List<MetaColumnEntity> getColumnListByTable(String tableId) {
        return columnRepository.findByDelYnAndTable_IdOrderByLogicalNmAsc(false, tableId);
    }

    /**
     * 컬럼 조회
     * @param columnId
     * @return
     */
    public MetaColumnEntity getColumn(String columnId) {
        MetaColumnEntity column = columnRepository.findOne(columnId);
        column.setRelTableCnt(tableRepository.getRelationTableCountByColumn(column.getPhysicalNm()));
        return column;
    }

    /**
     * 테이블의 샘플 데이터
     * @param tableId
     * @return
     */
    public QueryResult getTableSampleDataList( String tableId ) {
        MetaTableEntity table = tableRepository.findOne(tableId);
        if( table == null ) {
            return null;
        }
        return csvUtil.read(table.getDatabasePhysicalNm(), table.getPhysicalNm());
    }

    /**
     * 테이블의 샘플 데이터 (바이너리)
     * @param tableId
     * @return
     */
    public byte[] getTableSampleData( String tableId ) {
        return this.getTableSampleData(tableRepository.findOne(tableId));
    }

    /**
     * 테이블의 샘플 데이터 (바이너리)
     * @param table
     * @return
     */
    public byte[] getTableSampleData( MetaTableEntity table ) {
        if( table == null ) {
            return null;
        }
        byte[] data = null;
        File file = new File(csvUtil.getSampleDataPath(table.getDatabasePhysicalNm(), table.getPhysicalNm()));
        if( file.exists() && file.isFile() ) {
            try {
                String tmp = FileUtils.readFileToString(file, "UTF-8");
                data = tmp.getBytes("UTF-8");
//                data = FileUtils.readFileToByteArray(file);
            } catch(Exception e) {
                // ignore
                e.printStackTrace();
            }
        }
        return data;
    }

    /**
     * 용어사전 목록
     * @param keyword
     * @param pageable
     * @return
     */
    public Page<MetaDictionaryEntity> getDictionaryList(String keyword, Pageable pageable) {
        return dictionaryRepository.getDictionaryList(keyword, pageable);
    }

    /**
     * 용어사전
     * @param dicId
     * @return
     */
    public MetaDictionaryEntity getDictionary(String dicId) {
        return dictionaryRepository.findOne(dicId);
    }

    /**
     * 메타데이터 주제영역 추가
     * @param subjectDto
     * @return
     */
    public MetaSubjectEntity addMetaSubject(MetaDto.Subject subjectDto) {
//        MetaSubjectEntity subject = modelMapper.map(subjectDto, MetaSubjectEntity.class);
        // model mapper 사용 보류
        MetaSubjectEntity subject = new MetaSubjectEntity();
        subject.setNmKr(subjectDto.getNmKr());
        subject.setNmEn(subjectDto.getNmEn());
        subject.setDelYn(false);
        subject.setDescription(subjectDto.getDescription());
        subject.setLevel(subjectDto.getLevel());

        if( !StringUtils.isEmpty(subjectDto.getParentId()) ) {
            MetaSubjectEntity parent = subjectRepository.findOne(subjectDto.getParentId());
            subject.setParent(parent);
        }

        if( !StringUtils.isEmpty(subjectDto.getCriteriaId()) ) {
            CodeEntity criteria = codeService.get(subjectDto.getCriteriaId());
            subject.setCriteria(criteria);
        }

        // fqn
        String fqn = "";
        if( subject.getParent() != null ) {
            fqn += subject.getParent().getFqn() + " > ";
        } else {
            fqn += "[" + subject.getCriteria().getNmKr() + "] ";
        }
        fqn += subject.getNmKr();
        subject.setFqn(fqn);

        this.setCreateUserInfo(subject);

        return subjectRepository.save(subject);
    }

    /**
     * 메타데이터 주제영역 수정
     * @param subjectDto
     * @return
     */
    public MetaSubjectEntity editMetaSubject(MetaDto.Subject subjectDto) {
        if( StringUtils.isEmpty(subjectDto.getId()) ) {
            return null;
        }
        MetaSubjectEntity subject = subjectRepository.findOne(subjectDto.getId());
        if( subject == null ) {
            return null;
        }

        subject.setNmKr(subjectDto.getNmKr());
        subject.setNmEn(subjectDto.getNmEn());
        subject.setDescription(subjectDto.getDescription());
        subject.setLevel(subjectDto.getLevel());

        if( !StringUtils.isEmpty(subjectDto.getParentId()) ) {
            MetaSubjectEntity parent = subjectRepository.findOne(subjectDto.getParentId());
            subject.setParent(parent);
        } else {
            subject.setParent(null);
        }

        if( !StringUtils.isEmpty(subjectDto.getCriteriaId()) ) {
            CodeEntity criteria = codeService.get(subjectDto.getCriteriaId());
            subject.setCriteria(criteria);
        }

        // fqn
        String fqn = "";
        if( subject.getParent() != null ) {
            fqn += subject.getParent().getFqn() + " > ";
        } else {
            fqn += "[" + subject.getCriteria().getNmKr() + "] ";
        }
        fqn += subject.getNmKr();
        subject.setFqn(fqn);

        this.setUpdateUserInfo(subject);

        return subjectRepository.save(subject);
    }

    /**
     * 주제영역 삭제
     * 하위 주제영역이 존재한다면 삭제불가
     * @param subjectId
     * @return
     */
    public boolean removeMetaSubject(String subjectId) {
        MetaSubjectEntity subject = subjectRepository.findOne(subjectId);
        if( subject == null ) {
            return false;
        }
        if( subject.getChildren() != null && subject.getChildren().size() > 0 ) {
            return false;
        }
        subject.setDelYn(true);
        this.setUpdateUserInfo(subject);
        return subjectRepository.save(subject) != null;
    }

    /**
     * 연계 시스템 추가
     * @param systemDto
     * @return
     */
    public MetaSystemEntity addMetaSystem(MetaDto.System systemDto) {
//        MetaSystemEntity system = modelMapper.map(systemDto, MetaSystemEntity.class);
        // model mapper 사용 보류
        MetaSystemEntity system = new MetaSystemEntity();
        system.setStdNm(systemDto.getStdNm());
        system.setFullNm(systemDto.getFullNm());
        system.setDescription(systemDto.getDescription());
        system.setRelPurpose(systemDto.getRelPurpose());
        system.setDelYn(false);
        system.setInMethod(systemDto.getInMethod());
        system.setInFrequency(systemDto.getInFrequency());
        system.setInEntityCnt(systemDto.getInEntityCnt());
        system.setInSize(systemDto.getInSize());
        system.setInSizeUnit(systemDto.getInSizeUnit());
        system.setOutMethod(systemDto.getOutMethod());
        system.setOutFrequency(systemDto.getOutFrequency());
        system.setOutEntityCnt(systemDto.getOutEntityCnt());
        system.setOutSize(systemDto.getOutSize());
        system.setOutSizeUnit(systemDto.getOutSizeUnit());

        if( !StringUtils.isEmpty(systemDto.getWorkerId()) ) {
            UserEntity worker = userService.get(systemDto.getWorkerId());
            system.setWorker(worker);
        }

        if( !StringUtils.isEmpty(systemDto.getCoworkerId()) ) {
            UserEntity coworker = userService.get(systemDto.getCoworkerId());
            system.setCoworker(coworker);
        }

        if( !StringUtils.isEmpty(systemDto.getParentId()) ) {
            MetaSystemEntity parent = systemRepository.findOne(systemDto.getParentId());
            system.setParent(parent);
        }

        if( !StringUtils.isEmpty(systemDto.getDirectionId()) ) {
            CodeEntity direction = codeService.get(systemDto.getDirectionId());
            system.setDirection(direction);
        }

        if( !StringUtils.isEmpty(systemDto.getLevelId()) ) {
            CodeEntity level = codeService.get(systemDto.getLevelId());
            system.setLevel(level);
        }

        if( !StringUtils.isEmpty(systemDto.getOperTypeId()) ) {
            CodeEntity operType = codeService.get(systemDto.getOperTypeId());
            system.setOperType(operType);
        }

        this.setCreateUserInfo(system);

        return systemRepository.save(system);
    }

    /**
     * 연계 시스템 수정
     * @param systemDto
     * @return
     */
    public MetaSystemEntity editMetaSystem(MetaDto.System systemDto) {
        if( StringUtils.isEmpty(systemDto.getId()) ) {
            return null;
        }
        MetaSystemEntity system = systemRepository.findOne(systemDto.getId());
        if( system == null ) {
            return null;
        }
        system.setStdNm(systemDto.getStdNm());
        system.setFullNm(systemDto.getFullNm());
        system.setDescription(systemDto.getDescription());
        system.setRelPurpose(systemDto.getRelPurpose());
        system.setDelYn(false);
        system.setInMethod(systemDto.getInMethod());
        system.setInFrequency(systemDto.getInFrequency());
        system.setInEntityCnt(systemDto.getInEntityCnt());
        system.setInSize(systemDto.getInSize());
        system.setInSizeUnit(systemDto.getInSizeUnit());
        system.setOutMethod(systemDto.getOutMethod());
        system.setOutFrequency(systemDto.getOutFrequency());
        system.setOutEntityCnt(systemDto.getOutEntityCnt());
        system.setOutSize(systemDto.getOutSize());
        system.setOutSizeUnit(systemDto.getOutSizeUnit());

        if( !StringUtils.isEmpty(systemDto.getWorkerId()) ) {
            UserEntity worker = userService.get(systemDto.getWorkerId());
            system.setWorker(worker);
        } else {
            system.setWorker(null);
        }

        if( !StringUtils.isEmpty(systemDto.getCoworkerId()) ) {
            UserEntity coworker = userService.get(systemDto.getCoworkerId());
            system.setCoworker(coworker);
        } else {
            system.setCoworker(null);
        }

        if( !StringUtils.isEmpty(systemDto.getParentId()) ) {
            MetaSystemEntity parent = systemRepository.findOne(systemDto.getParentId());
            system.setParent(parent);
        } else {
            system.setParent(null);
        }

        if( !StringUtils.isEmpty(systemDto.getDirectionId()) ) {
            CodeEntity direction = codeService.get(systemDto.getDirectionId());
            system.setDirection(direction);
        } else {
            system.setDirection(null);
        }

        if( !StringUtils.isEmpty(systemDto.getLevelId()) ) {
            CodeEntity level = codeService.get(systemDto.getLevelId());
            system.setLevel(level);
        } else {
            system.setLevel(null);
        }

        if( !StringUtils.isEmpty(systemDto.getOperTypeId()) ) {
            CodeEntity operType = codeService.get(systemDto.getOperTypeId());
            system.setOperType(operType);
        } else {
            system.setOperType(null);
        }

        this.setUpdateUserInfo(system);

        return systemRepository.save(system);
    }

    /**
     * 연계시스템 삭제
     */
    public boolean removeMetaSystem(String systemId) {
        MetaSystemEntity system = systemRepository.findOne(systemId);
        if( system == null ) {
            return false;
        }
        if( system.getChildren() != null && system.getChildren().size() > 0 ) {
            return false;
        }
        system.setDelYn(true);
        this.setUpdateUserInfo(system);
        return systemRepository.save(system) != null;
    }

    /**
     * 메타데이터 테이블 수정
     * @param tableDto
     * @return
     */
    public MetaTableEntity editMetaTable(MetaDto.Table tableDto) {
        if( StringUtils.isEmpty(tableDto.getId()) ) {
            return null;
        }
        MetaTableEntity table = tableRepository.findOne(tableDto.getId());
        if( table == null ) {
            return null;
        }

        table.setPhysicalNm(tableDto.getPhysicalNm());
        table.setLogicalNm(tableDto.getLogicalNm());
        table.setDescription(tableDto.getDescription());
        table.setFirstCreated(tableDto.getFirstCreated());
        table.setStdEntityId(tableDto.getStdEntityId());

        if( !StringUtils.isEmpty(tableDto.getCycleId()) ) {
            table.setCycle(codeService.get(tableDto.getCycleId()));
        }
        if( !StringUtils.isEmpty(tableDto.getFeatureId()) ) {
            table.setFeature(codeService.get(tableDto.getFeatureId()));
        }
        if( !StringUtils.isEmpty(tableDto.getHistoryId()) ) {
            table.setHistory(codeService.get(tableDto.getHistoryId()));
        }
        if( !StringUtils.isEmpty(tableDto.getLayerId()) ) {
            table.setLayer(codeService.get(tableDto.getLayerId()));
        }
        if( !StringUtils.isEmpty(tableDto.getStatusId()) ) {
            table.setStatus(codeService.get(tableDto.getStatusId()));
        }
        if( !StringUtils.isEmpty(tableDto.getSecurityId()) ) {
            table.setSecurity(codeService.get(tableDto.getSecurityId()));
        }
        if( !StringUtils.isEmpty(tableDto.getRetentionId()) ) {
            table.setRetention(codeService.get(tableDto.getRetentionId()));
        }
        if( !StringUtils.isEmpty(tableDto.getPrivacyId()) ) {
            table.setPrivacy(codeService.get(tableDto.getPrivacyId()));
        }

        // subject & table relation
        // 1. deletion table relation
        subjectTableRelRepository.deleteByTable_Id(tableDto.getId());
        // 2. insert table relations
        if( tableDto.getSubjectIds() != null && tableDto.getSubjectIds().size() > 0 ) {
            tableDto.getSubjectIds().forEach(sId -> {
                MetaSubjectEntity subject = subjectRepository.findOne(sId);
                if( subject != null ) {
                    MetaSubjectTableRelEntity rel = new MetaSubjectTableRelEntity();
                    rel.setTable(table);
                    rel.setSubject(subject);
                    setCreateUserInfo(rel);
                    subjectTableRelRepository.save(rel);
                }
            });
        }

        if( !StringUtils.isEmpty(tableDto.getWorkerId()) ) {
            table.setWorker(userService.get(tableDto.getWorkerId()));
        }

        StringBuilder fqn = new StringBuilder();
//        if( !StringUtils.isEmpty(tableDto.getDatabaseId()) ) {
//            MetaDatabaseEntity database = databaseRepository.findOne(tableDto.getDatabaseId());
//            if( database == null ) {
//                return null;
//            }
//            table.setDatabase(database);
//            fqn.append(database.getPhysicalNm());
//            fqn.append(".");
//        }

        // fqn
        fqn.append(table.getDatabasePhysicalNm());
        fqn.append(".");
        fqn.append(table.getPhysicalNm());
        table.setFqn(fqn.toString());

        this.setUpdateUserInfo(table);
        return tableRepository.save(table);
    }

    /**
     * 메타데이터 컬럼 수정
     * @param colDto
     * @return
     */
    public MetaColumnEntity editMetaColumn(MetaDto.Column colDto) {
        if( StringUtils.isEmpty(colDto.getId()) ) {
            return null;
        }
        MetaColumnEntity column = columnRepository.findOne(colDto.getId());
        if( column == null ) {
            return column;
        }

        column.setPhysicalNm(colDto.getPhysicalNm());
        column.setLogicalNm(colDto.getLogicalNm());
        column.setDescription(colDto.getDescription());
        column.setDataType(colDto.getDataType());
        column.setDataSize(colDto.getDataSize());
        column.setHadoopPartitionKey(colDto.getHadoopPartitionKey());
        column.setPrimaryKey(colDto.getPrimaryKey());
        column.setNullable(colDto.getNullable());
        column.setRefTable(colDto.getRefTable());
        column.setRefSql(colDto.getRefSql());
        column.setStdFieldId(colDto.getStdFieldId());

        if( !StringUtils.isEmpty(colDto.getDruidColumnId()) ) {
            column.setDruidColumn(codeService.get(colDto.getDruidColumnId()));
        }
        if( !StringUtils.isEmpty(colDto.getPrivacyId()) ) {
            column.setPrivacy(codeService.get(colDto.getPrivacyId()));
        }
        if( !StringUtils.isEmpty(colDto.getPrivacyProcId()) ) {
            column.setPrivacyProc(codeService.get(colDto.getPrivacyProcId()));
        }

        StringBuilder fqn = new StringBuilder();
//        if( !StringUtils.isEmpty(colDto.getTableId()) ) {
//            MetaTableEntity table = tableRepository.findOne(colDto.getTableId());
//            if( table == null ) {
//                return null;
//            }
//            column.setTable(table);
//            fqn.append(table.getFqn());
//            fqn.append(".");
//        }

        // fqn
        fqn.append(column.getTable().getFqn());
        fqn.append(".");
        fqn.append(column.getPhysicalNm());
        column.setFqn(fqn.toString());

        this.setUpdateUserInfo(column);
        return columnRepository.save(column);
    }

    /**
     * 테이블 검색 색인용
     * @param pageable
     * @return
     */
    public Page<MetaTableIndexVO> getTableIndices(Pageable pageable) {
        List<MetaTableIndexVO> indices = new ArrayList<>();
        Page<MetaTableEntity> tables = tableRepository.findByDelYn(false, pageable);
        if( tables != null && tables.getSize() > 0 ) {
            tables.forEach(table -> {
                MetaTableIndexVO index = new MetaTableIndexVO();
                index.setPhysicalNm(table.getPhysicalNm());
                index.setLogicalNm(table.getLogicalNm());
                index.setDescription(table.getDescription());
                index.setLayer(table.getLayer()==null? null: table.getLayer().getNmKr());
                index.setFirstCreated(table.getFirstCreated());
                index.setCycle(table.getCycle()==null? null:table.getCycle().getNmKr());
                index.setHistory(table.getHistory()==null? null:table.getHistory().getNmKr());
                index.setRetention(table.getRetention()==null? null:table.getRetention().getNmKr());
                index.setSecurity(table.getSecurity()==null? null:table.getSecurity().getNmKr());
                index.setPrivacy(table.getPrivacy()==null? null:table.getPrivacy().getNmKr());
                index.setColumnCnt(table.getColumnCnt());

                index.setDatabaseNm(table.getDatabasePhysicalNm());
                if( table.getSubjectRels() != null && table.getSubjectRels().size() > 0 ) {
                    List<String> subjects = new ArrayList<>();
                    table.getSubjectRels().forEach(s -> {
                        subjects.add(s.getSubject().getNmKr());
                    });
                    index.setSubject(StringUtils.collectionToCommaDelimitedString(subjects));
                }

                index.setId(table.getId());
                index.setCreatedDate(table.getCreatedDate()==null? null: table.getCreatedDate().toString("yyyy-MM-dd HH:mm"));

                List<String> tags = new ArrayList<>();
                if( table.getLogicalNm() != null && !StringUtils.isEmpty(table.getLogicalNm().trim() ) ) {
                    tags.add(table.getLogicalNm());
                }
                tags.add(table.getPhysicalNm());
                index.setAutocompletes(tags);

                index.setType(Const.ElasticSearch.TYPE_META_TABLE);

                indices.add(index);
            });
        }
        return new PageImpl<>(indices, pageable, tables.getTotalElements());
    }

    /**
     * 컬럼 검색 색인용
     * @param pageable
     * @return
     */
    public Page<MetaColumnIndexVO> getColumnIndices(Pageable pageable) {
        List<MetaColumnIndexVO> indices = new ArrayList<>();
        Page<MetaColumnEntity> columns = columnRepository.findByDelYn(false, pageable);
        if( columns != null && columns.getSize() > 0 ) {
            columns.forEach(column -> {
                MetaColumnIndexVO index = new MetaColumnIndexVO();
                index.setFqn(column.getFqn());
                index.setPhysicalNm(column.getPhysicalNm());
                index.setLogicalNm(column.getLogicalNm());
                index.setDescription(column.getDescription());
                index.setRefTable(column.getRefTable());
                index.setRefSql(column.getRefSql());
                index.setDataType(column.getDataType());
                index.setDataSize(column.getDataSize());
                index.setPrimaryKey(column.getPrimaryKey()==null?false:column.getPrimaryKey());
                index.setNullable(column.getNullable()==null?false:column.getNullable());
                index.setPrivacy(column.getPrivacy()==null? null:column.getPrivacy().getNmKr());
                index.setPrivacyProc(column.getPrivacyProc()==null? null:column.getPrivacyProc().getNmKr());
                index.setStdFieldId(column.getStdFieldId());

//                index.setTableCnt(tableRepository.getRelationTableCountByColumn(column.getPhysicalNm()));

                index.setId(column.getId());
                index.setCreatedDate(column.getCreatedDate()==null? null: column.getCreatedDate().toString("yyyy-MM-dd HH:mm"));

                List<String> tags = new ArrayList<>();
                if( column.getLogicalNm() != null && !StringUtils.isEmpty(column.getLogicalNm().trim()) ) {
                    tags.add(column.getLogicalNm());
                }
                tags.add(column.getPhysicalNm());
                index.setAutocompletes(tags);

                index.setType(Const.ElasticSearch.TYPE_META_COLUMN);

                indices.add(index);
            });
        }
        return new PageImpl<>(indices, pageable, columns.getTotalElements());
    }

    /**
     * 주제 하위 정보 null 처리
     * @param subjectList
     */
    private void blockSubjectDetail(List<MetaSubjectEntity> subjectList) {
        if( subjectList != null && subjectList.size() > 0 ) {
            subjectList.forEach(child -> {
                child.setChildren(null);
            });
        }
    }

    /**
     * 태이블 정보 하위 컬럼 정보 null 처리
     * @param tableList
     */
    private void blockTableDetail(Page<MetaTableEntity> tableList) {
        if( tableList != null && tableList.getContent() != null && tableList.getContent().size() > 0 ) {
            tableList.getContent().forEach(table -> {
//                table.setColumns(null);
            });
        }
    }

    /**
     * 하위 주제영역 아이디 수집
     * @param subject
     * @param subjects
     */
    private void recursiveSubject( MetaSubjectEntity subject, List<String> subjects ) {
        subjects.add(subject.getId());
        if( subject.getChildren() != null && subject.getChildren().size() > 0 ) {
            subject.getChildren().forEach(s -> {
                recursiveSubject(s, subjects);
            });
        }
    }
}
