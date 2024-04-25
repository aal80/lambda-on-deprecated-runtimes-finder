# lambda-on-deprecated-runtimes-finder

This repo contains sample code for finding Lambda functions running on deprecated and soon-to-be deprecated managed runtimes and prioritize their upgrades. The code is provided as-is for illustrational purposes only. 

## Important notes
1. The information about deprecated runtimes can be found in `runtimes.js` file. It is taken from the official [Lambda documentation page](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtimes-deprecated). While repo owner makes best effort to keep the deprecated runtimes list in the `runtimes.js` file up to date, always make sure you compare it to the official Lambda docs.  

4. The project uses following data sources to build reports
   * Lambda's `ListFunctions` API is used to retrieve the full list of functions in the account
   * CloudWatch Logs `DescribeLogStreams` API is used to retrieve the latest LogStream associated with each Lambda function to check the last activity timestamp and days since. 
   * CloudWatch Metrics `GetMetricStatistics` API is used to retrieve the count of Invocations reported in the last 14 days.

## Usage
1. Clone the repo, run `npm install`
2. Make sure you have [AWS CLI](https://aws.amazon.com/cli/) installed and configured to use the region/account you want to scan
3. Run the app with `npm start` or `node .`. The app will use region/account you have currently configured in the AWS CLI. 
4. The reports will be generated under `/reports` directory

## Reports

Reports are generated in the CSV format under `/reports` directory and include following properties

* NAME
* ARN
* RUNTIME
* IS_DEPRECATED
* IS_SOON_DEPRECATED
* DEPRECATION_DATE
* DAYS_SINCE_DEPRECATION (negative value if deprecation is in future)
* LAST_LOG_EVENT_TIMESTAMP
* DAYS_SINCE_LAST_LOG_EVENT
* INVOKES_IN_LAST_14_DAYS

