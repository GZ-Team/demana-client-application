import login from './login';

export default {
  printerConfiguration: {
    title: 'Ajustes de impresora',
    printerName: 'Nombre',
    paperWidth: 'Ancho del papel',
    margin: 'Margen',
    automatic: 'Imprimir nuevos pedidos automáticamente',
    actions: {
      delete: 'Eliminar impresora',
      save: 'Guardar',
      test: 'Test'
    }
  },
  preferences: {
    title: 'Preferencias',
    applicationLanguage: 'Idioma'
  },
  login
};
