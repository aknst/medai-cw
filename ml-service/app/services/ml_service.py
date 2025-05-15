from pathlib import Path
from typing import Optional

import joblib
import torch
from transformers import AutoTokenizer, RobertaForSequenceClassification


class MLService:
    _instance: Optional["MLService"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Initialize model components"""
        base_dir = Path(__file__).parent.parent
        model_dir = base_dir / "data" / "bert"

        self.tokenizer = AutoTokenizer.from_pretrained(model_dir)
        self.model = RobertaForSequenceClassification.from_pretrained(model_dir)
        self.model.eval()
        self.label_encoder = joblib.load(model_dir / "label_encoder_new.pkl")

    def predict(self, text: str) -> str:
        """Perform inference on input text"""
        text = text.lower()
        inputs = self.tokenizer(
            text, return_tensors="pt", truncation=True, padding=True, max_length=512
        )

        with torch.no_grad():
            outputs = self.model(**inputs)

        predicted_class = torch.argmax(outputs.logits, dim=1).item()
        return self.label_encoder.inverse_transform([predicted_class])[0]


ml_service = MLService()
