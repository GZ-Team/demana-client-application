import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  icons: {
    aliases,
    sets: {
      mdi
    }
  }
});
