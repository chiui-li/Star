// Redirect Logic Examples and Utilities
// This file provides examples and utility functions for configuring redirect behavior

import { RedirectComponentProps } from './RedirectComponent';

// Example 1: Authentication-based redirect logic
export const authRedirectLogic: Partial<RedirectComponentProps> = {
  condition: () => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('authToken') !== null;
    return !isAuthenticated; // Only redirect if not authenticated
  },
  onBeforeRedirect: () => {
    // Store the original destination for post-login redirect
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    console.log('Storing redirect destination:', window.location.pathname);
  },
  message: 'Please log in to continue...'
};

// Example 2: Role-based redirect logic
export const roleBasedRedirectLogic = (requiredRole: string): Partial<RedirectComponentProps> => ({
  condition: async () => {
    // Simulate fetching user roles
    const userRoles = await getUserRoles();
    return !userRoles.includes(requiredRole);
  },
  onBeforeRedirect: () => {
    console.log(`Access denied. Required role: ${requiredRole}`);
  },
  message: 'Insufficient permissions. Redirecting...'
});

// Example 3: Maintenance mode redirect
export const maintenanceRedirectLogic: Partial<RedirectComponentProps> = {
  condition: () => {
    const maintenanceMode = localStorage.getItem('maintenanceMode') === 'true';
    return maintenanceMode && window.location.pathname !== '/maintenance';
  },
  to: '/maintenance', // Redirect to maintenance page
  delay: 1000,
  message: 'System maintenance in progress...'
};

// Example 4: Geographic redirect logic
export const geoRedirectLogic = (allowedCountries: string[]): Partial<RedirectComponentProps> => ({
  condition: async () => {
    try {
      const country = await detectUserCountry();
      return !allowedCountries.includes(country);
    } catch (error) {
      console.warn('Geolocation failed, allowing access');
      return false;
    }
  },
  to: '/region-restricted',
  message: 'Content not available in your region'
});

// Example 5: Time-based redirect logic
export const timeBasedRedirectLogic = (startTime: string, endTime: string): Partial<RedirectComponentProps> => ({
  condition: () => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0];
    return currentTime < startTime || currentTime > endTime;
  },
  to: '/outside-hours',
  message: 'Access available only during specified hours'
});

// Utility function to get user roles (mock implementation)
async function getUserRoles(): Promise<string[]> {
  // In a real application, this would fetch from an API
  return ['user']; // Default role
}

// Utility function to detect user country (mock implementation)
async function detectUserCountry(): Promise<string> {
  // In a real application, this would use geolocation API
  return 'US'; // Default to US
}

// Example usage in a component:
/*
import { RedirectComponent } from './RedirectComponent';
import { authRedirectLogic } from './redirect-examples';

function ProtectedRoute() {
  return (
    <RedirectComponent
      to="/login"
      {...authRedirectLogic}
      // Override specific properties if needed
      delay={500}
    />
  );
}
*/

// Advanced: Composite redirect logic
export const createCompositeRedirect = (
  logics: Partial<RedirectComponentProps>[]
): Partial<RedirectComponentProps> => {
  return {
    condition: async () => {
      for (const logic of logics) {
        if (logic.condition) {
          const shouldRedirect = await logic.condition();
          if (shouldRedirect) return true;
        }
      }
      return false;
    },
    onBeforeRedirect: async () => {
      for (const logic of logics) {
        if (logic.onBeforeRedirect) {
          await logic.onBeforeRedirect();
        }
      }
    }
  };
};

// Example of composite usage:
/*
const compositeLogic = createCompositeRedirect([
  authRedirectLogic,
  maintenanceRedirectLogic
]);

<RedirectComponent
  to="/login"
  {...compositeLogic}
/>
*/
