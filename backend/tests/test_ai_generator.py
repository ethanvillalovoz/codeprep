from types import SimpleNamespace

import pytest
from src.ai_generator import (
    ChallengeGenerationError,
    build_messages,
    generate_challenge_with_llm,
    parse_challenge_response,
)

VALID_PAYLOAD = """
Here is the requested challenge:
{
  "title": "Which data structure provides FIFO ordering?",
  "options": ["Stack", "Queue", "Heap", "Tree"],
  "correct_answer_id": 1,
  "explanation": "A queue removes elements in the same order in which they were inserted."
}
"""


def test_parse_challenge_response_validates_provider_json():
    challenge = parse_challenge_response(VALID_PAYLOAD)

    assert challenge["correct_answer_id"] == 1
    assert challenge["options"] == ["Stack", "Queue", "Heap", "Tree"]


@pytest.mark.parametrize(
    "raw_response",
    [
        "not json",
        '{"title":"Too short"}',
        '{"title":"A sufficiently long challenge title","options":["A","A","B","C"],'
        '"correct_answer_id":0,"explanation":"This explanation is long enough to validate."}',
    ],
)
def test_parse_challenge_response_rejects_malformed_output(raw_response):
    with pytest.raises(ChallengeGenerationError):
        parse_challenge_response(raw_response)


def test_generate_challenge_uses_hosted_client():
    response = SimpleNamespace(
        choices=[SimpleNamespace(message=SimpleNamespace(content=VALID_PAYLOAD))]
    )

    class FakeClient:
        def __init__(self):
            self.kwargs = None

        def chat_completion(self, **kwargs):
            self.kwargs = kwargs
            return response

    client = FakeClient()
    challenge = generate_challenge_with_llm("easy", client=client)

    assert challenge["title"].startswith("Which data structure")
    assert client.kwargs["temperature"] == 0.6
    assert build_messages("easy")[1]["content"] == "Generate a easy challenge."


def test_generate_challenge_wraps_provider_errors():
    class FailingClient:
        def chat_completion(self, **_kwargs):
            raise TimeoutError("provider timeout")

    with pytest.raises(ChallengeGenerationError, match="provider request failed"):
        generate_challenge_with_llm("hard", client=FailingClient())
