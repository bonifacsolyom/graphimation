interface IInteractable {
    isInteractable: () => void; //Type predicate
    hover(hover:boolean): void;
    click(): void;
}