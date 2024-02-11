export default {
    error: {
        default: 'Something went wrong.',
        unauthenticated: 'We were unable to authorize your action, please login.',
        authentication: {
            'no-user': 'There was no user found with email address "{emailAddress}".',
            'no-user-activation': 'You didn\'t activate your account yet, please check your email.',
            'login-bad-credentials': 'Couldn\'t login with the given credentials.',
            'login-no-customer':
        'Something went wrong during your login. Please contact us to resolve this issue.',
            'login-no-subscription':
        'Something went wrong during your login. Please contact us to resolve this issue.',
            'user-disabled': 'Your account has been disabled, please contact us for more information.',
            'venue-disabled':
        'The venue you want to access has been disabled, please contact us for more information.',
            'bad-refresh-token': 'The given refresh-token is invalid.',
            'no-refresh-token': 'There was no refresh-token provided.',
            'save-user-preferences': 'Failed to save user preferences. Try again later.',
            'get-user-venue-not-found': 'Failed to find your venue.',
            'get-user-venue-owner-not-found': 'Failed to find the owner of your venue.',
            'login-expired-trial': 'The trial period of this venue is over.',
            'trial-expired': 'The trial period of this venue has expired. You\'ll be logged off.'
        }
    },
    success: {
        default: 'It worked!',
        authentication: {
            'login-success': 'Welcome back!'
        },
        venue: {
            'register-desktop-application': 'This application was successfully attached to your Demana account!'
        }
    }
}
