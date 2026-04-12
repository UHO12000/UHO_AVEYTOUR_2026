## Agent Briefing

Guide for autonomous agents maintaining this Phaser seed project. Follow the playbook below before making modifications or responding to human prompts.

### Project Snapshot
- Technology: Phaser 3.55.2 via ESM import map inside `index.html`, rendered into the `#game` container.
- Purpose: This repository is a seed starter—copy it to kick off new Phaser projects, then customize scenes, assets, and layout to match the target game.
- Assets: URLs are defined in `consts/assets.json`. Use `Assets.js` (the exported `assetManager`) to initialize and load these assets; the helper `RemoteAssetLoader` can still be used to enqueue entries into the Phaser loader.

### Placeholder Policy
- The animated placeholder sprite exists only to prove the remote-loading pipeline; remove it (and its entry in `consts/assets.json`) once real art is available.
- Replace the placeholder texture, animation registration, and any references such as `PLACEHOLDER_TEXTURE_KEY`/`PLACEHOLDER_ANIM_KEY` as soon as production assets are ready.

### Critical Files
- `index.html`: Defines the import map, loads the WebP→sprite helper, and mounts the game.
- `main.js`: Application entry point, handles bootstrap + resize hooks.
 - `createGameConfig.js`: Produces Phaser configs and responsive viewport math.
 - `Assets.js` / `assetManager`: The canonical asset helper. Fetch `consts/assets.json`, call `assetManager.initCatalog(catalog)`, then use `assetManager.preload(scene)` or `assetManager.loadAndStore(scene)` to load and store assets. For placeholder WebP decoding, run the decoding before `initCatalog` and include decoded frames in the catalog if needed.
- `RemoteAsset.js` & `RemoteAssetLoader.js`: Declarative asset descriptors and utilities to enqueue assets into the Phaser loader.
- `BootScene.js`: Registers remote assets and placeholder animation, then hands off to Menu.
- `MenuScene.js`: UI-only scene with Play CTA wired to `PlayScene`.
- `PlayScene.js`: Interactive scene; responds to touch, pointer, and arrow keys while resizing sprites/fonts based on viewport.

### Scene Flow Recap
1. **BootScene**: Shows progress UI, registers assets from the manifest, and prepares the placeholder animation.
2. **MenuScene**: Displays the animated hero and a Play button (plays `clickSound`, transitions to Play).
3. **PlayScene**: Lets the user move the hero via pointer taps or cursor keys; listens for `Phaser.Scale.Events.RESIZE` to adjust physics bounds and UI copy.

### Change Procedure (for Agents)
1. Clarify the user goal and determine affected files.
2. Draft a lightweight plan (unless change is trivial) and keep only one in-progress step.
3. Modify files using `apply_patch` when editing single files; preserve ASCII and existing code style.
4. Keep user-facing text in English unless instructed otherwise.
5. After edits, self-review: re-open touched files, ensure no unintended diffs, and describe verification gaps in the final message.

### Updating Assets or Config
- **New remote asset**: Update `consts/assets.json`, then adjust `jsonToManifest()` or scene preload logic as needed. Ensure keys map to usage (e.g., `PLACEHOLDER_TEXTURE_KEY`).
- **Additional scenes**: Implement the scene, register it in `main.js` (`scenes: [...]` array) and wire any transitions from Menu/Play.
- **Responsive tweaks**: Centralize global behavior in `createGameConfig.js` or scene-specific `handleResize` hooks.

### Loading Remote Assets
1. Declare each resource in `consts/assets.json` with a unique `uuid`, `url`, and `type`.
2. At bootstrap, fetch `consts/assets.json`, convert/validate entries to the `assetManager` catalog shape and call `assetManager.initCatalog(catalog)`.
3. `BootScene` should fetch and initialize the catalog (see above), then hand the catalog to `RemoteAssetLoader` or call `assetManager.preload(scene)`/`assetManager.loadAndStore(scene)` to enqueue entries on the Phaser loader.
4. To add more files at runtime, use `RemoteAssetLoader.loadNow([...])` or call `assetManager.preload(scene)` with an updated catalog and then `loadAndStore` to persist references.

### Loading WebP Animations
1. Provide metadata (width, height, optional `frameRate`) for the WebP entry inside `consts/assets.json`.
2. Use `window.webPToSprite.loadSpriteSheet(url, options)` to convert the WebP into a sprite sheet (guard with a feature check). If you produce a decoded sprite sheet, add it to the texture cache and include the image key in the catalog passed to `assetManager.initCatalog(...)`.
3. Create animations with `this.anims.create(...)` or `this.anims.generateFrameNumbers(...)` against the texture key you registered.
4. Always guard the decoder with a feature check (`if (typeof window.webPToSprite?.loadSpriteSheet !== "function")`) and fall back to static imagery or alternative loading paths when absent.

### Quality & Testing Checklist
- Run the browser build (static server) whenever gameplay or asset loading changes.
- Validate console output: asset fetch failures, sprite sheet decoding, or Phaser loader errors should be actionable.
- Document noteworthy behaviors in this guide when new systems (e.g., shaders, new loaders) are added so future agents stay aligned.
