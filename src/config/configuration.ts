
export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/stagedb',
    env: process.env.ENV || 'LOCAL'
});
