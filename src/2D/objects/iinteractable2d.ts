interface IInteractable {
	/**
	 * A type predicate. This is how we can check whether an object implements
	 * the IInteractable interface or not.
	 *
	 * Yes as far as I understand this is actually the proper way of doing this.
	 * Sometimes I really do not like typescript.
	 */
	isInteractable: () => void; //Type predicate

	/**
	 * A function that's called when the user points at, or points away from the object
	 * @param hover true if the user is pointing at the object, false if not
	 */
	hover(hover: boolean): void;

	/**
	 * A function that's called when a user clicks on the object.
	 */
	click(): void;
}
