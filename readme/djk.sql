--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE accounts (
    id integer NOT NULL,
    email character varying(64),
    fullname character varying(32),
    password character varying(128),
    role character varying(16),
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE accounts OWNER TO dbuser;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE accounts_id_seq OWNER TO dbuser;

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE accounts_id_seq OWNED BY accounts.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE alembic_version OWNER TO dbuser;

--
-- Name: celery_task_log; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE celery_task_log (
    id character varying(36) NOT NULL,
    name character varying(32) NOT NULL,
    args json,
    kwargs json,
    retries integer,
    retval character varying(256),
    exception character varying(512),
    status smallint,
    create_at timestamp without time zone
);


ALTER TABLE celery_task_log OWNER TO dbuser;

--
-- Name: fixture_download; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE fixture_download (
    fixture_id integer NOT NULL,
    number_of_times integer
);


ALTER TABLE fixture_download OWNER TO dbuser;

--
-- Name: fixtures; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE fixtures (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    intro text NOT NULL,
    profile json,
    attachment json,
    assets json,
    cover character varying(256) NOT NULL,
    create_at timestamp without time zone,
    update_at timestamp without time zone,
    tag_ids integer[],
    pattern_ids integer[],
    author character varying(32),
    origin_place character varying(128),
    size character varying(64),
    year character varying(20)
);


ALTER TABLE fixtures OWNER TO dbuser;

--
-- Name: fixtures_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE fixtures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fixtures_id_seq OWNER TO dbuser;

--
-- Name: fixtures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE fixtures_id_seq OWNED BY fixtures.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE images (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    url character varying(256) NOT NULL,
    intro text
);


ALTER TABLE images OWNER TO dbuser;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE images_id_seq OWNER TO dbuser;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE images_id_seq OWNED BY images.id;


--
-- Name: pattern_download; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE pattern_download (
    pattern_id integer NOT NULL,
    number_of_times integer
);


ALTER TABLE pattern_download OWNER TO dbuser;

--
-- Name: patterns; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE patterns (
    id integer NOT NULL,
    name character varying NOT NULL,
    intro text,
    "references" json,
    attachment json,
    assets json
);


ALTER TABLE patterns OWNER TO dbuser;

--
-- Name: patterns_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE patterns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE patterns_id_seq OWNER TO dbuser;

--
-- Name: patterns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE patterns_id_seq OWNED BY patterns.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE tags (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    category character varying(8) NOT NULL
);


ALTER TABLE tags OWNER TO dbuser;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tags_id_seq OWNER TO dbuser;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE tags_id_seq OWNED BY tags.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY accounts ALTER COLUMN id SET DEFAULT nextval('accounts_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY fixtures ALTER COLUMN id SET DEFAULT nextval('fixtures_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY images ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY patterns ALTER COLUMN id SET DEFAULT nextval('patterns_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY tags ALTER COLUMN id SET DEFAULT nextval('tags_id_seq'::regclass);


--
-- Name: accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts_email_key UNIQUE (email);


--
-- Name: accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: celery_task_log_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY celery_task_log
    ADD CONSTRAINT celery_task_log_pkey PRIMARY KEY (id);


--
-- Name: fixture_download_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY fixture_download
    ADD CONSTRAINT fixture_download_pkey PRIMARY KEY (fixture_id);


--
-- Name: fixtures_name_key; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY fixtures
    ADD CONSTRAINT fixtures_name_key UNIQUE (name);


--
-- Name: fixtures_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY fixtures
    ADD CONSTRAINT fixtures_pkey PRIMARY KEY (id);


--
-- Name: images_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: pattern_download_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY pattern_download
    ADD CONSTRAINT pattern_download_pkey PRIMARY KEY (pattern_id);


--
-- Name: patterns_name_key; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY patterns
    ADD CONSTRAINT patterns_name_key UNIQUE (name);


--
-- Name: patterns_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY patterns
    ADD CONSTRAINT patterns_pkey PRIMARY KEY (id);


--
-- Name: tags_name_category_key; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_name_category_key UNIQUE (name, category);


--
-- Name: tags_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: fixtures_patterns; Type: INDEX; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE INDEX fixtures_patterns ON fixtures USING gin (pattern_ids);


--
-- Name: fixtures_tags; Type: INDEX; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE INDEX fixtures_tags ON fixtures USING gin (tag_ids);


--
-- Name: fixture_download_fixture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY fixture_download
    ADD CONSTRAINT fixture_download_fixture_id_fkey FOREIGN KEY (fixture_id) REFERENCES fixtures(id) ON DELETE CASCADE;


--
-- Name: pattern_download_pattern_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY pattern_download
    ADD CONSTRAINT pattern_download_pattern_id_fkey FOREIGN KEY (pattern_id) REFERENCES patterns(id) ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

