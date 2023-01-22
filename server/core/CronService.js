const CronJob = require("node-cron");
const moment = require("moment");
const { Vehicles, RecentActivations } = require("./DatabaseInitialization");
const { logger } = require("../config/logger");
exports.initScheduledJobs = () => {
    const scheduledJobFunction = CronJob.schedule("0 0 * * *", async () => {//every day at midnight
        try {
            logger.info('[SERVER] Elindult a CRON folyamat', {
                user: 'CronService',
                data: ''
            })
            const vehicles = await Vehicles.find({ isActive: true });
            for (vehicle of vehicles) {
                if (vehicle?.mot !== undefined) {
                    const difference = moment(vehicle?.mot).diff(moment(), 'days')
                    if (difference <= 31) {
                        const isRecentActivationExists = await RecentActivations.findOne({ vehicleId: vehicle._id, isActive: true, category: 'mot' })
                        if (!isRecentActivationExists) {
                            const vehiclePopulated = await Vehicles.findOne({ _id: vehicle._id }).populate('_manufacture').populate('_model')
                            await RecentActivations.create({
                                text: `Önnek a(z) ${vehiclePopulated._manufacture.manufacture} ${vehiclePopulated._model.model} (alvz.szm.:${vehiclePopulated.vin}) járművének a műszaki érényessége lejár egy hónapon belül!`,
                                vehicle: `${vehiclePopulated._manufacture.manufacture} ${vehiclePopulated._model.model}`,
                                vin: vehicle.vin,
                                userId: vehicle._userId,
                                vehicleId: vehicle._id,
                                expireDate: moment().add(30, 'days').format(),
                                category: "mot",
                            })
                        }
                    }
                }
            }


            const recentActivations = await RecentActivations.find({ isActive: true });
            for (recentActivation of recentActivations) {
                const createdDate = moment(recentActivation.date)
                const expireDate = moment(recentActivation.expireDate)
                const difference = expireDate.diff(createdDate, 'days')
                if (difference < 1) {
                    await RecentActivations.findOneAndUpdate({ _id: recentActivation._id }, { isActive: false })
                }
            }
        } catch (error) {
            logger.error('[SERVER] Hiba történt a CRON lefutási során!', {
                user: 'CronService',
                data: JSON.stringify(error)
            })
        }
    });

    scheduledJobFunction.start();
}