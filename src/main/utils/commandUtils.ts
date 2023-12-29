import { execSync } from 'child_process'

export function executeCommand(command: string, options: object): string {
  try {
    const result = execSync(command, options)

    return result.toString('utf-8')
  } catch (exception: unknown) {
    throw new Error(`Failed to execute command: ${command}: ${exception.message}`)
  }
}
