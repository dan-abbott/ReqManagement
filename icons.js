// Icon components
export const createIcon = (h) => {
    const Icon = ({ d, size = 24, ...props }) => h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        ...props
    }, typeof d === 'string' ? h('path', { d }) : d);

    return {
        Plus: ({ size }) => Icon({ size, d: 'M12 5v14M5 12h14' }),
        Link2: ({ size }) => Icon({ size, d: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'].map((d, i) => h('path', { key: i, d })) }),
        GitBranch: ({ size }) => Icon({ size, d: ['M6 3v12', h('circle', { key: 'c1', cx: 18, cy: 6, r: 3 }), h('circle', { key: 'c2', cx: 6, cy: 18, r: 3 }), h('path', { key: 'p', d: 'M18 9a9 9 0 0 1-9 9' })] }),
        MessageSquare: ({ size }) => Icon({ size, d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }),
        Edit2: ({ size }) => Icon({ size, d: 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' }),
        Trash2: ({ size }) => Icon({ size, d: ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M10 11v6', 'M14 11v6'].map((d, i) => h(d.includes('M') ? 'path' : 'line', { key: i, [d.includes('M') ? 'd' : 'x1']: d.includes('M') ? d : d.split(' ')[0], ...(d.includes(' ') && !d.includes('M') ? { y1: d.split(' ')[1], x2: d.split(' ')[2], y2: d.split(' ')[3] } : {}) })) }),
        Save: ({ size }) => Icon({ size, d: ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8'].map((d, i) => h(d.includes('M') ? 'path' : 'polyline', { key: i, [d.includes('M') ? 'd' : 'points']: d })) }),
        X: ({ size }) => Icon({ size, d: h('g', {}, [h('line', { key: 1, x1: 18, y1: 6, x2: 6, y2: 18 }), h('line', { key: 2, x1: 6, y1: 6, x2: 18, y2: 18 })]) }),
        ChevronRight: ({ size }) => Icon({ size, d: h('polyline', { points: '9 18 15 12 9 6' }) }),
        ChevronDown: ({ size }) => Icon({ size, d: h('polyline', { points: '6 9 12 15 18 9' }) }),
        Filter: ({ size }) => Icon({ size, d: h('polygon', { points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' }) }),
        Search: ({ size }) => Icon({ size, d: [h('circle', { key: 'c', cx: 11, cy: 11, r: 8 }), h('path', { key: 'p', d: 'm21 21-4.35-4.35' })] }),
        BarChart3: ({ size }) => Icon({ size, d: ['M3 3v18h18', 'M18 17V9', 'M13 17V5', 'M8 17v-3'].map((d, i) => h('path', { key: i, d })) }),
        PieChart: ({ size }) => Icon({ size, d: ['M21.21 15.89A10 10 0 1 1 8 2.83', 'M22 12A10 10 0 0 0 12 2v10z'].map((d, i) => h('path', { key: i, d })) }),
        TrendingUp: ({ size }) => Icon({ size, d: [h('polyline', { key: 1, points: '23 6 13.5 15.5 8.5 10.5 1 18' }), h('polyline', { key: 2, points: '17 6 23 6 23 12' })] }),
        CheckCircle: ({ size }) => Icon({ size, d: [h('path', { key: 1, d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }), h('polyline', { key: 2, points: '22 4 12 14.01 9 11.01' })] }),
        XCircle: ({ size }) => Icon({ size, d: [h('circle', { key: 1, cx: 12, cy: 12, r: 10 }), h('line', { key: 2, x1: 15, y1: 9, x2: 9, y2: 15 }), h('line', { key: 3, x1: 9, y1: 9, x2: 15, y2: 15 })] })
    };
};
