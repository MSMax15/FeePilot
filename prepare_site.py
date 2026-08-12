from pathlib import Path
from html import escape

ROOT = Path('.')
DOMAIN = 'https://saveonfees.eu'
REFERRAL = 'https://fomo.family/r/LMP506'
CODE = 'LMP506'

# Rebrand the existing polished homepage during the static build.
index = ROOT / 'index.html'
s = index.read_text(encoding='utf-8')
s = s.replace('https://msmax15.github.io/FeePilot/', DOMAIN + '/')
s = s.replace('Fee<span class="p">Pilot</span>', 'SaveOn<span class="p">Fees</span>')
s = s.replace('FeePilot', 'SaveOnFees')
s = s.replace('FOMO Referral Code 2026 – LMP506 | SaveOnFees', 'FOMO Referral Code 2026 – Save 10% on Fees | LMP506')
s = s.replace(
    '<meta property="og:type" content="website">',
    '<meta property="og:type" content="website"><meta property="og:site_name" content="SaveOnFees"><meta property="og:url" content="https://saveonfees.eu/">'
)
index.write_text(s, encoding='utf-8')

CSS = '''
:root{--bg:#07111f;--panel:#0d1b2c;--line:rgba(255,255,255,.1);--text:#f7fbff;--muted:#91a4b9;--mint:#8ee3c7;--mint2:#63d7b1}*{box-sizing:border-box}html{background:var(--bg)}body{margin:0;color:#d4deea;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:radial-gradient(circle at 12% -5%,rgba(99,215,177,.13),transparent 28rem),#07111f;min-height:100vh}a{color:inherit;text-decoration:none}.wrap{width:min(900px,calc(100% - 30px));margin:auto}header{border-bottom:1px solid #ffffff0e;background:#07111fe8}.nav{height:68px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{font-weight:900;color:#fff;letter-spacing:-.04em}.brand span{color:var(--mint)}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 17px;border-radius:13px;font-size:13px;font-weight:850;background:linear-gradient(#9aead0,#73dcbc);color:#06271f}.hero{padding:72px 0 45px}.eyebrow{color:var(--mint);font-size:11px;font-weight:850;letter-spacing:.16em;text-transform:uppercase}h1{margin:14px 0 0;color:#fff;font-size:clamp(42px,7vw,66px);line-height:1;letter-spacing:-.055em}h2{margin:34px 0 10px;color:#fff;letter-spacing:-.035em}.lead,p,li{color:var(--muted);line-height:1.75}.lead{font-size:18px;max-width:760px}.panel{margin:24px 0;padding:24px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(#ffffff07,#ffffff03),#0b1728}.code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#fff;font-size:42px;font-weight:900;letter-spacing:.12em;margin:8px 0 18px}.actions{display:flex;gap:10px;flex-wrap:wrap}.ghost{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 17px;border:1px solid var(--line);border-radius:13px;color:#fff;font-size:13px;font-weight:800}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.card{padding:19px;border:1px solid var(--line);border-radius:16px;background:#ffffff03}.card strong{color:#fff}.note{font-size:12px;color:#6f8297}.links{display:flex;flex-wrap:wrap;gap:10px;margin:30px 0}.links a{border-bottom:1px solid #8ee3c755;color:#c9f7e8}footer{border-top:1px solid #ffffff0e;margin-top:55px;padding:28px 0 60px;color:#6f8297;font-size:11px;line-height:1.7}@media(max-width:650px){.grid{grid-template-columns:1fr}.nav .btn{display:none}.actions>*{width:100%}}
'''

PAGES = [
    {
        'slug': 'fomo-referral-code',
        'title': 'FOMO Referral Code 2026 – LMP506 | SaveOnFees',
        'desc': 'FOMO referral code LMP506 with a direct referral link, 10% eligible fee discount reference and simple signup steps.',
        'h1': 'FOMO Referral Code 2026 – LMP506',
        'intro': 'Looking for a FOMO referral code before creating an account? SaveOnFees lists LMP506, the direct referral link and the key steps to verify the current referral benefit before you continue.',
        'sections': [
            ('How to use LMP506', 'Open the referral link first, start account creation, and confirm that the referral benefit is attached to your account before funding or trading.'),
            ('What does the referral offer do?', 'The current referral promotion is presented as a fee benefit for eligible users. Conditions can change, so confirm the exact offer displayed by FOMO during signup.'),
        ],
    },
    {
        'slug': 'fomo-fees',
        'title': 'FOMO Fees 2026 – Trading Fees & Referral Discount | SaveOnFees',
        'desc': 'Understand FOMO trading fees, see a simple 0.50% reference example and learn how a 10% referral fee reduction may affect eligible fees.',
        'h1': 'FOMO Fees 2026 – Simple Guide',
        'intro': 'Trading fees matter most when volume grows. This page turns the fee percentage into simple examples and shows how an eligible referral reduction can change the estimated cost.',
        'sections': [
            ('Reference example', 'At a 0.50% reference fee, $10,000 of trading volume corresponds to an estimated $50 fee before any eligible referral reduction. A 10% reduction of that fee would equal $5 in this simplified example.'),
            ('Always verify current pricing', 'FOMO can change fees, minimum charges, products and referral conditions. Treat these numbers as estimates and verify current pricing on FOMO before trading.'),
        ],
    },
    {
        'slug': 'fomo-fee-calculator',
        'title': 'FOMO Fee Calculator 2026 | SaveOnFees',
        'desc': 'Quick FOMO fee calculator examples for trading volume and a 10% eligible referral fee reduction using code LMP506.',
        'h1': 'FOMO Fee Calculator',
        'intro': 'Use the full calculator on the SaveOnFees homepage to estimate a reference fee and the possible effect of a 10% eligible referral reduction.',
        'sections': [
            ('$1,000 volume example', 'Using a 0.50% reference fee gives an estimated $5 standard fee. A 10% reduction would equal about $0.50.'),
            ('$10,000 volume example', 'Using the same reference rate gives an estimated $50 standard fee. A 10% reduction would equal about $5.'),
            ('$100,000 volume example', 'Using the same reference rate gives an estimated $500 standard fee. A 10% reduction would equal about $50.'),
        ],
    },
    {
        'slug': 'how-to-use-fomo-referral-code',
        'title': 'How to Use FOMO Referral Code LMP506 | SaveOnFees',
        'desc': 'Step-by-step guide to using FOMO referral code LMP506 before creating a new account.',
        'h1': 'How to Use FOMO Referral Code LMP506',
        'intro': 'The safest sequence is simple: enter through the referral link before account creation, then verify the benefit before you continue.',
        'sections': [
            ('Step 1 – Open the referral link', 'Use the LMP506 referral link on this page before starting signup.'),
            ('Step 2 – Create the new account', 'Continue through the normal FOMO onboarding process.'),
            ('Step 3 – Verify the referral', 'Check the referral or fee benefit shown for your account. If it is not shown, do not assume it has been applied.'),
            ('Step 4 – Decide independently', 'Review fees and risks before trading. A referral discount does not reduce market risk or guarantee profit.'),
        ],
    },
    {
        'slug': 'fomo-discount',
        'title': 'FOMO 10% Fee Discount – Referral Code LMP506 | SaveOnFees',
        'desc': 'Check the FOMO referral fee discount, use code LMP506 and open the direct referral link before creating a new account.',
        'h1': 'FOMO 10% Fee Discount – LMP506',
        'intro': 'SaveOnFees tracks the referral route for users who are already considering FOMO and want to check the available fee benefit before signup.',
        'sections': [
            ('Referral code', 'The code featured here is LMP506. Use the referral link before account creation and verify the current benefit shown by FOMO.'),
            ('No profit promise', 'This page is about potential fee savings only. It does not promise trading profits, returns or reduced market risk.'),
        ],
    },
]

NAV = [
    ('FOMO referral code', '/fomo-referral-code/'),
    ('FOMO fees', '/fomo-fees/'),
    ('Fee calculator', '/fomo-fee-calculator/'),
    ('How to use the code', '/how-to-use-fomo-referral-code/'),
    ('FOMO discount', '/fomo-discount/'),
]

def make_page(page):
    canonical = f"{DOMAIN}/{page['slug']}/"
    section_html = ''.join(
        f'<section><h2>{escape(title)}</h2><p>{escape(text)}</p></section>'
        for title, text in page['sections']
    )
    nav_html = ''.join(f'<a href="{href}">{escape(label)}</a>' for label, href in NAV if href != f"/{page['slug']}/")
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(page['title'])}</title><meta name="description" content="{escape(page['desc'])}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="{canonical}"><meta property="og:type" content="article"><meta property="og:site_name" content="SaveOnFees"><meta property="og:title" content="{escape(page['title'])}"><meta property="og:description" content="{escape(page['desc'])}"><meta property="og:url" content="{canonical}"><style>{CSS}</style></head>
<body><header><div class="wrap nav"><a class="brand" href="/"><span>SaveOn</span>Fees</a><a class="btn" href="{REFERRAL}" target="_blank" rel="sponsored nofollow noopener">Open FOMO →</a></div></header>
<main class="wrap"><div class="hero"><div class="eyebrow">Independent FOMO fee guide · 2026</div><h1>{escape(page['h1'])}</h1><p class="lead">{escape(page['intro'])}</p>
<div class="panel"><div class="eyebrow">Referral code</div><div class="code">{CODE}</div><div class="actions"><a class="btn" href="{REFERRAL}" target="_blank" rel="sponsored nofollow noopener">Use LMP506 →</a><a class="ghost" href="/">Open fee calculator</a></div><p class="note">Independent affiliate website. SaveOnFees is not operated by FOMO. Verify current fees, eligibility and referral conditions before trading.</p></div>
{section_html}<div class="links">{nav_html}</div></div></main>
<footer><div class="wrap">SaveOnFees may receive a commission from eligible referral activity. Crypto and trading involve financial risk. General information only; not financial advice.</div></footer></body></html>'''

for page in PAGES:
    folder = ROOT / page['slug']
    folder.mkdir(exist_ok=True)
    (folder / 'index.html').write_text(make_page(page), encoding='utf-8')

urls = [DOMAIN + '/'] + [f"{DOMAIN}/{p['slug']}/" for p in PAGES]
(ROOT / 'sitemap.xml').write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    ''.join(f'  <url><loc>{u}</loc><lastmod>2026-08-12</lastmod></url>\n' for u in urls) +
    '</urlset>\n', encoding='utf-8'
)
(ROOT / 'robots.txt').write_text(
    'User-agent: *\nAllow: /\n\nSitemap: https://saveonfees.eu/sitemap.xml\n',
    encoding='utf-8'
)
print('Prepared SaveOnFees homepage and', len(PAGES), 'SEO pages')
