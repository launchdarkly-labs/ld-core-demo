"""Verify DemoBuilder.py (data-driven v2) produces the identical LDPlatform
call sequence as the original DemoBuilderv1.py.

Run from this directory after editing the demo_resources.py tables:
    python3 test_demobuilder_equivalence.py
"""
import ast, importlib.util, inspect, io, sys
from contextlib import redirect_stdout
from types import SimpleNamespace

sys.path.insert(0, ".")
import LDPlatform as ldp_current
import LDPlatformv1 as ldp_v1
REAL = ldp_current.LDPlatform  # used only for signature normalization

class Recorder:
    def __init__(self, *a, **k):
        object.__setattr__(self, "calls", [])
        object.__setattr__(self, "project_key", None)
    def __setattr__(self, k, v):
        object.__setattr__(self, k, v)
    def __getattr__(self, name):
        def f(*args, **kwargs):
            try:
                sig = inspect.signature(getattr(REAL, name))
                bound = sig.bind(None, *args, **kwargs)
                bound.apply_defaults()
                norm = {k: v for k, v in bound.arguments.items() if k != "self"}
            except (AttributeError, TypeError):
                norm = {"args": args, "kwargs": kwargs}
            self.calls.append((name, repr(norm)))
            if name == "get_pipeline_phase_ids":
                return {"test": "T", "guard": "G", "ga": "GA"}
            if name == "exp_metric":
                return {"key": args[0], "isGroup": args[1] if len(args) > 1 else kwargs.get("is_group", True)}
            return SimpleNamespace(status_code=201, text="{}", headers={})
        return f

ldp_current.LDPlatform = Recorder
ldp_v1.LDPlatform = Recorder

def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

v1 = load("DemoBuilderv1.py", "db_v1")
v2 = load("DemoBuilder.py", "db_v2")

def make(mod):
    b = mod.DemoBuilder("api-key", "e@x.com", "user-key", "proj", "Proj Name")
    b.project_created = True
    b.metrics_created = True
    b.metric_groups_created = True
    b.flags_created = True
    b.segments_created = True
    return b

ORCHESTRATORS = [
    "create_metrics", "create_metric_groups", "create_flags", "create_segments",
    "create_contexts", "create_and_run_experiments", "setup_release_pipeline",
]

failures = 0
for orch in ORCHESTRATORS:
    b1, b2 = make(v1), make(v2)
    with redirect_stdout(io.StringIO()):
        getattr(b1, orch)()
        c1 = list(b1.ldproject.calls)
        getattr(b2, orch)()
        c2 = list(b2.ldproject.calls)
    if c1 == c2:
        print(f"MATCH  {orch}: {len(c1)} identical LD API calls")
    else:
        failures += 1
        print(f"DIFF   {orch}: v1={len(c1)} calls, v2={len(c2)} calls")
        for i, (a, b) in enumerate(zip(c1, c2)):
            if a != b:
                print(f"  first diff at call {i}:\n    v1: {a}\n    v2: {b}")
                break
        if len(c1) != len(c2):
            longer, shorter = (c1, c2) if len(c1) > len(c2) else (c2, c1)
            print(f"    extra call: {longer[len(shorter)]}")

sys.exit(1 if failures else 0)
