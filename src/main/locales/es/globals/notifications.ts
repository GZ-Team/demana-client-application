export default {
    error: {
        default: 'Algo ha salido mal.',
        unauthenticated: 'No hemos podido autorizar tu acción, por favor inicia sesión.',
        authentication: {
            'no-user':
        'No hemos encontrado ningún usuario con la dirección de correo electrónico “{emailAddress}”.',
            'no-user-activation':
        'Todavía no has activado tu cuenta, por favor revisa tu correo electrónico.',
            'login-bad-credentials': 'No se ha podido iniciar sesión con los datos proporcionados.',
            'login-no-customer':
        'Algo salió mal durante tu inicio de sesión, contáctanos para resolver el problema.',
            'login-no-subscription':
        'Algo salió mal durante tu inicio de sesión, contáctanos para resolver el problema.',
            'user-disabled':
        'Tu cuenta ha sido deshabilitada, por favor contacta con nosotros para saber más.',
            'venue-disabled':
        'Este establecimiento ha sido deshabilitado, por favor contacta con nostros para saber más.',
            // TODO: Translate
            'bad-refresh-token': 'The given refresh-token is invalid.',
            // TODO: Translate
            'no-refresh-token': 'There was no refresh-token provided.',
            'save-user-preferences':
        'No se han podido guardar tus preferencias. Inténtalo de nuevo más tarde.',
            'get-user-venue-not-found': 'No se ha encontrado tu establecimiento.',
            'get-user-venue-owner-not-found': 'No se ha encontrado al propietario del establecimiento.',
            // TODO: Translate
            'login-expired-trial': 'The trial period of this venue is over.',
            // TODO: Translate
            'trial-expired': 'The trial period of this venue has expired. You\'ll be logged off.'
        }
    },
    success: {
    // TODO: Translate
        default: 'It worked!',
        authentication: {
            'login-success': '¡Bienvenido!'
        },
        venue: {
            // TODO: Translate
            'register-desktop-application': 'This application was successfully attached to your Demana account!'
        }
    }
}
