---
workflow: general-video
flow: automation
storyboard: no
message: "Guía de sesión para builders: el hackathon explicado como el documento — concepto, objetivo, categorías, agentic voice, alcance, seguridad, agenda, evaluación"
destination: youtube
aspect: 1920x1080
language: es
length: 170s
angle: how-to
audience: teams and builders joining the hackathon
voice: elevenlabs-custom
---

## Intent

Video de sesión en español que explica el hackathon como el brief completo, orientado a equipos builders — no pitch de sponsors. Estructura numerada: 1 concepto, 2 objetivo, 3 categorías, 4 agentic voice, 5 alcance/stack, 6 seguridad, 7 agenda, 8 evaluating/premios. Estética Visible Builders.

## Assets

- audio/narration.wav — VO ElevenLabs (voz sePFppHi7mf6YBG1K6gB, modelo eleven_flash_v2_5)
- SCRIPT.md — narración completa en español

## Customizations

- ElevenLabs TTS (no Kokoro): ELEVEN_API_KEY + ELEVEN_VOICE_ID del usuario
- Paleta alineada con landing `/post/medellin-voice-wellness-hackathon`
- Incluir sponsors: roles, beneficios, awards nominados, pipeline post-evento

## Notes

- Prevención y wellness cotidiano — no diagnóstico médico
- No commitear `.env` con API keys
- Usuario pegó la API key en el chat: rotar después
