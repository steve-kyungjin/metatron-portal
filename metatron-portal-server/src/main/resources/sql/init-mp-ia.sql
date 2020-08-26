INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000000', 0, 'N', 'ROOT', '최상위', '/', null, 0, 'Y', 'N', 'N');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000001', 1, 'N', 'Main', 'Main 입니다.', '/view/intro', 'IA000000', 1, 'Y', 'Y', 'N');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000002', 1, 'N', '커뮤니케이션', '커뮤니케이션 입니다.', '/view/community', 'IA000000', 2, 'Y', 'N', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000003', 1, 'N', '마이앱 스페이스', '마이앱 스페이스 입니다.', '/view/my-space', 'IA000000', 3, 'Y', 'N', 'N');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000004', 1, 'N', '앱 플레이스', '앱 플레이스 입니다.', '/view/app-place', 'IA000000', 4, 'Y', 'N', 'N');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000005', 1, 'N', '메타데이터', '메타데이터 입니다.', '/view/metadata', 'IA000000', 5, 'Y', 'N', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000006', 1, 'N', '포털 관리', '포털 관리 입니다.', '/view/management', 'IA000000', 6, 'Y', 'N', 'N');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000007', 1, 'N', '전체 서비스', '전체 서비스 입니다.', '/view/site-map', 'IA000000', 7, 'Y', 'Y', 'N');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000008', 1, 'Y', '메타트론 3.0', '메타트론 3.0 입니다.', '/', 'IA000000', 8, 'Y', 'Y', 'N');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000009', 1, 'N', '시스템 도움말', '시스템 도움말 입니다.', '/view/help', 'IA000000', 9, 'N', 'N', 'Y');

INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000011', 2, 'N', '커뮤니티', '커뮤니티 입니다.', '/view/community', 'IA000002', 11, 'Y', 'N', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000012', 2, 'N', '데이터 활용 Tip', '데이터 활용Tip 입니다.', '/view/community', 'IA000002', 12, 'Y', 'N', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000013', 2, 'N', '요청 및 문의', '요청 및 문의 입니다.', '/view/community', 'IA000002', 13, 'Y', 'N', 'Y');

INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000021', 2, 'N', '마이 리포트', '마이 리포트 입니다.', '/view/report-app/my-app', 'IA000003', 14, 'Y', 'Y', 'N');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000022', 2, 'N', '마이 분석 앱', '마이 분석 앱 입니다.', '/view/analysis-app/my-app', 'IA000003', 15, 'Y', 'Y', 'N');

INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000031', 2, 'N', '리포트', '리포트 입니다.', '/view/report-app', 'IA000004', 16, 'Y', 'Y', 'N');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000032', 2, 'N', '분석 앱', '분석 앱 입니다.', '/view/analysis-app', 'IA000004', 17, 'Y', 'Y', 'N');

INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000041', 2, 'N', '데이터 관리 표준', '데이터 관리 표준 입니다.', '/view/metadata', 'IA000005', 18, 'N', 'N', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000042', 2, 'N', 'DW 데이터 정보', 'DW 데이터 정보 입니다.', '/view/metadata', 'IA000005', 19, 'Y', 'N', 'Y');

INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000051', 2, 'N', '시스템 운영 공지', '시스템 운영 공지 입니다.', '/view/community/notice', 'IA000009', 40, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000052', 2, 'N', '필요 소프트웨어', '필요 소프트웨어 입니다.', '/view/community/pds', 'IA000009', 41, 'Y', 'Y', 'Y');

INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000061', 3, 'N', '과제수행 가이드', '과제수행 가이드 입니다.', '/view/community/project-guide', 'IA000011', 50, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000062', 3, 'N', '과제 현황', '과제 현황 입니다.', '/view/project', 'IA000011', 51, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000063', 3, 'N', '과제 Q&A', '과제 Q&A 입니다.', '/view/community/project-qna', 'IA000011', 52, 'Y', 'Y', 'Y');

INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000071', 3, 'N', '데이터 정책/가이드', '데이터 정책/가이드 입니다.', '/view/community/data-guide', 'IA000012', 60, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000072', 3, 'N', '데이터 SQL 활용 Tip', '데이터 SQL 활용 Tip 입니다.', '/view/community/data-sql-tip', 'IA000012', 61, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000073', 3, 'N', '데이터 분석 기법 Tip', '데이터 분석 기법 Tip 입니다.', '/view/community/data-analysis-tip', 'IA000012', 62, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000074', 3, 'N', '분석 Tool 메뉴얼', '분석 Tool 메뉴얼 입니다.', '/view/community/analysis-tool', 'IA000012', 63, 'Y', 'Y', 'Y');

INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000081', 3, 'N', '데이터 수집/생성 요청', '데이터 수집/생성 요청 입니다.', '/view/community/request-collect', 'IA000013', 70, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000082', 3, 'N', '데이터 확인/검증 요청', '데이터 확인/검증 요청 입니다.', '/view/community/request-confirm', 'IA000013', 71, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000083', 3, 'N', '데이터 추출/분석 요청', '데이터 추출/분석 요청 입니다.', '/view/community/request-extract', 'IA000013', 72, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000084', 3, 'N', '분석 Tool 기능개선 요청', '분석 Tool 기능개선 요청 입니다.', '/view/community/request-analysis-tool', 'IA000013', 73, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000085', 3, 'N', '기타 Q&A', '기타 Q&A 입니다.', '/view/community/etc-qna', 'IA000013', 74, 'Y', 'Y', 'Y');

INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000091', 3, 'N', '데이터 주제영역', '데이터 주제영역 입니다.', '/view/metadata/subject', 'IA000041', 80, 'N', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000092', 3, 'N', '데이터 표준 단어집', '데이터 표준 단어집 입니다.', '/view/metadata/dictionary', 'IA000041', 81, 'N', 'Y', 'Y');

INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000101', 3, 'N', 'DW 연계시스템', 'DW 연계시스템 입니다.', '/view/metadata/system', 'IA000042', 82, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000102', 3, 'N', 'DW 데이터베이스', 'DW 데이터베이스 입니다.', '/view/metadata/database', 'IA000042', 83, 'Y', 'Y', 'Y');
INSERT INTO mp_cm_ia (id, depth, external_yn, ia_nm, ia_desc, path, parent_code, ia_order, display_yn, link_yn, edit_yn) VALUES ('IA000103', 3, 'N', 'DW 테이블', 'DW 테이블 입니다.', '/view/metadata/table', 'IA000042', 84, 'Y', 'Y', 'Y');