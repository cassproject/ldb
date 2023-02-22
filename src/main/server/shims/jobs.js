let CronJob = require('cron').CronJob;
const checkDiskSpace = require('check-disk-space').default;
const sendMail = require('./mailer.js').sendMail;

global.diskSpaceJob = new CronJob(
    '0 * * * * *', // Every minute
    async function() {
        try {
            let diskSpace = await checkDiskSpace(__dirname);
            let capacity = Math.round((diskSpace.free / diskSpace.size) * 100);
            if (capacity >= 75) { // 75% utilization
                await sendMail(`LDB Server`, 'Disk Space Warning', `The LDB Server at ${process.env.CASS_LOOPBACK || process.env.LOOPBACK} has reached ${capacity}% of disk capacity.`);
            }
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'LdbDiskSpaceJobError', e);
        }
    },
    null,
    true,
);
