-- 달력 마스터 - cal_inf
CREATE DATABASE IF NOT EXISTS d_bin;

DROP TABLE IF EXISTS d_bin.cal_inf

CREATE EXTERNAL TABLE IF NOT EXISTS d_bin.cal_inf(
  cal_id              string comment '달력 ID',
  cal_date            string comment '일자',
  cal_daw_cd          string comment '요일 CD',
  cal_daw             string comment '요일 한글',
  cal_daw_en          string comment '요일 영문',
  cal_year_seq        string comment '년 기준 주차 SEQ',
  cal_year_week       string comment '년월 주차'
  cal_year_mon        string comment '년월'
  cal_holiday         string comment '휴일여부'
  cal_holiday_des     string comment '휴일내용'
)
 comment '달력 마스터'
 partitioned by (etl_dt string)
 row format delimited fields terminated by '\036'
 lines terminated by '\n'
 null defined as ''
 stored as textfile
 location 'hdfs://localhost:9000/edw/warehouse/dw/db=d_bin/period=1d/ver=v1/tb=cal_inf'
 tblproperties("textfile.compress"="snappy")
;


