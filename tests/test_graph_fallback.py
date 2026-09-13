from graph import assess_node


def test_assess_node_falls_back_without_model_credentials():
    state = {"extracted_data": {"raw_text": "The fridge is empty and needs restocking", "fill_level": "low"}}

    result = assess_node(state, {})

    assert result["status"] == "critically_empty"
    assert "empty" in result["assessment_reasoning"].lower()
