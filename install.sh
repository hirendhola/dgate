#!/bin/sh
set -e

REPO="hirendhola/dgate"
INSTALL_DIR="/usr/local/bin"

# Detect OS and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Linux*)
    BINARY="dgate-linux"
    ;;
  Darwin*)
    if [ "$ARCH" = "arm64" ]; then
      BINARY="dgate-macos-arm64"
    else
      BINARY="dgate-macos"
    fi
    ;;
  *)
    echo "Unsupported OS: $OS"
    echo "Download manually from https://github.com/$REPO/releases"
    exit 1
    ;;
esac

# Get latest release URL
LATEST=$(curl -s "https://api.github.com/repos/$REPO/releases/latest" \
  | grep "browser_download_url.*$BINARY" \
  | cut -d '"' -f 4)

if [ -z "$LATEST" ]; then
  echo "Could not find release. Check https://github.com/$REPO/releases"
  exit 1
fi

echo "Downloading dgate..."
curl -L "$LATEST" -o /tmp/dgate
chmod +x /tmp/dgate
mv /tmp/dgate "$INSTALL_DIR/dgate"

echo "✓ dgate installed to $INSTALL_DIR/dgate"
echo "  Run: dgate --help"
