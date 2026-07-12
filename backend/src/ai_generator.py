import json
import os
from functools import lru_cache
from typing import Literal

from huggingface_hub import InferenceClient
from pydantic import BaseModel, Field, model_validator

DEFAULT_MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
MODEL_ID = os.getenv("CODEPREP_MODEL_ID", DEFAULT_MODEL_ID)


class ChallengeGenerationError(RuntimeError):
    """Raised when the provider cannot produce a valid challenge."""


class GeneratedChallenge(BaseModel):
    title: str = Field(min_length=10, max_length=500)
    options: list[str] = Field(min_length=4, max_length=4)
    correct_answer_id: int = Field(ge=0, le=3)
    explanation: str = Field(min_length=20, max_length=2_000)

    @model_validator(mode="after")
    def validate_options(self):
        normalized = [option.strip() for option in self.options]
        if any(not option or len(option) > 500 for option in normalized):
            raise ValueError("options must contain 1-500 characters")
        if len(set(normalized)) != 4:
            raise ValueError("options must be unique")
        self.options = normalized
        return self


@lru_cache(maxsize=1)
def get_inference_client() -> InferenceClient:
    token = os.getenv("HUGGINGFACE_TOKEN")
    if not token:
        raise ChallengeGenerationError("HUGGINGFACE_TOKEN is not configured")
    return InferenceClient(model=MODEL_ID, token=token, timeout=60)


def parse_challenge_response(raw_response: str) -> dict:
    start = raw_response.find("{")
    end = raw_response.rfind("}")
    if start < 0 or end <= start:
        raise ChallengeGenerationError("The provider did not return a JSON object")

    try:
        payload = json.loads(raw_response[start : end + 1])
        return GeneratedChallenge.model_validate(payload).model_dump()
    except (json.JSONDecodeError, ValueError) as exc:
        raise ChallengeGenerationError("The provider returned an invalid challenge") from exc


def build_messages(difficulty: Literal["easy", "medium", "hard"]) -> list[dict[str, str]]:
    return [
        {
            "role": "system",
            "content": (
                "Create one technically accurate multiple-choice coding interview challenge. "
                "Return only JSON with title, exactly four unique options, correct_answer_id "
                "from 0 to 3, and a concise explanation. Easy covers fundamentals; medium covers "
                "data structures and common algorithms; hard covers systems, optimization, or "
                "advanced algorithms. Exactly one answer must be correct."
            ),
        },
        {"role": "user", "content": f"Generate a {difficulty} challenge."},
    ]


def generate_challenge_with_llm(
    difficulty: Literal["easy", "medium", "hard"],
    client: InferenceClient | None = None,
) -> dict:
    active_client = client or get_inference_client()
    try:
        response = active_client.chat_completion(
            messages=build_messages(difficulty),
            max_tokens=700,
            temperature=0.6,
            top_p=0.9,
        )
        content = response.choices[0].message.content
    except ChallengeGenerationError:
        raise
    except Exception as exc:
        raise ChallengeGenerationError("The inference provider request failed") from exc

    if not isinstance(content, str) or not content.strip():
        raise ChallengeGenerationError("The inference provider returned an empty response")
    return parse_challenge_response(content)
