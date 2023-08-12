import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Colors,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Colors,
    ChartDataLabels
);

ChartJS.defaults.scale.grid.display = false;

const options = {
    indexAxis: 'y' as const,
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
            ticks: {
                display: false,
            },
        },
    },
    responsive: false,
    plugins: {
        legend: {
            display: false,
        },
        datalabels: {
            display: true,
            color: 'white',
        },
    },
    maintainAspectRatio: false,
};

const HorizontalStackedBarChart = (props: any) => {
    if (props.legendUsage) {
        return (
            <Bar
                options={{
                    indexAxis: 'y' as const,
                    scales: {
                        x: {
                            stacked: true,
                            ticks: {
                                display: false,
                            },
                        },
                        y: {
                            stacked: true,
                            ticks: {
                                display: false,
                            },
                        },
                    },
                    responsive: false,
                    plugins: {
                        legend: {
                            position: 'top' as const,
                            align: 'start',
                        },
                        datalabels: {
                            display: true,
                            color: 'white',
                        },
                    },
                    maintainAspectRatio: false,
                }}
                data={{
                    labels: [props.title],
                    datasets: [
                        {
                            label: 'Belum Diperingati',
                            data: 0,
                            backgroundColor: ['rgb(34, 197, 94)'],
                        },
                        {
                            label: 'Diperingati',
                            data: 0,
                            backgroundColor: ['rgb(255, 99, 132)'],
                        },
                    ],
                }}
                height={60}
            />
        );
    }
    return (
        <Bar
            options={options}
            data={{
                labels: [props.title],
                datasets: [
                    {
                        label: `${props.label}`,
                        data: [props.data],
                        backgroundColor: ['rgb(34, 197, 94)'],
                    },
                    {
                        label: `${props.labelWarned}`,
                        data: [props.warnedData],
                        backgroundColor: ['rgb(255, 99, 132)'],
                    },
                ],
            }}
            height={60}
        />
    );
};

export default HorizontalStackedBarChart;
