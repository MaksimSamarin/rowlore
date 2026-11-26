# Custom logo

Place `logo.png` or `logo.svg` in this directory as a local override. Rowlore uses the PNG first, then the SVG, then its built-in mark `frontend/public/rowlore-mark.svg`. A square image of at least 52×52 pixels looks best in the menu.

Compose mounts this directory in the frontend as read-only. Reload the page to see the new logo.

The tab icon is `frontend/public/rowlore-mark.svg` with the PNG fallback `frontend/public/rowlore-icon-32.png`. To change it, replace both files and rebuild the frontend.

```sh
docker compose up -d --build frontend
```
