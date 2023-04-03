from .serializers import SkillsSerializer, RolesSerializer, CoursesSerializer, ProgramAndBranchSerializer, StudentSerializer, FacultySerializer, FacultyAdvisorSerializer, DepartmentOfficeSerializer, HeadOfDepartmentSerializer
from .models import Skills, Roles, Courses, ProgramAndBranch, Student, Faculty, FacultyAdvisor, DepartmentOffice, HeadOfDepartment
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.utils import IntegrityError


class SkillsList(ListAPIView):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer
    search_fields = ['skill']
    filter_backends = (SearchFilter,)


class RolesList(ListAPIView):
    queryset = Roles.objects.all()
    serializer_class = RolesSerializer
    search_fields = ['role']
    filter_backends = (SearchFilter,)


class CoursesList(ListAPIView):
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer
    search_fields = ['course']
    filter_backends = (SearchFilter,)


class ProgramAndBranchList(ListAPIView):
    queryset = ProgramAndBranch.objects.all()
    serializer_class = ProgramAndBranchSerializer
    search_fields = ['program', 'name', 'abbreviation']
    filter_backends = (SearchFilter,)


class StudentProfile(APIView):
    permission_classes = (IsAuthenticated,)

    def get_data_from_roll_number(self, roll_number):
        import re
        data = {}
        list1 = re.split("\d+", roll_number) # Matches any Unicode decimal digit [0, 9]
        list2 = re.split("\D+", roll_number) # Matches any character which is not a decimal digit [^0-9]
        try:
            data["roll_number"], data["batch"], data["program"], data["branch"] = list2[-1], list2[-2], list1[0], list1[1]
        except:
            data["roll_number"], data["batch"], data["program"], data["branch"] = -1, 20, 'M', 'CS'
        return data

    def post(self, request, *args, **kwargs):
        data = {}
        for key in request.data.keys():
            data[key] = request.data.get(key)
        user = request.user
        data["roll_number"] = user.username
        skills = data.pop('skills', [])
        courses = data.pop('courses', [])
        role = Roles.objects.get(role='Student')
        data_from_roll_number = self.get_data_from_roll_number(user.username)
        data["year"] = data_from_roll_number["batch"]
        if data_from_roll_number["roll_number"] == -1:
            data["roll_number"] = "Unknown"
        getter = data_from_roll_number["program"] + '/' + data_from_roll_number["branch"] # BTech EE: B/EE
        program_branch = ProgramAndBranch.objects.filter(getter=getter)
        if not program_branch.exists():
            program_branch = ProgramAndBranch.objects.create(getter=getter, name="Unknown Branch" + user.username)
        else:
            program_branch = program_branch.first()
        try:
            profile = Student.objects.create(user=user, program_branch=program_branch, role=role, **data)
            for skill in skills:
                skill, _ = Skills.objects.get_or_create(skill=skill)
                profile.skills.add(skill)
            for course in courses:
                course, _ = Courses.objects.get_or_create(course=course)
                profile.courses.add(course)
            profile.save()
        except IntegrityError:
            return Response({'Error': 'Invalid/Empty fields in the form'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(StudentSerializer(profile).data, status=status.HTTP_200_OK)


    def put(self, request, *args, **kwargs):
        data = {}
        for key in request.data.keys():
            data[key] = request.data.get(key)
        student = Student.objects.get(user=request.user)
        skills = data.pop('skills')
        student.skills = skills
        courses = data.pop('courses')
        student.courses = courses
        student.save()
        return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)


    def get(self, request, *args, **kwargs):
        student = get_object_or_404(Student, user=request.user)
        return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)


class FacultyProfile(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        faculty = get_object_or_404(Faculty, user=request.user)
        return Response(FacultySerializer(faculty).data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        data = {}
        for key in request.data.keys():
            data[key] = request.data.get(key)
        faculty = Faculty.objects.get(user=request.user)
        description = data.pop('description')
        faculty.description = description
        faculty.save()
        return Response(FacultySerializer(faculty).data, status=status.HTTP_200_OK)


class FacultyAdvisorProfile(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        faculty_advisor =  get_object_or_404(FacultyAdvisor, user=request.user)
        return Response(FacultyAdvisorSerializer(faculty_advisor).data, status=status.HTTP_200_OK)


class DepartmentOfficeProfile(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        department_office =  get_object_or_404(DepartmentOffice, user=request.user)
        return Response(DepartmentOfficeSerializer(department_office).data, status=status.HTTP_200_OK)


class HeadOfDepartmentProfile(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        head_of_department =  get_object_or_404(HeadOfDepartment, user=request.user)
        return Response(HeadOfDepartmentSerializer(head_of_department).data, status=status.HTTP_200_OK)
