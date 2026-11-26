# Custom logo

Place `logo.png` or `logo.svg` in this directory as a local override. Rowlore uses the PNG first, then the SVG, then its built-in mark `frontend/public/rowlore-mark.svg`. A square image of at least 52×52 pixels looks best in the menu.

Compose mounts this directory in the frontend as read-only. Reload the page to see the new logo.

To change the tab icon, replace `frontend/public/rowlore-pixel-32.png` and rebuild the frontend. The full set of Rowlore marks is in [docs/brand](../docs/brand/).

```sh
docker compose up -d --build frontend
```
