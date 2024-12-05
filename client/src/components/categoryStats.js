import { PercentageBar } from "./percentageBar"

export const CategoryStats = ({category, correct_answers, total_answered, accuracy}) => {
    console.log(category, correct_answers, total_answered, accuracy)
    let percentage = Math.round(accuracy * 100)
    return (
        <>
            <h2 className = "category">{category}</h2>
            <div className = "category-properties">
                <p>{percentage}% accuracy</p>
                <p>{correct_answers} / {total_answered} questions correct</p>
            </div>
            <PercentageBar percentage = {percentage} />
        </>
    )
}