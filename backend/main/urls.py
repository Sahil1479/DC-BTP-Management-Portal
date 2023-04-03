from django.urls import path
from . import views

app_name = 'main'
urlpatterns = [
    path('skills/', views.SkillsList.as_view(), name="skills"),
    path('roles/', views.RolesList.as_view(), name="roles"),
    path('courses/', views.CoursesList.as_view(), name="courses"),
    path('program_and_branch/', views.ProgramAndBranchList.as_view(), name="program_and_branch"),
    path('student_profile/', views.StudentProfile.as_view(), name="student_profile"),
    path('faculty_profile/', views.FacultyProfile.as_view(), name="faculty_profile"),
    path('faculty_advisor_profile/', views.FacultyAdvisorProfile.as_view(), name="faculty_advisor_profile"),
    path('department_office_profile/', views.DepartmentOfficeProfile.as_view(), name="department_office_profile"),
    path('hod_profile/', views.HeadOfDepartmentProfile.as_view(), name="hod_profile"),
]
