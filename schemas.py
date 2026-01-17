from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from enum import Enum
from typing import Optional

class AttendanceStatus(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"

class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=20)
    full_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)

class Employee(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    employee_id: int = Field(..., gt=0)
    date: date
    status: AttendanceStatus

class Attendance(BaseModel):
    id: int
    employee_id: int
    date: date
    status: AttendanceStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class AttendanceWithEmployee(BaseModel):
    id: int
    employee_id: int
    date: date
    status: AttendanceStatus
    created_at: datetime
    employee: Optional[Employee] = None
    
    class Config:
        from_attributes = True

class ErrorResponse(BaseModel):
    detail: str
