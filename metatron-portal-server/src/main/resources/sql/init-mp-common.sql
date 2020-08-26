INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GC0000003', 'REPORT_APP', '리포트앱 카테고리', 'Report App Category', '리포트앱 분류 목적의 카테고리')
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GC0000004', 'ANALYSIS_APP', '분석앱 카테고리', 'Analysis App Category', '분석앱 분류 목적의 카테고리')
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GC0000005', 'APP_REG_TYPE', '앱등록 유형', 'App Regist Type', '앱 등록 유형')
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GC0000006', 'APP_TYPE', '앱 유형', 'App Type', '앱 유형')
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GC0000007', 'PROJECT_TYPE', '과제 구분', 'Project Type', '과제 구분')

INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000010', 'WIR', '무선', 'Wireless', '무선 카테고리', 1, 'GC0000003')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000011', 'COR', '코어', 'Core', '코어 카테고리', 2, 'GC0000003')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000012', 'TRA', '전송', 'Transffer', '전송 카테고리', 3, 'GC0000003')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000013', 'ETC', '기타', 'ETC', '기타 카테고리', 4, 'GC0000003')

INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000020', 'WIR', '무선', 'Wireless', '무선 카테고리', 1, 'GC0000004')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000021', 'COR', '코어', 'Core', '코어 카테고리', 2, 'GC0000004')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000022', 'TRA', '전송', 'Transffer', '전송 카테고리', 3, 'GC0000004')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000023', 'ETC', '기타', 'ETC', '기타 카테고리', 4, 'GC0000004')

INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000030', 'URL', 'Url 등록 타입', 'Url Type', 'Url로 등록하는 타입 앱', 1, 'GC0000005')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000031', 'MET', 'Metatron 타입', 'Metatron Type', '메타트론 워크북 또는 대시보드 타입 앱', 2, 'GC0000005')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000032', 'EXT', '추출앱 타입', 'Extract Type', '추출앱 타입', 3, 'GC0000005')

INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000040', 'REP', '리포트앱 타입', 'Report App Type', '리포트 타입 앱', 1, 'GC0000006')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0000041', 'ANA', '분색앱 타입', 'Analysis App Type', '분석 타입 앱', 2, 'GC0000006')

INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0001001', 'SOP', '안정운용', 'Stable Operation', '안정운용', 1, 'GC0000007')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0001002', 'CEF', '비용효율', 'Cost-effective', '비용효율', 2, 'GC0000007')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0001003', 'NBZ', '신사업', 'New Biz', '신사업', 3, 'GC0000007')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('CD0001004', 'QIM', '품질개선', 'Quality improvement', '품질개선', 4, 'GC0000007')

INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_SCAT_0','GRP_SCAT','운영계/정보계 분류','운영계/정보계 분류','운영계/정보계 분류');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GC0001001','GRP_BZP','데이터 주제영역 분류 기준','데이터 주제영역 분류 기준','데이터 주제영역 분류 기준');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_DAT_L0','GRP_DAT','데이터 계층(LAYER) 구분','데이터 계층(LAYER) 구분','데이터 계층(LAYER) 구분');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_PC_L10','GRP_PC','데이터 처리 주기','데이터 처리 주기','데이터 처리 주기');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_DC_TRX','GRP_DC','데이터 생성 특성 분류','데이터 생성 특성 분류','데이터 생성 특성 분류');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_DS_LV1','GRP_DS','보안 통제 수준','보안 통제 수준','보안 통제 수준');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_PRIV_L0','GRP_PRIV','개인식별 가능 수준','개인식별 가능 수준','개인식별 가능 수준');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_D_SV00','GRP_D','데이터 보관 기간','데이터 보관 기간','데이터 보관 기간');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_DHM_00','GRP_DHM','데이터 이력 관리 유형','데이터 이력 관리 유형','데이터 이력 관리 유형');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_PDP_01','GRP_PDP','개인정보 처리 유형','개인정보 처리 유형','개인정보 처리 유형');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_DT_001','GRP_DT','데이터 유형','데이터 유형','데이터 유형');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_DRT_01','GRP_DRT','Druid 컬럼 유형','Druid 컬럼 유형','Druid 컬럼 유형');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_TMS_01','GRP_TMS','DB테이블 관리 상태','DB테이블 관리 상태','DB테이블 관리 상태');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_SYS_L1','GRP_SYS','시스템 레벨 구분','시스템 레벨 구분','시스템 레벨 구분');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_DWI_01','GRP_DWI','DW 연동 방향','DW 연동 방향','DW 연동 방향');
INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_DBP_01','GRP_DBP','DB데이터베이스 관리 목적','DB데이터베이스 관리 목적','DB데이터베이스 관리 목적');



INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('SCAT_0','SCAT_0','운영 업무 처리','운영 업무 처리','데이터의 발생, 가공/처리, 활용 관점에서 IT 시스템을 분류할 때, 운영계(또는 기간계)에 해당하며, 주로 일상적으로 반복되는 운영 업무(Operational work)를 통해 데이터 생성이 중심이 되는 시스템 데이터 흐름 중 일부는 때는 운영계 내부에도 정보계의 특성을 포함할 수 있으나, 주요 작업이 기계나 사람이 데이터를 발생시키는 것인 시스템임',1,'GRPID_SCAT_0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('SCAT_1','SCAT_1','정보 활용 지원','정보 활용 지원','데이터의 발생, 가공/처리, 활용 관점에서 IT 시스템을 분류할 때, 정보계(또는 분석계)에 해당하며, 데이터를 모아 이를 분석하여 어떠한 의사결정을 지원하기 위한 정보를 제공하는 하는 것이 중심이 되는 시스템 데이터를 발생하는 측면에서 개별적인 데이터 트랜잭션이 없는 것이 특징적인 부분임',2,'GRPID_SCAT_0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('SCAT_2','SCAT_2','운영 모니터링','운영 모니터링','데이터 발생, 처리 기준에서는 정보 활용 지원과 동일한 것이나, 목적이 운영 업무 처리 과정에서 발생하는 데이터를 실시간으로 관찰하고, 이를 바탕으로 운영 업무 처리를 최적화하기 위한 시스템 통상적으로 운영 업무 처리 내부에 존재하나, 별도로 구성되어 운영 업무 처리와 정보 활용 지원의 중간 단계 역할로 구성되는 것이 IT 기술 제약 측면에서 보편적인 형태임',3,'GRPID_SCAT_0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('SCAT_3','SCAT_3','업무 활동 지원','업무 활동 지원','그룹웨어, HR, KM과 같이 기본 비즈니스 활동의 효율화를 위한 지원 시스템',4,'GRPID_SCAT_0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('BZP','BZP','비즈니스 프로세스','비즈니스 프로세스','Value Chain, Mega Process, Process 등으로 분류 되는 비즈니스 활동 프로세스를 기준으로 발생하는 데이터를 계층화하여 분류하는 기준',1,'GC0001001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('EPI','EPI','통합 엔터티','통합 엔터티','데이터 발생 중심이 아니라, 비즈니스의 핵심이 대상이 되는 프로세스와 엔터티 기준으로 통합 정리하기 위한 분류 기준',2,'GC0001001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DUO','DUO','데이터 활용 목적','데이터 활용 목적','일정한 패턴의 데이터 분석을 위해 정리된 데이터 항목들을 체계적으로 분할하기 위한 기준',3,'GC0001001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('UIG','UIG','정보 활용 그룹','정보 활용 그룹','리포트 중심의 데이터 조회를 분류하기 위한 기준',4,'GC0001001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DPG','DPG','데이터 제공 그룹','데이터 제공 그룹','',5,'GC0001001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DIL','DIL','통합 데이터 계층','통합 데이터 계층','',6,'GC0001001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DML','DML','마트 데이터 계층','마트 데이터 계층','',7,'GC0001001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('AIM','AIM','분석 인프라 운영','분석 인프라 운영','0',8,'GC0001001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DAT_L0','DAT_L0','ODS','ODS','Data Warehouse 내부로 1차 데이터가 수집되는 영역으로, 원본 그대로 수집함을 원칙으로 함',1,'GRPID_DAT_L0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DAT_L1','DAT_L1','DW','DW','ODS 영역에 수집된 데이터를 기반으로 1차 통합, 정리한 데이터 영역으로, 데이터 관리의 핵심이 되는 영역임 참고) ODS의 데이터 활용 방향, 데이터 수준, DW 데이터의 활용 방향에 따라, DW 계층의 정리 수준은 달리 가져갈 수 있음',2,'GRPID_DAT_L0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DAT_L2','DAT_L2','DM','DM','DW, ODS 영역의 데이터를 이용하여, 활용 목적에 맞게 집계, 요약하거나 복잡한 인사이트 산출 모형(고급 분석 기능의 프로그램)을 통해 산출된 핵심 데이터의 저장 영역',3,'GRPID_DAT_L0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DAT_LP','DAT_LP','DP','DP','DW 외부로 데이터르 제공하기 위해 뷰를 생성하거나, 별도의 다른 집계 데이터를 생성 관리하는 영역',4,'GRPID_DAT_L0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DAT_EC','DAT_EC','기타','기타','',5,'GRPID_DAT_L0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PC_L10','PC_L10','실시간발생','실시간발생','',1,'GRPID_PC_L10');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PC_L11','PC_L11','10분배치처리','10분배치처리','',2,'GRPID_PC_L10');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PC_L12','PC_L12','시간배치처리','시간배치처리','',3,'GRPID_PC_L10');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PC_L50','PC_L50','일배치처리','일배치처리','',4,'GRPID_PC_L10');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PC_L60','PC_L60','주배치처리','주배치처리','',5,'GRPID_PC_L10');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PC_L70','PC_L70','월배치처리','월배치처리','',6,'GRPID_PC_L10');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PC_L99','PC_L99','비정기 수동','비정기 수동','0',7,'GRPID_PC_L10');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DC_TRX','DC_TRX','트랜잭션','트랜잭션','특정한 업무 처리 또는 기계 동작에 의해 시시각각 생성되는 RAW 데이터',1,'GRPID_DC_TRX');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DC_KMT','DC_KMT','핵심 마스터','핵심 마스터','트랜잭션 데이터 생성 시, 필요한 기준 정보 중 주요 마스터로 관리되는 데이터로, 마스터 데이터의 특성은 다양한 속성 정보를 가지며, 데이터 생성 빈도가 잦지 않는 데이터임(조직, 장비, 고객 등)',2,'GRPID_DC_TRX');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DC_BMT','DC_BMT','기초 마스터','기초 마스터','트랜잭션, 비즈니스 핵심 마스터 데이터 생성 시, 속성 정보를 동일한 값으로 생성할 수 있도록 하기 위해 사전 정의된 데이터로, 통상적으로 코드/코드설명의 2가지 컬럼으로 구성된 데이터임(코드설명 한 개의 값을 가진 경우도 존재하며, 이러한 형태도 공통코드 데이터로 분류함)',3,'GRPID_DC_TRX');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DC_MAP','DC_MAP','관계매핑','관계매핑','주요 마스터 데이터의 ID 또는 코드 등과 같이 유일성을 보장하는 키 정보들의 연계 정보',4,'GRPID_DC_TRX');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DC_AGR','DC_AGR','집계','집계','트랜잭션 데이터를 기반으로 특정 정보 생성을 위해 요약 또는 집계한 데이터로, 일정 주기 단위로 생성하며, 보통 DW의  팩트 데이터가 해당함',5,'GRPID_DC_TRX');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DC_DIM','DC_DIM','디멘전','디멘전','마스터 데이터 내의 키값과 주요 명칭, 설명 값만을 추출하여, 상하 관계 정보를 포함하여 단일화된 테이블 내에 구성하여 다차원 분석을 용이하도록 설계한 테이블 형태를 의미하며, 디멘전 구성의 원천은 마스터 또는 공통코드 데이터가 주요한 원친이며, 트랜잭션이나 집계 데이터 중의 일부를 카테고리로 구성하여 생성하기도 함',6,'GRPID_DC_TRX');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DS_LV1','DS_LV1','전체공개','전체공개','접속이 허용된 전체 인원에게 공개된 데이터',1,'GRPID_DS_LV1');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DS_LV2','DS_LV2','지정공개','지정공개','특정 인원에 한하여, 접근 허용이 되고, 허용된 인원은 상시 접근이 가능한 데이터',2,'GRPID_DS_LV1');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DS_LV3','DS_LV3','활용통제','활용통제','특정 인원에 대해서, 일정과 특정 목적에 하여 사용을 허가하고, 활용 목적 종료 즉시, 폐기해야 하는 데이터로, 허가된 관리자만 접근 가능한 데이터',3,'GRPID_DS_LV1');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DS_LV4','DS_LV4','비공개','비공개','메타데이터 관리를 수행하되, 일반적인 사용자, 개발자 등 관련자에게 정보 자체를 공개하지 않는 데이터',4,'GRPID_DS_LV1');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PRIV_L0','PRIV_L0','개인식별 즉시 가능(식별자 및 준식별자 컬럼 존재)','개인식별 즉시 가능(식별자 및 준식별자 컬럼 존재)','고객번호 등과 같이 단일 컬럼으로 개인 식별이 가능한 데이터(식별자)와 개인의 이름, 주소, 성별, 나이 등의 정보(준식별자)를 비식별화하지 않은 상태로 가지고 있음 (주민번호, 여권번호, 운전면허번호 등의 법정 관리 식별자인 경우는 보관 자체를 제외함)',1,'GRPID_PRIV_L0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PRIV_L1','PRIV_L1','개인식별 즉시 가능(준식별자 컬럼 존재)','개인식별 즉시 가능(준식별자 컬럼 존재)','단일 컬럼으로 개인 식별이 가능한 데이터를 가지고 있지는 않으나, 이름/연령대/주소 등과 같이 컬럼의 조합을 통해 명확한 개인을 식별할 수 있는 정보(준식별자)를 가진 비식별화하지 않은 상태로 가지고 있음',2,'GRPID_PRIV_L0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PRIV_L2','PRIV_L2','개인식별 추적 가능(식별자 가명화)','개인식별 추적 가능(식별자 가명화)','고객번호 등과 같이 단일 컬럼으로 개인을 구분할 수 있는 식별자 컬럼을 가명화(암호화, 치환)를 통해 변환하였으나, 개인별로 구분되는 데이터를 가지고 있음',3,'GRPID_PRIV_L0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PRIV_L3','PRIV_L3','개인식별 불가(익명화)','개인식별 불가(익명화)','개인정보를 식별할 수 있느 식별자나 준식별자를 가지고 있으나, 이를 모드 삭제, 부분삭제, 동일화 등의 기법으로 익명화 처리(개인을 찾아낼 수 없음)한 데이터 형태로 가지고 있음',4,'GRPID_PRIV_L0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PRIV_L4','PRIV_L4','개인식별 불가(개인정보 부재)','개인식별 불가(개인정보 부재)','개인정보 자체를 가지고 있지 않음',5,'GRPID_PRIV_L0');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV00','D_SV00','영구','영구','',1,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV01','D_SV01','10년','10년','',2,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV02','D_SV02','5년','5년','',3,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV03','D_SV03','3년','3년','',4,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV04','D_SV04','2년','2년','',5,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV05','D_SV05','1년','1년','',6,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV06','D_SV06','6개월','6개월','',7,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV07','D_SV07','3개월','3개월','',8,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV08','D_SV08','2개월','2개월','',9,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV09','D_SV09','1개월','1개월','',10,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV10','D_SV10','3주','3주','',11,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV11','D_SV11','2주','2주','',12,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV12','D_SV12','1주','1주','',13,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV13','D_SV13','5일','5일','',14,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV14','D_SV14','3일','3일','',15,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV15','D_SV15','1일','1일','0',16,'GRPID_D_SV00')
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV16','D_SV16','90일','90일','',17,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV17','D_SV17','60일','60일','',18,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV18','D_SV18','30일','30일','',19,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV19','D_SV19','15일','15일','',20,'GRPID_D_SV00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('D_SV20','D_SV20','7일','7일','',21,'GRPID_D_SV00');

INSERT INTO mp_cm_group_code (id, group_cd, group_nm_kr, group_nm_en, group_desc) VALUES ('GRPID_PRIV','GRPID_PRIV','개인정보 항목','개인정보 항목','개인정보 항목');

INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('1','1','이름','이름','',1,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('2','2','성별','성별','',2,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('3','3','나이','나이','',3,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('4','4','생년월일','생년월일','',4,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('5','5','주민등록번호','주민등록번호','',5,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('6','6','여권번호','여권번호','',6,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('7','7','운전면허번호','운전면허번호','',7,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('8','8','SKT 서비스관리번호','SKT 서비스관리번호','',8,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('9','9','SKT 청구계정번호','SKT 청구계정번호','',9,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('10','10','개인 주소','개인 주소','',10,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('11','11','청구 주소','청구 주소','',11,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('12','12','개인 주소','개인 주소','',12,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('13','13','집 전화번호','집 전화번호','',13,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('14','14','업무 전화번호','업무 전화번호','',14,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('15','15','이메일주소','이메일주소','',15,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('16','16','아이디','아이디','',16,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('17','17','패스워드','패스워드','',17,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('18','18','IMEI','IMEI','',18,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('19','19','IMSI','IMSI','',19,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('20','20','MDN','MDN','',20,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('21','21','모바일 전화번호','모바일 전화번호','',21,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('22','22','모바일단말 전화번호','모바일단말 전화번호','',22,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('23','23','모바일단말 MAC정보','모바일단말 MAC정보','',23,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('24','24','개인 AP MAC정보','개인 AP MAC정보','',24,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('25','25','모바일단말 IP정보','모바일단말 IP정보','',25,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('26','26','모바일단말 GPS정보','모바일단말 GPS정보','',26,'GRPID_PRIV');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('27','27','모바일단말 CELL정보','모바일단말 CELL정보','',27,'GRPID_PRIV');

INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DHM_00','DHM_00','변경 발생 건단위 갱신','변경 발생 건단위 갱신','특정 키를 기준으로 포함된 속성 컬럼 전체를 업데이트 처리하여, 최신 본만 유지하는 형태',1,'GRPID_DHM_00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DHM_01','DHM_01','변경 발생 건단위 추가','변경 발생 건단위 추가','변경이 발생하는 시간을 기준으로, 발생일시와 함께 지속적으로 데이터를 추가하여 누적 관리하는 형태',2,'GRPID_DHM_00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DHM_02','DHM_02','시간단위 전체 데이터 추가 또는 갱신','시간단위 전체 데이터 추가 또는 갱신','변경 발생과 상관없이 일 단위로 전체 데이터를 재처리하여 추가하거나, 기존에 존재하는 일자의 경우는 갱신 처리하는 형태',3,'GRPID_DHM_00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DHM_03','DHM_03','일단위 전체 데이터 추가 또는 갱신','일단위 전체 데이터 추가 또는 갱신','변경 발생과 상관없이 일 단위로 전체 데이터를 재처리하여 추가하거나, 기존에 존재하는 일자의 경우는 갱신 처리하는 형태',4,'GRPID_DHM_00');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DHM_04','DHM_04','월단위 전체 데이터 추가 또는 갱신','월단위 전체 데이터 추가 또는 갱신','변경 발생과 상관없이 주 단위로 전체 데이터를 재처리하여 추가하거나, 기존에 존재하는 일자의 경우는 갱신 처리하는 형태',5,'GRPID_DHM_00');


INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PDP_01','PDP_01','암호화','암호화','',1,'GRPID_PDP_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PDP_02','PDP_02','단방향 암호화','단방향 암호화','',2,'GRPID_PDP_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PDP_03','PDP_03','가명화','가명화','',3,'GRPID_PDP_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PDP_04','PDP_04','부분삭제','부분삭제','',4,'GRPID_PDP_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PDP_05','PDP_05','삭제','삭제','',5,'GRPID_PDP_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PDP_06','PDP_06','부분치환','부분치환','',6,'GRPID_PDP_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('PDP_07','PDP_07','전체치환','전체치환','',7,'GRPID_PDP_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DT_001','DT_001','문자열(STRING)','문자열(STRING)','',1,'GRPID_DT_001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DT_002','DT_002','정수(INTEGER)','정수(INTEGER)','',2,'GRPID_DT_001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DT_003','DT_003','소수(FLOAT)','소수(FLOAT)','',3,'GRPID_DT_001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DT_004','DT_004','날짜(DATE)','날짜(DATE)','',4,'GRPID_DT_001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DT_005','DT_005','일시(DATETIME)','일시(DATETIME)','',5,'GRPID_DT_001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DT_006','DT_006','바이너리(BINARY)','바이너리(BINARY)','',6,'GRPID_DT_001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DT_007','DT_007','이미지(IMAGE)','이미지(IMAGE)','',7,'GRPID_DT_001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DT_008','DT_008','공간(SPATIAL)','공간(SPATIAL)','',8,'GRPID_DT_001');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DRT_01','DRT_01','TimeStamp','TimeStamp','',1,'GRPID_DRT_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DRT_02','DRT_02','Dimension','Dimension','',2,'GRPID_DRT_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DRT_03','DRT_03','Measure','Measure','',3,'GRPID_DRT_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('TMS_01','TMS_01','정상사용','정상사용','',1,'GRPID_TMS_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('TMS_02','TMS_02','개발중','개발중','',2,'GRPID_TMS_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('TMS_03','TMS_03','단기백업','단기백업','',3,'GRPID_TMS_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('TMS_04','TMS_04','임시작업용','임시작업용','',4,'GRPID_TMS_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('TMS_06','TMS_06','삭제대기','삭제대기','',5,'GRPID_TMS_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('SYS_L1','SYS_L1','시스템','시스템','',1,'GRPID_SYS_L1');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('SYS_L0','SYS_L0','시스템 모듈','시스템 모듈','0',2,'GRPID_SYS_L1');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DWI_01','DWI_01','수집','수집','Infra 센터 DW에서 데이터를 수집하거나, DW로 데이터를 전달하는 대상이 되는 시스템 (원천 시스템)',1,'GRPID_DWI_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DWI_02','DWI_02','제공','제공','Infra 센터 DW에서 데이터를 가져가거나, DW가 데이터를 전달하는 대상이 되는 시스템(제공 시스템)',2,'GRPID_DWI_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DWI_03','DWI_03','수집/제공','수집/제공','',3,'GRPID_DWI_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DBP_01','DBP_01','운영 서비스','운영 서비스','',1,'GRPID_DBP_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DBP_02','DBP_02','개인 활용','개인 활용','',2,'GRPID_DBP_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DBP_03','DBP_03','임시 개발','임시 개발','',3,'GRPID_DBP_01');
INSERT INTO mp_cm_code (id, cd, nm_kr, nm_en, cd_desc, cd_order, group_id) VALUES ('DBP_04','DBP_04','운용 관리','운용 관리','',4,'GRPID_DBP_01');

