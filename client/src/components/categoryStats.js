

export const CategoryStats = ({category, correct_answers, total_answered, accuracy}) => {
    return (
        <>
            <h4>{category}</h4>
            <p>{Math.round(accuracy * 100)}% accuracy</p>
            <p>{correct_answers} / {total_answered} questions correct</p>
        </>
    )
}