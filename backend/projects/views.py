from main.models import Student, Faculty, Skills, Courses, ProgramAndBranch, DepartmentOffice
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Categories, Project, Type, Application, ApplicationCourse, ApplicationComment, IndustryApplication
from .serializers import (ApplicationSerializer, CategoriesSerializer,
                          ProjectSerializer, TypeSerializer, ApplicationCourseSerializer, ApplicationCommentSerializer, IndustryApplicationSerializer)
from main.serializers import FacultySerializer

class TypeClass(ListAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    search_fields = ['type']
    filter_backends = (SearchFilter,)


class CategoriesClass(ListAPIView):
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer
    search_fields = ['category', 'total_credits_allowed']
    filter_backends = (SearchFilter,)


class ApplicationCourseCode(ListAPIView):
    queryset = ApplicationCourse.objects.all()
    serializer_class = ApplicationCourseSerializer
    search_fields = ['course_code', 'course_name']
    filter_backends = (SearchFilter,)


class AllProjectsClass(ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    search_fields = ['category', 'title', 'skills__skill', 'courses__course']
    filter_backends = (SearchFilter,)


# Projects floated by the you (Faculty) 
class ProjectsFloatedClass(APIView):
    permission_classes = (IsAuthenticated,)

    # Get all the projects floated by the you (Faculty)
    def get(self, request, pk = None, *args, **kwargs):
        faculty = Faculty.objects.get(user=request.user)
        if pk is not None:
            project = Project.objects.get(faculty=faculty, id=pk)
            return Response(ProjectSerializer(project).data, status=status.HTTP_200_OK)
        projects = Project.objects.filter(faculty=faculty)
        return Response(ProjectSerializer(projects, many=True).data, status=status.HTTP_200_OK)
    
    # Float a new project
    def post(self, request, *args, **kwargs):
        data = {}
        user = request.user
        for key in request.data.keys():
            data[key] = request.data.get(key)
        
        if(data['active'] == "true"):
            data['active'] = True
        else:
            data['active'] = False
        faculty_obj = Faculty.objects.get(user=user)
        categories = data.pop("category")
        categories = categories.split(',')
        project = Project.objects.create(faculty=faculty_obj, **data)

        for category in categories:
            category = Categories.objects.get(category=category)
            project.category.add(category)
        project.save()

        return Response(ProjectSerializer(project).data, status=status.HTTP_200_OK)
    
    # Update an existing project
    def put(self, request, pk, *args, **kwargs):
        data = {}
        user = request.user
        for key in request.data.keys():
            data[key] = request.data.get(key)
        title = data['title']
        categories = data['category']
        categories = categories.split(',')
        description = data['description']
        deliverables = data['deliverables']
        active = data['active']
        skills = data['skills']
        courses = data['courses']
        faculty = Faculty.objects.get(user=user)
        project = Project.objects.get(faculty=faculty, id=pk)
        project.title = title
        project.description = description
        project.deliverables = deliverables
        
        if active == 'false':
            project.active = False
        else:
            project.active = True

        project.skills = skills
        project.courses = courses

        project.category.clear()
        for category in categories:
            category = Categories.objects.get(category=category)
            project.category.add(category)

        project.save()
        return Response(ProjectSerializer(project).data, status=status.HTTP_200_OK)
    
    # Delete an existing project
    def delete(self, request, pk, *args, **kwargs):
        data = {}
        faculty = Faculty.objects.get(user=request.user)
        project = Project.objects.filter(faculty=faculty, id=pk)
        delete_project = project.delete()
        if delete_project:
            data["status"] = "Successfully deleted the project"
        else:
            data["status"] = "Failed to delete the project"
        return Response(data=data)


# Projects available to you (Student) (Apart from those applied for)
class AvailableProjectsClass(APIView):
    permission_classes = (IsAuthenticated,)

    def get_applied_projects(self, user):
        applications = Application.objects.filter(student__user=user)
        projects = Project.objects.filter(id__in=applications.values_list('project'), active=True)
        return projects

    def get(self, request, *args, **kwargs):
        projects = Project.objects.filter(active=True).difference(self.get_applied_projects(request.user))
        return Response(ProjectSerializer(projects, many=True).data, status=status.HTTP_200_OK)


# Get list of all the projects applied (From Student point of view)
class AppliedProjects(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        projects = Project.objects.filter(id__in=Application.objects.filter(student__user=user).values_list('project'), active=True)
        return Response(ProjectSerializer(projects, many=True).data, status=status.HTTP_200_OK)


# Create, Update, Delete and View Applications for projects (From Student point of view)
class StudentApplicationsClass(APIView):
    permission_classes = (IsAuthenticated,)

    # Get Application details you (Student) have applied for
    def get(self, request, pk = None, *args, **kwargs):
        student = Student.objects.get(user=request.user)
        if pk is not None:
            application = Application.objects.get(id=pk, student=student, is_withdrawn=False)
            return Response(ApplicationSerializer(application).data, status=status.HTTP_200_OK)
        applications = Application.objects.filter(student=student, is_withdrawn=False)
        return Response(ApplicationSerializer(applications, many=True).data, status=status.HTTP_200_OK)
    
    # Create new application for a project
    def post(self, request, *args, **kwargs):
        data = {}
        for key in request.data.keys():
            data[key] = request.data.get(key)
        student = Student.objects.get(user=request.user)
        application_type = Type.objects.get(application_type=data['application_type'])
        data.pop('application_type')
        project_id = data.pop('project_id')
        project = Project.objects.get(id=project_id)
        course = ApplicationCourse.objects.get(course_code=data['course_code'])
        data.pop('course_code')
        application = Application.objects.create(project=project, student=student, application_type=application_type, course_code=course, **data)
        return Response(ApplicationSerializer(application).data, status=status.HTTP_200_OK)
    
    # Update an existing application
    def put(self, request, pk = None, *args, **kwargs):
        data = {}
        for key in request.data.keys():
            data[key] = request.data.get(key)
        student = Student.objects.get(user=request.user)
        application_type = Type.objects.get(application_type=data['application_type'])
        data.pop('application_type')
        project_id = data.pop('project_id')
        project = Project.objects.get(id=project_id)
        course = ApplicationCourse.objects.get(course_code=data['course_code'])
        data.pop('course_code')
        currentApplication = Application.objects.filter(project=project, student=student, id=pk)
        if(currentApplication.get().is_accepted == False & currentApplication.get().is_withdrawn == False):
            _ = Application.objects.filter(project=project, student=student, id=pk).update(**data, application_type=application_type, course_code=course)
            application = Application.objects.get(id=pk, project=project, student=student, application_type=application_type)
            return Response(ApplicationSerializer(application).data, status=status.HTTP_200_OK)
        respone = {}
        respone['status'] = 'Can not update accepted/withdrawn applications. Please contact the concerned Faculty for the same.'
        return Response(respone, status=status.HTTP_200_OK)

    # Delete an existing application
    def delete(self, request, pk, *args, **kwargs):
        data = {}
        student = Student.objects.get(user=request.user)
        application = Application.objects.filter(id=pk, student=student)
        if(application.get().is_accepted == False & application.get().is_withdrawn == False):
            delete_application = application.delete()
            if delete_application:
                data["status"] = "Successfully deleted the application"
            else:
                data["status"] = "Failed to delete the application"
        else:
            data["status"] = "Can not delete accepted/withdrawn application"
        return Response(data=data)


class StudentArchivedApplications(APIView):
    permission_classes = (IsAuthenticated,)

    # List of all the applications withdrawn
    def get(self, request, *args, **kwargs):
        student = Student.objects.get(user=request.user)
        applications = Application.objects.filter(student=student, is_withdrawn=True)
        return Response(ApplicationSerializer(applications, many=True).data, status=status.HTTP_200_OK)


class StudentIndustryApplication(APIView):
    permission_classes = (IsAuthenticated,)

    # Get Application details you (Student) have applied for
    def get(self, request, pk = None, *args, **kwargs):
        student = Student.objects.get(user=request.user)
        if pk is not None:
            application = IndustryApplication.objects.get(id=pk, student=student, is_withdrawn=False)
            return Response(IndustryApplicationSerializer(application).data, status=status.HTTP_200_OK)
        applications = IndustryApplication.objects.filter(student=student, is_withdrawn=False)
        return Response(IndustryApplicationSerializer(applications, many=True).data, status=status.HTTP_200_OK)

# View all the applications to the projects floated (Faculty)
# Accept/ Reject applications for projects (Faculty)
class FacultyApplicationsClass(APIView):
    permission_classes = (IsAuthenticated,)

    # Get Application details you (Student) have applied for
    def get(self, request, pk = None, *args, **kwargs):
        faculty = Faculty.objects.get(user=request.user)
        if pk is not None:
            application = Application.objects.get(id=pk, project__faculty=faculty, is_withdrawn=False)
            return Response(ApplicationSerializer(application).data, status=status.HTTP_200_OK)
        applications = Application.objects.filter(project__faculty=faculty, is_withdrawn=False)
        return Response(ApplicationSerializer(applications, many=True).data, status=status.HTTP_200_OK)

    def put(self, request, pk = None, *args, **kwargs):
        faculty = Faculty.objects.get(user=request.user)
        if pk is not None:
            data = {}
            for key in request.data.keys():
                data[key] = request.data.get(key)

            is_accepted = data.pop('is_accepted')
            is_withdrawn = data.pop('is_withdrawn')
            grade = data.pop('grade')
            
            application = Application.objects.get(id=pk, project__faculty=faculty)

            if is_accepted == 'true':
                application.is_accepted = True
            else:
                application.is_accepted = False

            if is_withdrawn == 'true':
                application.is_withdrawn = True
                application.is_accepted = False
            else:
                application.is_withdrawn = False
            
            application.grade = grade

            application.save()

            return Response(ApplicationSerializer(application).data, status=status.HTTP_200_OK)
        applications = Application.objects.filter(project__faculty=faculty)
        return Response(ApplicationSerializer(applications, many=True).data, status=status.HTTP_200_OK)

    # TODO: Accept/ Reject Functionality


class ApplicationsForProject(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, *args, **kwargs):
        faculty = Faculty.objects.get(user=request.user)
        project = Project.objects.get(faculty=faculty, id=pk)
        applications = Application.objects.filter(project=project, is_withdrawn=False)
        return Response(ApplicationSerializer(applications, many=True).data, status=status.HTTP_200_OK)


class ArchivedApplicationsForProject(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, *args, **kwargs):
        faculty = Faculty.objects.get(user=request.user)
        project = Project.objects.get(faculty=faculty, id=pk)
        applications = Application.objects.filter(project=project, is_withdrawn=True)
        return Response(ApplicationSerializer(applications, many=True).data, status=status.HTTP_200_OK)


class FacultyCourses(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk = None, *args, **kwargs):
        faculty = Faculty.objects.get(user=request.user)
        if pk is not None:
            faculty_courses = ApplicationCourse.objects.get(id=pk)
            return Response(ApplicationCourseSerializer(faculty_courses).data, status=status.HTTP_200_OK)
        faculty_courses = ApplicationCourse.objects.filter(faculty=faculty)
        return Response(ApplicationCourseSerializer(faculty_courses, many=True).data, status=status.HTTP_200_OK)


class CourseApplicationsClass(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk = None, *args, **kwargs):
        if pk is not None:
            course = ApplicationCourse.objects.get(id=pk)
            application = Application.objects.filter(course_code=course, is_accepted=True)
            return Response(ApplicationSerializer(application, many=True).data, status=status.HTTP_200_OK)
        return Response('Course Id Missing', status=status.HTTP_400_BAD_REQUEST)


class DepartmentCoursesClass(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk = None, *args, **kwargs):
        department_office = DepartmentOffice.objects.get(user=request.user)
        courses = ApplicationCourse.objects.filter(program_branch=department_office.program_branch)
        return Response(ApplicationCourseSerializer(courses, many=True).data, status=status.HTTP_200_OK)
    
    def post(self, request, pk = None, *args, **kwargs):
        department_office = DepartmentOffice.objects.get(user=request.user)
        data = {}
        for key in request.data.keys():
            data[key] = request.data.get(key)
        faculty = Faculty.objects.get(id=data['course_advisor_id'])
        application_course = ApplicationCourse.objects.create(course_code=data['course_code'], course_name=data['course_name'], program_branch=department_office.program_branch, faculty=faculty)
        return Response(ApplicationCourseSerializer(application_course).data, status=status.HTTP_200_OK)

    def put(self, request, pk = None, *args, **kwargs):
        department_office = DepartmentOffice.objects.get(user=request.user)
        data = {}
        for key in request.data.keys():
            data[key] = request.data.get(key)

        faculty = Faculty.objects.get(id=data['course_advisor_id'])
        application_course = ApplicationCourse.objects.get(id=data['course_code_id'])
        application_course.course_code = data['course_code']
        application_course.course_name = data['course_name']
        application_course.faculty = faculty
        application_course.save()
        return Response(ApplicationCourseSerializer(application_course).data, status=status.HTTP_200_OK)


class DepartmentFacultyClass(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk = None, *args, **kwargs):
        department_office = DepartmentOffice.objects.get(user=request.user)
        faculty_list = Faculty.objects.filter(program_branch=department_office.program_branch)
        return Response(FacultySerializer(faculty_list, many=True).data, status=status.HTTP_200_OK)


class CommentsForApplication(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, *args, **kwargs):
        faculty = Faculty.objects.filter(user=request.user)
        student = Student.objects.filter(user=request.user)
        if not faculty:
           application = Application.objects.filter(id=pk, student=student.get())
        else:
            application = Application.objects.filter(id=pk, project__faculty=faculty.get())
        comments = ApplicationComment.objects.filter(application=application.get())
        return Response(ApplicationCommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)
    
    def post(self, request, pk, *args, **kwargs):
        data = {}
        for key in request.data.keys():
            data[key] = request.data.get(key)
        faculty = Faculty.objects.filter(user=request.user)
        student = Student.objects.filter(user=request.user)
        if not faculty:
           application = Application.objects.filter(id=pk, student=student.get())
        else:
            application = Application.objects.filter(id=pk, project__faculty=faculty.get())
        comment = data.pop('comment')
        if(application.get().is_withdrawn == False):
            comment = ApplicationComment.objects.create(application=application.get(), comment=comment, user=request.user)
            return Response(ApplicationCommentSerializer(comment).data, status=status.HTTP_200_OK)
        respone = {}
        respone['status'] = 'Can not comment on withdrawn applications. Please contact the concerned Faculty for the same.'
        return Response(respone, status=status.HTTP_200_OK)


class CourseIndustryApplicationClass(APIView):
    permission_classes = (IsAuthenticated,)

    # Get Application details you (Student) have applied for
    def get(self, request, pk = None, *args, **kwargs):
        faculty = Faculty.objects.get(user=request.user)
        if((pk is not None) and (faculty is not None)):
            course  = ApplicationCourse.objects.get(id=pk, faculty=faculty)
            industry_applications = IndustryApplication.objects.filter(course=course, is_withdrawn=False)
            return Response(IndustryApplicationSerializer(industry_applications, many=True).data, status=status.HTTP_200_OK)
                
        return Response({}, status=status.HTTP_200_OK)


class DepartmentIndustryApplicationClass(APIView):
    permission_classes = (IsAuthenticated,)

    # Get Application details you (Student) have applied for
    def get(self, request, pk = None, *args, **kwargs):
        department = DepartmentOffice.objects.get(user=request.user)
        if((pk is not None) and (department is not None)):
            course  = ApplicationCourse.objects.get(id=pk, program_branch=(department.program_branch))
            industry_applications = IndustryApplication.objects.filter(course=course, is_withdrawn=False)
            return Response(IndustryApplicationSerializer(industry_applications, many=True).data, status=status.HTTP_200_OK)
                
        return Response({}, status=status.HTTP_200_OK)


class StudentIndustryApplicationClass(APIView):
    permission_classes = (IsAuthenticated,)

    # Get Application details you (Student) have applied for
    def get(self, request, pk = None, *args, **kwargs):
        student = Student.objects.get(user=request.user)
        if student is not None:
            industry_applications = IndustryApplication.objects.filter(student=student)
            return Response(IndustryApplicationSerializer(industry_applications, many=True).data, status=status.HTTP_200_OK)
                
        return Response({}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = {}
        for key in request.data.keys():
            data[key] = request.data.get(key)
        student = Student.objects.get(user=request.user)
        application_type = Type.objects.get(application_type=data['application_type'])
        data.pop('application_type')
        category = Categories.objects.get(category=data['category'])
        data.pop('category')
        course = ApplicationCourse.objects.get(course_code=data['course_code'])
        data.pop('course_code')
        application = IndustryApplication.objects.create(student=student, application_type=application_type, category=category, course=course, **data)
        return Response(IndustryApplicationSerializer(application).data, status=status.HTTP_200_OK)
    
    def put(self, request, pk=None, *args, **kwargs):
        data = {}
        if pk is not None:
            data = {}
            for key in request.data.keys():
                data[key] = request.data.get(key)

            student = Student.objects.get(user=request.user)
            application_type = Type.objects.get(application_type=data['application_type'])
            data.pop('application_type')
            category = Categories.objects.get(category=data['category'])
            data.pop('category')
            course = ApplicationCourse.objects.get(course_code=data['course_code'])
            data.pop('course_code')
            application = IndustryApplication.objects.get(id=pk, student=student, is_accepted=False, is_withdrawn=False)
            if(application):
                application.application_type = application_type
                application.category = category
                application.course = course
                application.title = data['title']
                application.description = data['description']
                application.deliverables = data['deliverables']
                application.organization_name = data['organization_name']
                application.mentors_name = data['mentors_name']
                application.mentors_designation = data['mentors_designation']
                application.mentors_email = data['mentors_email']
                application.report_link = data['report_link']
                application.notes = data['notes']
                
                application.save()
                return Response(IndustryApplicationSerializer(application).data, status=status.HTTP_200_OK)
            data['status'] = "You cannot edit Accepted/Withdrawn application"
            return Response(data=data, status=status.HTTP_200_OK)
        data['status'] = "Application ID missing"
        return Response(data=data, status=status.HTTP_200_OK)

    # Delete an existing application
    def delete(self, request, pk, *args, **kwargs):
        data = {}
        student = Student.objects.get(user=request.user)
        application = IndustryApplication.objects.filter(id=pk, student=student)
        if(application.get().is_accepted == False & application.get().is_withdrawn == False):
            delete_application = application.delete()
            if delete_application:
                data["status"] = "Successfully deleted the application"
            else:
                data["status"] = "Failed to delete the application"
        else:
            data["status"] = "Can not delete accepted/withdrawn application"
        return Response(data=data)