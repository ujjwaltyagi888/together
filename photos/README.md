# 📸 Photo Gallery Instructions

## How to Add Your Photos

1. **Add your photos** to this folder (`photos/`)
2. **Name them** as `photo1.jpg`, `photo2.jpg`, etc. (or any name you prefer)
3. **Update the paths** in `script.js` if you use different names

## Supported Formats
- JPG / JPEG
- PNG
- WebP

## Photo Tips for Best Results
- **Aspect ratio**: The frames have different sizes, so photos will be cropped to fit
- **Resolution**: At least 800x800 pixels recommended for crisp display
- **File size**: Keep under 2MB per photo for faster loading

## Current Frame Layout

| Frame | Location | Size | Best For |
|-------|----------|------|----------|
| Photo 1 | Front wall (left) | Portrait | Vertical photos |
| Photo 2 | Front wall (center) | Landscape | Horizontal photos |
| Photo 3 | Front wall (right) | Portrait | Vertical photos |
| Photo 4 | Left wall (front) | Landscape | Horizontal photos |
| Photo 5 | Left wall (back) | Portrait | Vertical photos |
| Photo 6 | Right wall (front) | Landscape | Horizontal photos |
| Photo 7 | Right wall (back) | Portrait | Vertical photos |
| Photo 8 | Back wall (center) | Large Landscape | Feature photo! |

## Adding More Frames

To add more photos in the future, edit `script.js` and add a new entry to the `photoFrames` array:

```javascript
{
    photo: 'photos/photo9.jpg',
    position: { x: -2, y: 1.5, z: 4.9 },
    rotation: { x: 0, y: Math.PI, z: 0 },
    size: { width: 1.5, height: 2 },
    frameStyle: 'rose-gold'  // Options: 'rose-gold', 'wood', 'cream'
}
```

## Frame Styles Available
- **rose-gold**: Elegant pink metallic finish 💕
- **wood**: Classic warm wooden frame 🪵
- **cream**: Soft ivory/cream colored frame 🤍

---
Made with love 💕