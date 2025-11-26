import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import dayjs from 'dayjs'

function prepare(data, type){
  if (type === 'hourly') return data.map(d => ({ x: dayjs.unix(d.dt).format('HH:mm'), temp: Math.round(d.temp) }))
  return data.map(d => ({ x: dayjs.unix(d.dt).format('ddd'), temp: Math.round(d.temp.day || d.temp) }))
}

export default function TempChart({ data, type='hourly' }){
  const prepared = prepare(data, type)
  return (
    <div className="charts" style={{height:240}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={prepared}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#ff7300" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
