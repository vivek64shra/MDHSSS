import re

with open("/tmp/netlify-bundle.js", "r") as f:
    text = f.read()

matches = re.findall(r"https://docs\.google\.com/spreadsheets[^\s\"'`]+", text)
print("Found URLs:")
for m in set(matches):
    print(" -", m)

print("\nFees-related occurrences:")
for line in text.splitlines():
    for word in re.findall(r"[A-Za-z0-9_]*FEES[A-Za-z0-9_]*", line):
        print(" - Word:", word)
        idx = line.find(word)
        snippet = line[max(0, idx - 40):min(len(line), idx + 100)]
        print("   Snippet:", snippet)
