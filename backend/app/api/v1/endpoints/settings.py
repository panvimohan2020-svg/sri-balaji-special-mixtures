from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.settings import BusinessSetting
from app.core.rbac import (
    require_roles,
    log_admin_action,
    ROLE_SUPERADMIN
)
from app.models.user import User

router = APIRouter()


@router.get("/")
def get_all_settings(db: Session = Depends(get_db)) -> Dict[str, str]:
    """Public endpoint to fetch dynamic business settings (address, WhatsApp, FSSAI, timings)."""
    settings = db.query(BusinessSetting).all()
    return {s.key: s.value for s in settings}


@router.put("/{key}")
def update_setting(
    key: str,
    payload: Dict[str, str],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN]))
):
    """Admin-only endpoint to update a configuration key."""
    value = payload.get("value")
    if value is None:
        raise HTTPException(status_code=400, detail="Missing 'value' in payload")

    setting = db.query(BusinessSetting).filter(BusinessSetting.key == key).first()
    old_val = setting.value if setting else "None"
    if not setting:
        setting = BusinessSetting(key=key, value=value)
        db.add(setting)
    else:
        setting.value = value

    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="SETTING_UPDATED",
        entity="BusinessSetting",
        entity_id=key,
        details=f"Setting '{key}' updated from '{old_val}' to '{value}'"
    )

    return {"key": key, "value": value}
