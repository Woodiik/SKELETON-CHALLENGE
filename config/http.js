/**
 * HTTP server settings (sails.config.http)
 *
 * https://sailsjs.com/config/http
 */

const path = require('path');
const fs = require('fs');
const serveStatic = require('serve-static');

const distRoot = path.resolve(__dirname, '..', 'assets', 'dist');

// Vite emits a manifest at `assets/dist/.vite/manifest.json` with hashed
// filenames per entry. The layout reads it through `res.locals.viteAsset`
// to build the correct <script>/<link> tags for whatever the last build produced.
let cachedManifest = null;
function readManifest() {
  if (process.env.NODE_ENV === 'production' && cachedManifest) {
    return cachedManifest;
  }
  try {
    const raw = fs.readFileSync(path.join(distRoot, '.vite', 'manifest.json'), 'utf8');
    cachedManifest = JSON.parse(raw);
    return cachedManifest;
  } catch (err) {
    return {};
  }
}

const distStatic = serveStatic(distRoot, {
  index: false,
  immutable: true,
  maxAge: '1y'
});

module.exports.http = {

  middleware: {

    order: [
      'cookieParser',
      'session',
      'bodyParser',
      'compress',
      'poweredBy',
      'viteLocals',
      'distStatic',
      'router',
      'www',
      'favicon'
    ],

    distStatic: function(req, res, next) {
      if (!req.url.startsWith('/dist/')) return next();
      const original = req.url;
      req.url = req.url.replace(/^\/dist/, '') || '/';
      distStatic(req, res, function(err) {
        req.url = original;
        next(err);
      });
    },

    viteLocals: function(req, res, next) {
      const manifest = readManifest();
      res.locals.viteAsset = function(entryKey) {
        const chunk = manifest[entryKey];
        if (!chunk) {
          return '<!-- vite manifest is missing; run `npm --prefix frontend run build` -->';
        }
        let html = '';
        if (Array.isArray(chunk.css)) {
          for (const href of chunk.css) {
            html += `<link rel="stylesheet" href="/dist/${href}">`;
          }
        }
        html += `<script type="module" src="/dist/${chunk.file}"></script>`;
        return html;
      };
      next();
    }

  }

};
