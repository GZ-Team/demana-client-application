// import { writeFileSync } from 'fs'

// const commands = {
//   windows: {
//     getAllPrinters: {
//       command: 'Get-CimInstance -ClassName Win32_Printer | ConvertTo-Json',
//       options: {
//         shell: 'powershell.exe'
//       }
//     }
//   }
// }

export default class {
  // async getAllPrinterDevices(): Promise<Array<PrinterDevice>> {
  //   try {
  //     const { command, options } = commands.windows.getAllPrinters
  //     const result = executeCommand(command, options)

  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const jsonPrinters = JSON.parse(result) as Array<any>

  //     const usbDevices = USB.findPrinter()

  //     writeFileSync(
  //       './usbDevices.json',
  //       JSON.stringify({
  //         usbDevices: { devices: usbDevices, count: usbDevices.length },
  //         jsonPrinters: { devices: jsonPrinters, count: jsonPrinters.length }
  //       })
  //     )

  //     return jsonPrinters.map(
  //       ({ DeviceID, Name, Default, PortName, PrinterStatus }) =>
  //         new PrinterDevice(DeviceID, Name, Default, PortName, PrinterStatus)
  //     )
  //   } catch (exception) {
  //     throw new Error(`Failed to get all printer devices: ${exception.message}`)
  //   }
  // }
}
