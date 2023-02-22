module.exports = {
    apps: [
        {
            name: 'ldb',
            script: './src/main/server.js',
            watch: true,
            ignore_watch: ['logs'],
            instances: 1,
            log_file: 'logs/ldb.log',
            env: {
            },
            node_args: [
                '--max-old-space-size=512',
            ],
        },
    ],
};
