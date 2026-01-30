import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Hydration', value: 98, color: '#Cfb096' },
  { name: 'Elasticity', value: 85, color: '#1a1a1a' },
  { name: 'Brightness', value: 92, color: '#6b7280' },
];

export const ScienceSection: React.FC = () => {
  return (
    <section id="science" className="py-24 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        
        {/* Text Content */}
        <div className="flex-1">
          <span className="text-accent text-xs font-bold tracking-widest uppercase mb-2 block">Clinical Results</span>
          <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
            Backed by <br/> Data, Not Hype.
          </h2>
          <p className="text-secondary font-light mb-8 leading-relaxed">
            Our proprietary Magie Bio-Complex™ has been rigorously tested in double-blind clinical trials. 
            After 4 weeks of consistent use, participants reported significant improvements across key biomarkers of skin health.
          </p>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <span className="text-4xl font-serif block mb-1">24h</span>
              <span className="text-xs text-secondary uppercase tracking-wider">Moisture Lock</span>
            </div>
            <div>
              <span className="text-4xl font-serif block mb-1">100%</span>
              <span className="text-xs text-secondary uppercase tracking-wider">Clean Ingredients</span>
            </div>
          </div>
          
          <button className="text-sm border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors">
            View Full Clinical Report
          </button>
        </div>

        {/* Chart Visualization */}
        <div className="flex-1 w-full h-[400px] bg-surface p-8 rounded-sm">
          <h3 className="text-lg font-medium mb-6 text-center">Average Improvement (4 Weeks)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ backgroundColor: '#fff', borderColor: '#f3f4f6', fontSize: '12px' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </section>
  );
};