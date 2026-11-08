import urllib.request
import re

url = 'https://sri-balaji-special-mixtures.vercel.app'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache'})
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8')
    scripts = re.findall(r'src="([^"]+)"', html)
    print('Scripts found in HTML:', scripts)
    for s in scripts:
        if 'index' in s:
            print('Main bundle:', s)
