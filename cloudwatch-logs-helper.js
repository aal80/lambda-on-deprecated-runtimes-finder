import { CloudWatchLogsClient, DescribeLogStreamsCommand } from "@aws-sdk/client-cloudwatch-logs";
const cloudWatchLogsClient = new CloudWatchLogsClient();

class CloudwatchLogsHelper{
    async injectLastLogEventData(functions){
        console.log(`[CloudwatchLogsHelper:injectLastLogEventData] Processing ${functions.length} functions`);
        for (let i=0;i<functions.length;i++){
            const f = functions[i];
            console.log(`[CloudwatchLogsHelper:injectLastLogEventData] Processing function ${f.name} [${i+1}/${functions.length}]`);
            await this.processFunction(f);
        }
        console.log(`[CloudwatchLogsHelper:injectLastLogEventData] All done!`);
    }

    async processFunction(f){
        const input = {
            logGroupName: f.logGroupName,
            orderBy: 'LastEventTime',
            limit: 1
        }

        const command = new DescribeLogStreamsCommand(input);
        try {
            const res = await cloudWatchLogsClient.send(command);
            if (res.logStreams.length===0){
                throw new Error('No log streams found');
            } else {
                const daysSinceLastEvent = parseInt((new Date() - res.logStreams[0].lastEventTimestamp)/1000/60/60/24);
                f.lastLogEventTimestamp = new Date(res.logStreams[0].lastEventTimestamp);
                f.daysSinceLastLogEvent = daysSinceLastEvent;
            }
        } catch(e){
            f.lastLogEventTimestamp = `ERR: ${e.message}`;
            f.daysSinceLastLogEvent = `ERR: ${e.message}`;
        }
        // console.log(f);
    }
}

export default new CloudwatchLogsHelper();
