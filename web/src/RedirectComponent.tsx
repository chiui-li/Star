import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface RedirectComponentProps {
  /**
   * The target path to redirect to
   */
  to: string;
  /**
   * Optional delay in milliseconds before redirecting
   */
  delay?: number;
  /**
   * Optional condition function to determine if redirect should occur
   */
  condition?: () => boolean | Promise<boolean>;
  /**
   * Optional callback function to execute before redirecting
   */
  onBeforeRedirect?: () => void | Promise<void>;
  /**
   * Optional callback function to execute after redirecting
   */
  onAfterRedirect?: () => void;
  /**
   * Optional message to display while redirecting
   */
  message?: string;
}

/**
 * A configurable redirect component that provides hooks for custom redirect logic
 */
export function RedirectComponent({
  to,
  delay = 0,
  condition,
  onBeforeRedirect,
  onAfterRedirect,
  message = 'Redirecting...'
}: RedirectComponentProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const performRedirect = async () => {
      try {
        // Check condition if provided
        if (condition) {
          const shouldRedirect = await condition();
          if (!shouldRedirect) {
            return;
          }
        }

        // Execute pre-redirect callback if provided
        if (onBeforeRedirect) {
          await onBeforeRedirect();
        }

        // Apply delay if specified
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Perform the actual navigation
        navigate({ to });

        // Execute post-redirect callback if provided
        if (onAfterRedirect) {
          onAfterRedirect();
        }
      } catch (error) {
        console.error('Redirect failed:', error);
        // You can add custom error handling logic here
      }
    };

    performRedirect();
  }, [to, delay, condition, onBeforeRedirect, onAfterRedirect, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div>{message}</div>
      {delay > 0 && (
        <div>Redirecting in {delay / 1000} seconds...</div>
      )}
    </div>
  );
}

// Example usage patterns for different scenarios:

/**
 * Example 1: Basic immediate redirect
 * <RedirectComponent to="/login" />
 */

/**
 * Example 2: Redirect with delay and custom message
 * <RedirectComponent
 *   to="/dashboard"
 *   delay={2000}
 *   message="Taking you to your dashboard..."
 * />
 */

/**
 * Example 3: Conditional redirect based on authentication
 * <RedirectComponent
 *   to="/login"
 *   condition={() => !isAuthenticated}
 *   onBeforeRedirect={() => localStorage.setItem('redirectFrom', window.location.pathname)}
 * />
 */

/**
 * Example 4: Complex redirect with multiple callbacks
 * <RedirectComponent
 *   to="/profile"
 *   condition={async () => {
 *     const userData = await fetchUserData();
 *     return userData?.needsProfileCompletion;
 *   }}
 *   onBeforeRedirect={async () => {
 *     await trackRedirectEvent('profile_completion_redirect');
 *   }}
 *   onAfterRedirect={() => {
 *     showNotification('Please complete your profile');
 *   }}
 * />
 */
