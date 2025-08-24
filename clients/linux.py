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
    code, out, _ = safe_run(["lsblk", "-o", "NAME,TYPE,MOUNTPOINT"])
    if code == 0:
        for line in out.splitlines():
            if "crypt" in line:
                return {"status": "encrypted"}
    return {"status": "not_encrypted"}

def check_os_updates():
    # Try apt first
    if Path("/usr/bin/apt").exists():
        code, out, _ = safe_run(["apt", "list", "--upgradable"])
        if code == 0:
            updates = [l for l in out.splitlines() if l and not l.startswith("Listing...")]
            return {"status": "updates_available" if updates else "up_to_date"}
    
    # Try dnf/yum
    if Path("/usr/bin/dnf").exists() or Path("/usr/bin/yum").exists():
        cmd = "dnf" if Path("/usr/bin/dnf").exists() else "yum"
        code, _, _ = safe_run([cmd, "check-update"])
        if code == 100:  # Special code for available updates
            return {"status": "updates_available"}
        if code == 0:
            return {"status": "up_to_date"}
    
    return {"status": "unknown"}

def check_antivirus():
    # Check for ClamAV
    services = ["clamav-daemon", "clamav-freshclam"]
    for service in services:
        code, out, _ = safe_run(["systemctl", "is-active", service])
        if code == 0 and "active" in out:
            return {"status": "found"}
    
    # Check for ClamAV binary
    if Path("/usr/bin/clamscan").exists():
        return {"status": "found"}
    
    return {"status": "not_found"}

def check_sleep():
    # Check GNOME power settings
    if Path("/usr/bin/gsettings").exists():
        code, out, _ = safe_run([
            "gsettings", "get", 
            "org.gnome.settings-daemon.plugins.power", 
            "sleep-inactive-ac-timeout"
        ])
        if code == 0:
            try:
                minutes = int(out.strip()) // 60
                return {"status": "compliant" if 0 < minutes <= 10 else "non_compliant"}
            except:
                pass
    return {"status": "unknown"}

def gather_report():
    return {
        "machine_id": get_machine_id(),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "platform": "linux",
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
    print("Starting Linux system health check...")
    report = gather_report()
    send_report(report)

if __name__ == "__main__":
    main()
