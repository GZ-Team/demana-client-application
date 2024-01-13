import { Printer } from '@worker/models/printer';

export default class {
  async getSelectedPrinter(): Promise<Printer> {
    const selectedPrinterId = await window.api.getSelectedPrinter();
    return new Printer(selectedPrinterId);
  }

  async print(): Promise<void> {
    const selectedPrinter = await this.getSelectedPrinter();

    console.log('Printing is not implemented yet', { selectedPrinter });

    // await printer.printText('')
  }
}
