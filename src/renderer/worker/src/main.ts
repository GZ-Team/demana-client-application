import PrinterService from './services/printerService';

import type { DemanaMessage } from 'types';

const printerService = new PrinterService();

window.api['@orders:new'](async () => {
  await printerService.print();
});

window.api['@messages:new'](async (message: DemanaMessage) => {
  if (message.target === 'worker' && message.content === 'test-printer') {
    await printerService.print();
  }
});
