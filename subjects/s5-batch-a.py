#!/usr/bin/env python3
"""S5 Batch A upgrade — units 1-9 感冒→癫狂"""
import re, json, os

FILE = 's5-neike.js'
with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()
with open('s5_a_trailing.json', 'r', encoding='utf-8') as f:
    trailing = json.load(f)

new_dir = 's5_a_new/'
pids_nowritten = []

for pid in trailing:
    fn = f's5_a_new_{pid}.txt'
    if not os.path.exists(fn):
        pids_nowritten.append(pid)

if pids_nowritten:
    print(f"MISSING {len(pids_nowritten)} files: {pids_nowritten[:5]}...")
    
for pid in trailing:
    if pid in pids_nowritten:
        continue
    with open(f's5_a_new_{pid}.txt', 'r', encoding='utf-8') as f:
        new_core = f.read()
    
    new_full = new_core + trailing[pid]['trailing']
    
    # Find and replace
    pos = content.find(f'id:"{pid}"')
    cpos = content.find("content:'", pos)
    
    end = -1
    i = cpos + 9
    while i < len(content):
        if content[i] == "'":
            ni = i + 1
            while ni < len(content) and content[ni] in ' \t\n':
                ni += 1
            if ni < len(content) and content[ni] in ',}':
                end = i
                break
        i += 1
    
    old_len = len(content[cpos+9:end])
    content = content[:cpos+9] + new_full + content[end:]
    print(f"{pid}: {old_len}B -> {len(new_full)}B (+{len(new_full)-old_len}B)")

content = content.replace(']}]}{unit:"', ']}]},{unit:"')
content = content.replace('</div<', '</div><')
# Don't replace </div' globally - could break valid strings

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

sz = os.path.getsize(FILE)
print(f"\nDone. Size: {sz} bytes")
