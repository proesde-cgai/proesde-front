const ConditionItem = ({ condition, breaches }) => {
	const conditionSelectedFound = () => {
		return !!breaches.find(breach => breach.idCondition === condition.id || Number(breach.id) === condition.id)
	}

	return (
		<option value={condition.id} disabled={conditionSelectedFound()}>
			{condition.description}
		</option>
	);
};


export default ConditionItem;