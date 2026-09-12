import React from 'react'

export default function DataTable({ columns, data }) {
  return (
    <table style={{width:'100%',borderCollapse:'collapse'}}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} style={{textAlign:'left',padding:10,color:'var(--muted)',fontSize:13}}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr><td colSpan={columns.length} style={{padding:20}}>No records</td></tr>
        )}
        {data.map((row, idx) => (
          <tr key={idx} style={{borderTop:'1px solid #f3f4f6'}} className="data-row">
            {columns.map(col => (
              <td key={col.key} style={{padding:12}}>{col.render ? col.render(row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
