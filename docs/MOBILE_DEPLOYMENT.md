# 📱 Mobile Deployment Guide

This guide covers deploying your Sprinkler Business App as native iOS and Android applications using Capacitor.

## 🚀 Prerequisites

### For Both Platforms

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Capacitor CLI** (already installed)

### For Android

- **Android Studio** (latest version)
- **Java Development Kit (JDK 17)**
- **Android SDK** (installed via Android Studio)

### For iOS

- **Xcode** (latest version)
- **macOS** (required for iOS development)
- **Apple Developer Account** (for distribution)

---

## 🤖 Android Deployment

### 1. Install Android Studio

```bash
# Download from: https://developer.android.com/studio
# Install Android Studio and SDK tools
```

### 2. Set Up Environment Variables

```bash
# Add to your ~/.zshrc or ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Install Java 17 (macOS with Homebrew)
brew install openjdk@17
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
```

### 3. Build and Sync

```bash
# Build the web assets
npm run build

# Sync to Android platform
npx cap sync android

# Open in Android Studio
npx cap open android
```

### 4. Configure Android App

#### **App Configuration** (`android/app/src/main/AndroidManifest.xml`)

Add these permissions:

```xml
<!-- Contact permissions -->
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.WRITE_CONTACTS" />

<!-- Network permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Location permissions (for GPS features) -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

#### **App Signing** (for Release)

1. Generate keystore:

```bash
keytool -genkey -v -keystore sprinkler-business-release.keystore -alias sprinkler-business -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure in `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('sprinkler-business-release.keystore')
            storePassword 'your_store_password'
            keyAlias 'sprinkler-business'
            keyPassword 'your_key_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 5. Build Release APK

```bash
# In Android Studio, or via command line:
cd android
./gradlew assembleRelease

# APK will be generated at:
# android/app/build/outputs/apk/release/app-release.apk
```

### 6. Testing on Device

```bash
# Run on connected device
npx cap run android

# Run on emulator
npx cap run android --target=emulator
```

---

## 🍎 iOS Deployment

### 1. Add iOS Platform

```bash
npx cap add ios
```

### 2. Build and Sync

```bash
# Build the web assets
npm run build

# Sync to iOS platform
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### 3. Configure iOS App

#### **App Configuration** (`ios/App/App/Info.plist`)

Add these permissions:

```xml
<!-- Contact permissions -->
<key>NSContactsUsageDescription</key>
<string>This app needs access to contacts to import customer information.</string>

<!-- Location permissions -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to help you navigate to customer locations.</string>

<!-- Camera permissions (for future features) -->
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to capture photos of work completed.</string>
```

#### **App Icons and Launch Screen**

1. Add app icons to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Configure launch screen in `ios/App/App/Base.lproj/LaunchScreen.storyboard`

### 4. Configure Apple Developer Account

1. Open Xcode
2. Go to **Signing & Capabilities**
3. Select your **Team** (Apple Developer Account)
4. Configure **Bundle Identifier**: `com.sprinklerbusiness.app`
5. Enable **Automatic Signing**

### 5. Build and Test

```bash
# Run on iOS Simulator
npx cap run ios --target=simulator

# Run on connected iOS device
npx cap run ios --target=device
```

### 6. Create Production Build

1. In Xcode, select **Product** → **Archive**
2. Choose **Distribute App**
3. Select **App Store Connect** for distribution
4. Follow the upload process

---

## 🔧 Development Workflow

### Regular Development Cycle

```bash
# 1. Make changes to your Vue app
# 2. Build the web assets
npm run build

# 3. Sync changes to native platforms
npx cap sync

# 4. Run on device/emulator
npx cap run android  # or ios
```

### Live Reload (Development)

```bash
# Start development server
npm run dev

# In another terminal, run with live reload
npx cap run android --livereload --external
npx cap run ios --livereload --external
```

---

## 📦 Distribution

### Android Distribution

**Google Play Store:**

1. Create Google Play Console account
2. Upload signed APK/AAB
3. Complete store listing
4. Submit for review

**Direct Distribution:**

- Share APK file directly
- Enable "Install from Unknown Sources" on device

### iOS Distribution

**App Store:**

1. Create App Store Connect account
2. Upload via Xcode or Application Loader
3. Complete app metadata
4. Submit for review

**TestFlight (Beta):**

1. Upload to App Store Connect
2. Create TestFlight build
3. Invite beta testers

---

## 🔍 Debugging

### Common Issues

#### **Android Build Errors**

```bash
# Clear build cache
cd android
./gradlew clean

# Rebuild
./gradlew assembleDebug
```

#### **iOS Build Errors**

```bash
# Clean build folder
npx cap sync ios
# In Xcode: Product → Clean Build Folder
```

#### **Plugin Issues**

```bash
# Update plugins
npm update @capacitor/core @capacitor/android @capacitor/ios

# Sync after updates
npx cap sync
```

### Useful Commands

```bash
# Check Capacitor configuration
npx cap doctor

# List available targets
npx cap run android --list
npx cap run ios --list

# View device logs
npx cap run android --consolelogs
npx cap run ios --consolelogs
```

---

## 🎯 App Store Optimization

### App Store Assets

- **App Icon**: 1024x1024 PNG
- **Screenshots**: Various device sizes
- **App Preview**: 30-second video (optional)
- **Keywords**: Sprinkler, Business, Customer Management
- **Description**: Focus on productivity and efficiency

### App Store Categories

- **Primary**: Business
- **Secondary**: Productivity

### Pricing Strategy

- **Free**: Basic customer management
- **Premium**: Advanced features (future expansion)

---

## 📊 Analytics and Monitoring

### Recommended Tools

- **Firebase Analytics**: User behavior tracking
- **Crashlytics**: Crash reporting
- **Performance Monitoring**: App performance metrics

### Implementation

```bash
# Install Firebase
npm install firebase
npm install @capacitor-firebase/analytics
npm install @capacitor-firebase/crashlytics

# Sync after installation
npx cap sync
```

---

## 🚀 Next Steps

1. **Test thoroughly** on both platforms
2. **Set up CI/CD** for automated builds
3. **Implement push notifications** for customer reminders
4. **Add offline capabilities** for field work
5. **Integrate with device features** (camera, GPS, etc.)

---

## 📞 Support

If you encounter issues:

1. Check [Capacitor Documentation](https://capacitorjs.com/docs)
2. Review [iOS](https://capacitorjs.com/docs/ios) and [Android](https://capacitorjs.com/docs/android) specific guides
3. Check platform-specific documentation (Xcode, Android Studio)

---

**Happy Deploying! 🎉**
