import React from 'react';
import rd3 from 'react-d3-library';
import { getDatasets } from "../api/api";

class Statistics extends React.Component {
    state = {
        d3: []
    };

    componentDidMount() {
        getDatasets().then((data) => {
            this.formatData(data);
        }, (e) => {
            console.log('Error', e);
        });
    }

    const formatData = data => {
        data.forEach((d) => {
            const name = d.name; // will be used to name the dataset
            const rowCount = d.stats.row_count;
            if(d.stats.keys) {
                d.stats.keys.forEach((key) => {
                    if(key.distinct < 0) {
                        const distinct = - (key.distinct * rowCount);
                        const d3 = {
                            null_fraction: rowCount * key.null_fraction,
                            distinct,
                            duplicate: rowCount - (key.null_fraction + distinct),
                            name
                        };
                        this.setState({
                            d3: [
                                ...this.state.d3,
                                d3
                            ]
                        });
                    } else {
                        const distinct = key.distinct;
                        const d3 = {
                            null_fraction: rowCount * key.null_fraction,
                            distinct,
                            duplicate: rowCount - (key.null_fraction + distinct),
                            name
                        };
                        this.setState({
                            d3: [
                                ...this.state.d3,
                                d3
                            ]
                        });
                    }
                });
            }
        });
    };

    render() {
        const PieChart = rd3.PieChart;
        const { d3 } = this.state;

        // return (
        //     <div>
        //     {d3 ?
        //             <PieChart
        //             data={d3[0]}
        //             width={200}
        //             height={200}
        //             innerRadius={60}
        //             outerRadius={100}
        //         /> : <p>Loading</p>
        //     }
        //     </div>
        // );

        return (
            <table>
                <thead>
                <tr>
                    <th>Dataset #</th>
                    <th>Null</th>
                    <th>Distinct</th>
                    <th>Duplicate</th>
                </tr>
                </thead>
                <tbody>
                    {d3 && d3.map((dataset) => {
                        return (
                            <tr key={dataset.id}>
                                <td>{dataset.name}</td>
                                <td>{dataset.null_fraction}</td>
                                <td>{dataset.distinct}</td>
                                <td>{dataset.duplicate}</td>
                            </tr>
                        )
                    }}
                </tbody>
            </table>
        )
    }
}

export default Statistics;