#!/usr/bin/env python
import hashlib
import json
import platform
import subprocess
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

import requests

def safe_run(cmd: list[str], timeout: int = 10):
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return proc.returncode, proc.stdout.strip(), proc.stderr.strip()
    except:
        return 1, "", "error"

def check_disk_encryption():
    if platform.system().lower().startswith("win"):
        code, out, _ = safe_run(["manage-bde", "-status"])
        return {"status": "encrypted" if code == 0 and "protection on" in out.lower() else "not_encrypted"}
    return {"status": "unknown"}

def check_os_updates():
    if platform.system().lower().startswith("win"):
        ps = ["powershell", "-NoProfile", "-Command",
              "(New-Object -ComObject Microsoft.Update.Session).CreateUpdateSearcher().Search(\"IsInstalled=0\").Updates.Count"]
        code, out, _ = safe_run(ps, timeout=30)
        if code == 0:
            return {"status": "updates_available" if int(out.strip() or 0) > 0 else "up_to_date"}
    return {"status": "unknown"}

def check_antivirus():
    if platform.system().lower().startswith("win"):
        ps = ["powershell", "-NoProfile", "-Command",
              "Get-CimInstance -Namespace root\\SecurityCenter2 -ClassName AntivirusProduct | ConvertTo-Json -Compress"]
        code, out, _ = safe_run(ps)
        if code == 0 and out.strip():
            return {"status": "found"}
    return {"status": "not_found"}

def check_sleep():
    if platform.system().lower().startswith("win"):
        code, out, _ = safe_run(["powercfg", "/query"])
        if code == 0:
            return {"compliant": "never" not in out.lower()}
    return {"compliant": False}

def get_machine_id():
    node = platform.node() or "unknown"
    return hashlib.sha256(node.encode()).hexdigest()

def check_sleep():
    if platform.system().lower().startswith("win"):
        code, out, _ = safe_run(["powercfg", "/query"])
        if code == 0:
            return {"status": "compliant" if "never" not in out.lower() else "non_compliant"}
    return {"status": "unknown"}

def gather_report():
    return {
        "machine_id": get_machine_id(),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "platform": platform.system().lower(),
        "hostname": platform.node(),
        "disk_encryption": check_disk_encryption(),
        "os_updates": check_os_updates(),
        "antivirus": check_antivirus(),
        "sleep_settings": check_sleep()
    }

def send_report(report: Dict[str, Any]):
    print("\nSending report:", json.dumps(report, indent=2))
    try:
        resp = requests.post(
            "https://solsphere-backend-hq50.onrender.com/api/reports",
            json=report,
            headers={"Content-Type": "application/json"},
            timeout=20
        )
        print(f"Response status: {resp.status_code}")
        print(f"Response: {resp.text[:200]}")
        return resp.ok
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    print("Starting system health check...")
    report = gather_report()
    send_report(report)

if __name__ == "__main__":
    main()