select 
	exec_log.id as exec_trid
	,exec_log.action as exec_action_type
	,exec_log.module_id as opened_uxfunc_id
	,exec_log.module_nm as opened_uxfunc_name
	,date_format(exec_log.time, '%Y-%m-%d %T') as exec_datetime
	,date_format(exec_log.time, '%Y-%m-%d') as exec_date
	,weekday(exec_log.time) as exec_weekday_cd
	,case when weekday(exec_log.time)  = 6 then 'SUN'
	      when weekday(exec_log.time)  = 0 then 'MON'
	      when weekday(exec_log.time)  = 1 then 'TUE'
	      when weekday(exec_log.time)  = 2 then 'WED'
	      when weekday(exec_log.time)  = 3 then 'THU'
	      when weekday(exec_log.time)  = 4 then 'FRI'		  
	      when weekday(exec_log.time)  = 5 then 'SAT'	
	 end as exec_weekday	
	,date_format(exec_log.time, '%H') as exec_hours
	,date_format(exec_log.time, '%H:%i') as exec_hourmin	
	,exec_log.type as exec_type
	,uxf_tr.l1_nm as exec_uxf_l1
	,uxf_tr.l2_nm as exec_uxf_l2
	,exec_log.var as exec_uxf_l3
	,exec_log.host as exec_hostname
	,exec_log.system as exec_system
	,user_info.user_id
	,user_info.user_name
	,case when user_info.l2_org like 'ICT Infra%' or user_info.l1_org <> 'SKT' then 'Infra/O&S' else 'Others' end as org_cat1		
	,user_info.l4_org
	,user_info.l3_org
	,user_info.l2_org
	,user_info.l1_org 
from metatron_portal.mp_log_action as exec_log
inner join 
(
	select 
	 u.user_id as user_id
	 ,u.user_nm as user_name
	 ,org.l4_org_name as l4_org
	 ,org.l3_org_name as l3_org
	 ,org.l2_org_name as l2_org
	 ,org.l1_org_name as l1_org
	from 
	  metatron_portal.mp_cm_user as u 
	  , metatron_portal.mp_cm_role_group_user_rel as rel 
	  , (
			select 
				case when l4_org.id is null then l123_org.l3_org_id else l4_org.id end as l4_org_id
				,case when l4_org.id is null then l123_org.l3_org_name else l4_org.name end as l4_org_name
				,l123_org.l3_org_id
				,l123_org.l3_org_name
				,l123_org.l2_org_id
				,l123_org.l2_org_name
				,l123_org.l1_org_id
				,l123_org.l1_org_name	
			from metatron_portal.mp_cm_role_group as l4_org
			right outer join
			(
				select 
					case when l3_org.id is null then l1l2_org.l2_org_id else l3_org.id end as l3_org_id
					,case when l3_org.id is null then l1l2_org.l2_org_name else l3_org.name end as l3_org_name
					,l1l2_org.l2_org_id
					,l1l2_org.l2_org_name
					,l1l2_org.l1_org_id
					,l1l2_org.l1_org_name
				from metatron_portal.mp_cm_role_group as l3_org
				right outer join (
					select 
						l2_org.id as l2_org_id, 
						l2_org.name as l2_org_name, 
						l1_org.id as l1_org_id, 
						l1_org.name  as l1_org_name
					from  metatron_portal.mp_cm_role_group as l2_org 
					inner join ( 
							select id as id, name as name, parent_id as parent_id 
						from metatron_portal.mp_cm_role_group as grp where grp.type = 'ORGANIZATION' and grp.id = '50000000'
						union all
						select id as id, 'SKT' as name, parent_id as parent_id 
						from metatron_portal.mp_cm_role_group as grp where grp.type = 'ORGANIZATION' and grp.id = 'A000020000' 
					) as l1_org on (l1_org.id = l2_org.parent_id )
				) as l1l2_org on (l1l2_org.l2_org_id = l3_org.parent_id )
			) as  l123_org on (l123_org.l3_org_id = l4_org.parent_id )	  
		  ) as org
	where u.user_id = rel.user_id
	and rel.role_group_id = org.l4_org_id
) user_info on (exec_log.user_id = user_info.user_id)
inner join 
(
	SELECT
		ia1.id AS l1_id,
		ia1.ia_nm AS l1_nm,
		ia1.ia_order as l1_order,
		case when ia2.id is null then ia1.id else ia2.id end AS l2_id,
		case when ia2.id is null then ia1.ia_nm else ia2.ia_nm end AS l2_nm,
		case when ia2.id is null then ia1.ia_order else ia2.ia_order end as l2_order,
		case when ia3.id is null and ia2.id is null then ia1.id
			 when ia3.id is null and ia2.id is not null then ia2.id 
			 else ia3.id end as l3_id,
		case when ia3.id is null and ia2.id is null then ia1.ia_nm
			 when ia3.id is null and ia2.id is not null then ia2.ia_nm 
			 else ia3.ia_nm end as l3_nm,		 
		case when ia3.id is null and ia2.id is null then ia1.ia_order
			 when ia3.id is null and ia2.id is not null then ia2.ia_order 
			 else ia3.ia_order end as l3_order,
		case when ia3.id is null and ia2.id is null then 1
			 when ia3.id is null and ia2.id is not null then 2 
			 else 3 end as leaf_level
	FROM metatron_portal.mp_cm_ia ia1
	 LEFT JOIN metatron_portal.mp_cm_ia ia2 ON ia2.parent_code = ia1.id
	 LEFT JOIN metatron_portal.mp_cm_ia ia3 ON ia3.parent_code = ia2.id
	WHERE ia1.depth = 1 and ia1.id <> 'IA000001'
) uxf_tr on ( exec_log.var = uxf_tr.l3_nm )
where date_format(exec_log.time, '%Y-%m-%d') >= '2018-10-04'
and exec_log.action <> 'VIEW'
order by exec_datetime desc
;
