# @nervmouse/oneserve

A simple yet powerful static server with proxy capabilities and SPA history mode support.

## Installation

```bash
npm install @nervmouse/oneserve
# or globally
npm install -g @nervmouse/oneserve
```

## Usage

You can run it directly using the CLI:

```bash
# Using npx (recommended)
npx @nervmouse/oneserve

# If installed globally
serve
```

### Local Project Usage

If installed as a dependency in your project:

**In `package.json` scripts:**

```json
{
  "scripts": {
    "dev": "serve"
  }
}
```

**Using npx in project root:**

```bash
npx serve
```

## Configuration

`oneserve` can be configured via a `serve.cfg.json` file in the working directory or via environment variables.

### Configuration Options

| Option | Env Variable | Default | Description |
|:---|:---|:---|:---|
| `port` | `PORT` | `8000` | Port to listen on. |
| `api_url` | `API_URL` | `http://api.gov.tw` | Target URL for the API proxy. |
| `api_uri` | `API_URI` | `/api` | The base path to prepend to proxied requests on the target server. |
| `local_api_uri` | `LOCAL_API_URI` | `/api` | The local path prefix to intercept for proxying. |
| `mode` | `MODE` | `hash` | `hash` or `history`. Use `history` for SPA with client-side routing. |
| `root_dir` | `ROOT_DIR` | `./spa` | Directory containing static files to serve. |
| `index_path` | `INDEX_PATH` | `null` | Path to the index file (for history mode). Defaults to `root_dir/index.html`. |
| `auto_update` | N/A | `true` | Enables `/_oneserve/update` endpoint to trigger `git pull`. |
| `console_title` | `CONSOLE_TITLE` | Package Name | Title of the process. |

### Configuration File (`serve.cfg.json`) Example

Create a `serve.cfg.json` in your project root:

```json
{
  "port": 3000,
  "root_dir": "./dist",
  "mode": "history",
  "api_url": "http://backend-api.com",
  "local_api_uri": "/api/v1"
}
```

## Features

### Static File Serving
Serves static files from the specified `root_dir`.

### API Proxy
Proxies requests matching `local_api_uri` to `api_url`.
- Automatically handles `X-Forwarded-For` and `x-real-ip` headers.
- Maps `local_api_uri` + `path` to `api_url` + `api_uri` + `path`.

### SPA History Mode
If `mode` is set to `history`, any request that doesn't match a static file or the proxy path will serve the `index.html` (defined by `index_path` or default `root_dir/index.html`), allowing client-side routing to work.

### Auto Update
The server exposes `/_oneserve/update`. Accessing this endpoint will execute `git pull` in the server's root directory.
