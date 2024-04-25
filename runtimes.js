const DEPRECATION_DATES = {

    // Upcoming
    "nodejs16.x": new Date('2024-6-12'),
    "python3.8": new Date('2024-10-14'),
    "dotnet7": new Date('2024-5-13'),
    "dotnet6": new Date('2024-11-12'),

    // Deprecated
    "java8": new Date('2024-1-8'),
    "go1.x": new Date('2024-1-8'),
    "provided": new Date('2024-1-8'),
    "ruby2.7": new Date('2023-12-7'),
    "nodejs14.x": new Date('2023-12-4'),
    "python3.7": new Date('2023-12-4'),
    "dotnetcore3.1": new Date('2023-4-3'),
    "nodejs12.x": new Date('2023-03-31'),
    "python3.6": new Date('2022-07-18'),
    "dotnet5.0": new Date('2022-05-10'),
    "dotnetcore2.1": new Date('2022-1-5'),
    "nodejs10.x":new Date('2021-7-30'),
    "ruby2.5": new Date('2021-7-30'),
    "python2.7": new Date('2021-7-15'),
    "nodejs8.10": new Date('2020-3-6'),
    "nodejs4.3": new Date('2020-3-5'),
    "nodejs4.3-edge": new Date('2020-3-5'),
    "nodejs6.10": new Date('2019-8-12'),
    "dotnetcore1.0": new Date('2019-6-27'),
    "dotnetcore2.0": new Date('2019-5-30'),
    "nodejs": new Date('2016-10-31')
}

class Runtimes{
    check (runtime) {
        // console.log(`Checking runtime ${runtime}`);
        const response = {
            deprecated: false,
            soonToBeDeprecated: false,
            deprecationDate: null,
            daysSinceDeprecation: null
        }

        const deprecationDate = DEPRECATION_DATES[runtime];
        if (!deprecationDate) return response;

        const daysSinceDeprecation = parseInt((new Date() - deprecationDate)/1000/60/60/24);
        response.deprecationDate = deprecationDate;
        response.daysSinceDeprecation = daysSinceDeprecation;

        if (daysSinceDeprecation>=0){
            response.deprecated = true;
        } else {
            response.soonToBeDeprecated = true;
        }

        return response;
    }
}

export default new Runtimes();