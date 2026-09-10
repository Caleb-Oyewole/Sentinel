
import json
import os

from strands import tool

_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "shelf_life.json")

with open(_DATA_PATH, "r") as f:
    _SHELF_LIFE_DB = json.load(f)

# Maps common raw phrasing -> a canonical key in _SHELF_LIFE_DB.
# Extend this as real check-in data surfaces terms it doesn't catch yet.
_ALIASES = {
    "veggies": "root_vegetables",
    "vegetable": "root_vegetables",
    "vegetables": "root_vegetables",
    "greens": "leafy_greens",
    "spinach": "leafy_greens",
    "lettuce": "leafy_greens",
    "kale": "leafy_greens",
    "carrots": "root_vegetables",
    "potatoes": "root_vegetables",
    "onions": "root_vegetables",
    "strawberries": "berries",
    "orange": "citrus",
    "oranges": "citrus",
    "lemon": "citrus",
    "lemons": "citrus",
    "apple": "apples",
    "banana": "bananas",
    "chicken": "raw_poultry",
    "beef": "raw_red_meat",
    "pork": "raw_red_meat",
    "meat": "raw_red_meat",
    "cheese": "hard_cheese",
    "egg": "eggs",
    "rice": "dry_staples",       # unopened/dry by default; cooked rice should be tagged leftovers/cooked_grains_dish
    "pasta": "dry_staples",
    "beans": "dry_staples",
    "flour": "dry_staples",
    "leftover": "leftovers_general",
    "leftovers": "leftovers_general",
    "canned": "canned_goods",
    "cans": "canned_goods",
    "snacks": "packaged_snacks",
    "chips": "packaged_snacks",
}


def _resolve(item: str) -> tuple:
    """Returns (matched_category, matched: bool)."""
    normalized = item.strip().lower()
    if normalized in _SHELF_LIFE_DB:
        return normalized, True
    if normalized in _ALIASES:
        return _ALIASES[normalized], True
    return "unidentified", False


@tool
def lookup_shelf_life(item: str) -> str:
    """Look up typical shelf life in days for a donated food item.

    Call this for each item or freshness claim that needs verification.
    Never estimate shelf life yourself -- always use this tool's result.

    Args:
        item: item name or category as described in the check-in, e.g.
            "milk", "chicken", "leftover rice", "spinach". Unrecognized
            items fall back to a generic profile rather than erroring.

    Returns:
        A short description of typical fridge shelf life and the
        spoilage signals to watch for.
    """
    category, matched = _resolve(item)
    entry = _SHELF_LIFE_DB[category]
    days = entry["fridge_shelf_life_days"]
    signals = ", ".join(entry["spoilage_signals"])

    if not matched:
        return (
            f"No specific shelf-life reference is available for '{item}'; "
            f"treating as unidentified (assume ~{days} days, watch for: {signals}). "
            "Rely on the volunteer's freshness description for this item."
        )

    return (
        f"Typical shelf life for {item} ({category}, {entry['condition']}) "
        f"is about {days} days when refrigerated appropriately. "
        f"Spoilage signs to check for: {signals}."
    )


def list_categories() -> list:
    """All known categories -- useful for the intake node's extraction prompt."""
    return sorted(_SHELF_LIFE_DB.keys())


if __name__ == "__main__":
    # quick manual sanity check
    for test_item in ["milk", "apples", "rice", "chicken", "made_up_thing"]:
        print(test_item, "->", lookup_shelf_life(test_item))
