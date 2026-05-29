# Test Video Hero Section

## How to Test:

1. **Go to Admin Panel** (`/admin`)
2. **Navigate to "Hero Section" tab**
3. **Enable "Show Hero Section"** checkbox
4. **Select "Video" as Hero Type**
5. **Add a video URL** in one of these formats:

### Test Video URLs (Free to use):

```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
```

```
https://www.w3schools.com/html/mov_bbb.mp4
```

6. **Click "Save Hero Settings"**
7. **Go to Home Page** (`/`)

## Expected Result:
- Video should autoplay, loop, and be muted
- Video should cover the full hero section
- Title and subtitle should appear over the video
- Overlay color should be visible if enabled

## Current Video Settings:
- `autoPlay`: Yes
- `muted`: Yes (required for autoplay)
- `loop`: Yes
- `object-fit`: cover

## If Video Doesn't Work:
1. Check browser console for errors
2. Verify video URL is accessible
3. Try different video format (MP4 recommended)
4. Check if browser blocks autoplay
5. Ensure video file size is reasonable (<50MB)
