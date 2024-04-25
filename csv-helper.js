import * as CsvWriter from 'csv-writer';
import {existsSync, mkdirSync} from 'fs';

const REPORTS_DIRECTORY_NAME = 'reports';

class CsvHelper{
    async write(reportName, records){
        if (!existsSync(REPORTS_DIRECTORY_NAME)){
            mkdirSync(REPORTS_DIRECTORY_NAME);
        }

        const csvWriter = CsvWriter.createObjectCsvWriter({
            path: `${REPORTS_DIRECTORY_NAME}/${reportName}.csv`,
            header: [
                {id: 'name', title: 'NAME'},
                {id: 'arn', title:'ARN'},
                {id: 'runtime', title: 'RUNTIME'},
                {id: 'deprecated', title: 'IS_DEPRECATED'},
                {id: 'soonToBeDeprecated', title: 'IS_SOON_DEPRECATED'},
                {id: 'deprecationDate', title: 'DEPRECATION_DATE'},
                {id: 'daysSinceDeprecation',title: 'DAYS_SINCE_DEPRECATION'},
                {id: 'lastLogEventTimestamp', title: 'LAST_LOG_EVENT_TIMESTAMP'},
                {id: 'daysSinceLastLogEvent', title: 'DAYS_SINCE_LAST_LOG_EVENT'},
                {id: 'invokesInLast14Days', title: 'INVOKES_IN_LAST_14_DAYS'}
            ]
        });

        csvWriter.writeRecords(records);
    }
}

export default new CsvHelper();