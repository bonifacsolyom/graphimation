export function removeFromArray(arr: any[], value: any): any[] {
	var index = arr.indexOf(value);
    
	if (index == -1)
		throw new Error(
			`Could not remove element from array: Value ${value} not found.`
		);

	arr.splice(index, 1);
	return arr;
}
