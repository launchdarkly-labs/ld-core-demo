"""
Fetch two evaluations from the LD internal API and diff them.

Fill in WORKING_EVAL_ID and FAILING_EVAL_ID before running.
Run with: python diff_evals.py
"""

import json
import os
import sys
import requests

# ── Fill these in ──────────────────────────────────────────────────────────────
WORKING_EVAL_ID = "17366b80-0619-469e-9a2f-5cb6fc5ce6db"   # from the working playground's network trace
FAILING_EVAL_ID = "f59f1156-9d2e-45a2-9b7f-69f3369c8d5b"   # from your provisioning script output
# ──────────────────────────────────────────────────────────────────────────────

API_KEY     = os.environ.get("LD_API_KEY", "")
PROJECT_KEY = os.environ.get("LD_PROJECT_KEY", "")

if not API_KEY or not PROJECT_KEY:
    # fallback: load from .env in this directory or two levels up
    for env_path in [
        os.path.join(os.path.dirname(__file__), ".env"),
        os.path.join(os.path.dirname(__file__), "../../.env"),
        os.path.join(os.path.dirname(__file__), "../../../.env"),
    ]:
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, _, v = line.partition("=")
                        os.environ.setdefault(k.strip(), v.strip())
            API_KEY     = os.environ.get("LD_API_KEY", "")
            PROJECT_KEY = os.environ.get("LD_PROJECT_KEY", "")
            break

if not API_KEY:
    sys.exit("Error: LD_API_KEY not found. Set it in your environment or .env file.")
if not PROJECT_KEY:
    sys.exit("Error: LD_PROJECT_KEY not found. Set it in your environment or .env file.")
if not WORKING_EVAL_ID or not FAILING_EVAL_ID:
    sys.exit("Error: Fill in WORKING_EVAL_ID and FAILING_EVAL_ID at the top of this script.")

BASE_HEADERS = {"Authorization": API_KEY, "Content-Type": "application/json"}


def get_account_and_member_ids():
    res = requests.get("https://app.launchdarkly.com/api/v2/members/me", headers=BASE_HEADERS)
    res.raise_for_status()
    data = res.json()
    member_id = data.get("_id")
    account_id = None
    for key in ("_accountId", "accountId", "account_id"):
        if data.get(key):
            account_id = str(data[key])
            break
    if not account_id and isinstance(data.get("account"), dict):
        account_id = str(data["account"].get("_id") or data["account"].get("id") or "")
    return account_id, member_id


def get_project_internal_id():
    res = requests.get(
        f"https://app.launchdarkly.com/api/v2/projects/{PROJECT_KEY}",
        headers=BASE_HEADERS,
    )
    res.raise_for_status()
    return res.json().get("_id")


def fetch_evaluation(eval_id, internal_headers):
    url = f"https://app.launchdarkly.com/internal/projects/{PROJECT_KEY}/evaluations/{eval_id}"
    res = requests.get(url, headers=internal_headers)
    if res.status_code != 200:
        print(f"  Error fetching {eval_id}: HTTP {res.status_code}")
        print(f"  {res.text[:300]}")
        return None
    return res.json()


def diff_dicts(a, b, path=""):
    keys = sorted(set(a) | set(b))
    diffs = []
    for k in keys:
        full = f"{path}.{k}" if path else k
        if k not in a:
            diffs.append(f"  [only in FAILING]  {full} = {json.dumps(b[k])}")
        elif k not in b:
            diffs.append(f"  [only in WORKING]  {full} = {json.dumps(a[k])}")
        elif isinstance(a[k], dict) and isinstance(b[k], dict):
            diffs.extend(diff_dicts(a[k], b[k], full))
        elif a[k] != b[k]:
            diffs.append(f"  [differs]          {full}")
            diffs.append(f"    WORKING: {json.dumps(a[k])}")
            diffs.append(f"    FAILING: {json.dumps(b[k])}")
    return diffs


def main():
    print("Fetching account/member IDs...")
    account_id, member_id = get_account_and_member_ids()
    print(f"  account_id : {account_id}")
    print(f"  member_id  : {member_id}")

    print("Fetching project internal ID...")
    project_internal_id = get_project_internal_id()
    print(f"  project_id : {project_internal_id}")

    internal_headers = {
        "Content-Type": "application/json",
        "Authorization": API_KEY,
        "X-Ld-Accountid": account_id,
        "X-Ld-Mbrid": member_id,
        "X-Ld-Prjid": project_internal_id,
    }

    print(f"\nFetching WORKING eval  ({WORKING_EVAL_ID})...")
    working = fetch_evaluation(WORKING_EVAL_ID, internal_headers)

    print(f"Fetching FAILING eval  ({FAILING_EVAL_ID})...")
    failing = fetch_evaluation(FAILING_EVAL_ID, internal_headers)

    if working is None or failing is None:
        sys.exit("Could not fetch one or both evaluations — check IDs and permissions.")

    print("\n── WORKING eval (full) ───────────────────────────────────────────────────")
    print(json.dumps(working, indent=2))

    print("\n── FAILING eval (full) ───────────────────────────────────────────────────")
    print(json.dumps(failing, indent=2))

    print("\n── DIFF (working vs failing) ─────────────────────────────────────────────")
    diffs = diff_dicts(working, failing)
    if diffs:
        for d in diffs:
            print(d)
    else:
        print("  No differences found at the top level.")


if __name__ == "__main__":
    main()
