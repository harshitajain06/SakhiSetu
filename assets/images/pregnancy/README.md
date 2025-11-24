# Pregnancy Basics Images

This directory contains images for the "Pregnancy Basics" module, showing illustrations for each week of pregnancy (weeks 1-40).

## Required Images

Place the following images in this directory. Each image corresponds to a specific week of pregnancy:

### First Trimester (Weeks 1-12)
- `BABY WEEK 1.png` - Week 1: The Beginning
- `BABY WEEK 2.png` - Week 2: Ovulation
- `BABY WEEK 3.png` - Week 3: Conception & Implantation
- `BABY WEEK 4.png` - Week 4: Positive Test!
- `BABY WEEK 5.png` - Week 5: Early Development
- `BABY WEEK 6.png` - Week 6: Rapid Growth
- `BABY WEEK 7.png` - Week 7: Forming Features
- `BABY WEEK 8.png` - Week 8: Major Milestones
- `BABY WEEK 9.png` - Week 9: Moving Forward
- `BABY WEEK 10.png` - Week 10: Critical Period
- `BABY WEEK 11.png` - Week 11: Growing Strong
- `BABY WEEK 12.png` - Week 12: End of First Trimester

### Second Trimester (Weeks 13-27)
- `BABY WEEK 13.png` through `BABY WEEK 27.png`

### Third Trimester (Weeks 28-40)
- `BABY WEEK 28.png` through `BABY WEEK 40.png`

## Image Specifications

- **Format**: PNG (recommended) or JPG
- **Recommended size**: 800x600px or similar aspect ratio
- **File names**: Must match exactly as listed above (e.g., `BABY WEEK 1.png`, `BABY WEEK 2.png`, etc.)
- **Content**: Images should be relevant to the specific week's content (baby development, body changes, etc.)

## How to Add Images

1. Place your image files in this directory (`assets/images/pregnancy/`)
2. Make sure the file names match exactly (e.g., `BABY WEEK 1.png`)
3. Open `app/components/ContentIllustration.jsx`
4. Find the `pregnancyImages` object
5. Uncomment the corresponding `require()` line for the image you added

For example, if you add `BABY WEEK 1.png`, uncomment this line:
```javascript
'week_1': require('../../assets/images/pregnancy/BABY WEEK 1.png'),
```

## Notes

- If an image is not found, the app will display a placeholder with "Image not available"
- You can add images gradually - you don't need all 40 images at once
- Images will be displayed at 200px height with `contain` resize mode

