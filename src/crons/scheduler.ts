import cron from "node-cron"
import cleanupOrphanedUpload from "./cleanupOrphanedUpload"

export function cronScheduler() {
  // Clean orphaned carousel images every day at 1am
  cron.schedule("0 1 * * *", async () => {
    try {
      await cleanupOrphanedUpload()
    } catch (error) {
      console.error(
        "Failed to run orphaned carousel images cleanup job:",
        error,
      )
    }
  })
}
