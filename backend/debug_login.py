import urllib.request
import urllib.error
import json
import re

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/auth/login/',
    data=json.dumps({'email': 'admin@polytechnic.edu', 'password': 'admin123'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as res:
        print("LOGIN SUCCESS:", res.read().decode())
except urllib.error.HTTPError as e:
    body = e.read().decode('utf-8')
    m = re.search(r'<pre class="exception_value">(.*?)</pre>', body, re.DOTALL)
    if m:
        print("DJANGO EXCEPTION:", m.group(1).strip())
    else:
        print("HTTP ERROR:", e.code, body[:500])
