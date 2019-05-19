import React, {Component} from 'react';
import './employees-page.css';
// Library for parsing the csv files
import * as Papa from 'papaparse';
import * as moment from 'moment';

class Employees extends Component {

    constructor(props) {
        super(props);

        this.state = {
            csvFile: undefined,
            data: [],
            highestCouple: {}
        };

        this.updateData = this.updateData.bind(this);
    }

    handleChange = event => {
        this.setState({
            csvFile: event.target.files[0]
        });
    };

    /**
     * Import the csv
     * After the csv file is imported by the user, parse the data from csv to array
     */
    importCSV = () => {
        const csvFile = this.state.csvFile;
        Papa.parse(csvFile, {
            complete: this.updateData,
            header: true
        });
    };

    /**
     * Show the data added by the text file in the console
     *
     * @param result
     */
    updateData(result) {
        this.setState({
            data: result.data
        });

        console.log(this.state.data);
        this.checkSameProjects(this.state.data);
    }

    /**
     * Find the unique couples who worked on same projects
     *
     * @param employees
     */
    checkSameProjects = (employees) => {
        let couples = [];

        const uniqueEntriesOfEmployees = [...new Set(employees.map(employee => employee.EmpID))];

        for (let i = 0; i < uniqueEntriesOfEmployees.length - 1; i++) {
            for (let j = i + 1; j < uniqueEntriesOfEmployees.length; j++) {
                couples.push({
                    couple: [uniqueEntriesOfEmployees[i], uniqueEntriesOfEmployees[j]],
                    projects: {},
                    timeSpentTogether: 0
                });
            }
        }

        // Map the unique couple to find out if the workers worked on the same project
        couples.forEach(uniqueCouple => {
            employees.forEach(employeeEntry => {

                if (employeeEntry.EmpID === uniqueCouple.couple[0] || employeeEntry.EmpID === uniqueCouple.couple[1]) {

                    employeeEntry.DateFrom = moment(employeeEntry.DateFrom).format('MM/DD/YYYY');
                    employeeEntry.DateTo = employeeEntry.DateTo === 'NULL' ? employeeEntry.DateTo = moment().format('MM/DD/YYYY') : moment(employeeEntry.DateTo).format('MM/DD/YYYY');
                    if (!uniqueCouple.projects[employeeEntry.ProjectID]) {
                        uniqueCouple.projects[employeeEntry.ProjectID] = [employeeEntry];
                    } else {
                        uniqueCouple.projects[employeeEntry.ProjectID].push(employeeEntry);
                    }
                }
            })
        });

        couples.forEach(uniqueCouple => {
            Object.keys(uniqueCouple.projects).forEach(project => {
                if (uniqueCouple.projects[project].length > 1) {
                    let firstEmployee = uniqueCouple.projects[project][0];
                    let secondEmployee = uniqueCouple.projects[project][1];

                    let start = moment(firstEmployee.DateFrom) > moment(secondEmployee.DateFrom) ? moment(firstEmployee.DateFrom) : moment(secondEmployee.DateFrom);
                    let end = moment(firstEmployee.DateTo) > moment(secondEmployee.DateTo) ? moment(secondEmployee.DateTo) : moment(firstEmployee.DateTo);
                    let period = (moment(end) - moment(start)) / 1000 / 60 / 60 / 24;
                    if (period > 0) {
                        uniqueCouple.timeSpentTogether += Math.round(period)
                    }
                } else {
                    delete uniqueCouple.projects[project];
                }
            })
        });

        let maxValue = 0;
        let maxCouple;

        couples.forEach(couple => {
            if (couple.timeSpentTogether > 0 && couple.timeSpentTogether > maxValue) {
                maxValue = couple.timeSpentTogether;
                maxCouple = couple;
            }
        });

        console.log('Couple that worked longest together:', maxCouple);
        this.setState({highestCouple: maxCouple})
    }

    render() {
        return (
            < div className="row">
                < div className="col-sm-12 content-container">
                    < div className="row">
                        < div className="col-sm-6">
                            < div className="left-content">
                                < span className="title">Manage Employees </ span>
                                < span className="sub-title">Import file with users, projects they were working of and the time they spent. </ span>
                                < div className="input-wrapper">
                                    < input className="csv-input" type="file" name="file" placeholder={null}
                                            onChange={this.handleChange}/>
                                </ div>
                                < button className="upload-button" onClick={this.importCSV}>Upload now!</ button>
                            </ div>
                        </ div>
                        < div className="col-sm-6">
                            < img src={window.location.origin + "/assets/employees1.jpg"} className="employees"
                                  alt="employees"/>
                        </ div>
                    </ div>


                </ div>

                < div className="col-sm-12 results-container">
                    < div className="row">
                        < div className="col-sm-5">
                            < img src={window.location.origin + "/assets/two-workers.png"} className="workers"
                                  alt="workers"/>
                        </ div>
                        < div className="col-sm-7">
                            < div className="information-wrapper">
                                < span className="title">Working Together </ span>
                                < span className="sub-title">Check which two workers works together longest on same projects </ span>

                                < table>
                                    < thead>
                                    < tr>
                                        < th>First Worker ID:</ th>
                                        < th>Second Worker ID:</ th>
                                        < th>Project ID:</ th>
                                        < th>Time Spent:</ th>
                                    </ tr>
                                    </ thead>
                                    < tbody>
                                    < tr>
                                        < td> {this.state.highestCouple['couple'] ? this.state.highestCouple.couple[0] : 'upload file to check'} </ td>
                                        < td> {this.state.highestCouple['couple'] ? this.state.highestCouple.couple[1] : 'upload file to check'} </ td>
                                        < td> {this.state.highestCouple['projects'] ? Object.keys(this.state.highestCouple.projects).toString() : 'upload file to check'} </ td>
                                        < td> {this.state.highestCouple['timeSpentTogether'] ? this.state.highestCouple.timeSpentTogether : 'upload file to check'} </ td>
                                    </ tr>
                                    </ tbody>
                                </ table>
                            </ div>
                        </ div>
                    </ div>
                </ div>
            </ div>


        );
    }
}

export default Employees;

