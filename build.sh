#!/usr/bin/env bash
set -e

# Render runs this as the build command and does not install dependencies for you,
# so the install has to happen here. Everything runs from the repo root: yarn
# workspaces have to be installed from the root, and the Next.js app is a workspace,
# so its .next/ lives in apps/web rather than next to this script's caller.
cd "$(dirname "$0")"

build_with_cache() {
  if [[ -d "$XDG_CACHE_HOME"/next ]]; then
    echo "Copying cached .next/cache"
    mkdir -p apps/web/.next
    rsync -a "$XDG_CACHE_HOME"/next/ apps/web/.next/cache
  else
    echo "No cached .next/cache found"
  fi

  echo "Building"

  yarn build

  echo "Done, caching .next/cache"
  rsync -a apps/web/.next/cache/ "$XDG_CACHE_HOME"/next
}

echo "Installing dependencies"
yarn install --frozen-lockfile

if [[ "$RENDER" ]]; then
  build_with_cache
else
  yarn build
fi
