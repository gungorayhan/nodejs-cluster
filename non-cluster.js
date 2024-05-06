const express = require('express');
const cluster = require("node:cluster");
const app = express();
const port = 5001;

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

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port} with process id ${process.pid} `)
);


// Example app listening at http://localhost:5001 with process id 15164 


// 30 connections
// 3 workers

// /
// ┌─────────┬────────┬────────┬─────────┬─────────┬───────────┬──────────┬─────────┐
// │ Stat    │ 2.5%   │ 50%    │ 97.5%   │ 99%     │ Avg       │ Stdev    │ Max     │
// ├─────────┼────────┼────────┼─────────┼─────────┼───────────┼──────────┼─────────┤
// │ Latency │ 300 ms │ 733 ms │ 4169 ms │ 4320 ms │ 737.63 ms │ 706.2 ms │ 4395 ms │
// └─────────┴────────┴────────┴─────────┴─────────┴───────────┴──────────┴─────────┘
// ┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────┬─────────┐
// │ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ 
// Stdev │ Min     │
// ├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────┼─────────┤
// │ Req/Sec   │ 37      │ 37      │ 40      │ 40      │ 39,3    │ 
// 1,19  │ 37      │
// ├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────┼─────────┤
// │ Bytes/Sec │ 9.78 kB │ 9.78 kB │ 10.6 kB │ 10.6 kB │ 10.4 kB │ 
// 313 B │ 9.77 kB │
// └───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────┴─────────┘

// Req/Bytes counts sampled once per second.
// # of samples: 30

// 423 requests in 10.11s, 104 kB read