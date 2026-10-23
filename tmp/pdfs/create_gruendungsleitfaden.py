from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "output" / "pdf" / "Schritt-fuer-Schritt_Selbststaendig_als_Grafikerin_Wien.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
pdfmetrics.registerFont(TTFont("Arial", FONT_REG))
pdfmetrics.registerFont(TTFont("Arial-Bold", FONT_BOLD))

NAVY = colors.HexColor("#183153")
BLUE = colors.HexColor("#2F6FED")
PALE = colors.HexColor("#EDF3FF")
TEAL = colors.HexColor("#0E7C7B")
MINT = colors.HexColor("#E8F6F3")
ORANGE = colors.HexColor("#C45A16")
CREAM = colors.HexColor("#FFF3E8")
TEXT = colors.HexColor("#253247")
MUTED = colors.HexColor("#667085")
LINE = colors.HexColor("#D6DCE5")
WHITE = colors.white

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverTitle", fontName="Arial-Bold", fontSize=25, leading=30, textColor=WHITE, alignment=TA_LEFT, spaceAfter=7*mm))
styles.add(ParagraphStyle(name="CoverSub", fontName="Arial", fontSize=11.5, leading=16, textColor=colors.HexColor("#DCE7FF")))
styles.add(ParagraphStyle(name="H1x", fontName="Arial-Bold", fontSize=19, leading=23, textColor=NAVY, spaceAfter=5*mm))
styles.add(ParagraphStyle(name="H2x", fontName="Arial-Bold", fontSize=12.5, leading=16, textColor=NAVY, spaceBefore=3*mm, spaceAfter=2.3*mm))
styles.add(ParagraphStyle(name="Bodyx", fontName="Arial", fontSize=9.2, leading=13.2, textColor=TEXT, spaceAfter=2.2*mm))
styles.add(ParagraphStyle(name="Smallx", fontName="Arial", fontSize=7.7, leading=10.5, textColor=MUTED))
styles.add(ParagraphStyle(name="Stepx", fontName="Arial-Bold", fontSize=13, leading=16, textColor=WHITE))
styles.add(ParagraphStyle(name="BoxTitle", fontName="Arial-Bold", fontSize=10.2, leading=13, textColor=NAVY, spaceAfter=1.5*mm))
styles.add(ParagraphStyle(name="BoxBody", fontName="Arial", fontSize=8.5, leading=12, textColor=TEXT))
styles.add(ParagraphStyle(name="Check", fontName="Arial", fontSize=8.8, leading=12.4, leftIndent=0, textColor=TEXT, spaceAfter=1.2*mm))
styles.add(ParagraphStyle(name="Link", fontName="Arial", fontSize=7.7, leading=10.5, textColor=BLUE))

def P(text, style="Bodyx"):
    return Paragraph(text, styles[style])

def checkbox(text):
    return P("☐&nbsp;&nbsp;" + text, "Check")

def step_header(number, title):
    return Table([[P(str(number), "Stepx"), P(title, "Stepx")]], colWidths=[18*mm, 155*mm], style=TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), NAVY),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("ALIGN", (0,0), (0,0), "CENTER"),
        ("LEFTPADDING", (0,0), (-1,-1), 4*mm),
        ("RIGHTPADDING", (0,0), (-1,-1), 4*mm),
        ("TOPPADDING", (0,0), (-1,-1), 3*mm),
        ("BOTTOMPADDING", (0,0), (-1,-1), 3*mm),
    ]))

def info_box(title, body, bg=PALE, border=BLUE):
    return Table([[P(title, "BoxTitle")], [P(body, "BoxBody")]], colWidths=[173*mm], style=TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), bg),
        ("BOX", (0,0), (-1,-1), 0.8, border),
        ("LEFTPADDING", (0,0), (-1,-1), 4*mm),
        ("RIGHTPADDING", (0,0), (-1,-1), 4*mm),
        ("TOPPADDING", (0,0), (0,0), 3*mm),
        ("BOTTOMPADDING", (0,0), (0,0), 1*mm),
        ("TOPPADDING", (0,1), (0,1), 1*mm),
        ("BOTTOMPADDING", (0,1), (0,1), 3*mm),
    ]))

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []
    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()
    def save(self):
        count = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.setFont("Arial", 7.5)
            self.setFillColor(MUTED)
            self.drawString(20*mm, 12*mm, "Selbstständig als Grafikerin in Wien | Stand 15.10.2026")
            self.drawRightString(190*mm, 12*mm, f"Seite {self._pageNumber} von {count}")
            self.setStrokeColor(LINE)
            self.line(20*mm, 16*mm, 190*mm, 16*mm)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

doc = BaseDocTemplate(str(OUT), pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=18*mm, bottomMargin=22*mm, title="Schritt-für-Schritt selbstständig als Grafikerin in Wien")
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
doc.addPageTemplates([PageTemplate(id="main", frames=frame)])
story = []

# Cover
cover = Table([[P("SELBSTSTÄNDIG ALS<br/>GRAFIKERIN IN WIEN", "CoverTitle")],
               [P("Persönlicher Schritt-für-Schritt-Leitfaden für ein nebenberufliches Einzelunternehmen, österreichische Kleinunternehmerregelung und B2B-Leistungen an EU-Unternehmen.", "CoverSub")]],
              colWidths=[173*mm], rowHeights=[80*mm, 45*mm], style=TableStyle([
                  ("BACKGROUND", (0,0), (-1,-1), NAVY),
                  ("LEFTPADDING", (0,0), (-1,-1), 12*mm),
                  ("RIGHTPADDING", (0,0), (-1,-1), 12*mm),
                  ("TOPPADDING", (0,0), (0,0), 16*mm),
                  ("VALIGN", (0,0), (-1,-1), "TOP"),
              ]))
story += [Spacer(1, 18*mm), cover, Spacer(1, 12*mm)]
story.append(info_box("DEIN ZIEL", "Du meldest das freie Gewerbe <b>Werbegrafik-Designer</b> als Einzelunternehmerin an, bleibst umsatzsteuerlich Kleinunternehmerin, beantragst wegen EU-B2B-Leistungen eine UID und prüfst die SVS-Ausnahme.", MINT, TEAL))
story += [Spacer(1, 8*mm), P("Name: ____________________________________________", "Bodyx"), P("Geplanter Tätigkeitsbeginn: __________________________", "Bodyx"), P("Geplanter Gewerbestandort: _________________________", "Bodyx"), Spacer(1, 8*mm)]
story.append(P("Wichtiger Hinweis", "H2x"))
story.append(P("Dieser Leitfaden ist auf die geschilderte Ausgangslage zugeschnitten, ersetzt aber keine individuelle Steuer- oder Rechtsberatung. Sonderfälle entstehen insbesondere bei Privatkunden im Ausland, Drittlandskunden, Grundstücksleistungen, hohen Investitionen, mehreren Betrieben oder Überschreitung der Grenzen.", "Smallx"))
story.append(PageBreak())

# Overview
story += [P("Deine Reihenfolge auf einen Blick", "H1x")]
rows = [
    ["1", "Arbeitsvertrag und Arbeitgeber klären", "vor Gewerbeanmeldung"],
    ["2", "Wohnadresse als Gewerbestandort klären", "vor Gewerbeanmeldung"],
    ["3", "Unterlagen und ID Austria vorbereiten", "vor Gewerbeanmeldung"],
    ["4", "Freies Gewerbe Werbegrafik-Designer anmelden", "Starttag"],
    ["5", "FinanzOnline: Erklärungswechsel / Tätigkeit melden", "unverzüglich danach"],
    ["6", "UID mit Formular U15 beantragen", "nach Steuernummer / Registrierung"],
    ["7", "SVS-Ausnahme für Kleinunternehmer beantragen", "sofort nach Anmeldung"],
    ["8", "Rechnungssystem und Aufzeichnungen einrichten", "vor erster Rechnung"],
    ["9", "EU-Rechnung mit Reverse Charge ausstellen", "nach gültiger UID-Prüfung"],
    ["10", "Zusammenfassende Meldung abgeben", "bis Ende Folgemonat"],
    ["11", "Jahresabschluss und Steuererklärungen", "jährlich"],
]
t = Table([[P("SCHRITT", "Smallx"), P("AUFGABE", "Smallx"), P("ZEITPUNKT", "Smallx")]] + [[P(a,"BoxBody"),P(b,"BoxBody"),P(c,"BoxBody")] for a,b,c in rows], colWidths=[20*mm, 105*mm, 48*mm], repeatRows=1)
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), NAVY), ("TEXTCOLOR", (0,0), (-1,0), WHITE),
    ("GRID", (0,0), (-1,-1), 0.4, LINE), ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, colors.HexColor("#F8FAFC")]),
    ("LEFTPADDING", (0,0), (-1,-1), 3*mm), ("RIGHTPADDING", (0,0), (-1,-1), 3*mm),
    ("TOPPADDING", (0,0), (-1,-1), 2.5*mm), ("BOTTOMPADDING", (0,0), (-1,-1), 2.5*mm),
]))
story += [t, Spacer(1, 6*mm)]
story.append(info_box("DREI GRENZEN, DREI VERSCHIEDENE THEMEN", "<b>13.539 EUR:</b> Einkommensteuertarif 2026 für Selbstständige (0 % bis zu dieser Tarifstufe; bei Anstellung zählt das Gesamteinkommen).<br/><b>730 EUR:</b> Veranlagungsfreibetrag für andere Einkünfte neben lohnsteuerpflichtigen Einkünften - keine allgemeine Umsatzgrenze.<br/><b>55.000 EUR:</b> Umsatzsteuer-Kleinunternehmergrenze.<br/><b>6.613,20 EUR:</b> SVS-Einkunftsgrenze 2026 für die beantragte Kleinunternehmer-Ausnahme.", CREAM, ORANGE))
story.append(PageBreak())

# Steps 1-3
story += [step_header(1, "Arbeitsvertrag und Arbeitgeber klären"), Spacer(1, 4*mm)]
story += [P("Prüfe deinen Dienstvertrag, Kollektivvertrag und interne Nebenbeschäftigungsregeln. Eine Zustimmung ist nicht immer gesetzlich zwingend, kann aber vertraglich vorgeschrieben sein. Keine Konkurrenztätigkeit, keine Nutzung von Arbeitgebermitteln oder Kundendaten und keine Beeinträchtigung deiner Haupttätigkeit."), checkbox("Dienstvertrag auf Melde- oder Zustimmungspflicht geprüft"), checkbox("Tätigkeitsbeschreibung schriftlich an Arbeitgeber geschickt"), checkbox("Schriftliche Zustimmung oder Kenntnisnahme abgelegt, falls erforderlich")]
story.append(info_box("FORMULIERUNGSVORSCHLAG", "„Ich beabsichtige, außerhalb meiner Arbeitszeit nebenberuflich als selbstständige Werbegrafik-Designerin tätig zu werden. Die Tätigkeit steht nicht in Konkurrenz zum Unternehmen, beeinträchtigt meine Arbeitsleistung nicht und erfolgt ohne Nutzung betrieblicher Ressourcen. Ich ersuche um schriftliche Bestätigung der Kenntnisnahme bzw. Zustimmung.“"))
story += [Spacer(1, 5*mm), step_header(2, "Wohnadresse als Gewerbestandort klären"), Spacer(1, 4*mm)]
story += [P("Prüfe Mietvertrag, Hausordnung und gegebenenfalls Wohnungseigentumsvertrag. Ein stiller Büroarbeitsplatz ohne Mitarbeiter, Lager, Lärm oder regelmäßigen Kundenverkehr ist meist einfacher. Die konkrete Zustimmungspflicht hängt aber vom Vertrag und der tatsächlichen Nutzung ab."), checkbox("Mietvertrag und Hausordnung geprüft"), checkbox("Vermieter/Hausverwaltung schriftlich gefragt, wenn unklar"), checkbox("Regeln für Türschild/Sticker geklärt"), checkbox("Kein genehmigungspflichtiger Betriebsanlagenbetrieb geplant")]
story.append(info_box("FORMULIERUNGSVORSCHLAG", "„Ich möchte an meiner Wohnadresse ein nebenberufliches Einzelunternehmen für Werbegrafik-Design betreiben. Die Tätigkeit erfolgt ausschließlich am Computer, ohne Mitarbeiter, Lager, Lärm oder regelmäßigen Kundenverkehr. Bitte bestätigen Sie, ob dies zulässig ist und ob ein kleines Türschild erlaubt ist.“", MINT, TEAL))
story += [Spacer(1, 5*mm), step_header(3, "Unterlagen vorbereiten"), Spacer(1, 4*mm)]
story += [checkbox("ID Austria aktiv und funktionsfähig"), checkbox("Reisepass/Personalausweis und Meldeadresse verfügbar"), checkbox("Sozialversicherungsnummer und Geburtsdaten bereit"), checkbox("Gewerbewortlaut notiert: Werbegrafik-Designer"), checkbox("Standortadresse und Startdatum festgelegt"), checkbox("Bei Aufenthalt außerhalb Österreichs in den letzten 5 Jahren: nötige Strafregisterbestätigungen geprüft")]
story.append(PageBreak())

# Gewerbe
story += [step_header(4, "Gewerbe bei der Stadt Wien anmelden"), Spacer(1, 4*mm)]
story.append(P("<b>Wo:</b> Online über die Stadt Wien/GISA mit ID Austria oder persönlich über das WKO-Gründerservice bzw. das zuständige Magistratische Bezirksamt."))
story.append(P("<b>Online-Einstieg:</b> https://www.wien.gv.at/amtswege/gewerbeanmeldung"))
story.append(P("<b>Formularangaben:</b>"))
fields = [
    ("Rechtsform", "Natürliche Person / Einzelunternehmen"),
    ("Gewerbe", "Werbegrafik-Designer"),
    ("Standort", "deine geklärte Wohn- oder Geschäftsadresse"),
    ("Beginn", "gewünschtes Datum; nicht rückwirkend planen"),
    ("Geschäftsführung", "bei dir selbst grundsätzlich keine zusätzliche gewerberechtliche Geschäftsführung"),
]
tab = Table([[P(a,"BoxTitle"),P(b,"BoxBody")] for a,b in fields], colWidths=[46*mm,127*mm], style=TableStyle([
    ("GRID",(0,0),(-1,-1),0.4,LINE),("BACKGROUND",(0,0),(0,-1),PALE),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("LEFTPADDING",(0,0),(-1,-1),3*mm),("RIGHTPADDING",(0,0),(-1,-1),3*mm),("TOPPADDING",(0,0),(-1,-1),2.5*mm),("BOTTOMPADDING",(0,0),(-1,-1),2.5*mm)
]))
story += [tab, Spacer(1, 4*mm), checkbox("Eingangsbestätigung gespeichert"), checkbox("GISA-Auszug gespeichert und Daten kontrolliert"), checkbox("WKO-Fachgruppe und Grundumlage vorgemerkt")]
story.append(info_box("WAS DANACH AUTOMATISCH PASSIERT", "Die Gewerbeanmeldung führt zur WKO-Pflichtmitgliedschaft und grundsätzlich zur SVS-Pflichtversicherung. Verlasse dich bei der gewünschten SVS-Ausnahme nicht auf einen Automatismus: Stelle den Ausnahme-Antrag selbst und rechtzeitig.", CREAM, ORANGE))

story += [PageBreak(), step_header(5, "Finanzamt über FinanzOnline informieren"), Spacer(1, 4*mm)]
story.append(P("<b>Wo:</b> FinanzOnline → Weitere Services bzw. Eingaben/Anträge → <b>Erklärungswechsel / Änderung der Tätigkeit</b>. Die genaue Navigation kann sich ändern."))
story.append(P("Trage sinngemäß ein:"))
fo = [
    ("Einkunftsart", "Einkünfte aus Gewerbebetrieb"),
    ("Tätigkeit", "Werbegrafik-Design / Kommunikationsdesign"),
    ("Beginn", "Datum laut Gewerbeanmeldung"),
    ("Betriebsstätte", "Gewerbestandort"),
    ("Beschäftigte", "0, sofern du niemanden beschäftigst"),
    ("Umsatzschätzung", "realistische Einnahmen des ersten Jahres"),
    ("Gewinnschätzung", "Umsatz minus voraussichtliche Betriebsausgaben"),
    ("Umsatzsteuer", "Kleinunternehmerregelung; keine freiwillige Regelbesteuerung"),
]
story.append(Table([[P(a,"BoxTitle"),P(b,"BoxBody")] for a,b in fo], colWidths=[46*mm,127*mm], style=TableStyle([
    ("GRID",(0,0),(-1,-1),0.4,LINE),("BACKGROUND",(0,0),(0,-1),PALE),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("LEFTPADDING",(0,0),(-1,-1),3*mm),("RIGHTPADDING",(0,0),(-1,-1),3*mm),("TOPPADDING",(0,0),(-1,-1),2.3*mm),("BOTTOMPADDING",(0,0),(-1,-1),2.3*mm)
])))
story += [Spacer(1, 4*mm), checkbox("Erklärungswechsel abgesendet und Bestätigung gespeichert"), checkbox("Steuernummer / unternehmerische Registrierung abgewartet"), checkbox("Keinen U12-Regelbesteuerungsantrag gestellt")]
story.append(PageBreak())

# UID + SVS
story += [step_header(6, "UID-Nummer mit Formular U15 beantragen"), Spacer(1, 4*mm)]
story.append(P("Du brauchst die UID, weil du grenzüberschreitende B2B-Dienstleistungen an ein EU-Unternehmen erbringst. Die UID ändert deinen österreichischen Kleinunternehmerstatus nicht automatisch."))
story.append(P("<b>Formular:</b> U15 - Antrag auf Vergabe einer Umsatzsteuer-Identifikationsnummer<br/><b>Download:</b> https://service.bmf.gv.at/service/anwend/formulare/"))
u15 = [
    ("Kopf", "Steuernummer, Name/Unternehmensbezeichnung, Anschrift, Telefon"),
    ("Punkt 1", "„Ich beantrage die Vergabe einer UID“"),
    ("Punkt 1.1", "ankreuzen: ausschließlich Umsätze mit Ausschluss vom Vorsteuerabzug; das trifft bei der österreichischen Kleinunternehmerbefreiung grundsätzlich zu"),
    ("Punkt 2.5", "ankreuzen: grenzüberschreitende sonstige Leistungen, bei denen die Steuerschuld zwingend auf den Leistungsempfänger übergeht"),
    ("Abschluss", "Datum und Unterschrift; Kopie für deine Unterlagen"),
]
story.append(Table([[P(a,"BoxTitle"),P(b,"BoxBody")] for a,b in u15], colWidths=[40*mm,133*mm], style=TableStyle([
    ("GRID",(0,0),(-1,-1),0.4,LINE),("BACKGROUND",(0,0),(0,-1),MINT),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("LEFTPADDING",(0,0),(-1,-1),3*mm),("RIGHTPADDING",(0,0),(-1,-1),3*mm),("TOPPADDING",(0,0),(-1,-1),2.5*mm),("BOTTOMPADDING",(0,0),(-1,-1),2.5*mm)
])))
story += [Spacer(1, 4*mm), checkbox("Aktuelle U15-Version verwendet"), checkbox("U15 an Finanzamt Österreich übermittelt"), checkbox("UID-Bescheid gespeichert"), checkbox("Eigene UID im Rechnungsprogramm hinterlegt")]
story.append(info_box("NICHT ANKREUZEN", "Keinen Verzicht auf die Kleinunternehmerbefreiung bzw. keine freiwillige Regelbesteuerung beantragen, wenn du Kleinunternehmerin bleiben möchtest. Ein UID-Antrag allein ist keine solche Option.", CREAM, ORANGE))

story += [Spacer(1, 6*mm), step_header(7, "SVS-Ausnahme beantragen"), Spacer(1, 4*mm)]
story.append(P("<b>Formular:</b> Antrag auf Ausnahme von der Pflichtversicherung für Kleinunternehmer (gewerbliche Einzelunternehmer). Abruf über https://www.svs.at → Formulare → Versicherungsanmeldung."))
story.append(P("Voraussetzungen 2026: voraussichtliche selbstständige Einkünfte höchstens <b>6.613,20 EUR</b>, gesamter unternehmerischer Umsatz höchstens <b>55.000 EUR</b> und zusätzliche persönliche Voraussetzungen. Unter 57 Jahren typischerweise: in den letzten 60 Monaten nicht länger als 12 Monate GSVG/FSVG-pflichtversichert."))
story += [checkbox("Persönliche Vorversicherungsbedingung geprüft"), checkbox("Umsatz 2026 realistisch unter 55.000 EUR geschätzt"), checkbox("Gewinn/Einkünfte 2026 realistisch unter 6.613,20 EUR geschätzt"), checkbox("Ausnahme-Antrag unterschrieben und übermittelt"), checkbox("SVS-Bescheid gespeichert")]
story.append(info_box("FOLGE DER AUSNAHME", "Du bist dann grundsätzlich von GSVG-Kranken- und Pensionsversicherung ausgenommen. Die gesetzliche Unfallversicherung bleibt bestehen; 2026 beträgt sie 12,95 EUR monatlich. Überschreitest du später eine Grenze, drohen Nachverrechnung und gegebenenfalls Zuschläge - beobachte deshalb deinen Gewinn laufend.", CREAM, ORANGE))
story.append(PageBreak())

# Operations and invoice
story += [step_header(8, "Buchhaltung und Rechnungssystem einrichten"), Spacer(1, 4*mm)]
story += [checkbox("Eigenes Geschäftskonto oder klare Trennung der Zahlungen eingerichtet"), checkbox("Fortlaufende Rechnungsnummern definiert, z. B. 2026-001"), checkbox("Belegablage für Einnahmen, Ausgaben und Verträge eingerichtet"), checkbox("Umsatz- und Gewinnprognose als laufende Tabelle angelegt"), checkbox("UID-Prüfnachweise je EU-Kunde gespeichert"), checkbox("Kalendererinnerungen für ZM und Jahreserklärungen gesetzt")]
story.append(P("Für die Einnahmen-Ausgaben-Rechnung dokumentierst du Zahlungseingänge und betriebliche Ausgaben. Gewinn ist grundsätzlich Einnahmen minus abzugsfähige Betriebsausgaben. Prüfe getrennt, ob die Kleinunternehmerpauschalierung oder tatsächliche Ausgaben für dich günstiger sind."))

story += [Spacer(1, 5*mm), step_header(9, "EU-B2B-Rechnung korrekt ausstellen"), Spacer(1, 4*mm)]
story.append(P("Vor der ersten Rechnung: Kundenstatus klären und UID über FinanzOnline oder MIAS/VIES prüfen. Bei einer gewöhnlichen Grafikdienstleistung an ein EU-Unternehmen liegt der Leistungsort grundsätzlich beim Kunden und Reverse Charge greift."))
invoice_data = [
    [P("RECHNUNG", "BoxTitle"), P("Nr. 2026-001", "BoxBody")],
    [P("Leistungserbringerin", "BoxTitle"), P("Dein Name, Anschrift, österreichische UID", "BoxBody")],
    [P("Kunde", "BoxTitle"), P("Firmenname, Anschrift, gültige EU-UID", "BoxBody")],
    [P("Leistung", "BoxTitle"), P("Klare Beschreibung und Leistungszeitraum/-datum", "BoxBody")],
    [P("Entgelt", "BoxTitle"), P("Nettobetrag; keine österreichische Umsatzsteuer", "BoxBody")],
    [P("Pflichthinweis", "BoxTitle"), P("Reverse Charge - Steuerschuld geht auf den Leistungsempfänger über.", "BoxBody")],
    [P("Zahlung", "BoxTitle"), P("Fälligkeit, IBAN/BIC, Währung", "BoxBody")],
]
story.append(Table(invoice_data, colWidths=[46*mm,127*mm], style=TableStyle([
    ("BOX",(0,0),(-1,-1),0.8,NAVY),("INNERGRID",(0,0),(-1,-1),0.4,LINE),("BACKGROUND",(0,0),(-1,0),PALE),
    ("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),3*mm),("RIGHTPADDING",(0,0),(-1,-1),3*mm),
    ("TOPPADDING",(0,0),(-1,-1),2.6*mm),("BOTTOMPADDING",(0,0),(-1,-1),2.6*mm)
])))
story += [Spacer(1, 4*mm), checkbox("Eigene und Kunden-UID auf Rechnung"), checkbox("Keine österreichische Umsatzsteuer ausgewiesen"), checkbox("Reverse-Charge-Hinweis enthalten"), checkbox("UID-Prüfung und Rechnung gemeinsam abgelegt")]
story.append(info_box("ACHTUNG BEI EINGANGSLEISTUNGEN", "Beziehst du Dienstleistungen von ausländischen Unternehmen - etwa Adobe, Hosting, Werbung oder Software - kann Reverse Charge in Österreich entstehen. Dann musst du österreichische Umsatzsteuer selbst berechnen und abführen; als unecht steuerbefreite Kleinunternehmerin hast du grundsätzlich keinen Vorsteuerabzug. Lass diesen Fall steuerlich prüfen.", CREAM, ORANGE))
story.append(PageBreak())

# ZM and annual
story += [step_header(10, "Zusammenfassende Meldung (ZM) abgeben"), Spacer(1, 4*mm)]
story.append(P("<b>Wo:</b> FinanzOnline → Erklärungen → Zusammenfassende Meldung. Das Papierformular heißt U13. Elektronische Übermittlung ist der Regelfall."))
story.append(P("Für deine EU-B2B-Grafikleistung trägst du den Meldezeitraum, die UID des Kunden und die Summe der Bemessungsgrundlage ein und kennzeichnest die Position als sonstige Leistung."))
deadlines = [
    ("Jänner-März", "30. April"), ("April-Juni", "31. Juli"),
    ("Juli-September", "31. Oktober"), ("Oktober-Dezember", "31. Jänner des Folgejahres"),
]
story.append(Table([[P("LEISTUNGSQUARTAL","Smallx"),P("ZM-FRIST","Smallx")]] + [[P(a,"BoxBody"),P(b,"BoxBody")] for a,b in deadlines], colWidths=[85*mm,88*mm], style=TableStyle([
    ("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),WHITE),("GRID",(0,0),(-1,-1),0.4,LINE),
    ("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),3*mm),("RIGHTPADDING",(0,0),(-1,-1),3*mm),
    ("TOPPADDING",(0,0),(-1,-1),2.5*mm),("BOTTOMPADDING",(0,0),(-1,-1),2.5*mm)
])))
story += [Spacer(1, 4*mm), checkbox("Alle EU-B2B-Rechnungen des Quartals summiert"), checkbox("Kunden-UID korrekt eingetragen"), checkbox("Sonstige Leistung gekennzeichnet"), checkbox("Übermittlungsprotokoll gespeichert")]

story += [Spacer(1, 6*mm), step_header(11, "Laufende und jährliche Pflichten"), Spacer(1, 4*mm)]
annual = [
    ("Laufend", "Einnahmen, Ausgaben, Belege, UID-Prüfungen und Verträge ablegen; Umsatz und Gewinn überwachen."),
    ("Quartalsweise", "ZM für meldepflichtige EU-B2B-Leistungen bis Ende des Folgemonats."),
    ("Bei Auslandsbezug", "Prüfen, ob Reverse-Charge-Umsatzsteuer über UVA/Jahreserklärung abzuführen ist."),
    ("Jährlich", "Einkommensteuererklärung E1 samt Beilage E1a für den Gewerbebetrieb."),
    ("Umsatzsteuer", "Je nach Registrierung und Sachverhalt kann eine U1/UVA nötig sein; FinanzOnline-Angebot und Bescheide beachten."),
    ("SVS", "Bescheide kontrollieren; Grenzüberschreitung unverzüglich melden und Rücklage bilden."),
    ("WKO", "Grundumlage und sonstige Vorschreibungen fristgerecht zahlen."),
]
story.append(Table([[P(a,"BoxTitle"),P(b,"BoxBody")] for a,b in annual], colWidths=[40*mm,133*mm], style=TableStyle([
    ("GRID",(0,0),(-1,-1),0.4,LINE),("BACKGROUND",(0,0),(0,-1),PALE),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("LEFTPADDING",(0,0),(-1,-1),3*mm),("RIGHTPADDING",(0,0),(-1,-1),3*mm),("TOPPADDING",(0,0),(-1,-1),2.5*mm),("BOTTOMPADDING",(0,0),(-1,-1),2.5*mm)
])))
story.append(PageBreak())

# Final checklist and sources
story += [P("Abschluss-Checkliste", "H1x")]
for item in [
    "Arbeitgeberregelung geklärt", "Standort und Türschild geklärt", "Gewerbe Werbegrafik-Designer angemeldet",
    "GISA-Auszug erhalten", "FinanzOnline-Erklärungswechsel erledigt", "Kleinunternehmerregelung beibehalten",
    "U15 mit 1.1 und 2.5 eingereicht", "UID erhalten", "SVS-Ausnahme beantragt und Bescheid erhalten",
    "Rechnungsvorlage eingerichtet", "UID-Prüfung des EU-Kunden gespeichert", "ZM-Fristen eingetragen",
    "Gewinn- und Umsatzkontrolle eingerichtet", "Rücklage für Einkommensteuer/SVS angelegt"
]:
    story.append(checkbox(item))

story += [Spacer(1, 5*mm), P("Offizielle Anlaufstellen", "H2x")]
sources = [
    ("Stadt Wien - Gewerbeanmeldung", "https://www.wien.gv.at/amtswege/gewerbeanmeldung"),
    ("WKO Wien - Gründungsservice", "https://www.wko.at/wien/gruendung"),
    ("FinanzOnline", "https://finanzonline.bmf.gv.at"),
    ("BMF-Formularsuche, insbesondere U15 und U13", "https://service.bmf.gv.at/service/anwend/formulare/"),
    ("SVS - Kleinunternehmer / Formulare", "https://www.svs.at/kleinunternehmer"),
    ("WKO - Kleinunternehmerregelung Umsatzsteuer", "https://www.wko.at/steuern/kleinunternehmerregelung-umsatzsteuer"),
    ("WKO - B2B-Dienstleistungen an ausländische Unternehmer", "https://www.wko.at/steuern/b2b-dienstleistungen-auslaendische-unternehmer"),
]
for name, url in sources:
    story.append(P(f"<b>{name}</b><br/><link href='{url}' color='#2F6FED'>{url}</link>", "Link"))
    story.append(Spacer(1, 1.5*mm))

story += [Spacer(1, 4*mm), info_box("WANN DU NOCHMALS NACHFRAGEN SOLLTEST", "Bei Überschreiten von 6.613,20 EUR Gewinn oder 55.000 EUR Umsatz; bei Kunden außerhalb der EU; bei Privatkunden im Ausland; bei hohen Anschaffungen; bei ausländischen Software-/Werbeleistungen; wenn FinanzOnline eine UVA/U1 verlangt; oder wenn deine Tätigkeit über reines Werbegrafik-Design hinausgeht.", CREAM, ORANGE)]
story += [Spacer(1, 6*mm), P("Erstellt auf Basis der offiziellen Informationen von BMF, SVS, WKO und Stadt Wien. Stand: 15. Oktober 2026.", "Smallx")]

doc.build(story, canvasmaker=NumberedCanvas)
print(OUT)
