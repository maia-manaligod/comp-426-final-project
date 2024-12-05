export const PercentageBar = ({ percentage }) => {
    console.log("percentage", percentage, percentage - .125, 100 - percentage - .125)
    return (
        <div style={{
            display: 'flex',
            height: '25px',
            width: '100%',
            borderRadius: '3px',
            backgroundColor: '#f0a5c3',
            overflow: 'hidden'
        }}>
            <div style={{
                width: `${percentage}%`,
                backgroundColor: '#75CCBB',
                borderRight: `${percentage != 100 ? "3px solid white" : ''}`
            }} />
            <div style={{
                width: `${100 - percentage}%`,
                backgroundColor: '#f0a5c3'
            }} />
        </div>
    );
};