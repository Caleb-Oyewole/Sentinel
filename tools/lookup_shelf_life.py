from strands import tool


SHELF_LIFE_DAYS = {
    "milk": 7,
    "apples": 28,
    "bread": 7,
    "rice": 365,
    "vegetables": 14,
}


@tool
def lookup_shelf_life(item: str) -> str:
    """Look up typical shelf life in days for a donated food item."""
    normalized_item = item.strip().lower()
    days = SHELF_LIFE_DAYS.get(normalized_item)
    if days is None:
        return f"No shelf-life reference is available for {item!r}; use the check-in evidence."
    return f"Typical shelf life for {normalized_item} is about {days} days when stored appropriately."