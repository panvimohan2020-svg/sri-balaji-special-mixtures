import json

with open(r"C:\Users\lenovo\.gemini\antigravity\brain\814eae1d-adf7-4684-8a35-e4eefde9c889\.system_generated\logs\transcript_full.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        data = json.loads(line)
        if data.get("step_index") == 4572:
            content = data.get("content", "")
            task2_pos = content.find("# TASK 2:")
            print(content[task2_pos:])
            break

