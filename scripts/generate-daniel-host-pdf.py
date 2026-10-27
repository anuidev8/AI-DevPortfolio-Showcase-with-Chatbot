#!/usr/bin/env python3
"""Generate Daniel's Host Playbook PDF (styled like AI Hub Angel Host Playbook)."""
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                HRFlowable, KeepTogether, PageBreak)
from reportlab.lib import colors
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "docs", "Daniel_Host_Playbook_Oct22_2026.pdf")
OUT = os.path.abspath(OUT)

NAVY = HexColor("#0F2342")
ORANGE = HexColor("#FF6B00")
CYAN = HexColor("#00B8D9")
LIGHT = HexColor("#EEF2F7")
LIGHT2 = HexColor("#FFF4EC")
GREY = HexColor("#5A6B84")
DARK = HexColor("#16233A")

styles = {}
styles['title'] = ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=26, leading=28, textColor=NAVY, spaceAfter=2)
styles['subtitle'] = ParagraphStyle('subtitle', fontName='Helvetica', fontSize=9.5, leading=12, textColor=GREY, spaceAfter=6)
styles['h1'] = ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=white, spaceAfter=0)
styles['h2'] = ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=9.5, leading=12, textColor=NAVY, spaceBefore=8, spaceAfter=3, keepWithNext=True, borderPadding=(0,0,3,0))
styles['h3'] = ParagraphStyle('h3', fontName='Helvetica-Bold', fontSize=8.5, leading=10.5, textColor=DARK, spaceBefore=4, spaceAfter=2, keepWithNext=True)
styles['body'] = ParagraphStyle('body', fontName='Helvetica', fontSize=8.2, leading=11, textColor=DARK, spaceAfter=3, alignment=TA_LEFT)
styles['body_small'] = ParagraphStyle('body_small', fontName='Helvetica', fontSize=7.7, leading=9.8, textColor=DARK, spaceAfter=1.5)
styles['bullet'] = ParagraphStyle('bullet', parent=styles['body_small'], leftIndent=12, firstLineIndent=0, bulletIndent=4, spaceAfter=1.5)
styles['quote'] = ParagraphStyle('quote', fontName='Helvetica-Oblique', fontSize=8.2, leading=10.8, textColor=DARK, leftIndent=8, rightIndent=8, spaceAfter=2)
styles['cell'] = ParagraphStyle('cell', fontName='Helvetica', fontSize=7.6, leading=9.5, textColor=DARK)
styles['cell_b'] = ParagraphStyle('cell_b', fontName='Helvetica-Bold', fontSize=7.6, leading=9.5, textColor=DARK)
styles['cell_h'] = ParagraphStyle('cell_h', fontName='Helvetica-Bold', fontSize=7.4, leading=9, textColor=white)
styles['kicker'] = ParagraphStyle('kicker', fontName='Helvetica-Bold', fontSize=7, leading=9, textColor=ORANGE, spaceAfter=2)
styles['footer'] = ParagraphStyle('footer', fontName='Helvetica-Bold', fontSize=7.5, leading=9, textColor=NAVY, alignment=1)

def P(text, style='body'): return Paragraph(text, styles[style])
def header_bar(text):
    t = Table([[P(f"<font color='white'><b>{text}</b></font>", 'h1')]], colWidths=[7.5*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NAVY),
        ('LEFTPADDING', (0,0), (-1,-1), 8), ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROUNDEDCORNERS', [3,3,3,3]),
    ]))
    return t

def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica-Bold", 6.5); canvas.setFillColor(GREY)
    canvas.drawString(0.5*inch, 10.55*inch, "VISIBLE BUILDERS  /  AI AFTER HOURS")
    canvas.drawRightString(8.0*inch, 10.55*inch, f"HOST COPY  •  OCT 22, 2026  |  Page {doc.page}")
    canvas.setStrokeColor(HexColor("#D9E1EC")); canvas.setLineWidth(0.7)
    canvas.line(0.5*inch, 10.48*inch, 8.0*inch, 10.48*inch)
    canvas.setFont("Helvetica", 6); canvas.setFillColor(GREY)
    canvas.drawCentredString(4.25*inch, 0.35*inch, "Visible Builders  •  AI After Hours  •  Medellín  —  Practical. Welcoming. On time.")
    canvas.restoreState()

def styled_table(headers, rows, widths):
    data = [[P(h, 'cell_h') for h in headers]]
    for r in rows:
        data.append([P(r[0], 'cell_b')] + [P(c, 'cell') for c in r[1:]])
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.4, HexColor("#D9E1EC")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 6), ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    return t

def quote_box(paras):
    inner = []
    for p in paras:
        inner.append(P(p, 'quote'))
    t = Table([[inner]], colWidths=[7.3*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT2),
        ('BOX', (0,0), (-1,-1), 0.6, HexColor("#FFD9C2")),
        ('LINEBELOW', (0,0), (-1,0), 0, white),
        ('LEFTPADDING', (0,0), (-1,-1), 6), ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('ROUNDEDCORNERS', [4,4,4,4]),
    ]))
    return t

doc = SimpleDocTemplate(OUT, pagesize=LETTER, leftMargin=0.5*inch, rightMargin=0.5*inch, topMargin=0.62*inch, bottomMargin=0.38*inch,
                        title="Daniel — Host Playbook — AI After Hours Oct 22 2026", author="Visible Builders")

story = []

# PAGE 1
story.append(P("HOST PLAYBOOK  •  FOR DANIEL", 'kicker'))
story.append(P("AI After Hours", 'title'))
story.append(P("Host run of show  /  Thursday, October 22, 2026  &nbsp;|&nbsp;  Host (intros &amp; breaks): <b>Daniel</b>  &nbsp;•&nbsp;  Room lead / timekeeper: <b>Angel</b>", 'subtitle'))

# Info box
info = [
    [P("<b><font color='#FF6B00'>SETUP</font></b> &nbsp;5:45 PM — Angel", 'cell'), P("<b><font color='#FF6B00'>DOORS</font></b> &nbsp;6:45 PM", 'cell'), P("<b><font color='#FF6B00'>PROGRAM</font></b> &nbsp;7:20–8:55 PM + networking", 'cell')],
    [P("<b>HOST</b> &nbsp;Daniel — intros &amp; breaks hosting only", 'cell'), P("<b>ROOM LEAD</b> &nbsp;Angel — leads room, keeps time", 'cell'), P("<b>VENUE</b> &nbsp;Rooftop La Rock, El Poblado, Medellín", 'cell')],
]
t = Table(info, colWidths=[2.6*inch, 2.1*inch, 2.8*inch])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), LIGHT),
    ('BOX', (0,0), (-1,-1), 0.6, HexColor("#D9E1EC")),
    ('INNERGRID', (0,0), (-1,-1), 0.4, HexColor("#D9E1EC")),
    ('LEFTPADDING', (0,0), (-1,-1), 7), ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('ROUNDEDCORNERS', [4,4,4,4]),
]))
story.append(t); story.append(Spacer(1, 8))

story.append(header_bar("RUN OF SHOW  |  KEEP THIS SCHEDULE VISIBLE")); story.append(Spacer(1, 4))
story.append(styled_table(
    ["TIME", "SEGMENT", "CUE  (ANGEL KEEPS TIME)"],
    [
        ["5:45 PM", "<b>Setup</b> — Angel arrives", "Angel: room, sound, screen, chairs ready. Leads room from here."],
        ["6:45 PM", "<b>Doors open</b> &amp; check-in", "Angel: music on, doors open. Daniel: greet people if you're early."],
        ["7:15 PM", "<b>5-minute warning</b>", "Angel calls it: <i>“We start in 5 — please find a seat.”</i> Music down."],
        ["7:20 PM", "<b>START (hard limit)</b> — Welcome", "<b>Daniel:</b> introduce yourself as host (name + role — you host intros &amp; breaks), then community goals &amp; opportunity speech, p.2. Do not start later than 7:20."],
        ["7:20–7:30", "<b>Welcome + community</b> (10 min)", "<b>Daniel hosts:</b> introduce your role, script p.2. End by introducing Speaker 1 — Marylin Alarcon."],
        ["7:30–7:50", "<b>Talk 1</b> (20 min)<br/><b>Marylin Alarcon</b>", "Lead R&amp;D Engineer — <i>“AI Lowered The Floor, Our Work Is Now The Ceiling.”</i> &nbsp;Angel: 5-min warning 7:45."],
        ["7:50–8:00", "<b>Networking 1</b> (10 min)", "Daniel hosts: 1 person from public — <i>What project are you building?</i> Then pairs, p.2."],
        ["8:00–8:25", "<b>Talk 2</b> (25 min)<br/><b>Salome Arboleda</b>", "Software Developer &amp; Tech Enthusiast — <i>“Build real-time quantum apps with AI — use cases.”</i> &nbsp;Angel: warnings 8:15 &amp; 8:20."],
        ["8:25–8:35", "<b>Networking 2</b> (10 min)", "Daniel hosts: 1 person from public — <i>What do you expect from this event?</i> Then pairs, p.2."],
        ["8:35–8:55", "<b>Talk 3</b> (20 min)<br/><b>Jacobo Blandón</b>", "XR / Blockchain &amp; Digital Product Builder — <i>“Turn complex ideas into digital products that actually work.”</i> &nbsp;Angel: 5-min warning 8:50."],
        ["8:55–close", "<b>Open networking</b>", "Close stage (p.2), QR for WhatsApp community, open networking."],
    ], [1.05*inch, 1.95*inch, 4.5*inch]))
story.append(Spacer(1, 3))
story.append(P("<b>If we run late:</b> +10 min → cut both networking breaks 10 → 5 min. &nbsp;+20 min → cut Break 2 entirely. &nbsp;<b>Never cut a speaker to protect a break.</b>", 'body_small'))

story.append(P("DIVISION OF RESPONSIBILITY", 'h2'))
story.append(styled_table(
    ["PERSON", "OWNS", "NOTES"],
    [
        ["Angel — Room lead", "Leads the room, keeps the time, setup, doors, sound, screen. Cues Daniel &amp; speakers", "Angel is the clock. Start at 7:20 even if room is still filling."],
        ["Daniel — Host", "Intros &amp; breaks hosting only: welcome, speaker intros, networking breaks, close", "Follow Angel's time cues. No room/time duties — just host your moments."],
        ["Speakers 1–3", "Marylin (20) · Salome (25) · Jacobo (20) — talks incl. quick Q&amp;A if time", "Daniel confirms each speaker is in the room before 7:20."],
        ["Everyone", "Real conversations and warm introductions", "Goal: nobody leaves with only notes — they leave with people."],
    ], [1.5*inch, 2.7*inch, 3.3*inch]))

story.append(P("BEFORE DOORS OPEN  |  HOST CHECKLIST", 'h2'))
checks = [
    "☐ &nbsp;<b>6:45 doors (Angel):</b> music on, room ready, Angel leads the room from doors open.",
    "☐ &nbsp;<b>Sound/screen (Angel):</b> host mic + speaker mic tested; slides/screen readable from back.",
    "☐ &nbsp;<b>Speakers confirmed:</b> Marylin, Salome, Jacobo in the room; Angel tells each speaker their time warnings.",
    "☐ &nbsp;<b>Daniel ready:</b> intros &amp; break scripts (p.2) read once; wait for Angel's cues.",
    "☐ &nbsp;<b>7:15 (Angel):</b> 5-minute warning. &nbsp;<b>7:20 (Angel cues Daniel):</b> start — no exceptions.",
]
for c in checks: story.append(P(c, 'bullet'))
story.append(Spacer(1, 4))
story.append(P("THE STANDARD: &nbsp;Practical. &nbsp;Welcoming. &nbsp;On time. &nbsp;Connected.", 'footer'))

story.append(PageBreak())

# PAGE 2
story.append(P("HOST COPY  •  WHAT TO SAY AND HOW TO RUN IT", 'kicker'))
story.append(header_bar("FACILITATOR PROMPTS  |  DANIEL — READ, OR USE AS A GUIDE")); story.append(Spacer(1, 6))

story.append(P("7:20 PM — OPENING: COMMUNITY GOALS &amp; OPPORTUNITY &nbsp;<font color='#5A6B84'>(~3 minutes)</font>", 'h3'))
story.append(quote_box([
    "“Good evening, everyone — welcome to <b>AI After Hours</b>. My name is Daniel, I'm your host tonight — I'll be introducing our speakers and guiding our networking breaks — and on behalf of <b>Visible Builders</b>, thank you for being here. Give yourselves a round of applause for showing up — not just watching online, but being in the room.”",
    "“We built this community here in Medellín for one simple reason: <b>the best opportunities don't come from an algorithm — they come from a conversation</b> with the person sitting next to you.”",
    "“Our goals are three, and they're simple. <b>One — Real talks:</b> not theory, not hype; people actually building with AI, sharing what worked, what failed, and what it cost them. <b>Two — Real experiences:</b> every speaker tonight is a practitioner — what you hear tonight, you can use tomorrow morning. <b>Three — Real connections:</b> in this community, a friend from this room got a job, and a builder from this room got a new client. That's what happens when the right people meet in the right room.”",
    "“So here is your opportunity tonight: <b>don't leave with only notes — leave with people.</b> Tonight you'll hear three talks. Between them we'll stop and connect: I'll invite someone from the audience to share what they're building and what they're looking for. Listen carefully — the person you need might be two seats away.”",
    "“And it's simple tonight: walk up to someone, say your name, what you're building, and what you're looking for. That's it — that's how connections start here.”",
    "“Three quick things: please silence your phones; talks are 20–25 minutes; and after the last talk the room stays open for networking — that's where the magic happens, so don't rush out. Medellín is becoming a city where builders meet, share, and grow together. Tonight you're not just attending an event — <b>you're joining the build</b>. Let's get started.”",
]))
story.append(P("<b>60-second version (if short on time):</b> “Welcome to AI After Hours by Visible Builders. I'm Daniel. We exist for three things: real talks from people actually building with AI, real experiences you can use tomorrow, and real connections — in this room people have found jobs, clients, and partners. Tonight: three talks and two moments to connect with each other. Don't leave with only notes; leave with people. Let's begin.”", 'body_small'))
story.append(P("<b>In Spanish, if the room needs it:</b> <i>“Esto es AI After Hours de Visible Builders: charlas reales, experiencias reales y conexiones reales — aquí la gente ha encontrado trabajo, clientes y socios. Esta noche, no salgan solo con notas: salgan con personas.”</i>", 'body_small'))

story.append(P("NETWORKING BREAKS — 10 MINUTES EACH &nbsp;<font color='#5A6B84'>(~3 min on mic + ~7 min in pairs)</font>", 'h3'))
story.append(P("<b>Break 1 · 7:50 PM — “What are you building?”</b>", 'body'))
for b in [
    "Say: <i>“Who wants to share, in 30 seconds: who are you, and what project are you building right now?”</i> Pick <b>1 volunteer</b>, give them the mic (30–60 sec max).",
    "One follow-up only: <i>“And what do you need right now to move it forward?”</i> Repeat their name + project loudly so the room can find them later.",
    "Launch pairs: <i>“If you can help them — find them now. Everyone: 7 minutes, turn to someone you don't know, introduce yourself, and ask what they're building. Go.”</i>",
]: story.append(P("• &nbsp;" + b, 'bullet'))
story.append(P("<b>Break 2 · 8:25 PM — “What do you expect from tonight?”</b>", 'body'))
for b in [
    "Say: <i>“Who came tonight looking for something specific — a client, a partner, a job, an answer?”</i> Pick <b>1 volunteer</b>, mic, 30–60 sec.",
    "Ask: <i>“What would make tonight a win for you?”</i> Repeat it back to the room.",
    "Launch pairs: <i>“Who heard something they can help with? Go find that person. 7 minutes — introduce yourself to someone new. Go.”</i>",
    "<b>If nobody volunteers in 10 seconds:</b> pick a friendly face — <i>“You, with the smile — what brings you here?”</i> Keep it warm, keep it moving.",
]: story.append(P("• &nbsp;" + b, 'bullet'))

story.append(P("SPEAKER INTRODUCTIONS &nbsp;<font color='#5A6B84'>(under 40 seconds each — read as written)</font>", 'h3'))
story.append(P("<b>1 · 7:30 — Marylin Alarcon:</b> <i>“Our first speaker tonight is <b>Marylin Alarcon</b>, Lead R&amp;D Engineer, with <b>‘AI Lowered The Floor, Our Work Is Now The Ceiling.’</b> Please welcome Marylin.”</i>", 'body_small'))
story.append(P("<b>2 · 8:00 — Salome Arboleda:</b> <i>“Our second speaker is <b>Salome Arboleda</b>, Software Developer &amp; Tech Enthusiast. She's building <b>real-time quantum apps with AI</b> — and she'll show us real use cases. Give it up for Salome.”</i>", 'body_small'))
story.append(P("<b>3 · 8:35 — Jacobo Blandón:</b> <i>“Our final speaker tonight is <b>Jacobo Blandón</b>, XR, Blockchain &amp; Digital Product Builder. His talk: <b>‘Turn complex ideas into digital products that actually work.’</b> Let's make some noise for Jacobo.”</i>", 'body_small'))
story.append(P("After each talk: <i>“Round of applause for [Name] — find them in the networking at the end.”</i> &nbsp;<b>Angel</b> gives speakers their <b>5-minute warning</b> — Daniel just hosts the intro.", 'body_small'))

story.append(P("8:55 PM — CLOSE &amp; OPEN NETWORKING", 'h3'))
story.append(quote_box([
    "“That's our last talk — one more round of applause for all three speakers tonight. Remember what I said at the start: <b>don't leave with only notes, leave with people.</b> The room is now open — go find the speakers, meet someone new, and exchange contacts.”",
    "“If tonight helped you, join the <b>Visible Builders WhatsApp community</b> — QR on screen — so the conversation continues after tonight. Thank you for building with us. This is AI After Hours. See you at the next one — <b>now go meet someone worth meeting</b>.”",
]))

story.append(P("CLOSEOUT  |  DONE MEANS CONNECTIONS, NOT JUST NOTES", 'h2'))
for b in [
    "☐ &nbsp;Thank speakers by name; remind room of WhatsApp QR. Stay for networking and make 2–3 intros.",
    "☐ &nbsp;Quick debrief with Angel after: attendance, what worked, one improvement for next time.",
]: story.append(P(b, 'bullet'))
story.append(Spacer(1, 2))
story.append(HRFlowable(width="100%", thickness=0.6, color=HexColor("#D9E1EC")))
story.append(P("THE STANDARD: &nbsp;Practical. &nbsp;Welcoming. &nbsp;On time. &nbsp;Recorded. &nbsp;Repeatable.", 'footer'))

doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(f"Created: {OUT}")
