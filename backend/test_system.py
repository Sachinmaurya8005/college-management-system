import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, {"error": err_body}

def run_tests():
    print("==================================================")
    print("STARTING END-TO-END VERIFICATION SUITE")
    print("==================================================")

    # 1. Test Public Endpoints
    print("\n1. Testing Public Endpoints...")
    public_endpoints = [
        "/public/home/",
        "/public/about/",
        "/public/location/",
        "/public/facilities/",
        "/public/gallery/",
        "/public/links/",
        "/public/fees/",
        "/public/courses/",
        "/public/faculty/",
        "/public/notices/",
        "/public/examinations/",
        "/public/timetable/",
    ]

    for ep in public_endpoints:
        status_code, data = make_request(ep)
        assert status_code == 200, f"Endpoint {ep} failed with status {status_code}: {data}"
        print(f"  [PASS] {ep} returned 200 OK")

    # 2. Test Role-Based Authentication
    print("\n2. Testing Role-Based Logins...")
    # Admin login
    status_code, admin_auth = make_request("/auth/login/", method="POST", data={
        "username": "admin@polytechnic.edu",
        "password": "admin123"
    })
    assert status_code == 200, f"Admin login failed: {admin_auth}"
    admin_token = admin_auth["access"]
    print("  [PASS] Admin Login successful (Role: admin)")

    # Teacher login
    status_code, teacher_auth = make_request("/auth/login/", method="POST", data={
        "username": "teacher@polytechnic.edu",
        "password": "teacher123"
    })
    assert status_code == 200, f"Teacher login failed: {teacher_auth}"
    print("  [PASS] Teacher Login successful (Role: teacher)")

    # Student login with enrollment number & password
    status_code, student_auth = make_request("/auth/login/", method="POST", data={
        "username": "E224412355001",
        "password": "student123"
    })
    assert status_code == 200, f"Student login failed: {student_auth}"
    student_token = student_auth["access"]
    print("  [PASS] Student Login with Enrollment Number successful (Role: student)")

    # Student login with enrollment number & DOB (Date of Birth)
    status_code, student_dob_auth = make_request("/auth/login/", method="POST", data={
        "username": "E224412355001",
        "password": "2004-05-14"
    })
    assert status_code == 200, f"Student login with DOB failed: {student_dob_auth}"
    print("  [PASS] Student Login with DOB (2004-05-14) successful")

    # 3. Test Student Self-Service & Strict Object-Level Privacy
    print("\n3. Testing Student Self-Service & Object-Level Privacy...")
    status_code, prof = make_request("/student-portal/my-profile/", token=student_token)
    assert status_code == 200, f"Student profile failed: {prof}"
    print(f"  [PASS] /student-portal/my-profile/ returned: {prof.get('full_name')} ({prof.get('roll_number')})")

    status_code, att = make_request("/student-portal/my-attendance/", token=student_token)
    assert status_code == 200, f"Student attendance failed: {att}"
    print(f"  [PASS] /student-portal/my-attendance/ returned: {att.get('overall_percentage')}% attendance")

    status_code, fees = make_request("/student-portal/my-fees/", token=student_token)
    assert status_code == 200, f"Student fees failed: {fees}"
    print(f"  [PASS] /student-portal/my-fees/ returned fee status: {fees.get('status')}")

    status_code, results = make_request("/student-portal/my-results/", token=student_token)
    assert status_code == 200, f"Student results failed: {results}"
    print(f"  [PASS] /student-portal/my-results/ returned results count: {len(results.get('results', []))}")

    # 4. Test Student Online Application Submission & Staff Resolution
    print("\n4. Testing Student Online Application & Resolution Flow...")
    new_app_data = {
        "subject": "Test Name Correction Verification",
        "category": "Personal Information Correction",
        "description": "Please verify name spelling on official portal."
    }
    status_code, app_res = make_request("/student-portal/my-applications/", method="POST", data=new_app_data, token=student_token)
    assert status_code == 201, f"Failed to submit application: {app_res}"
    app_id = app_res.get("id")
    print(f"  [PASS] Student submitted application {app_res.get('application_no')} (ID: {app_id})")

    # Staff / Admin reviews and approves application
    status_code, update_res = make_request(f"/students/applications/{app_id}/update_status/", method="POST", data={
        "status": "Approved",
        "staff_response": "Approved and verified with matriculation record.",
        "reviewed_by": "Er. R. C. Srivastava (Principal)"
    }, token=admin_token)
    assert status_code == 200, f"Staff application review failed: {update_res}"
    print(f"  [PASS] Staff updated application status to: {update_res.get('status')}")

    # 5. Test Admin Website Content Management (Add Fee Head & Add Link)
    print("\n5. Testing Admin Website Content Management (Fees & Links)...")
    fee_payload = {
        "branch": "Computer Science & Engineering",
        "academic_year": "2025-2026",
        "fee_type": "Specialized Lab Maintenance Fee",
        "amount": 2500,
        "notes": "Verified state fee head.",
        "is_published": True,
        "display_order": 1
    }
    status_code, fee_created = make_request("/admin/website/fees/", method="POST", data=fee_payload, token=admin_token)
    assert status_code == 201, f"Failed to create fee head: {fee_created}"
    print(f"  [PASS] Admin created fee head '{fee_created.get('fee_type')}' (ID: {fee_created.get('id')})")

    link_payload = {
        "title": "National Technical Education Portal",
        "description": "AICTE unified technical education services",
        "url": "https://www.aicte-india.org",
        "category": "Technical Education",
        "is_active": True,
        "display_order": 2
    }
    status_code, link_created = make_request("/admin/website/links/", method="POST", data=link_payload, token=admin_token)
    assert status_code == 201, f"Failed to create important link: {link_created}"
    print(f"  [PASS] Admin created important link '{link_created.get('title')}' (ID: {link_created.get('id')})")

    # 6. Test Teacher Staff Approval Request & Admin Approval Flow
    print("\n6. Testing Teacher Change Request & Admin Approval Flow...")
    approval_payload = {
        "request_type": "FEE_UPDATE",
        "student_name": "Rahul Verma",
        "roll_number": "E224412355001",
        "branch": "Computer Science & Engineering",
        "semester": 4,
        "description": "Fee update collection of Rs 12650",
        "payload": {
            "fee_status": "Paid",
            "paid_amount": 12650,
            "payment_mode": "Online UPI",
            "transaction_ref": "UPI-BTEUP-99210"
        }
    }
    status_code, req_created = make_request("/students/approval-requests/", method="POST", data=approval_payload, token=teacher_auth["access"])
    assert status_code == 201, f"Failed to create approval request: {req_created}"
    req_id = req_created.get("id")
    print(f"  [PASS] Teacher submitted approval request {req_created.get('request_no')} (ID: {req_id})")

    # Admin approves the request
    status_code, req_approved = make_request(f"/students/approval-requests/{req_id}/approve/", method="POST", data={
        "admin_remarks": "Approved and verified against bank receipt."
    }, token=admin_token)
    assert status_code == 200, f"Failed to approve request: {req_approved}"
    assert req_approved.get("status") == "Approved"
    print(f"  [PASS] Admin approved request {req_approved.get('request_no')} -> Status: {req_approved.get('status')}")

    print("\n==================================================")
    print("ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
