import * as fs from 'node:fs'
import * as path from 'node:path'
import { exec } from 'node:child_process'

/**
 * Get the lifecycle stage from the filename
 * @returns {HookStage}
 */
function getLifecycleStage(lifecycleEventFileURL = import.meta.url) {
  const url = new URL(lifecycleEventFileURL)
  const filename = path.basename(url.pathname, '.js')
  const [stage] = filename.split('-')
  return stage
}

/**
 * @returns {HookData}
 */
function getParameters() {
  return JSON.parse(fs.readFileSync(0, { encoding: 'utf8' }))
}

/**
 * @param {HookEvent} event
 * @param {HookContext} context
 */
async function handler(event, context) {
  const { data, error } = event
  if (error) {
    console.error(error)
    process.exit(1)
  }
  const { command, environment } = data.amplify
  const stage = getLifecycleStage(context.url)
  const message = `${stage} ${command} ${environment.envName}`
  console.log(message)
  // try {
  //   await run(`git add .; git commit -m "${message}"`)
  // } catch (error) {
  //   if (error.cause.includes('nothing to commit')) {
  //     console.log('[autogit] Skipping, nothing to commit')
  //   } else {
  //     console.error(error)
  //     process.exit(1)
  //   }
  // }
}
