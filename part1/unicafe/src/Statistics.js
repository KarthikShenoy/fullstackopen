import StatisticLine from "./StatisticLine";
const Statistics = ({ good, neutral, bad }) => {
    const all = good + bad + neutral;
    const average = (good - bad) / all;
    const positive = (good / all) * 100;
    if (all === 0) {
        return (
            <div>
                <h1>statistics</h1>
                <div>No feedback given</div>
            </div>
        )
    }
    else {
        return <div>
            <h1>statistics</h1>
            <table>
                <tbody>
                    <StatisticLine lable='good' value={good} />
                    <StatisticLine lable='neutral' value={neutral} />
                    <StatisticLine lable='bad' value={bad} />
                    <StatisticLine lable='all' value={all} />
                    <StatisticLine lable='average' value={average} />
                    <StatisticLine lable='positive' value={positive} suffix='%' />
                </tbody>
            </table>

        </div>
    }
}
export default Statistics;