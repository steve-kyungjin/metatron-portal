select 
	exec_log.exec_trid
	,exec_log.exec_action_type
	,exec_log.opened_uxfunc_id
	,exec_log.opened_uxfunc_name
	,exec_log.exec_datetime
	,exec_log.exec_date
	,exec_log.exec_weekday_cd
	,case when exec_weekday_cd = 6 then 'SUN'
	      when exec_weekday_cd = 0 then 'MON'
	      when exec_weekday_cd = 1 then 'TUE'
	      when exec_weekday_cd = 2 then 'WED'
	      when exec_weekday_cd = 3 then 'THU'
	      when exec_weekday_cd = 4 then 'FRI'		  
	      when exec_weekday_cd = 5 then 'SAT'	
	 end as exec_weekday	
	,exec_log.exec_hours
	,exec_log.exec_hourmin
	,exec_log.exec_hostname
	,exec_log.exec_system
	,exec_log.exec_type
	,exec_log.meta_loc
	,exec_log.meta_type
	,exec_log.exec_meta_nm
	,exec_log.exec_meta_id
	,user_info.user_id
	,user_info.user_name
	,case when user_info.l2_org like 'ICT Infra%' or user_info.l1_org <> 'SKT' then 'Infra/O&S' else 'Others' end as org_cat1		
	,user_info.l4_org
	,user_info.l3_org
	,user_info.l2_org
	,user_info.l1_org
from ( 
	select 
		id as exec_trid
		,action as exec_action_type
		,module_id as opened_uxfunc_id
		,module_nm as opened_uxfunc_name
		,date_format(time, '%Y-%m-%d %T') as exec_datetime
		,date_format(time, '%Y-%m-%d') as exec_date
		,weekday(time) as exec_weekday_cd
		,date_format(time, '%H') as exec_hours
		,date_format(time, '%H:%i') as exec_hourmin	
		,type as exec_type
		,var as exec_contents_name
		,host as exec_hostname
		,system as exec_system
		, case when module_id = 'IA000001' then 'INTEG_SEARCH' else 'METADATA' end as meta_loc
	  	, case when length(substring_index(var, ',', -1)) = 3 then 'SYSTEM'
										   
	        when length(substring_index(var, ',', -1)) = 11  and substring_index(var, ',', 1) like '(C)%' then 'COLUMN'
			when length(substring_index(var, ',', -1)) = 7 and left(var,1) = '[' then 'DATABASE'
			when length(substring_index(var, ',', -1)) = 7 then 'TABLE'
	        else 'UNKNOWN' end as meta_type
	  	,substring_index(var, ',', 1) as exec_meta_nm
		,substring_index(var, ',', -1) as exec_meta_id
		,user_id
		,time
	from metatron_portal.mp_log_action 
	where date_format(time, '%Y-%m-%d %T') >= '2018-10-04'
		and module_id in ('IA000101', 'IA000102', 'IA000103', 'IA000001')
		and type = 'DETAIL'
		and action = 'VIEW'
) as exec_log
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
order by exec_datetime desc
;