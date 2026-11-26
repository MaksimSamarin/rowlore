"""Пакет backend Rowlore (бывший Analyzer).

Единый источник версии приложения (BUG-11). Используется и в `main.py` (FastAPI `version`),
и в `job_manager.py` (метаданные экспорта raw JSON). При релизе меняем **только** эту строку.
"""

__version__ = "2.3.0"
