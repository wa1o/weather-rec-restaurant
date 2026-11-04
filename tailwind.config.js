const v = n => `rgb(var(--${n}) / <alpha-value>)`;
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                bg: v('bg'), surface: v('surface'), ink: v('ink'), muted: v('muted'),
                neon: '#D93829', gold: '#FFB74D', leaf: '#4A7C59', leafdk: '#2D4A3E', green: '#636E46'
            },
            fontFamily: { display: ['Marcellus', 'Optima', 'Candara', 'Georgia', 'serif'], body: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'] }
        }
    }
};
