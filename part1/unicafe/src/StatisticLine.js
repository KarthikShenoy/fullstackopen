const StatisticLine = ({ lable, value, suffix }) => (
    <tr>
        <td>
            {lable}
        </td>
        <td>
            {value} {suffix}
        </td>
    </tr>
)
export default StatisticLine;