# PyMacs Mobile Edition for Android (v4.2.0)

## Specifications
- **Package ID:** `org.pymacs.os`
- **Supported Android Versions:** Android 8.0 (API 26, Oreo) through Android 14 (API 34, Upside Down Cake)
- **Architectures:** `arm64-v8a`, `armeabi-v7a`, `x86_64`
- **Package File:** `pymacs-v4.2.0-android.apk`

## Installation via ADB
```bash
# Connect device or emulator
adb devices

# Install package directly
adb install -r pymacs-v4.2.0-android.apk

# Launch PyMacs application
adb shell am start -n org.pymacs.os/.MainActivity
```

## Sideloading via Mobile Browser
1. Download `pymacs-v4.2.0-android.apk` on your Android device.
2. In Settings > Security, enable "Install unknown apps" for your browser or file manager.
3. Tap the downloaded APK to install.
4. Launch PyMacs from your home screen or app drawer.
