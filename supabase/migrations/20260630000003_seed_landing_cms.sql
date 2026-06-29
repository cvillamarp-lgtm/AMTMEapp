-- Migration: Seed Landing CMS
-- Date: 2026-06-30
-- Description: Initial seed data for landing page CMS with 10 sections

-- Create admin user
insert into public.cms_admin_users (user_id, role)
values ('c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid, 'admin')
on conflict (user_id) do nothing;

-- Create site_pages entry for 'home'
insert into public.site_pages (id, user_id, slug, payload)
values (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'home',
  jsonb_build_object(
    'is_published', true,
    'seo', jsonb_build_object(
      'title', 'AMTME — A Mí Tampoco Me Explicaron · Podcast de Christian Villamar',
      'description', 'Podcast emocional sobre amor, apego, vínculos, límites y volver a uno mismo. Conducido por Christian Villamar.',
      'ogTitle', 'A Mí Tampoco Me Explicaron',
      'ogDescription', 'Podcast para entender el amor, el apego, los vínculos, la dignidad y todo eso que sentimos.',
      'ogImage', '/images/og-image.jpg'
    )
  )
)
on conflict do nothing;

-- Fetch the page_id for use in sections
with page as (
  select id from public.site_pages where slug = 'home' limit 1
)

-- 1. hero section
insert into public.site_sections (
  id, page_id, user_id, section_key, is_visible, sort_order, payload
)
select
  'b0000000-0000-0000-0000-000000000001'::uuid,
  page.id,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'hero',
  true,
  1,
  jsonb_build_object(
    'tagline', 'Episodio 014 · Nuevo',
    'mainHeading', 'A mí tampoco me explicaron cómo se suelta lo que todavía duele.',
    'subtitle', 'Un podcast para entender el amor, el apego, los vínculos, la dignidad y todo eso que sentimos, pero que nadie nos enseñó a nombrar.',
    'primaryCta', 'Escuchar episodio destacado',
    'secondaryCta', 'Ver episodios',
    'imageUrl', '/images/christian-hero-headshot.jpg',
    'imageAlt', 'Christian Villamar - Host de A Mí Tampoco Me Explicaron',
    'stats', jsonb_build_array(
      jsonb_build_object('label', 'Temporadas', 'value', '03'),
      jsonb_build_object('label', 'Episodios', 'value', '42'),
      jsonb_build_object('label', 'Oyentes', 'value', '120K+')
    ),
    'topics', jsonb_build_array(
      'Amor vs apego',
      'Dignidad',
      'Volver a uno mismo',
      'Duelo emocional',
      'Límites',
      'Rechazo',
      'Ansiedad afectiva',
      'Tarot como espejo'
    )
  )
from page;

-- 2. featured_episode section
insert into public.site_sections (
  id, page_id, user_id, section_key, is_visible, sort_order, payload
)
select
  'b0000000-0000-0000-0000-000000000002'::uuid,
  page.id,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'featured_episode',
  true,
  2,
  jsonb_build_object(
    'sectionLabel', 'Episodio destacado',
    'sectionTitle', 'Lo que está sonando ahora',
    'episodeLabel', 'Apego · Dignidad · 48 min',
    'episodeBadge', 'NUEVO · EP 014',
    'episodeTitle', 'Por qué vuelves aunque ya lo sabes',
    'episodeDescription', 'Esa cosa rara donde la mente entiende, el cuerpo recuerda y la historia vuelve a llamarte a la puerta. Un episodio sobre el ciclo, el cuerpo y lo que realmente se está soltando cuando crees que estás soltando.',
    'imageUrl', '/episode-cover-1.jpg',
    'imageAlt', 'Por qué vuelves aunque ya lo sabes',
    'spotifyEmbedUrl', 'https://open.spotify.com/embed/episode/YOUR_EPISODE_ID?utm_source=generator',
    'episodeUrl', '/episodios/por-que-vuelves-aunque-ya-lo-sabes',
    'spotifyUrl', 'https://open.spotify.com/show/YOUR_SHOW_ID',
    'applePodcastsUrl', 'https://podcasts.apple.com/podcast/YOUR_PODCAST_ID'
  )
from page;

-- 3. about section
insert into public.site_sections (
  id, page_id, user_id, section_key, is_visible, sort_order, payload
)
select
  'b0000000-0000-0000-0000-000000000003'::uuid,
  page.id,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'about',
  true,
  3,
  jsonb_build_object(
    'sectionLabel', 'Qué es AMTME',
    'sectionTitle', 'Una casa para los que sintieron demasiado.',
    'paragraphs', jsonb_build_array(
      'AMTME es un espacio para quienes han sentido demasiado, han explicado demasiado, han esperado demasiado y un día necesitan volver a escucharse.',
      'No viene a darte respuestas perfectas. Viene a acompañarte mientras encuentras las tuyas. Aquí no hablamos desde el pedestal — hablamos desde el camino, con honestidad, vulnerabilidad y una mirada simbólica que usa el tarot como espejo de conciencia.',
      'No prometemos arreglarte. Te recordamos que no estás roto: estás entendiendo tarde lo que nadie te enseñó a tiempo.'
    )
  )
from page;

-- 4. topics section
insert into public.site_sections (
  id, page_id, user_id, section_key, is_visible, sort_order, payload
)
select
  'b0000000-0000-0000-0000-000000000004'::uuid,
  page.id,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'topics',
  true,
  4,
  jsonb_build_object(
    'sectionTitle', 'Temas que exploramos',
    'topics', jsonb_build_array(
      jsonb_build_object('name', 'Amor vs Apego', 'description', 'Diferencias y patrones'),
      jsonb_build_object('name', 'Dignidad', 'description', 'Reconocer tu valor'),
      jsonb_build_object('name', 'Volver a Uno Mismo', 'description', 'Reconstrucción personal'),
      jsonb_build_object('name', 'Duelo Emocional', 'description', 'Procesos de soltar'),
      jsonb_build_object('name', 'Límites', 'description', 'Protección emocional'),
      jsonb_build_object('name', 'Rechazo', 'description', 'Manejo y recuperación'),
      jsonb_build_object('name', 'Ansiedad Afectiva', 'description', 'Patrones de apego'),
      jsonb_build_object('name', 'Tarot como Espejo', 'description', 'Conciencia simbólica')
    )
  )
from page;

-- 5. recent_episodes section
insert into public.site_sections (
  id, page_id, user_id, section_key, is_visible, sort_order, payload
)
select
  'b0000000-0000-0000-0000-000000000005'::uuid,
  page.id,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'recent_episodes',
  true,
  5,
  jsonb_build_object(
    'sectionLabel', 'Catálogo completo',
    'sectionTitle', 'Episodios recientes',
    'episodes', jsonb_build_array(
      jsonb_build_object(
        'id', 1,
        'title', 'Por qué vuelves aunque ya lo sabes',
        'number', '014',
        'duration', '48 min',
        'description', 'Sobre el ciclo, el cuerpo y lo que realmente se está soltando',
        'tags', jsonb_build_array('Apego', 'Dignidad'),
        'url', '/episodios/por-que-vuelves-aunque-ya-lo-sabes',
        'imageUrl', '/episode-cover-1.jpg'
      ),
      jsonb_build_object(
        'id', 2,
        'title', 'No era intensidad, era una herida',
        'number', '013',
        'duration', '52 min',
        'description', 'Reconocer el dolor como información',
        'tags', jsonb_build_array('Heridas', 'Vulnerabilidad'),
        'url', '/episodios/no-era-intensidad-era-una-herida',
        'imageUrl', '/episode-cover-2.jpg'
      ),
      jsonb_build_object(
        'id', 3,
        'title', 'Soltar sin pedir permiso',
        'number', '012',
        'duration', '45 min',
        'description', 'El acto de soltar como acto de amor propio',
        'tags', jsonb_build_array('Soltar', 'Dignidad'),
        'url', '/episodios/soltar-sin-pedir-permiso',
        'imageUrl', '/episode-cover-3.jpg'
      )
    )
  )
from page;

-- 6. manifesto section
insert into public.site_sections (
  id, page_id, user_id, section_key, is_visible, sort_order, payload
)
select
  'b0000000-0000-0000-0000-000000000006'::uuid,
  page.id,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'manifesto',
  true,
  6,
  jsonb_build_object(
    'sectionLabel', 'Nuestro propósito',
    'sectionTitle', 'El manifiesto de AMTME',
    'manifestoPoints', jsonb_build_array(
      'Creemos que sentir profundamente no es debilidad.',
      'Creemos que necesitas permiso para tu propia dignidad.',
      'Creemos en la vulnerabilidad como fortaleza.',
      'Creemos en sanar desde la honestidad.',
      'Creemos que mereces ser escuchado sin juzgamientos.',
      'Creemos que el camino solitario no tiene que ser solitario.'
    )
  )
from page;

-- 7. about_christian section
insert into public.site_sections (
  id, page_id, user_id, section_key, is_visible, sort_order, payload
)
select
  'b0000000-0000-0000-0000-000000000007'::uuid,
  page.id,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'about_christian',
  true,
  7,
  jsonb_build_object(
    'sectionLabel', 'Conoce al host',
    'name', 'Christian Villamar',
    'title', 'Productor de audio y facilitador emocional',
    'bio', 'Christian es un facilitador que ha trabajado en el espacio del bienestar emocional y la comunicación consciente. Su voz es la brújula que guía cada episodio de AMTME.',
    'imageUrl', '/images/christian-profile.jpg',
    'imageAlt', 'Christian Villamar',
    'socialLinks', jsonb_build_object(
      'instagram', 'https://instagram.com/amitampocomeexplicaron',
      'spotify', 'https://open.spotify.com/show/YOUR_SHOW_ID',
      'linkedin', 'https://linkedin.com/in/christianvillamar'
    )
  )
from page;

-- 8. newsletter section
insert into public.site_sections (
  id, page_id, user_id, section_key, is_visible, sort_order, payload
)
select
  'b0000000-0000-0000-0000-000000000008'::uuid,
  page.id,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'newsletter',
  true,
  8,
  jsonb_build_object(
    'sectionLabel', 'Mantente conectado',
    'sectionTitle', 'Suscríbete a nuestro newsletter',
    'subtitle', 'Reflexiones semanales directo a tu inbox. Sin spam, solo contenido que resuena.',
    'placeholderText', 'Tu correo aquí',
    'ctaText', 'Suscribirse',
    'successMessage', 'Gracias por suscribirte',
    'formAction', '/api/email'
  )
from page;

-- 9. platforms section
insert into public.site_sections (
  id, page_id, user_id, section_key, is_visible, sort_order, payload
)
select
  'b0000000-0000-0000-0000-000000000009'::uuid,
  page.id,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'platforms',
  true,
  9,
  jsonb_build_object(
    'sectionTitle', 'Escúchanos en todas partes',
    'platforms', jsonb_build_array(
      jsonb_build_object(
        'name', 'Spotify',
        'url', 'https://open.spotify.com/show/YOUR_SHOW_ID',
        'icon', 'spotify'
      ),
      jsonb_build_object(
        'name', 'Apple Podcasts',
        'url', 'https://podcasts.apple.com/podcast/YOUR_PODCAST_ID',
        'icon', 'apple'
      ),
      jsonb_build_object(
        'name', 'YouTube',
        'url', 'https://youtube.com/@amitampocomeexplicaron',
        'icon', 'youtube'
      ),
      jsonb_build_object(
        'name', 'Instagram',
        'url', 'https://instagram.com/amitampocomeexplicaron',
        'icon', 'instagram'
      ),
      jsonb_build_object(
        'name', 'TikTok',
        'url', 'https://tiktok.com/@amitampocomeexplicaron',
        'icon', 'tiktok'
      )
    )
  )
from page;

-- 10. footer section
insert into public.site_sections (
  id, page_id, user_id, section_key, is_visible, sort_order, payload
)
select
  'b0000000-0000-0000-0000-000000000010'::uuid,
  page.id,
  'c5b87e86-8520-42a1-b9b4-48f8315a147a'::uuid,
  'footer',
  true,
  10,
  jsonb_build_object(
    'brandName', 'AMTME',
    'brandTagline', 'A Mí Tampoco Me Explicaron',
    'copyright', '© 2024 Christian Villamar. Todos los derechos reservados.',
    'footerLinks', jsonb_build_array(
      jsonb_build_object('label', 'Privacidad', 'url', '/privacy'),
      jsonb_build_object('label', 'Términos', 'url', '/terms'),
      jsonb_build_object('label', 'Contacto', 'url', 'mailto:contacto@amtme.com')
    ),
    'socialLinks', jsonb_build_array(
      jsonb_build_object('name', 'Instagram', 'url', 'https://instagram.com/amitampocomeexplicaron'),
      jsonb_build_object('name', 'Spotify', 'url', 'https://open.spotify.com/show/YOUR_SHOW_ID'),
      jsonb_build_object('name', 'YouTube', 'url', 'https://youtube.com/@amitampocomeexplicaron'),
      jsonb_build_object('name', 'TikTok', 'url', 'https://tiktok.com/@amitampocomeexplicaron')
    )
  )
from page;
