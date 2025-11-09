# Meta Pixel Setup for PaieFacile

## 🎯 Overview
This document explains how to set up Meta Pixel (Facebook Pixel) for conversion tracking on PaieFacile.

## 📋 Prerequisites
1. Facebook Business Manager account
2. Meta Pixel ID from Facebook Ads Manager
3. Access to environment variables configuration

## 🚀 Setup Instructions

### 1. Your Meta Pixel ID
Your Meta Pixel ID is: **1197510262295232**

This is already configured in the application. The pixel will automatically load on all pages when the environment variable is set.

### 2. Configure Environment Variables

#### For Local Development:
Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_META_PIXEL_ID=1197510262295232
```

#### For Production (Vercel):
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `NEXT_PUBLIC_META_PIXEL_ID`
   - **Value**: `1197510262295232`
   - **Environment**: Production, Preview, Development

### 3. Verify Installation
1. Install the [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
2. Visit your website
3. Check that the pixel is firing correctly

## 📊 Tracked Events

### 1. Demo Request (Lead Generation)
- **Event**: `Lead`
- **Trigger**: When user submits demo request form
- **Data**: User information, company details
- **Value**: 0 MAD (lead generation)

### 2. User Registration (Signup)
- **Event**: `CompleteRegistration`
- **Trigger**: When user creates account
- **Data**: User profile information
- **Value**: 0 MAD (user acquisition)

### 3. User Login (Engagement)
- **Event**: `Login`
- **Trigger**: When user logs in
- **Data**: Basic login information
- **Value**: N/A (engagement tracking)

### 4. Payroll Generation (Core Feature)
- **Event**: `Purchase`
- **Trigger**: When user generates payroll
- **Data**: Payroll details, employee information
- **Value**: 0 MAD (feature usage)

### 5. Employee Addition (Feature Usage)
- **Event**: `AddToCart`
- **Trigger**: When user adds new employee
- **Data**: Employee information
- **Value**: 0 MAD (feature usage)

## 🔧 Custom Events

### Available Tracking Functions:
```typescript
import { 
  trackEvent, 
  trackCustomEvent, 
  trackDemoRequest, 
  trackSignup, 
  trackLogin, 
  trackPayrollGeneration, 
  trackEmployeeAdded 
} from "@/components/MetaPixel";

// Track custom events
trackEvent('CustomEvent', { custom_data: 'value' });
trackCustomEvent('CustomEventName', { data: 'value' });
```

## 📈 Conversion Optimization

### 1. Create Custom Audiences
- **Demo Requesters**: Users who submitted demo requests
- **Registered Users**: Users who completed registration
- **Active Users**: Users who generated payroll
- **Feature Users**: Users who added employees

### 2. Set Up Conversion Campaigns
- **Lead Generation**: Target demo request conversions
- **User Acquisition**: Target registration conversions
- **Feature Adoption**: Target payroll generation conversions

### 3. Retargeting Campaigns
- **Abandoned Demo**: Users who visited but didn't submit demo
- **Inactive Users**: Users who registered but haven't used features
- **Feature Promoters**: Users who actively use the platform

## 🛠️ Testing

### 1. Test Events in Facebook Events Manager
1. Go to **Events Manager** → **Test Events**
2. Perform actions on your website
3. Verify events are being tracked

### 2. Use Facebook Pixel Helper
1. Install the Chrome extension
2. Visit your website
3. Check that all events fire correctly

### 3. Test Conversion Tracking
1. Submit a demo request
2. Create a user account
3. Generate payroll
4. Add an employee
5. Verify all events appear in Facebook Ads Manager

## 🔒 Privacy Considerations

### 1. GDPR Compliance
- Meta Pixel respects user privacy settings
- Users can opt-out through Facebook settings
- No personal data is shared beyond what's necessary

### 2. Data Retention
- Facebook retains pixel data for up to 2 years
- You can request data deletion through Facebook Business Manager

### 3. Cookie Consent
- Consider implementing cookie consent banner
- Allow users to opt-out of tracking

## 📊 Analytics Dashboard

### Key Metrics to Track:
1. **Conversion Rate**: Demo requests / Website visits
2. **Registration Rate**: Signups / Demo requests
3. **Feature Adoption**: Payroll generations / Active users
4. **User Engagement**: Login frequency / Feature usage

### Custom Conversions to Set Up:
1. **Demo Request Conversion**: Lead event
2. **Registration Conversion**: CompleteRegistration event
3. **Feature Usage Conversion**: Purchase event (payroll generation)
4. **Employee Management Conversion**: AddToCart event

## 🚨 Troubleshooting

### Common Issues:
1. **Pixel not firing**: Check environment variable configuration
2. **Events not appearing**: Verify pixel ID is correct
3. **Duplicate events**: Check for multiple pixel installations
4. **Missing data**: Ensure all required data is passed to tracking functions

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test with Facebook Pixel Helper
4. Check Facebook Events Manager for event delivery

## 📞 Support

For technical issues:
1. Check Facebook Business Help Center
2. Review Meta Pixel documentation
3. Contact Facebook Business Support

For PaieFacile-specific issues:
1. Check environment variable configuration
2. Verify tracking function implementations
3. Test with Facebook Pixel Helper
