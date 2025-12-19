# 📚 Claude Code Documentation Tracker

[日本語](README.ja.md)

[![Fetch Docs](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml/badge.svg)](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Automatically fetch and track changes in Claude Code's official documentation using Git-based scraping.

## 🎯 Features

- 🔄 **Automated Updates**: 4 times daily (3:00, 9:00, 15:00, 21:00 JST)
- 📝 **Pure Markdown**: Direct storage from source
- 📊 **Git-based Tracking**: Complete change history
- 🗑️ **Full Sync**: Adds new docs, updates existing, removes deleted
- 🚀 **TypeScript**: Type-safe implementation
- ⚡ **Lightweight**: Minimal dependencies

## 🔍 How It Works

### System Architecture

```
1. Fetch Sources in Parallel
   ├── llms.txt (authoritative URL list)
   └── docs_map.md (titles and structure)

2. Merge & Dedupe
   ├── Combine both sources
   └── Remove duplicate URLs

3. Sync Local Files
   ├── Compare merged list with local files
   └── Delete orphaned files (not in sources)

4. Fetch Each Document
   ├── Direct Markdown fetch (no HTML conversion)
   ├── Add minimal frontmatter (title, source)
   └── Save to docs/en/[filename].md

5. Git Tracking
   ├── New files → "Added [file]"
   ├── Changed files → "Modified [file]"
   └── Deleted files → "Deleted [file]"
```

### Data Flow

```
┌─ llms.txt (authoritative) ─┐   ┌─ docs_map.md (titles) ─┐
│  48 URLs                   │   │  44 URLs + metadata    │
└────────────┬───────────────┘   └──────────┬─────────────┘
             └──────────┬─────────────────────┘
                        ↓
               [Merge & Dedupe: 48 docs]
                        ↓
              [Sync: Remove orphaned files]
                        ↓
             [Fetch: Get Markdown directly]
                        ↓
               [Git: Track all changes]
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `llms.txt` | Authoritative URL list (always up-to-date) |
| `docs_map.md` | Titles and structure (may become stale) |
| `mergeDocLists()` | Merge and dedupe both sources |
| `syncLocalFiles()` | Remove files not in merged list |
| `fetchDoc()` | Fetch and save individual docs |
| `metadata/` | Track statistics and failures |

## 🤖 Automation

Runs automatically at:
- **3:00 JST** (18:00 UTC)
- **9:00 JST** (0:00 UTC)
- **15:00 JST** (6:00 UTC)
- **21:00 JST** (12:00 UTC)

Manual trigger: Actions tab → "Run workflow"

## 📈 Statistics

Current success rate: **100%** (48/48 documents)

```json
{
  "totalDocs": 48,
  "successfulFetch": 48,
  "failedFetch": 0,
  "deletedFiles": 0
}
```

## 🛠️ Tech Stack

- `node-fetch` - HTTP client
- `dotenv` - Environment variables
- TypeScript 5.3
- GitHub Actions

## 📝 License

MIT

## ⚠️ Known Limitations

- `claude_code_docs_map.md` may become stale (last observed: 2025-11-06)
- `llms.txt` is treated as the authoritative source for URLs
- Subdirectory paths (e.g., `sdk/migration-guide.md`) are supported

## ⚠️ Disclaimer

Unofficial tool. Not affiliated with Claude Code or Anthropic.

---

Made with ❤️ for the Claude Code community
