

export const CategoryStats = ({category, correct_answered, total_answered, accuracy}) => {
    return (
        <>
            <h4>{category}</h4>
            <p>{Math.round(accuracy * 100)}% accuracy</p>
            <p>{correct_answered / total_answered}</p>
        </>
    )
}