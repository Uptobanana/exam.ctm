#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re, json

FILE = "s2-zhongzhen.js"
with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

with open("s2_f_trailing.json", "r", encoding="utf-8") as f:
    trailing = json.load(f)

import sys
sys.stdout.reconfigure(encoding="utf-8")

new_contents = {}

with open("s2_f_new_dx-16-1.txt", "r", encoding="utf-8") as f:
    new_contents["dx-16-1"] = f.read()

with open("s2_f_new_dx-17-1.txt", "r", encoding="utf-8") as f:
    new_contents["dx-17-1"] = f.read()

with open("s2_f_new_dx-17-2.txt", "r", encoding="utf-8") as f:
    new_contents["dx-17-2"] = f.read()

with open("s2_f_new_dx-17-3.txt", "r", encoding="utf-8") as f:
    new_contents["dx-17-3"] = f.read()

with open("s2_f_new_dx-18-1.txt", "r", encoding="utf-8") as f:
    new_contents["dx-18-1"] = f.read()

with open("s2_f_new_dx-18-2.txt", "r", encoding="utf-8") as f:
    new_contents["dx-18-2"] = f.read()

with open("s2_f_new_dx-18-3.txt", "r", encoding="utf-8") as f:
    new_contents["dx-18-3"] = f.read()

# Perform replacement
for pid, new_core in new_contents.items():
    tra = trailing[pid]["trailing"]
    new_full = new_core + tra
    pos = content.find(f"id:'{pid}'")
    c_pos = content.find("content:'", pos)
    # Find end
    end = -1
    i = c_pos + 9
    while i < len(content):
        if content[i] == "'":
            ni = i + 1
            while ni < len(content) and content[ni] in " \t\n":
                ni += 1
            if ni < len(content) and content[ni] in ",}":
                end = i
                break
        i += 1
    old_len = len(content[c_pos+9:end])
    content = content[:c_pos+9] + new_full + content[end:]
    print(f"{pid}: {old_len}B -> {len(new_full)}B (+{len(new_full)-old_len}B)")

content = content.replace("]}]}{unit:'", "]}]},{unit:'")
content = content.replace("</div<", "</div><")
content = content.replace("</div'", "</div>'")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)

orig = len(open("s2-zhongzhen.js.bak-F", "rb").read())
print(f"\n=== DONE === Original: {orig}B, New: {len(content)}B, Delta: +{len(content)-orig}B")