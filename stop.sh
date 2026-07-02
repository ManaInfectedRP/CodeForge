#!/usr/bin/env bash
# Force-stop CodeForge's dev servers.
#
# On Windows, Ctrl+C on ./fastboot.sh often doesn't reach the actual server
# process: it's spawned several layers deep (bash -> npm.cmd -> concurrently
# -> npm.cmd -> tsx watch -> node), and Windows console control events don't
# reliably propagate through that many cmd.exe/npm.cmd wrappers, especially
# under Git Bash's pty. The result is an orphaned node process still holding
# the port. This script finds and kills whatever's actually listening.
set -uo pipefail

for port in 4000 5173; do
  pids=$(netstat -ano 2>/dev/null | grep -E ":$port[[:space:]]" | grep LISTENING | awk '{print $NF}' | sort -u)
  if [ -z "$pids" ]; then
    echo "port $port: nothing listening"
    continue
  fi
  for pid in $pids; do
    echo "port $port: stopping pid $pid"
    taskkill //PID "$pid" //F >/dev/null 2>&1 || true
  done
done
