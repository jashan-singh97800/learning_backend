#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT ..."

until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "   PostgreSQL not ready yet, retrying in 2s..."
  sleep 2
done

echo "✅ PostgreSQL is ready"

echo "🔄 Running migrations..."
node dist/run-migrations.js

echo "🚀 Starting server..."
exec node dist/main
