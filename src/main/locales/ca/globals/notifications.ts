export default {
    error: {
        default: 'Alguna cosa ha sortit malament.',
        unauthenticated: 'No hem pogut autoritzar la teva acció, si us plau inicia la teva sessió.',
        authentication: {
            'no-user': 'No s’ha trobat cap usuari amb la direcció de correu electrònic “{emailAddress}”.',
            'no-user-activation':
        'Encara no has activat el teu compte, si us plau revisa el teu correu electrònic.',
            'login-bad-credentials': 'No s’ha pogut iniciar sessió amb les dades proporcionades.',
            'login-no-customer':
        'Alguna cosa ha sortit malament durant el teu inici de sessió, si us plau contacta\'ns per resoldre el problema.',
            'login-no-subscription':
        'Alguna cosa ha sortit malament durant el teu inici de sessió, si us plau contacta\'ns per resoldre el problema.',
            'user-disabled':
        'El teu compte ha estat desactivat, si us plau contacta amb nosaltres si necessites més informació.',
            'venue-disabled':
        'L’establiment al que intentes accedir ha estat desactivat, si us plau contacta amb nosaltres si necessites més informació.',
            // TODO: Translate
            'bad-refresh-token': 'The given refresh-token is invalid.',
            // TODO: Translate
            'no-refresh-token': 'There was no refresh-token provided.',
            'save-user-preferences':
        'No s\'han pogut guardar les teves preferències. Intenta-ho de nou més tard.',
            'get-user-venue-not-found': 'No s\'ha trobat el teu establiment.',
            'get-user-venue-owner-not-found': 'No s\'ha trobat el propietari de l\'establiment.',
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
            'login-success': 'Benvingut!',
            // TODO: Translate
            'register-desktop-application': 'This application was successfully attached to your Demana account!'
        },
        'printer-configuration': {
            'save-success': 'La impresora se ha guardado con éxito!'
        }
    }
}
