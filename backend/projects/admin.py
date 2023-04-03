from django.contrib import admin
from .models import Type, Categories, Project, Application, ApplicationCourse, ApplicationComment, IndustryApplication

admin.site.register(Type)
admin.site.register(Categories)
admin.site.register(ApplicationCourse)
admin.site.register(Project)
admin.site.register(Application)
admin.site.register(ApplicationComment)
admin.site.register(IndustryApplication)