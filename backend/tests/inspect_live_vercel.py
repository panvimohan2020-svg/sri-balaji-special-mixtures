import requests
import re

url = 'https://sri-balaji-special-mixtures.vercel.app'
print('Testing public URL:', url)

r = requests.get(url, timeout=30)
print('HTML Status:', r.status_code)

js_matches = re.findall(r'src="(/assets/[^"]+\.js)"', r.text)
print('Found JS Assets:', js_matches)

css_matches = re.findall(r'href="(/assets/[^"]+\.css)"', r.text)
print('Found CSS Assets:', css_matches)

if js_matches:
    js_url = url + js_matches[0]
    r_js = requests.get(js_url, timeout=30)
    print('JS Download Status:', r_js.status_code, 'Size:', len(r_js.content))
    has_render = 'sri-balaji-special-mixtures.onrender.com' in r_js.text
    print('Is Render Backend URL baked into Vite build:', has_render)

# Test robots and sitemap on production domain
r_robots = requests.get(f'{url}/robots.txt', timeout=30)
print('Robots status:', r_robots.status_code)

r_sitemap = requests.get(f'{url}/sitemap.xml', timeout=30)
print('Sitemap status:', r_sitemap.status_code)
