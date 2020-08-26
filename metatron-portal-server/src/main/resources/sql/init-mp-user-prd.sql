-- Common role group & System Admin
INSERT INTO mp_cm_user (user_id, password, use_yn, user_nm) VALUES ('DT_ADMIN', 'DT_ADMIN@2018', 'Y', '관리자');

insert into mp_cm_role_group (id, name, description, type) values ('SYSTEM_ADMIN', '시스템 관리자', '시스템 관리자', 'SYSTEM');
insert into mp_cm_role_group (id, name, description, type) values ('DEFAULT_USER', '일반 사용자', '일반 사용자', 'SYSTEM');
insert into mp_cm_role_group (id, name, description, type) values ('DT_ADMIN', '관리자', '관리자', 'PRIVATE');

insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000001', 'DT_ADMIN', 'SYSTEM_ADMIN');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000002', 'DT_ADMIN', 'DEFAULT_USER');
insert into mp_cm_role_group_user_rel (id, user_id, role_group_id) values ('RU000021', 'DT_ADMIN', 'DT_ADMIN');


-- Role & IA
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000001', 'IA000001', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000002', 'IA000002', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000003', 'IA000003', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000004', 'IA000004', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000005', 'IA000005', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000006', 'IA000006', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000007', 'IA000007', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000008', 'IA000008', 'SYSTEM_ADMIN', 'SA');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000009', 'IA000009', 'SYSTEM_ADMIN', 'SA');

insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000011', 'IA000001', 'DEFAULT_USER', 'RO');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000012', 'IA000002', 'DEFAULT_USER', 'RW');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000013', 'IA000003', 'DEFAULT_USER', 'RW');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000014', 'IA000004', 'DEFAULT_USER', 'RO');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000015', 'IA000005', 'DEFAULT_USER', 'RO');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000017', 'IA000007', 'DEFAULT_USER', 'RO');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000018', 'IA000008', 'DEFAULT_USER', 'RO');
insert into mp_cm_role_group_ia_rel (id, ia_id, role_group_id, permission) values ('RI000019', 'IA000009', 'DEFAULT_USER', 'RO');