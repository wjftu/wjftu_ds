---
title: Oracle
sidebar_position: 30
---

# Oracle



### 登录数据库


登录数据库

```sql
sqlplus username/password@ip:port/name
```

如果被锁了登录不上，可以用管理员账户解锁
```sql
select LOCK_DATE,username from dba_users where username = 'MYUSERNAME';
alter user MYUSERNAME account unlock;
```





### 数据类型

字符型：

char 长度固定的字符串，char(10) 表示最长 10 字节，后面用空格补全，查询速度快，适合长度固定或频繁查找的数据  
varchar2 长度可变，varchar2(10) 表示最长 10 字节，省空间

如需设置字符长度而不是字节长度，需要用 `char` ，例如 char(5 char) varchar2(10 char)


数字型：

number 整数或小数  
number(5) 表示5位整数，-99999 到 99999  
number(5,2) 表示 5 位有效数，包括 2 位小数，范围 -999.99 到 999.99  

日期型：

date 年月日时分秒  
timestamp 精确到毫秒  

```sql
to_date('1999-01-31 23:24:25','yyyy-mm-dd hh24:mi:ss') 
to_char(sysdate,'yyyy-mm-dd hh24:mi:ss')
```

Blob

blob 二进制数据，最大 4 G

### 创建表

```sql
create table tab_name (
    name varchar2(10),
    age number(3),
    sex char(1),
    weight number(7,2), 
    birthday date
)
```

添加主键

```sql
alter table tab_name add constraint tb_pk primary key (deptno);
```






添加字段

```sql
alter table tab_name add(col_name number(2))
```

修改字段长度或类型（修改类型不能有数据）

```sql
alter table tab_name modify( col_name varchar2(5))
```

删除字段

```sql
alter table tab_name drop column col_name
```

修改表名 renam
```sql
rename tab_name to tab_name_new
```

复制表

`insert select` 插入数据非常非常快，比直接用代码批量插入快很多

```sql
-- 复制表结构和数据
create table tab_name as select * from tab_name_old
-- 复制表结构
create table tab_name like tab_name_old
-- 复制表数据（表结构一样）
insert into tab_name select * from tab_name_old
-- 复制表数据（表结构不一样）
insert into tab_name(col1, col2) select col1, col2 from tab_name_old
```

删除表

```sql
drop table tab_name
```

获取删除所有表的 sql 
```sql
SELECT 'DROP table USERNAME.'||table_name||';'  FROM all_tables WHERE owner='USERNAME';
```

插入数据

如果每列都插入数据，可以不指定列名，按顺序插入。如果指定列名，可以插入部分列

在 oracle 中，空字符串视为 null

```sql
insert into tab_name values('abc',1, null, 2.2);
insert into tab_name(name, age, weight) values('tom', 7, 11.1);
```

插入遇到重复主键可以用 `merge into` 处理

```sql
MERGE INTO users dest
  USING( SELECT 1 user_id, 10 points FROM dual) src
     ON( dest.user_id = src.user_id )
 WHEN MATCHED THEN
   UPDATE SET points = src.points
 WHEN NOT MATCHED THEN
   INSERT( user_id, points ) 
     VALUES( src.user_id, src.points );
```

修改数据

通常需要用 where 语句指定修改的行，不然全部都会被修改

```sql
update tab_name set col1 = 'aaa', col2 = 11 where id = 1;
```

删除数据

通常需要用 where 语句指定删除的行，不然全部都会被删除

```sql
delete from tab_name where id = 1;
```

查询数据


```sql
select * from tab_name;
select col1, col2 from tab_name;
```

查询数据，去除重复行

```sql
select distinct col1, col2 from tab_name;
```

统计数量

```sql
select count(*) from tab_name;
```

可以使用 where 进行条件查询

可以使用 like 进行模糊查询，% 表示 0 个或多个任意字符

```sql
select * from tab_name where col1 = 1;
select * from tab_name where col1 is null;
select * from tab_name where col1 is not null;
select * from tab_name where col1 like '%abc%';
select * from tab_name where col1 in (1, 3, 5);
```

dual 是一个特殊的表，可以用于查询不属于任何表的数据或计算。

```sql
select 1+2 from dual;
select sysdate from dual;
```

查询时可以使用别名

```sql
select col1 col1_aliase from tab_name;
select col1 as col1_aliase from tab_name;
```



序列

当需要使用自增 id 时，可以使用 oracle 的序列
```sql
-- 创建序列
CREATE SEQUENCE seq_name INCREMENT BY 1 START WITH 1 MAXVALUE 999999999999999999999999999 CACHE 10 ORDER NOCYCLE;
-- 读取下一个值
select seq_name.nextval from dual
```

获取建序列语句

```sql
SELECT 'drop SEQUENCE '||SEQUENCE_NAME|| ';CREATE SEQUENCE '||SEQUENCE_NAME|| ' INCREMENT BY '||INCREMENT_BY ||' START WITH '||LAST_NUMBER||' MAXVALUE '||MAX_VALUE ||' '||(case when CACHE_SIZE=0 then 'NOCACHE' else 'CACHE '||CACHE_SIZE end)||' ORDER NOCYCLE ;' FROM user_SEQUENCES;


```

查询所有序列
```sql
select * from user_sequences;
```

索引

查看所有索引

```sql
select * from user_ind_columns;
```

有一些索引列以 `SYS_NC00` 开头，这些是辅组列


创建索引

```sql
-- 创建 b-tree 索引
create index idx_name on tab_name(col);
-- 创建位图索引
create bitmap index idx_name on tab_name(col);
```



表的统计信息

all_tables user_tables 含有表的统计信息


有一些信息不是实时统计的，可以手动进行统计

```sql
-- 统计
analyze table tab_name compute statistics for table;
-- 获取所有表统计的 sql
select 'analyze table ' || table_name || ' compute statistics for table;' from user_tables;
```

### 函数

字符串处理函数

字符串拼接可以使用 `||` ，也可以使用 `concat(str1, str2)` ，concat 只能拼 2 个字符串，如需拼多个需要反复调用

字符串替换 `replace(src, str1, str2)` 将 src 中的 str1 替换成 str2 

字符串截取 `substr(string str, int a, int b)` ，截取 str 从 a 开始长度为 b 的字符串，下标从 1 开始， 写 0 也是 1 ， `substr(string str, int a)` 截取从 a 到末尾

在为空时可以用 `nvl(str, replace_with)` 函数指定值 

```sql
select 'a' || 'b' from dual;  -- ab
select concat('ab', 'cd') from dual; -- abcd
select replace('abcd', 'b' ,'bb') from dual; -- abbcd
select substr('abcdefg', 2, 3) from dual; -- bcd
select substr('abcdefg', 2) from dual; -- bcdefg
select nvl(col1, 'aa') from dual;
```

时间处理函数

`to_date(str, pattern)` 将字符串转化为 date  
`to_char(date, pattern)` 将 date 转换为字符串  

```sql
select to_date('2000-01-01 01:01:01', 'yyyy-mm-dd hh24:mi:ss') from dual;
select to_char(sysdate, 'yyyy-mm-dd hh24:mi:ss') from dual;
```

