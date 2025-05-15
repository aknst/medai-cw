import logging
from pathlib import Path

from sqlmodel import Session, select

from .database import engine
from .models import Recommendation

logger = logging.getLogger(__name__)


def load_initial_data():
    """Load initial recommendations from CSV file"""
    base_dir = Path(__file__).parent
    csv_path = base_dir / "data" / "gpt.csv"

    if not csv_path.exists():
        logger.warning("Initial data CSV file not found at %s", csv_path)
        return

    with Session(engine) as session, open(csv_path, encoding="utf-8") as file:
        for line_number, line in enumerate(file, 1):
            line = line.strip()
            if not line:
                continue

            try:
                label, data = line.split("$", 1)
                label = label.strip('"')
                data = data.replace("\\n", "\n").strip()

                # Check for existing recommendation
                existing = session.exec(
                    select(Recommendation).where(Recommendation.label == label)
                ).first()

                if existing:
                    continue

                recommendation = Recommendation(label=label, data=data)
                session.add(recommendation)
                session.commit()

            except ValueError as ve:
                logger.warning(
                    "Invalid line format at line %d: %s", line_number, str(ve)
                )
            except Exception as e:
                logger.error("Error processing line %d: %s", line_number, str(e))
                session.rollback()
