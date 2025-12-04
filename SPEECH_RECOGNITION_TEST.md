# Speech Recognition Testing - Chrome/Edge Compatibility

## Overview

This document describes how to test the speech recognition functionality in WraithWeave for Chrome and Edge browser compatibility.

## Automated Tests

Run the automated test suite to verify speech recognition functionality:

```bash
npm run test:run
```

The test suite includes:
- **Browser Compatibility Tests**: Verify SpeechRecognition API availability
- **Recognition Lifecycle Tests**: Test starting, stopping, and state management
- **Speech Processing Tests**: Verify real-time speech result handling
- **Chrome/Edge Specific Tests**: Test browser-specific features
- **Error Recovery Tests**: Test graceful error handling

## Manual Testing

### 1. Test Page

Open `test-speech.html` in Chrome or Edge to manually test speech recognition:

```bash
# Start development server
npm run dev

# Then navigate to: http://localhost:5173/test-speech.html
```

### 2. Browser Requirements

**Chrome (Recommended):**
- Version 25+ (SpeechRecognition API)
- Microphone permissions required
- HTTPS or localhost required for security

**Edge:**
- Version 79+ (Chromium-based Edge with SpeechRecognition API)
- Legacy Edge uses webkitSpeechRecognition (automatically detected)
- Microphone permissions required

### 3. Test Scenarios

**Basic Functionality:**
1. Click "Start Recognition"
2. Say "Hello world" - should display transcript
3. Click "Stop Recognition" - should stop listening

**Interrupt Testing:**
1. Start recognition
2. Say "I am worried about my job" (Score: 2.75, should trigger interrupt)
3. Say "I am happy" (Score: 1.0, should not interrupt)
4. Say "I feel stressed and worried" (Should trigger interrupt)

## Integration Testing

### 1. Full Application Test

```bash
# Start the full application
npm run dev

# Navigate to: http://localhost:5173
```

Test the complete WraithWeave experience:
1. Click "🎙️ Speak Your Worry"
2. Speak emotional phrases to trigger interrupts
3. Verify horror effects and radio voice responses

### 2. Real-time Processing

The speech recognition system processes speech in real-time with:
- **Continuous Recognition**: `continuous: true`
- **Interim Results**: `interimResults: true` 
- **English US Language**: `lang: 'en-US'`

## Troubleshooting

### Common Issues

**"Speech Recognition not supported":**
- Ensure you're using Chrome 25+ or Edge 79+
- Check that you're on HTTPS or localhost
- Verify microphone permissions

**"Permission denied":**
- Grant microphone access when prompted
- Check browser settings for microphone permissions
- Ensure no other applications are using the microphone

**Recognition not starting:**
- Check browser console for errors
- Verify SpeechRecognition API is available
- Try refreshing the page

### Browser-Specific Notes

**Chrome:**
- Uses native `SpeechRecognition` API
- Best performance and accuracy
- Supports all features

**Edge (Chromium):**
- Uses `SpeechRecognition` API (same as Chrome)
- Full compatibility with Chrome implementation

**Edge (Legacy):**
- Uses `webkitSpeechRecognition` API
- Automatically detected and supported
- May have slightly different behavior

## Performance Verification

The speech recognition system is optimized for:
- **Low Latency**: Interrupt detection within 200ms
- **Real-time Processing**: Continuous speech monitoring
- **Memory Efficiency**: Singleton pattern prevents multiple instances
- **Error Recovery**: Graceful handling of API failures

## Security Considerations

- **Client-side Only**: No audio data transmitted to servers
- **No Storage**: Audio is not saved or cached
- **Permission-based**: Requires explicit user consent
- **HTTPS Required**: Secure context required for microphone access