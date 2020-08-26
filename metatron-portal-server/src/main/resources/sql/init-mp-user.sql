insert into mp_cm_role_group (id, name, description, type) values ('SYSTEM_ADMIN', '시스템 관리자', '시스템 관리자', 'SYSTEM');
insert into mp_cm_role_group (id, name, description, type) values ('DEFAULT_USER', '일반 사용자', '일반 사용자', 'SYSTEM');

insert into mp_cm_role_group (id, name, description, type) values ('1000196808', '중부CEM팀', '중부CEM팀', 'ORGANIZATION');

INSERT INTO mp_cm_user (user_id, password, bp_id, org_grp_cd, use_yn, user_nm) VALUES ('dt-admin', 'dt-admin@2018', 'BP0000001', 'SKT', 'Y', 'DT관리자');
INSERT INTO mp_cm_user (user_id, password, bp_id, org_grp_cd, use_yn, user_nm) VALUES ('admin', 'admin@2018', 'BP0000001', 'SKT', 'Y', '관리자1');
INSERT INTO mp_cm_user (user_id, password, bp_id, org_grp_cd, use_yn, user_nm) VALUES ('OI12345', 'OI12345@2018', 'BP0000002', 'SKT', 'Y', '관리자2');
INSERT INTO mp_cm_user (user_id, password, bp_id, org_grp_cd, use_yn, user_nm) VALUES ('OI12346', 'OI12346@2018', 'BP0000002', 'SKT', 'Y', '황인용');

insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000001', 'admin', 'SYSTEM_ADMIN');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000002', 'admin', 'DEFAULT_USER');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000003', 'OI12345', 'SYSTEM_ADMIN');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000004', 'OI12345', 'DEFAULT_USER');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000005', 'OI12346', 'DEFAULT_USER');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000006', 'dt-admin', 'SYSTEM_ADMIN');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000007', 'dt-admin', 'DEFAULT_USER');

insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000011', 'admin', '1000196808');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000012', 'OI12345', '1000196808');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000013', 'OI12346', '1000196808');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000014', 'dt-admin', '1000196808');

-- private
insert into mp_cm_role_group (id, name, description, type) values ('admin', 'admin', 'admin', 'PRIVATE');
insert into mp_cm_role_group (id, name, description, type) values ('OI12345', 'OI12345', 'OI12345', 'PRIVATE');
insert into mp_cm_role_group (id, name, description, type) values ('OI12346', 'OI12346', 'OI12346', 'PRIVATE');
insert into mp_cm_role_group (id, name, description, type) values ('dt-admin', 'dt-admin', 'dt-admin', 'PRIVATE');

insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000021', 'admin', 'admin');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000022', 'OI12345', 'OI12345');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000023', 'OI12346', 'OI12346');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000024', 'dt-admin', 'dt-admin');


-- ia rel
-- SYSTEM_ADMIN
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000001', 'IA000001', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000002', 'IA000002', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000003', 'IA000003', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000004', 'IA000004', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000005', 'IA000005', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000006', 'IA000006', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000007', 'IA000007', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000008', 'IA000008', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000009', 'IA000009', 'SYSTEM_ADMIN', 'SA');

-- DEFAULT_USER
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000011', 'IA000001', 'DEFAULT_USER', 'RO');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000012', 'IA000002', 'DEFAULT_USER', 'RW');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000013', 'IA000003', 'DEFAULT_USER', 'RW');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000014', 'IA000004', 'DEFAULT_USER', 'RO');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000015', 'IA000005', 'DEFAULT_USER', 'RO');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000017', 'IA000007', 'DEFAULT_USER', 'RO');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000018', 'IA000008', 'DEFAULT_USER', 'RO');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000019', 'IA000009', 'DEFAULT_USER', 'RO');