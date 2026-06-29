-- Seed: Create default home landing page with 10 predefined sections
INSERT INTO landing_pages (slug, version, title, description, meta_keywords, is_published)
VALUES (
  'home',
  1,
  'AMITAMPOCOMEEXPLICARON - Podcast de Claridad Emocional',
  'Explora episodios sobre claridad emocional, relaciones y autoconocimiento con Christian Tebaldi',
  'podcast, emocional, claridad, relaciones, autoconocimiento',
  TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- Get the landing page ID
WITH home_page AS (
  SELECT id FROM landing_pages WHERE slug = 'home' LIMIT 1
)
INSERT INTO landing_sections (landing_page_id, section_key, section_order, is_visible, content)
SELECT
  hp.id,
  section_data.key,
  section_data.order_num,
  section_data.visible,
  section_data.default_content
FROM home_page hp,
LATERAL (
  VALUES
    (
      'hero',
      0,
      TRUE,
      '{
        "title": "AMITAMPOCOMEEXPLICARON",
        "subtitle": "Historias que liberan",
        "description": "Un podcast sobre claridad emocional, relaciones y todo aquello que nos mantiene atrapados",
        "cta_text": "Escuchar primero episodio",
        "cta_url": "https://open.spotify.com/show/amitampocomeexplicaron",
        "hero_image_url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop"
      }'::JSONB
    ),
    (
      'featured_episode',
      1,
      TRUE,
      '{
        "title": "Episodio Destacado",
        "episode_title": "No era intensidad, era una herida",
        "episode_description": "Explora cómo la intensidad emocional puede enmascarar heridas profundas",
        "episode_url": "/episodios/no-era-intensidad-era-una-herida",
        "episode_image_url": "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=400&fit=crop"
      }'::JSONB
    ),
    (
      'about',
      2,
      TRUE,
      '{
        "title": "Sobre el Podcast",
        "description": "AMITAMPOCOMEEXPLICARON es un espacio de profundidad emocional. Cada episodio explora temas que afectan nuestras relaciones y autoconocimiento.",
        "cta_text": "Conocer más",
        "cta_url": "/sobre"
      }'::JSONB
    ),
    (
      'topics',
      3,
      TRUE,
      '{
        "title": "Temas Explorados",
        "topics": [
          {"name": "Relaciones", "icon": "heart"},
          {"name": "Claridad", "icon": "lightbulb"},
          {"name": "Emociones", "icon": "brain"},
          {"name": "Autoconocimiento", "icon": "person"}
        ]
      }'::JSONB
    ),
    (
      'recent_episodes',
      4,
      TRUE,
      '{
        "title": "Episodios Recientes",
        "description": "Conoce nuestros últimos episodios publicados",
        "show_count": 6
      }'::JSONB
    ),
    (
      'manifesto',
      5,
      TRUE,
      '{
        "title": "Nuestro Manifiesto",
        "content": "Creemos en la claridad emocional como herramienta de transformación. En una sociedad que nos enseña a silenciar, elegimos hablar verdad.",
        "cta_text": "Leer completo",
        "cta_url": "/sobre"
      }'::JSONB
    ),
    (
      'about_christian',
      6,
      TRUE,
      '{
        "title": "Acerca del Host",
        "name": "Christian Tebaldi",
        "bio": "Facilitador de claridad emocional con 15 años de experiencia en desarrollo personal y relaciones.",
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "cta_text": "Conectar",
        "cta_url": "https://www.instagram.com/amitampocomeexplicaron/"
      }'::JSONB
    ),
    (
      'newsletter',
      7,
      TRUE,
      '{
        "title": "Suscribirse a Novedades",
        "description": "Recibe reflexiones semanales sobre claridad emocional directamente en tu bandeja de entrada",
        "placeholder": "tu@email.com",
        "cta_text": "Suscribirse"
      }'::JSONB
    ),
    (
      'platforms',
      8,
      TRUE,
      '{
        "title": "Escucha en tu plataforma favorita",
        "platforms": [
          {"name": "Spotify", "url": "https://open.spotify.com/show/amitampocomeexplicaron", "icon": "spotify"},
          {"name": "Apple Podcasts", "url": "https://podcasts.apple.com/amitampocomeexplicaron", "icon": "apple"},
          {"name": "YouTube", "url": "https://youtube.com/@amitampocomeexplicaron", "icon": "youtube"},
          {"name": "Instagram", "url": "https://instagram.com/amitampocomeexplicaron", "icon": "instagram"}
        ]
      }'::JSONB
    ),
    (
      'footer',
      9,
      TRUE,
      '{
        "copyright": "© 2026 AMITAMPOCOMEEXPLICARON. Todos los derechos reservados.",
        "links": [
          {"text": "Política de Privacidad", "url": "/privacy"},
          {"text": "Términos de Servicio", "url": "/terms"},
          {"text": "Contacto", "url": "mailto:hello@amitampocomeexplicaron.com"}
        ]
      }'::JSONB
    )
  ) AS section_data(key, order_num, visible, default_content)
ON CONFLICT (landing_page_id, section_key) DO UPDATE SET
  section_order = EXCLUDED.section_order,
  is_visible = EXCLUDED.is_visible,
  content = EXCLUDED.content,
  updated_at = NOW();
