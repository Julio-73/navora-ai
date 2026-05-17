from __future__ import annotations

import os
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / 'frontend'
BACKEND = ROOT / 'backend'


def clean_environment() -> dict[str, str]:
    env = dict(os.environ)

    # The Codex Windows shell can expose both PATH and Path. PowerShell's
    # process launcher treats them as duplicate keys, so keep the canonical one.
    if 'PATH' in env and 'Path' in env:
        env.pop('PATH')

    return env


def start_process(name: str, command: list[str], cwd: Path) -> int:
    log_file = cwd / f'{name}.log'
    error_file = cwd / f'{name}.err.log'
    create_breakaway_from_job = 0x01000000
    flags = (
        subprocess.DETACHED_PROCESS
        | subprocess.CREATE_NEW_PROCESS_GROUP
        | create_breakaway_from_job
    )

    stdout = log_file.open('ab')
    stderr = error_file.open('ab')

    process = subprocess.Popen(
        command,
        cwd=cwd,
        env=clean_environment(),
        stdin=subprocess.DEVNULL,
        stdout=stdout,
        stderr=stderr,
        creationflags=flags,
        close_fds=True,
    )

    return process.pid


def main() -> None:
    frontend_pid = start_process(
        'dev',
        [
            r'C:\Program Files\nodejs\npm.cmd',
            'run',
            'dev',
            '--',
            '--host',
            '127.0.0.1',
        ],
        FRONTEND,
    )

    backend_pid = start_process(
        'dev',
        [
            str(BACKEND / '.venv' / 'Scripts' / 'python.exe'),
            '-m',
            'uvicorn',
            'app.main:app',
            '--host',
            '127.0.0.1',
            '--port',
            '8000',
        ],
        BACKEND,
    )

    print(f'frontend_pid={frontend_pid}')
    print(f'backend_pid={backend_pid}')


if __name__ == '__main__':
    main()
