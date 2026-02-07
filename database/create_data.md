# AscortBali Database Setup

## Prerequisites
- PostgreSQL installed (`psql` available)
- Python 3 with `psycopg2` (`pip install psycopg2-binary`)

## Steps

### 1. Create the database
```bash
createdb ascortbali
```

### 2. Run the schema
```bash
psql ascortbali < schema.sql
```

### 3. Seed the data
Create and run a seed script that reads `page_output.json` and `page_images.json` and inserts everything into the database.

```bash
python3 seed.py
```

## Files
- `schema.sql` — PostgreSQL schema (providers + provider_images tables)
- `scrappers/page_scrapper/page_output.json` — provider profile data (134 entries)
- `scrappers/page_scrapper/page_images.json` — image URLs keyed as `IM_{ID}_{seq}` (1,524 entries)
