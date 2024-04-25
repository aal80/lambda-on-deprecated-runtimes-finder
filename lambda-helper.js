import Runtimes from './runtimes.js';

import { LambdaClient, ListFunctionsCommand } from "@aws-sdk/client-lambda";
const lambdaClient = new LambdaClient();

const MAX_ITEMS = 50;

class LambdaHelper{
    async buildFunctionLists(){
        console.log(`[LambdaHelper:buildFunctionLists] Retrieving functions list`);
        let isDone = false;
        let nextMarker = null;
        const allFunctionsList = [];
        const deprecatedFunctionsList = [];
        const soonToBeDeprecatedFunctionsList = [];
        const goodFunctionsList = [];

        while (!isDone){
            const listFunctionCommandInput = {
                FunctionVersion: "ALL",
                MaxItems: MAX_ITEMS
            };

            if (nextMarker) {
                listFunctionCommandInput['Marker'] = nextMarker;
            }

            const listFunctionsCommand = new ListFunctionsCommand(listFunctionCommandInput);

            console.log(`[LambdaHelper:buildFunctionLists] Sending ListFunctions request (${allFunctionsList.length} retrieved so far)`);
            const listFunctionsResponse = await lambdaClient.send(listFunctionsCommand);
            // console.log(listFunctionsResponse);

            if (listFunctionsResponse.Functions.length>0) {
                console.log(`[LambdaHelper:buildFunctionLists] Retrieved ${listFunctionsResponse.Functions.length} functions`);
                for (const f of listFunctionsResponse.Functions){
                    allFunctionsList.push({
                        name: f.FunctionName,
                        arn: f.FunctionArn,
                        runtime: f.Runtime,
                        logGroupName: f.LoggingConfig.LogGroup

                    });
                }
            }

            nextMarker = listFunctionsResponse.NextMarker || null;
            if (!nextMarker) isDone = true;
            // isDone = true;
        }
        console.log(`[LambdaHelper:buildFunctionLists] Finished retrieving functions list, total functions retrieved: ${allFunctionsList.length}`);

        console.log('[LambdaHelper:buildFunctionLists] Injecting runtime deprecation data');
        for (const f of allFunctionsList){
            const deprecationData = Runtimes.check(f.runtime);
            f.deprecated = deprecationData.deprecated;
            f.soonToBeDeprecated = deprecationData.soonToBeDeprecated;
            f.deprecationDate = deprecationData.deprecationDate;
            f.daysSinceDeprecation = deprecationData.daysSinceDeprecation;
            // console.log(f);

            if (f.deprecated) {
                deprecatedFunctionsList.push(f);
            } else if (f.soonToBeDeprecated){
                soonToBeDeprecatedFunctionsList.push(f);
            } else {
                goodFunctionsList.push(f);
            }
        }
        console.log('[LambdaHelper:buildFunctionLists] All done!');
        return {allFunctionsList, deprecatedFunctionsList, soonToBeDeprecatedFunctionsList, goodFunctionsList};
    }
}

export default new LambdaHelper();

