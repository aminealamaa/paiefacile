"use client";

import { useEffect } from 'react';
import Script from 'next/script';

interface MetaPixelProps {
  pixelId: string;
}

export function MetaPixel({ pixelId }: MetaPixelProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      // Initialize pixel
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    }
  }, [pixelId]);

  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      
      {/* Meta Pixel NoScript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Global Facebook Pixel interface
declare global {
  interface Window {
    fbq: (action: string, event: string, data?: Record<string, unknown>) => void;
  }
}

// Helper functions for tracking events
export const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};

export const trackCustomEvent = (eventName: string, data?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, data);
  }
};

// Specific conversion tracking functions for PaieFacile
export const trackDemoRequest = (formData: Record<string, unknown>) => {
  trackEvent('Lead', {
    content_name: 'Demo Request',
    content_category: 'Lead Generation',
    value: 0,
    currency: 'MAD'
  });
};

export const trackSignup = (userData: Record<string, unknown>) => {
  trackEvent('CompleteRegistration', {
    content_name: 'User Registration',
    content_category: 'User Acquisition',
    value: 0,
    currency: 'MAD'
  });
};

export const trackLogin = () => {
  trackEvent('Login', {
    content_name: 'User Login',
    content_category: 'User Engagement'
  });
};

export const trackPayrollGeneration = (payrollData: Record<string, unknown>) => {
  trackEvent('Purchase', {
    content_name: 'Payroll Generation',
    content_category: 'Core Feature Usage',
    value: 0,
    currency: 'MAD'
  });
};

export const trackEmployeeAdded = () => {
  trackEvent('AddToCart', {
    content_name: 'Employee Added',
    content_category: 'Feature Usage',
    value: 0,
    currency: 'MAD'
  });
};
