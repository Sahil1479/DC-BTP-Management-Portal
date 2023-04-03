from rest_framework import serializers
from .models import Type, Categories, Project, Application, ApplicationCourse, ApplicationComment, IndustryApplication
from main.serializers import UserSerializer, StudentSerializer, FacultySerializer


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    faculty = FacultySerializer(read_only=True)
    category = CategoriesSerializer(read_only=True, many=True)
    
    class Meta:
        model = Project
        fields = '__all__'


class ApplicationCourseSerializer(serializers.ModelSerializer):
    faculty = FacultySerializer(read_only=True)
    
    class Meta:
        model = ApplicationCourse
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    application_type = TypeSerializer(read_only=True)
    course_code = ApplicationCourseSerializer(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'


class IndustryApplicationSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    application_type = TypeSerializer(read_only=True)
    course = ApplicationCourseSerializer(read_only=True)
    category = CategoriesSerializer(read_only=True)

    class Meta:
        model = IndustryApplication
        fields = '__all__'


# class RecursiveField(serializers.Serializer):
#     def to_representation(self, value):
#         serializer = self.parent.parent.__class__(value, context=self.context)
#         return serializer.data


class ApplicationCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # application = ApplicationSerializer(read_only=True)
    # replies = RecursiveField(many=True)

    class Meta:
        model = ApplicationComment
        fields = '__all__'