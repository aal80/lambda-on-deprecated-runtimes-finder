import LambdaHelper from './lambda-helper.js'
import CloudwatchLogsHelper from "./cloudwatch-logs-helper.js";
import CloudwatchMetricsHelper from "./cloudwatch-metrics-helper.js";
import CsvHelper from "./csv-helper.js";

console.log('[Main] Retrieving functions lists');
const {
    allFunctionsList,
    deprecatedFunctionsList,
    soonToBeDeprecatedFunctionsList,
    goodFunctionsList
} = await LambdaHelper.buildFunctionLists();

console.log('[Main] Processing deprecatedFunctionsList');
await CloudwatchLogsHelper.injectLastLogEventData(deprecatedFunctionsList);
await CloudwatchMetricsHelper.injectInvocationMetrics(deprecatedFunctionsList);
CsvHelper.write('deprecatedFunctionsList', deprecatedFunctionsList);

console.log('[Main] Processing soonToBeDeprecatedFunctionsList');
await CloudwatchLogsHelper.injectLastLogEventData(soonToBeDeprecatedFunctionsList);
await CloudwatchMetricsHelper.injectInvocationMetrics(soonToBeDeprecatedFunctionsList);
CsvHelper.write('soonToBeDeprecatedFunctionsList', soonToBeDeprecatedFunctionsList);

console.log('[Main] All done!');
