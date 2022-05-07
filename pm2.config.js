module.exports = {
  apps: [
    {
        name: 'emp-wechat',
        script: 'dist/server/main.js',
        exec_mode: 'cluster',
        max_memory_restart: '750M',
        out_file: 'log/out.log',
        error_file: 'log/error.log',
        merge_logs: true,
        log_date_format: "YYYY-MM-DD HH:mm Z",
        instances: 4,
        env: {
            NODE_ENV: 'prod',
        }
    }
  ]
}
