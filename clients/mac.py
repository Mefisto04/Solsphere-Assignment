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

def get_machine_id():
    node = platform.node() or "unknown"
    return hashlib.sha256(node.encode()).hexdigest()

def check_disk_encryption():
    code, out, _ = safe_run(["fdesetup", "status"])
    if code == 0 and "FileVault is On" in out:
        return {"status": "encrypted"}
    return {"status": "not_encrypted"}

def check_os_updates():
    code, out, _ = safe_run(["softwareupdate", "-l"])
    if code == 0:
        if "No new software available" in out:
            return {"status": "up_to_date"}
        if "recommended" in out.lower():
            return {"status": "updates_available"}
    return {"status": "unknown"}

def check_antivirus():
    av_paths = [
        "/Applications/Sophos/",
        "/Applications/Symantec/",
        "/Applications/Kaspersky/",
        "/Applications/McAfee/",
        "/Applications/ClamXAV.app",
        "/Applications/Intego VirusBarrier.app"
    ]
    
    for path in av_paths:
        if Path(path).exists():
            return {"status": "found"}
    
    # Check for built-in XProtect
    xprotect = "/Library/Apple/System/Library/CoreServices/XProtect.bundle"
    if Path(xprotect).exists():
        return {"status": "found"}
        
    return {"status": "not_found"}

def check_sleep():
    code, out, _ = safe_run(["pmset", "-g"])
    if code == 0:
        for line in out.splitlines():
            if "sleep" in line.lower() or "idle" in line.lower():
                try:
                    # Extract number of minutes
                    minutes = int(''.join(c for c in line if c.isdigit()))
                    return {"status": "compliant" if 0 < minutes <= 10 else "non_compliant"}
                except:
                    pass
    return {"status": "unknown"}

def gather_report():
    return {
        "machine_id": get_machine_id(),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "platform": "darwin",
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
    print("Starting macOS system health check...")
    report = gather_report()
    send_report(report)

if __name__ == "__main__":
    main()
