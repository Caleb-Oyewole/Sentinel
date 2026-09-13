import os


def get_model():
    agentrouter_key = os.environ.get("AGENTROUTER_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    if agentrouter_key := os.environ.get("AGENTROUTER_API_KEY"):
        from strands.models.openai import OpenAIModel
        return OpenAIModel(
            client_args={
                "api_key": agentrouter_key,
                "base_url": "https://agentrouter.org/v1",
            },
            model_id=os.environ.get("AGENTROUTER_MODEL_ID", "gpt-4o-mini"),
        )

    if openai_key:
        from strands.models.openai import OpenAIModel
        return OpenAIModel(
             client_args={"api_key": openai_key},
             model_id=os.environ.get("OPENAI_MODEL_ID", "gpt-4o-mini"),
            params={"temperature": 0}, 
        )

    return None 
