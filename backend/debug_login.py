import urllib.request
import urllib.error
import json
import re

req = urllib.request.Request(
    'https://college-management-system-dsgq.onrender.com/api/auth/login/',
    data=json.dumps({'username': 'sachin_maurya8005', 'password': 'sachin@123'}).encode('utf-8'),
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
