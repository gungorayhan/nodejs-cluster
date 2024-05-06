const express = require('express');
const app = express();
const port = 5001;
const cluster = require('node:cluster');
const {availableParallelism} = require('node:os');

const numCPUs = availableParallelism();

const startServer = () => {
    app.get('/', (req, res) => {
        console.time('Request received');
        const baseNumber = 7;
        let result = 0;
        for (let i = Math.pow(baseNumber, 7); i >= 0; i--) {
            result += Math.atan(i) * Math.tan(i);
        }
        res.send({
            result
        })
        console.log(`Process: ${process.pid} finished the request`)
        console.timeEnd('Request received');
    });
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port} with process id ${process.pid} and thread id ${cluster.worker.id}`);
    });
}

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    startServer();
}


// Example app listening at http://localhost:5001 with process id 23592 and thread id 3
// Example app listening at http://localhost:5001 with process id 26104 and thread id 1
// Example app listening at http://localhost:5001 with process id 9096 and thread id 5
// Example app listening at http://localhost:5001 with process id 18844 and thread id 7
// Example app listening at http://localhost:5001 with process id 25684 and thread id 2
// Example app listening at http://localhost:5001 with process id 1432 and thread id 6
// Example app listening at http://localhost:5001 with process id 21376 and thread id 4
// Example app listening at http://localhost:5001 with process id 24160 and thread id 8



// 30 connections
// 3 workers

// -
// ┌─────────┬───────┬────────┬────────┬────────┬───────────┬───────────┬─────────┐
// │ Stat    │ 2.5%  │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev     │ Max     │
// ├─────────┼───────┼────────┼────────┼────────┼───────────┼───────────┼─────────┤
// │ Latency │ 50 ms │ 137 ms │ 223 ms │ 528 ms │ 144.85 ms │ 127.78 ms │ 2626 ms │
// └─────────┴───────┴────────┴────────┴────────┴───────────┴───────────┴─────────┘
// ┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
// │ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ 
// Stdev   │ Min     │
// ├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
// │ Req/Sec   │ 190     │ 190     │ 204     │ 226     │ 205,6   │ 
// 10,37   │ 190     │
// ├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
// │ Bytes/Sec │ 50.2 kB │ 50.2 kB │ 53.9 kB │ 59.7 kB │ 54.3 kB │ 
// 2.74 kB │ 50.2 kB │
// └───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

// Req/Bytes counts sampled once per second.
// # of samples: 30

// 2k requests in 10.08s, 543 kB read