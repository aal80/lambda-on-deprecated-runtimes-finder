import { CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";
const cloudWatchClient = new CloudWatchClient();

class CloudwatchMetricsHelper{
    async injectInvocationMetrics(functions){
        console.log(`[CloudwatchMetricsHelper:injectInvocationMetrics] Processing ${functions.length} functions`);
        for (let i=0;i<functions.length;i++){
            const f = functions[i];
            console.log(`[CloudwatchMetricsHelper:injectInvocationMetrics] Processing function ${f.name} [${i+1}/${functions.length}]`);
            await this.processFunction(f);
        }
        console.log(`[CloudwatchMetricsHelper:injectInvocationMetrics] All done!`);
    }

    async processFunction(f){
        const input = {
            Namespace: 'AWS/Lambda',
            MetricName: 'Invocations',
            StartTime: new Date(Date.now()-86400*1000*14), //14 days ago
            EndTime: new Date(Date.now()),
            Period: 86400 * 14, // 14 days.
            Statistics: ['Sum'],
            Dimensions: [{
                Name: 'FunctionName',
                Value: f.name
            }]
        };

        const command = new GetMetricStatisticsCommand(input);
        try {
            const res = await cloudWatchClient.send(command);
            // console.log(res);
            if (res.Datapoints.length==0){
                f.invokesInLast14Days = 0;
            } else {
                f.invokesInLast14Days = res.Datapoints[0].Sum;
            }
        } catch (e){
            f.invokesInLast14Days = `ERR: ${e.message}`;
        }
    }

}

export default new CloudwatchMetricsHelper();

