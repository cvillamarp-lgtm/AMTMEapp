-- ============================================================
-- Migration: 20260628000001_seed_landing_cms.sql
-- Seed the CMS with the current AMTME landing content.
-- Idempotent: uses ON CONFLICT DO NOTHING / DO UPDATE.
-- ============================================================

do $$
declare
  v_page_id uuid;
begin

-- ─────────────────────────────────────────
-- 1. Create the landing page record
-- ─────────────────────────────────────────
insert into public.site_pages (slug, title, description, is_published, seo_metadata)
values (
  'landing',
  'AMTME — A Mí Tampoco Me Explicaron · Podcast de Christian Villamar',
  'Podcast emocional sobre amor, apego, vínculos, límites y volver a uno mismo. Conducido por Christian Villamar.',
  true,
  jsonb_build_object(
    'og_title', 'AMTME — A Mí Tampoco Me Explicaron',
    'og_description', 'Podcast emocional sobre amor, apego, vínculos, límites y volver a uno mismo.',
    'og_image', '/og-image.jpg',
    'twitter_card', 'summary_large_image'
  )
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  is_published = excluded.is_published,
  seo_metadata = excluded.seo_metadata,
  updated_at = now();

select id into v_page_id from public.site_pages where slug = 'landing';

-- ─────────────────────────────────────────
-- 2. Seed sections (idempotent via unique(page_id, section_key))
-- ─────────────────────────────────────────

-- HERO
insert into public.site_sections (page_id, section_key, label, sort_order, is_visible, content)
values (v_page_id, 'hero', 'Hero', 0, true, jsonb_build_object(
  'eyebrow', 'EPISODIO 014 · NUEVO',
  'title', 'A mí tampoco me explicaron cómo se suelta lo que todavía duele.',
  'subtitle', 'Un podcast para entender el amor, el apego, los vínculos, la dignidad y todo eso que sentimos, pero que nadie nos enseñó a nombrar.',
  'cta_primary_label', 'Escuchar episodio destacado',
  'cta_primary_url', 'https://open.spotify.com/show/7w3r41VGcUjCRU8QF3pnRb',
  'cta_secondary_label', 'Ver episodios',
  'cta_secondary_url', '/#episodios',
  'stats', jsonb_build_array(
    jsonb_build_object('label', 'TEMPORADAS', 'value', '03'),
    jsonb_build_object('label', 'EPISODIOS', 'value', '42'),
    jsonb_build_object('label', 'OYENTES', 'value', '120K+'),
    jsonb_build_object('label', 'HOST', 'value', 'Christian Villamar')
  ),
  'ticker_items', jsonb_build_array(
    'Amor vs apego', 'Dignidad', 'Volver a uno mismo', 'Duelo emocional',
    'Límites', 'Rechazo', 'Ansiedad afectiva', 'Tarot como espejo'
  )
))
on conflict (page_id, section_key) do update set
  content = excluded.content, updated_at = now();

-- FEATURED EPISODE
insert into public.site_sections (page_id, section_key, label, sort_order, is_visible, content)
values (v_page_id, 'featured_episode', 'Episodio Destacado', 1, true, jsonb_build_object(
  'eyebrow', 'EPISODIO DESTACADO',
  'label', 'Lo que está sonando ahora',
  'episode_tag', 'NUEVO · EP 014',
  'episode_topics', 'APEGO · DIGNIDAD · 48 MIN',
  'episode_title', 'Por qué vuelves aunque ya lo sabes',
  'episode_description', 'Esa cosa rara donde la mente entiende, el cuerpo recuerda y la historia vuelve a llamarte a la puerta. Un episodio sobre el ciclo, el cuerpo y lo que realmente se está soltando cuando crees que estás soltando.',
  'cta_label', 'Ver episodio completo →',
  'cta_url', 'https://open.spotify.com/show/7w3r41VGcUjCRU8QF3pnRb',
  'platforms', jsonb_build_array('Spotify', 'Apple Podcasts', 'YouTube', 'iVoox')
))
on conflict (page_id, section_key) do update set
  content = excluded.content, updated_at = now();

-- ABOUT (Qué es AMTME)
insert into public.site_sections (page_id, section_key, label, sort_order, is_visible, content)
values (v_page_id, 'about', 'Sobre AMTME', 2, true, jsonb_build_object(
  'eyebrow', 'QUÉ ES AMTME',
  'headline', 'Una casa para los que sintieron demasiado.',
  'body', 'AMTME es un espacio para quienes han sentido demasiado, han explicado demasiado, han esperado demasiado y un día necesitan volver a escucharse. No viene a darte respuestas perfectas. Viene a acompañarte mientras encuentras las tuyas. Aquí no hablamos desde el pedestal — hablamos desde el camino, con honestidad, vulnerabilidad y una mirada simbólica que usa el tarot como espejo de conciencia. No prometemos arreglarte. Te recordamos que no estás roto: estás entendiendo tarde lo que nadie te enseñó a tiempo.'
))
on conflict (page_id, section_key) do update set
  content = excluded.content, updated_at = now();

-- TOPICS GRID
insert into public.site_sections (page_id, section_key, label, sort_order, is_visible, content)
values (v_page_id, 'topics', 'Temas', 3, true, jsonb_build_object(
  'eyebrow', 'TEMAS',
  'headline', 'Lo que abordamos.',
  'sub_headline', '09 territorios emocionales',
  'topics', jsonb_build_array(
    jsonb_build_object('number', '01', 'label', 'Amor vs apego'),
    jsonb_build_object('number', '02', 'label', 'Límites'),
    jsonb_build_object('number', '03', 'label', 'Dignidad'),
    jsonb_build_object('number', '04', 'label', 'Rechazo'),
    jsonb_build_object('number', '05', 'label', 'Duelo'),
    jsonb_build_object('number', '06', 'label', 'Ansiedad emocional'),
    jsonb_build_object('number', '07', 'label', 'Rol del salvador'),
    jsonb_build_object('number', '08', 'label', 'Volver a uno mismo'),
    jsonb_build_object('number', '09', 'label', 'Tarot como espejo')
  )
))
on conflict (page_id, section_key) do update set
  content = excluded.content, updated_at = now();

-- RECENT EPISODES
insert into public.site_sections (page_id, section_key, label, sort_order, is_visible, content)
values (v_page_id, 'recent_episodes', 'Episodios Recientes', 4, true, jsonb_build_object(
  'eyebrow', 'CATÁLOGO',
  'headline', 'Episodios recientes.',
  'cta_label', 'Ver todos los episodios →',
  'cta_url', '/episodios',
  'spotify_embed_note', 'Los episodios se cargan desde Spotify. Explora todos aquí:'
))
on conflict (page_id, section_key) do update set
  content = excluded.content, updated_at = now();

-- MANIFESTO
insert into public.site_sections (page_id, section_key, label, sort_order, is_visible, content)
values (v_page_id, 'manifesto', 'Manifiesto', 5, true, jsonb_build_object(
  'eyebrow', 'MANIFIESTO',
  'quote_line1', 'No era intensidad.',
  'quote_line2', 'Era una herida intentando',
  'quote_line3', 'explicar por qué dolía tanto.',
  'cta_primary_label', 'Escuchar el podcast',
  'cta_primary_url', 'https://open.spotify.com/show/7w3r41VGcUjCRU8QF3pnRb',
  'cta_secondary_label', 'Unirme a la newsletter',
  'cta_secondary_url', '/#newsletter'
))
on conflict (page_id, section_key) do update set
  content = excluded.content, updated_at = now();

-- ABOUT CHRISTIAN
insert into public.site_sections (page_id, section_key, label, sort_order, is_visible, content)
values (v_page_id, 'about_christian', 'Sobre Christian', 6, true, jsonb_build_object(
  'eyebrow', 'SOBRE CHRISTIAN',
  'headline', 'No hablo desde el pedestal. Hablo desde el camino.',
  'body1', 'Soy Christian Villamar. AMTME nace de todo eso que también tuve que aprender tarde: amar sin desaparecer, soltar sin romperme y volver a mí sin pedir permiso.',
  'body2', 'Llevo años conversando sobre vínculos, apego, ansiedad afectiva y dignidad emocional. No para darte fórmulas — para acompañarte mientras entiendes las tuyas.',
  'cta_label', 'Conocer más',
  'cta_url', '/sobre',
  'social_handle', '@YOSOYVILLAMAR',
  'social_url', 'https://instagram.com/yosoyvillamar',
  'image_url', '/christian-villamar.jpg',
  'image_alt', 'Christian Villamar de espaldas'
))
on conflict (page_id, section_key) do update set
  content = excluded.content, updated_at = now();

-- NEWSLETTER
insert into public.site_sections (page_id, section_key, label, sort_order, is_visible, content)
values (v_page_id, 'newsletter', 'Newsletter', 7, true, jsonb_build_object(
  'eyebrow', 'CARTA EMOCIONAL',
  'headline', 'Recibe una carta cuando haya algo que valga la pena decir.',
  'body', 'Reflexiones, episodios nuevos y recordatorios para no volver a negociarte por migajas. Sin spam. Sin ruido. Solo cuando importa.',
  'cta_label', 'Quiero recibirla',
  'disclaimer', 'Protegemos tu correo. Te puedes dar de baja cuando quieras.',
  'beehiiv_url', ''
))
on conflict (page_id, section_key) do update set
  content = excluded.content, updated_at = now();

-- PLATFORMS
insert into public.site_sections (page_id, section_key, label, sort_order, is_visible, content)
values (v_page_id, 'platforms', 'Plataformas', 8, true, jsonb_build_object(
  'eyebrow', 'PLATAFORMAS',
  'headline', 'Escucha donde quieras.',
  'platforms', jsonb_build_array(
    jsonb_build_object('name', 'Spotify', 'badge', 'PRINCIPAL', 'url', 'https://open.spotify.com/show/7w3r41VGcUjCRU8QF3pnRb'),
    jsonb_build_object('name', 'Apple Podcasts', 'badge', 'IOS', 'url', 'https://podcasts.apple.com/mx/podcast/a-mi-tampoco-me-explicaron/id1796503084'),
    jsonb_build_object('name', 'iVoox', 'badge', 'COMUNIDAD ES', 'url', 'https://www.ivoox.com/podcast-a-mi-tampoco-me-explicaron_sq_f12702462_1.html'),
    jsonb_build_object('name', 'YouTube', 'badge', 'VIDEO', 'url', 'https://www.youtube.com/@AmitampocoExplicaron')
  )
))
on conflict (page_id, section_key) do update set
  content = excluded.content, updated_at = now();

-- FOOTER
insert into public.site_sections (page_id, section_key, label, sort_order, is_visible, content)
values (v_page_id, 'footer', 'Footer', 9, true, jsonb_build_object(
  'brand_name', 'AMTME',
  'tagline', 'A Mí Tampoco Me Explicaron',
  'copyright', '© 2024 AMTME. Todos los derechos reservados.',
  'nav_links', jsonb_build_array(
    jsonb_build_object('label', 'Episodios', 'url', '/episodios'),
    jsonb_build_object('label', 'Sobre AMTME', 'url', '/#manifiesto'),
    jsonb_build_object('label', 'Christian', 'url', '/#christian'),
    jsonb_build_object('label', 'Newsletter', 'url', '/#newsletter'),
    jsonb_build_object('label', 'Privacidad', 'url', '/privacy'),
    jsonb_build_object('label', 'Términos', 'url', '/terms')
  )
))
on conflict (page_id, section_key) do update set
  content = excluded.content, updated_at = now();

-- ─────────────────────────────────────────
-- 3. Global site settings
-- ─────────────────────────────────────────
insert into public.site_settings (key, value, description)
values (
  'social_links',
  jsonb_build_object(
    'spotify', 'https://open.spotify.com/show/7w3r41VGcUjCRU8QF3pnRb',
    'instagram', 'https://instagram.com/amitampocomeexplicaron',
    'instagram_host', 'https://instagram.com/yosoyvillamar',
    'tiktok', 'https://tiktok.com/@yosoyvillamar',
    'youtube', 'https://www.youtube.com/@AmitampocoExplicaron',
    'apple_podcasts', 'https://podcasts.apple.com/mx/podcast/a-mi-tampoco-me-explicaron/id1796503084',
    'ivoox', 'https://www.ivoox.com/podcast-a-mi-tampoco-me-explicaron_sq_f12702462_1.html'
  ),
  'Social media and platform links'
)
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_settings (key, value, description)
values (
  'brand',
  jsonb_build_object(
    'name', 'A Mí Tampoco Me Explicaron',
    'short', 'AMTME',
    'host', 'Christian Villamar',
    'handle', '@YOSOYVILLAMAR',
    'email', 'hola@amtme.com',
    'spotify_show_id', '7w3r41VGcUjCRU8QF3pnRb'
  ),
  'Brand identity settings'
)
on conflict (key) do update set value = excluded.value, updated_at = now();

end $$;
