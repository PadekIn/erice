FROM oven/bun:1

WORKDIR /app

# Copy semua file project ke image
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile
RUN bun run build

EXPOSE 4444

# Jalankan aplikasi (ubah path kalau entry point bukan di dist/index.js)
CMD ["bun", "preview"]
