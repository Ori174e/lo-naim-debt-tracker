import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'
import { Debt } from '../../types/debt.types'

interface DebtChartProps {
    debtsAsLender: Debt[]
    debtsAsBorrower: Debt[]
}

export default function DebtChart({ debtsAsLender, debtsAsBorrower }: DebtChartProps) {
    // Aggregate data
    const data = [
        {
            name: 'Owed to You',
            amount: debtsAsLender.reduce((sum, d) => sum + (d.status !== 'SETTLED' ? d.remainingAmount : 0), 0),
            color: '#4ade80' // success-400
        },
        {
            name: 'You Owe',
            amount: debtsAsBorrower.reduce((sum, d) => sum + (d.status !== 'SETTLED' ? d.remainingAmount : 0), 0),
            color: '#f87171' // danger-400
        }
    ]

    if (data.every(d => d.amount === 0)) return null

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 h-[400px]">
            <h3 className="text-xl font-bold text-white mb-6">Debt Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8' }}
                        axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8' }}
                        axisLine={{ stroke: '#334155' }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: '#334155', opacity: 0.2 }}
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            borderColor: '#334155',
                            borderRadius: '8px',
                            color: '#f8fafc'
                        }}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={100}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
