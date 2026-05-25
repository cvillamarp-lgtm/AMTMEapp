# AMTME Visual OS — Especificación de Marca

## Objetivo

El AMTME Visual OS es un sistema de validación tipado que garantiza conformidad visual con la marca oficial de AMTME en todos los formatos de contenido. Define reglas específicas para colores, dimensiones, márgenes seguros, templates visuales, personalidad de marca y elementos prohibidos.

## Paleta Oficial

La paleta de marca AMTME consta de 7 colores específicos con uso controlado:

| Color | Hex Code | Uso Principal |
|-------|----------|---------------|
| Lemon Lime | `#FEE94B` | Acento principal, foco visual, CTA secundaria |
| Navy Profundo | `#0C1F36` | Base editorial, titulares, navegación |
| Crema Editorial | `#F5F2EA` | Fondo operativo principal |
| Blanco | `#FFFFFF` | Fondos, espacios negativos |
| Azul Grisáceo | `#90A4B8` | Apoyo visual, estados neutros, fondos suaves |
| Rojo AMTME | `#E0211E` | Error, bloqueo, alertas críticas |
| Negro Interfaz | `#111111` | Texto de alto contraste y cierre visual |

## Reglas de Color

### Navy Profundo (`#0C1F36`)
- Base tipográfica y de navegación del sistema.
- Prioridad para títulos, menús y componentes de estructura.

### Lemon Lime (`#FEE94B`)
- Acento de foco y señal operativa.
- Uso puntual para evitar saturación visual.

### Crema Editorial (`#F5F2EA`) y Blanco (`#FFFFFF`)
- Crema para fondo general de trabajo.
- Blanco para superficies, tarjetas y capas de lectura.

### Azul Grisáceo (`#90A4B8`)
- Texto secundario, estados neutros y soportes de UI.

### Rojo AMTME (`#E0211E`)
- Estados de error, alertas y bloqueos.
- No usar como color base del layout.

### Negro Interfaz (`#111111`)
- Refuerzo de contraste en elementos de máxima jerarquía.

## Formatos Oficiales

Tres formatos visuales estandarizados con dimensiones pixel-exactas:

### 1. FEED_4_5 (Redes Sociales - Feed)
- **Dimensiones:** 1080 × 1350 píxeles
- **Relación de aspecto:** 4:5
- **Uso:** Instagram Feed, TikTok, Reels
- **Tipo contenido:** Vertical, textos grandes, llamadas visuales claras

### 2. STORY_9_16 (Historias Verticales)
- **Dimensiones:** 1080 × 1920 píxeles
- **Relación de aspecto:** 9:16
- **Uso:** Instagram Stories, Facebook Stories
- **Tipo contenido:** Animado, overlays, acciones por tap

### 3. SQUARE_1_1 (Contenido Cuadrado)
- **Dimensiones:** 3000 × 3000 píxeles
- **Relación de aspecto:** 1:1
- **Uso:** Thumbnails, miniaturas, avatares, covers
- **Tipo contenido:** Icónico, símbolos, logos, composiciones simétricas

## Safe Zones (Zonas Seguras)

Márgenes garantizados donde el contenido crítico permanece visible sin recortes:

### FEED_4_5
- **Margen superior:** 108 px
- **Margen inferior:** 108 px
- **Margen lateral:** 54 px
- **Área segura:** 972 × 1134 px

### STORY_9_16
- **Margen superior:** 135 px
- **Margen inferior:** 135 px
- **Margen lateral:** 54 px
- **Área segura:** 972 × 1650 px

### SQUARE_1_1
- **Margen superior:** 150 px
- **Margen inferior:** 150 px
- **Margen lateral:** 150 px
- **Área segura:** 2700 × 2700 px

## Templates Oficiales

Cuatro estructuras visuales predefinidas para garantizar coherencia:

### 1. viral_feed
Contenido con texto grande (headlines), imagen de fondo difuminada, llamada a acción clara. Uso: Artículos virales, noticiarios.

### 2. episode_player_story
Reproductor de episodio con overlay de controles, título, avance de barra. Uso: Podcast, videos.

### 3. dm_interaction_story
Conversación simulada, burbujas de chat, interacción visual. Uso: Testimonios, diálogos.

### 4. manifesto_feed
Texto editorial grande con marcas tipográficas, fondo sólido. Uso: Manifiestos, statements, posicionamiento.

## Personalidad Visual

Ocho tonos de marca que deben estar presentes en toda composición:

1. **Editorial** — Texto claro, headlines impactantes, estructura visible
2. **Masculino** — Líneas rectas, ángulos agudos, composición simétrica
3. **Sobrio** — Sin exceso decorativo, paleta limitada, jerarquía clara
4. **Humano** — Rostros reales, imperfecciones, autenticidad
5. **Emocional** — Conexión con el espectador, resonancia psicológica
6. **Directo** — Mensajes sin ambigüedad, tipografía clara
7. **Real** — Fotografía verdadera, sin filtros excesivos
8. **Cercano** — Proximidad visual, escala relatable
9. **Contundente** — Impacto visual inmediato, presencia fuerte

## Prohibiciones Visuales

Elementos **ESTRICTAMENTE PROHIBIDOS** en cualquier composición AMTME:

1. **italic** — Tipografía itálica (excepto créditos)
2. **cursive** — Fuentes cursivas de cualquier tipo
3. **neon** — Colores neón o degradados fluorescentes
4. **glow** — Efectos de brillo/resplandor
5. **3D** — Objetos 3D, perspectivas isométricas
6. **unnecessary_gradients** — Degradados no funcionales
7. **wellness_cliche** — Imágenes de yoga, meditación, bolas de cristal
8. **sad** — Expresiones de tristeza extrema o desesperación
9. **funeral** — Tonos fúnebres, composiciones mortuorias
10. **depressive** — Paletas deprimentes, filtros desaturados

## Reglas de Composición

- **Legibilidad primero:** Texto siempre legible a 200% de zoom
- **Contraste alto:** Mínimo 4.5:1 entre texto y fondo (WCAG AA)
- **Alineación:** Uso de grillas de 54px (FEED) y 135px (STORY)
- **Espaciado:** Respeto de safe zones en todos los formatos
- **Jerarquía:** Máximo 3 niveles tipográficos por composición
- **Balance:** Peso visual distribuido simétricamente
- **Movimiento:** Si hay animación, máximo 3 segundos de transición

## Alcance de Fase 5

**Inclusiones:**
- Definición completa de paleta, formatos, safe zones, templates
- Biblioteca TypeScript con validación de 12 funciones
- Suite de pruebas Vitest con 40+ casos de cobertura
- Especificación de reglas visuales y prohibiciones
- Documentación de personalidad y composición

**Out of Scope (Fase 6+):**
- Generación automática de composiciones visuales
- Integración con diseñador de IA (DALL-E, Midjourney)
- Editor visual interactivo
- Sistema de gestión de assets
- Auditoría automática de contenido ya publicado
- Aplicación mobile de preview de Brand Compliance
- Sincronización con sistemas de CMS

## Validación

**Requisitos de Validación Fase 5:**
- [ ] Función `validateBrandColor(color)` — Valida colores contra paleta
- [ ] Función `validateFormat(format)` — Verifica formatos válidos (FEED_4_5, STORY_9_16, SQUARE_1_1)
- [ ] Función `validateSafeZone(format, content)` — Asegura contenido dentro de márgenes
- [ ] Función `validateBrandPersonality(tones)` — Verifica presencia de personalidad
- [ ] Función `validateTemplate(template)` — Valida templates oficiales
- [ ] Función `validateVisualContent(content)` — Validación integral de composición
- [ ] Función `validateAccentUsage(colors)` — Control de uso de acentos
- [ ] Todas las funciones retornan `ValidationResult` con `isValid`, `errors`, `warnings`

**Cobertura de Pruebas:** Mínimo 80% de líneas código (Vitest)

---

**Documento de especificación:** AMTME Visual OS v1.0  
**Fase:** Fase 5 — Visual OS Mínimo  
**Estado:** Especificación Final  
**Última actualización:** Mayo 2026