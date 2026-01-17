from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import date
import schemas
import models
from database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== EMPLOYEE ENDPOINTS ====================

@app.post("/api/employees", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    """Create a new employee"""
    try:
        # Check if employee_id already exists
        existing_emp = db.query(models.Employee).filter(
            models.Employee.employee_id == employee.employee_id
        ).first()
        if existing_emp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee ID '{employee.employee_id}' already exists"
            )
        
        # Check if email already exists
        existing_email = db.query(models.Employee).filter(
            models.Employee.email == employee.email
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email '{employee.email}' is already registered"
            )
        
        db_employee = models.Employee(**employee.model_dump())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee with this ID or email already exists"
        )

@app.get("/api/employees", response_model=list[schemas.Employee])
def get_employees(db: Session = Depends(get_db)):
    """Get all employees"""
    employees = db.query(models.Employee).order_by(models.Employee.id).all()
    return employees

@app.get("/api/employees/{employee_id}", response_model=schemas.Employee)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    """Get a specific employee"""
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    return employee

@app.delete("/api/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    """Delete an employee"""
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    db.delete(employee)
    db.commit()
    return None

# ==================== ATTENDANCE ENDPOINTS ====================

@app.post("/api/attendance", response_model=schemas.Attendance, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    """Mark attendance for an employee"""
    # Check if employee exists
    employee = db.query(models.Employee).filter(
        models.Employee.id == attendance.employee_id
    ).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {attendance.employee_id} not found"
        )
    
    # Check if attendance already marked for this date
    existing_record = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()
    if existing_record:
        # Update the existing record
        existing_record.status = attendance.status
        db.commit()
        db.refresh(existing_record)
        return existing_record
    
    # Create new attendance record
    db_attendance = models.Attendance(**attendance.model_dump())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@app.get("/api/attendance", response_model=list[schemas.AttendanceWithEmployee])
def get_all_attendance(
    employee_id: int = None,
    start_date: date = None,
    end_date: date = None,
    db: Session = Depends(get_db)
):
    """Get attendance records with optional filtering"""
    query = db.query(models.Attendance)
    
    if employee_id:
        # Verify employee exists
        employee = db.query(models.Employee).filter(
            models.Employee.id == employee_id
        ).first()
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID {employee_id} not found"
            )
        query = query.filter(models.Attendance.employee_id == employee_id)
    
    if start_date:
        query = query.filter(models.Attendance.date >= start_date)
    
    if end_date:
        query = query.filter(models.Attendance.date <= end_date)
    
    records = query.order_by(models.Attendance.date.desc()).all()
    return records

@app.get("/api/attendance/{employee_id}", response_model=list[schemas.Attendance])
def get_employee_attendance(employee_id: int, db: Session = Depends(get_db)):
    """Get attendance records for a specific employee"""
    # Check if employee exists
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    records = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).order_by(models.Attendance.date.desc()).all()
    return records

@app.get("/api/attendance/{employee_id}/summary")
def get_attendance_summary(employee_id: int, db: Session = Depends(get_db)):
    """Get attendance summary for an employee"""
    # Check if employee exists
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    records = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).all()
    
    present_count = sum(1 for r in records if r.status == models.AttendanceStatus.PRESENT)
    absent_count = sum(1 for r in records if r.status == models.AttendanceStatus.ABSENT)
    
    return {
        "employee_id": employee_id,
        "employee_name": employee.full_name,
        "total_records": len(records),
        "present_days": present_count,
        "absent_days": absent_count
    }

@app.get("/api/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get dashboard summary with overall statistics"""
    total_employees = db.query(models.Employee).count()
    total_attendance_records = db.query(models.Attendance).count()
    
    return {
        "total_employees": total_employees,
        "total_attendance_records": total_attendance_records
    }

@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "HRMS Lite API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
