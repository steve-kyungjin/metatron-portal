-- 주제영역


INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-1000','[비즈니스 프로세스] 공용 데이터 관리','BZP','공용 데이터 관리','Common Data Management','다양한 영역에서 활용하는 기준정보 성격의 데이터나 공통적인 활용을 목적으로 수집하거나, 집계 정리한 데이터를 관리하는 영역','최상위',null);
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-1100','[비즈니스 프로세스] 공용 데이터 관리 > 공통 코드 데이터 관리','BZP','공통 코드 데이터 관리','Common Code Data Management','다양한 데이터에서 참조로 활용되는 공통된 코드/코드설명 데이터를 관리하는 영역','중간레벨','DSA-BZP-1000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-1200','[비즈니스 프로세스] 공용 데이터 관리 > 기초 마스터 데이터 관리','BZP','기초 마스터 데이터 관리','Basic Master Data Management','고객, 조직, 장비 등의 비즈니스 활동에서 가장 기본이 되는 기준정보(마스터) 데이터를 관리하는 영역','중간레벨','DSA-BZP-1000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-1300','[비즈니스 프로세스] 공용 데이터 관리 > 외부 수집 데이터 관리','BZP','외부 수집 데이터 관리','External Data Ingestion Management','공공정보, 기상정보 등과 같이 외부에서 수집 또는 구매한 데이터를 관리하는 영역','중간레벨','DSA-BZP-1000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-1400','[비즈니스 프로세스] 공용 데이터 관리 > KPI 및 통계 정보 관리','BZP','KPI 및 통계 정보 관리','KPI & Report Management','비즈니스 프로세스의 성과 평가를 위한 KPI 산출을 위한 데이터 및 특정 보고서를 위해 다양한 데이터를 종합적으로 집계한 데이터를 관리하는 영역','중간레벨','DSA-BZP-1000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-1500','[비즈니스 프로세스] 공용 데이터 관리 > 분석 기반 데이터 통합 관리','BZP','분석 기반 데이터 통합 관리','Data Integration Management','다수의 비즈니스 프로세스 영역에서 발생한 데이터를 기반으로 상호 연결 또는 통합하여, 특정 비즈니스 프로세스에 종속되지 않으면서 공통적으로 활용하는 것으로 새롭게 구성한 데이터를 관리하는 영역','중간레벨','DSA-BZP-1000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-2000','[비즈니스 프로세스] 고객/계약 관리','BZP','고객/계약 관리','Customer & Subscription Management','서비스에 가입함으로써 생성된 계약 정보와 가입 고객의 기본 정보를 관리하는 영역','최상위',null);
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-2100','[비즈니스 프로세스] 고객/계약 관리 > 고객 기본 정보 관리','BZP','고객 기본 정보 관리','Customer Information Management','고객에 대한 기본정보 및 부가정보 등의 다양한 고객 관련 데이터를 관리하는 영역','중간레벨','DSA-BZP-2000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-2200','[비즈니스 프로세스] 고객/계약 관리 > 고객 서비스 계약 관리','BZP','고객 서비스 계약 관리','Subscription Management','고객이 가입한 계약에 대한 상세 정보를 관리하는 영역','중간레벨','DSA-BZP-2000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-3000','[비즈니스 프로세스] 상품/서비스 관리','BZP','상품/서비스 관리','Product & Service Management','고객에게 판매 또는 제공되는 각종 서비스 상품에 대한 기본정보 및 관련된 추가적인 데이터를 관리하는 영역','최상위',null);
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-3100','[비즈니스 프로세스] 상품/서비스 관리 > 상품/서비스 마스터 정보 관리','BZP','상품/서비스 마스터 정보 관리','Product & Service Master Management','판매 또는 제공되는 서비스 상품의 명칭, 특성 등에 대한 설명을 가지는 기본정보와 부가적인 속성 데이터를 관리하는 영역','중간레벨','DSA-BZP-3000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-3200','[비즈니스 프로세스] 상품/서비스 관리 > 상품/서비스 사용 이력 관리','BZP','상품/서비스 사용 이력 관리','Product & Service Usage Management','고객이 해당 서비스 상품을 사용한 내역의 상세 또는 집계성 데이터를 관리하는 영역','중간레벨','DSA-BZP-3000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-4000','[비즈니스 프로세스] 자산/자원 관리','BZP','자산/자원 관리','Asset & Resource Management','시설, 장비, 파트너 및 인원 등과 같이 비즈니스 활동에 기반이 되는 자산에 대한 기본정보 데이터를 관리','최상위',null);
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-4100','[비즈니스 프로세스] 자산/자원 관리 > 비즈니스 파트너 관리','BZP','비즈니스 파트너 관리','Business Partner Management','비즈니스 활동 도메인별로 협업하는 비즈니스 파트너에 대한 기본정보 데이터 관리 영역','중간레벨','DSA-BZP-4000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-4200','[비즈니스 프로세스] 자산/자원 관리 > 인적자원 관리','BZP','인적자원 관리','Human Resource Management','내부 구성원 및 비즈니스 파트너 인원까지 비즈니스 활동에 투입되는 인적 자원에 대한 기본 정보 데이터 관리 영역','중간레벨','DSA-BZP-4000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-4300','[비즈니스 프로세스] 자산/자원 관리 > 시설/장비 관리','BZP','시설/장비 관리','Facility & Equipmenet Management','고객 서비스에 사용되는 기본적인 시설 및 장비와 관련된 기본정보, 위치정보 데이터에 대한 관리 영역','중간레벨','DSA-BZP-4000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-4400','[비즈니스 프로세스] 자산/자원 관리 > 구성/환경 관리','BZP','구성/환경 관리','Configuration & Environment Management','시설/장비의 연결 구성 정보 및 장비 내의 각종 설정 정보에 대한 데이터 및 변경 이력에 대한 데이터를 관리하는 영역','중간레벨','DSA-BZP-4000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-4500','[비즈니스 프로세스] 자산/자원 관리 > 임차/전기료 관리','BZP','임차/전기료 관리','Lease & Eletric Charge Management','시설을 위한 건물 임차와 시설 운용에 따른 전기료에 관련 데이터에 대한 관리 영역','중간레벨','DSA-BZP-4000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-5000','[비즈니스 프로세스] 투자/계획 관리','BZP','투자/계획 관리','Investment & Planning Management','기반 인프라 투자에 대한 분석 및 계획 수립, 투자 집행에 대한 데이터를 관리하는 영역','최상위',null);
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-5100','[비즈니스 프로세스] 투자/계획 관리 > 투자/비용 분석/계획','BZP','투자/비용 분석/계획','Investment & Cost Planning','투자 항목에 대한 전반적인 계획 수립 내역, 상세 기획을 위한 분석 과정에 필요한 데이터를 관리하는 영역','중간레벨','DSA-BZP-5000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-5200','[비즈니스 프로세스] 투자/계획 관리 > 투자/비용 집행 관리','BZP','투자/비용 집행 관리','Investment & Cost Execution Management','투자 의사결정 이후에 비용 집행과 관련된 데이터의 관리 영역','중간레벨','DSA-BZP-5000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-6000','[비즈니스 프로세스] 설계/구축 관리','BZP','설계/구축 관리','Engineering & Contruction Management','인프라에 대한 세부적인 설계와 설계 기준에 대한 구축 작업의 진행 기록에 대한 데이터를 관리하는 영역','최상위',null);
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-6100','[비즈니스 프로세스] 설계/구축 관리 > 청약/검수','BZP','청약/검수','Subscription & Acceptance Inspection','인프라 구축 프로젝트에 대한 계약, 수행, 검수와 관련된 데이터를 관리하는 영역','중간레벨','DSA-BZP-6000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-6200','[비즈니스 프로세스] 설계/구축 관리 > 설계 관리','BZP','설계 관리','Engineering Management','인프라 구축에 대한 세부적인 설계 사항에 대한 데이터를 관리하는 영역','중간레벨','DSA-BZP-6000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-6300','[비즈니스 프로세스] 설계/구축 관리 > 구축 작업 관리','BZP','구축 작업 관리','Contruction Management','인프라 구축에 필요한 각종 작업 사항을 기록하고, 작업 단위 별 수행 결과와 관련된 데이터를 관리하는 영역','중간레벨','DSA-BZP-6000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-7000','[비즈니스 프로세스] 운용/품질 관리','BZP','운용/품질 관리','Operation & Quality Management','구축된 인프라에 대한 안정적인 운영과 품질 개선을 위해 필요한 감시, 작업 관리, 각종 장애 관리, 장애 대응 등의 업무 수행에 필요한 데이터를 관리하는 영역','최상위',null);
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-7100','[비즈니스 프로세스] 운용/품질 관리 > 운영 감시','BZP','운영 감시','Opertion Monitoring','인프라에 대한 실시간 성능 통계, 이상 감지, 장애 감지 등에 필요한 데이터를 관리하는 영역','중간레벨','DSA-BZP-7000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-7200','[비즈니스 프로세스] 운용/품질 관리 > 운영 작업 관리','BZP','운영 작업 관리','Maintenance Work Management','인프라에 대한 설정 변경, 조정 작업, 추가적인 설치 및 유지 보수 작업 등에 관련된 작업 항목, 작업 진행 사항, 작업 진행 결과 데이터를 관리하는 영역','중간레벨','DSA-BZP-7000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-7300','[비즈니스 프로세스] 운용/품질 관리 > 장애/사고 관리','BZP','장애/사고 관리','Fault & Accident Management','장애 발생 내역에 대한 상세 데이터 및 장애 발생 시 대응 기록에 대한 데이터를 관리하는 영역','중간레벨','DSA-BZP-7000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-7400','[비즈니스 프로세스] 운용/품질 관리 > 성능/통계 관리','BZP','성능/통계 관리','Performance & Statistics Management','단기적인 개선 계획, 투자 계획, 운영 계획 수립에 필요한 각종 통계 데이터를 관리하는 영역','중간레벨','DSA-BZP-7000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-7500','[비즈니스 프로세스] 운용/품질 관리 > 품질 분석/개선 대응','BZP','품질 분석/개선 대응','Quality Analysis & Planning','인프라의 운용 품질에 대한 분석 작업을 위해 다양한 기반 데이터를 위해 추가적인 인사이트 데이터를 생성하고, 이를 분석하여 개선 계획을 수립하는 과정에 필요한 데이터를 관리하는 영역','중간레벨','DSA-BZP-7000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-7600','[비즈니스 프로세스] 운용/품질 관리 > 이벤트 분석/대응','BZP','이벤트 분석/대응','Event Preparation','축제, 행사 등의 각종 대형 이벤트에 대응에 필요한 데이터를 관리하는 영역','중간레벨','DSA-BZP-7000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-8000','[비즈니스 프로세스] 고객 케어','BZP','고객 케어','Customer Care','서비스 이용 고객에 대한 불문사항 및 대응 결과와 실제 고객이 말하지 않는 사용 품질에 대한 데이터를 관리하는 영역','최상위',null);
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-8100','[비즈니스 프로세스] 고객 케어 > 고객 VoC 및 대응','BZP','고객 VoC 및 대응','Customer Voice Management','서비스 이용 고객의 VoC 및 VoC에 대한 대응 결과 데이터를 관리하는 영역','중간레벨','DSA-BZP-8000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-8200','[비즈니스 프로세스] 고객 케어 > 고객 체감 품질 관리','BZP','고객 체감 품질 관리','Customer Experience Quaility Management','서비스 이용 고객이 실제로 느낄 수 있는 서비스 품질을 별도의 측정 체계 및 지수로 전환한 데이터를 관리하는 영역','중간레벨','DSA-BZP-8000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-9000','[비즈니스 프로세스] 영업/마케팅','BZP','영업/마케팅','Sales & Marketing','서비스 상품에 대한 영업과 홍보, 마케팅 활동과 관련된 데이터를 관리하는 영역','최상위',null);
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-9100','[비즈니스 프로세스] 영업/마케팅 > 영업/마케팅 채널 관리','BZP','영업/마케팅 채널 관리','Sales & Marketing Channel Management','영업 채널, 마케팅 활동 채널들에 대한 기본정보 데이터를 관리하는 영역','중간레벨','DSA-BZP-9000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-9200','[비즈니스 프로세스] 영업/마케팅 > 고객 분석/마케팅 기획','BZP','고객 분석/마케팅 기획','Customer Analysis & Marketing Planning','서비스 이용 고객에 대한 성향, 특성에 대한 분석이 필요한 데이데이터를 관리하는 영역','중간레벨','DSA-BZP-9000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-9300','[비즈니스 프로세스] 영업/마케팅 > 마케팅 관리','BZP','마케팅 관리','Marketing Management','마케팅, 캠페인 활동에 진행한 이력 및 결과 평가에 대한 데이터를 관리하는 영역','중간레벨','DSA-BZP-9000');
INSERT INTO mp_md_subject (id, fqn, criteria_id, nm_kr, nm_en, description, level,parent_id) VALUES ('DSA-BZP-9400','[비즈니스 프로세스] 영업/마케팅 > 영업 활동 관리','BZP','영업 활동 관리','Sales Management','영업 활동과 실적에 대한 데이터를 관리하는 영역','중간레벨','DSA-BZP-9000');








































































