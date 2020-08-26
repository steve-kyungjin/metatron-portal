select 
	conn_log.id as conn_trid
	,conn_log.access_ip as conn_ip
	,conn_log.endpoint as conn_thr_path
	,conn_log.type as conn_type
	,date_format(conn_log.access_time, '%Y-%m-%d %T') as conn_datetime
	,date_format(conn_log.access_time, '%Y-%m-%d') as conn_date
	,weekday(conn_log.access_time) as conn_weekday_cd
	,case when weekday(conn_log.access_time) = 6 then 'SUN'
	      when weekday(conn_log.access_time) = 0 then 'MON'
	      when weekday(conn_log.access_time) = 1 then 'TUE'
	      when weekday(conn_log.access_time) = 2 then 'WED'
	      when weekday(conn_log.access_time) = 3 then 'THU'
	      when weekday(conn_log.access_time) = 4 then 'FRI'		  
	      when weekday(conn_log.access_time) = 5 then 'SAT'	
	 end as conn_weekday
	,date_format(conn_log.access_time, '%H') as conn_hours
	,date_format(conn_log.access_time, '%H:%i') as conn_hourmin
	,user_info.user_id as conn_user_id
	,user_info.user_name as conn_user_name
	,case when user_info.l2_org like 'ICT Infra%' or user_info.l1_org <> 'SKT' then 'Infra/O&S' else 'Others' end as org_cat1
	,user_info.l4_org as l4_org_name
	,user_info.l3_org as l3_org_name
	,user_info.l2_org as l2_org_name
	,user_info.l1_org as l1_org_name	
from metatron_portal.mp_log_sys as conn_log
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
) user_info on (conn_log.access_user_id = user_info.user_id )
where date_format(conn_log.access_time, '%Y-%m-%d') >= '2018-10-04'
order by access_time desc
;
