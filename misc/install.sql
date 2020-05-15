-- Replace lucy with your postgres username.

create database calorietracker;

create table "user"
(
	userid text not null
		constraint user_pkey
			primary key,
	first_name varchar(50) not null,
	last_name varchar(50) not null,
	email varchar(120) not null,
	password varchar(120) not null,
	gender varchar(6) not null
		constraint user_gender_check
			check (((gender)::text = 'Female'::text) OR ((gender)::text = 'Male'::text)),
	age smallint not null
		constraint user_age_check
			check (age > 15),
	goalweight integer not null,
	datejoined timestamp not null,
	caloriegoal double precision not null
);

alter table "user" owner to lucy;

create table weight
(
	userid text not null
		constraint weight_userid_fkey
			references "user",
	weight double precision not null,
	date timestamp not null
);

alter table weight owner to lucy;

create table food
(
	userid text not null
		constraint food_userid_fkey
			references "user",
	foodname varchar(500) not null,
	calories double precision not null,
	"fdcId" integer not null,
	mealtype varchar(12) not null,
	date timestamp not null,
	numberofservings double precision default 1.00 not null,
	servingsize double precision default 100.00 not null
);

alter table food owner to lucy;