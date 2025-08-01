--
-- PostgreSQL database dump
--

-- Dumped from database version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)
-- Dumped by pg_dump version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password text NOT NULL,
    session_token text,
    session_expires_at timestamp without time zone
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admin_id_seq OWNER TO postgres;

--
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- Name: capsulas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capsulas (
    id integer NOT NULL,
    image_url character varying(100) NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    season character varying(25) NOT NULL,
    is_public boolean DEFAULT true
);


ALTER TABLE public.capsulas OWNER TO postgres;

--
-- Name: capsulas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.capsulas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.capsulas_id_seq OWNER TO postgres;

--
-- Name: capsulas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.capsulas_id_seq OWNED BY public.capsulas.id;


--
-- Name: capsulas_superset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capsulas_superset (
    capsulas_id integer NOT NULL,
    outfit_id integer NOT NULL
);


ALTER TABLE public.capsulas_superset OWNER TO postgres;

--
-- Name: clothes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clothes (
    id integer NOT NULL,
    image_url character varying(100) NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    category character varying(50),
    artikul character varying(100),
    store_name character varying(100),
    store_url text
);


ALTER TABLE public.clothes OWNER TO postgres;

--
-- Name: clothes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clothes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clothes_id_seq OWNER TO postgres;

--
-- Name: clothes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clothes_id_seq OWNED BY public.clothes.id;


--
-- Name: outfits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.outfits (
    id integer NOT NULL,
    image_url character varying(100) NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    season character varying(50),
    label character varying(50),
    is_public boolean DEFAULT true
);


ALTER TABLE public.outfits OWNER TO postgres;

--
-- Name: outfits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.outfits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.outfits_id_seq OWNER TO postgres;

--
-- Name: outfits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.outfits_id_seq OWNED BY public.outfits.id;


--
-- Name: outfits_superset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.outfits_superset (
    outfit_id integer NOT NULL,
    clothes_id integer NOT NULL
);


ALTER TABLE public.outfits_superset OWNER TO postgres;

--
-- Name: user_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_images (
    id integer NOT NULL,
    user_id integer,
    image_url text NOT NULL
);


ALTER TABLE public.user_images OWNER TO postgres;

--
-- Name: user_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_images_id_seq OWNER TO postgres;

--
-- Name: user_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_images_id_seq OWNED BY public.user_images.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    alias character varying(100) NOT NULL,
    session_token text,
    session_expires_at timestamp without time zone,
    full_name text,
    birth_date text,
    current_city text,
    phone_number text,
    email text,
    profession text,
    marital_status boolean,
    top_size text,
    bottom_size text,
    shoe_size text,
    shoe_description text,
    height text,
    chest_circumference text,
    shoulder_circumference text,
    waist_circumference text,
    hip_circumference text,
    eye_color text,
    hair_color text,
    aim_description text,
    experience_description text,
    wardrobe_description text,
    labels_description text,
    impression_description text[],
    brand_description text,
    colors_description text,
    body_description text,
    outfit_description text[],
    budget_description text,
    passcode text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_capsulas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_capsulas (
    user_id integer NOT NULL,
    capsulas_id integer NOT NULL
);


ALTER TABLE public.users_capsulas OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_liked; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_liked (
    id integer NOT NULL,
    user_id integer,
    liked_type character varying(20) NOT NULL,
    liked_id integer NOT NULL,
    CONSTRAINT users_liked_liked_type_check CHECK (((liked_type)::text = ANY ((ARRAY['clothes'::character varying, 'outfits'::character varying, 'capsulas'::character varying])::text[])))
);


ALTER TABLE public.users_liked OWNER TO postgres;

--
-- Name: users_liked_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_liked_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_liked_id_seq OWNER TO postgres;

--
-- Name: users_liked_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_liked_id_seq OWNED BY public.users_liked.id;


--
-- Name: users_outfits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_outfits (
    user_id integer NOT NULL,
    outfit_id integer NOT NULL
);


ALTER TABLE public.users_outfits OWNER TO postgres;

--
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- Name: capsulas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsulas ALTER COLUMN id SET DEFAULT nextval('public.capsulas_id_seq'::regclass);


--
-- Name: clothes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clothes ALTER COLUMN id SET DEFAULT nextval('public.clothes_id_seq'::regclass);


--
-- Name: outfits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outfits ALTER COLUMN id SET DEFAULT nextval('public.outfits_id_seq'::regclass);


--
-- Name: user_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_images ALTER COLUMN id SET DEFAULT nextval('public.user_images_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_liked id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_liked ALTER COLUMN id SET DEFAULT nextval('public.users_liked_id_seq'::regclass);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: capsulas capsulas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsulas
    ADD CONSTRAINT capsulas_pkey PRIMARY KEY (id);


--
-- Name: capsulas_superset capsulas_superset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsulas_superset
    ADD CONSTRAINT capsulas_superset_pkey PRIMARY KEY (capsulas_id, outfit_id);


--
-- Name: clothes clothes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clothes
    ADD CONSTRAINT clothes_pkey PRIMARY KEY (id);


--
-- Name: outfits outfits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outfits
    ADD CONSTRAINT outfits_pkey PRIMARY KEY (id);


--
-- Name: outfits_superset outfits_superset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outfits_superset
    ADD CONSTRAINT outfits_superset_pkey PRIMARY KEY (outfit_id, clothes_id);


--
-- Name: user_images user_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_pkey PRIMARY KEY (id);


--
-- Name: users_capsulas users_capsulas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_capsulas
    ADD CONSTRAINT users_capsulas_pkey PRIMARY KEY (user_id, capsulas_id);


--
-- Name: users_liked users_liked_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_liked
    ADD CONSTRAINT users_liked_pkey PRIMARY KEY (id);


--
-- Name: users_outfits users_outfits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_outfits
    ADD CONSTRAINT users_outfits_pkey PRIMARY KEY (user_id, outfit_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: capsulas_superset capsulas_superset_capsulas_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsulas_superset
    ADD CONSTRAINT capsulas_superset_capsulas_id_fkey FOREIGN KEY (capsulas_id) REFERENCES public.capsulas(id) ON DELETE CASCADE;


--
-- Name: capsulas_superset capsulas_superset_outfit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsulas_superset
    ADD CONSTRAINT capsulas_superset_outfit_id_fkey FOREIGN KEY (outfit_id) REFERENCES public.outfits(id) ON DELETE CASCADE;


--
-- Name: outfits_superset outfits_superset_clothes_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outfits_superset
    ADD CONSTRAINT outfits_superset_clothes_id_fkey FOREIGN KEY (clothes_id) REFERENCES public.clothes(id) ON DELETE CASCADE;


--
-- Name: outfits_superset outfits_superset_outfit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outfits_superset
    ADD CONSTRAINT outfits_superset_outfit_id_fkey FOREIGN KEY (outfit_id) REFERENCES public.outfits(id) ON DELETE CASCADE;


--
-- Name: user_images user_images_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_capsulas users_capsulas_capsulas_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_capsulas
    ADD CONSTRAINT users_capsulas_capsulas_id_fkey FOREIGN KEY (capsulas_id) REFERENCES public.capsulas(id) ON DELETE CASCADE;


--
-- Name: users_capsulas users_capsulas_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_capsulas
    ADD CONSTRAINT users_capsulas_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_liked users_liked_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_liked
    ADD CONSTRAINT users_liked_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_outfits users_outfits_outfit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_outfits
    ADD CONSTRAINT users_outfits_outfit_id_fkey FOREIGN KEY (outfit_id) REFERENCES public.outfits(id) ON DELETE CASCADE;


--
-- Name: users_outfits users_outfits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_outfits
    ADD CONSTRAINT users_outfits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

